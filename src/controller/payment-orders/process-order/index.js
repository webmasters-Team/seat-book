import dotenv from "dotenv";

import {
  getOrder,
  getOrderFields,
  updateDataOrder,
} from "../../../repository/payment-orders/index.js";
import { createSales } from "../../../repository/sales/index.js";
import jwt from "jsonwebtoken";
import { CompileErrorReport, JWT_SECRET } from "../../../utils/utils.js";
import { processItemInventoryUser } from "../../playfabRequests/index.js";
import { PlayFab, PlayFabServer } from "playfab-sdk";
import { io } from "../../../app.js";

dotenv.config();

export async function processOrder(req, res) {
  const { userToken, orderId, products } = req.body;
  const PFsessionUser = req.headers.authorization;

  try {

    const userId = jwt.verify(userToken, JWT_SECRET);
    let productsId = await products.map((p) => p.id);
    PlayFab._internalSettings.sessionTicket = PFsessionUser;
    if (!PFsessionUser || !userId) {
      return res
        .status(401)
        .json({ message: "Token inválido o no proporcionado" });
    }

    // const saveItemInventory = await processItemInventoryUser(productsId, token);

    // Primero creamos la venta
    const resultCreateSale = await createSales(orderId, userId, res);

    if (!resultCreateSale.isSuccess) {
      return res.status(200).json({
        isSuccess: false,
        message:
          resultCreateSale.message || "Ocurrió un error al crear la venta",
      });
    }

    // Luego actualizamos la orden con el billingId
    const updateOrderResult = await updateDataOrder(orderId, userId, {
      billingId: resultCreateSale.billingId,
      isPaid: true,
      orderStatus: "finish",
    });

    if (!updateOrderResult.isSuccess) {
      return res.status(200).json({
        isSuccess: false,
        message: "Ocurrió un error al actualizar el estado de la orden",
      });
    }
    const updatedOrder = await getOrder(orderId, userId);

    if (!updatedOrder) {
      return res.status(200).json({
        isSuccess: false,
        message: "No se encontró la orden después de actualizar",
      });
    }
    try {
      // Verificar si el item está duplicado en el inventario del usuario
      console.log(
        "Verificando si el item está duplicado en el inventario del usuario..."
      );
      const userInventory = await new Promise((resolve, reject) => {
        PlayFabServer.GetUserInventory(
          { PlayFabId: userId },
          (error, result) => {
            if (result) {
              resolve(result.data.Inventory);
              return result.data.Inventory;
            } else {
              reject(error);
              return error;
            }
          }
        );
      });

      const isDuplicated = productsId.some((p) =>
        userInventory.some((i) => i.ItemId === p)
      );

      if (isDuplicated) {
        console.log("Item duplicado en el inventario del usuario.");
        return res
          .status(200)
          .send({ message: "Item duplicado", isSuccess: false });
      }

      PlayFabServer.GrantItemsToUser(
        {
          CatalogVersion: "HLS1",
          ItemIds: productsId,
          PlayFabId: userId,
        },
        (error, result) => {
          console.log(error);
          console.log(result.data.ItemGrantResults);
          if (result !== null) {
            console.log(result);
          } else if (error !== null) {
            console.log("error en la API");
            console.log(CompileErrorReport(error));

            return {
              isSuccess: false,
              message: "Algo salió mal con tu primera llamada a la API.",
              debugInfo: CompileErrorReport(error),
            };
          }
        }
      );
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Error en la solicitud",
        isSuccess: false,
        error: error.response ? error.response.data : error.message,
      });
    }
    // io.emit("orderProcessed", {
    //   status: "success",
    //   orderId,
    //   message: "La orden ha sido procesada exitosamente.",
    // });



    // Emitir evento con la orden actualizada
    // io.emit("orderProcessed", {
    //   status: "success",
    //   orderId,
    //   message: "La orden ha sido procesada exitosamente.",
    //   updatedOrder, // Enviar los datos actualizados
    // });

    // Emitir evento únicamente al cliente correspondiente
    io.emit("orderProcessed", {
      status: "success",
      orderId,
      message: "La orden ha sido procesada exitosamente.",
      updatedOrder,
    });
    return res.status(200).json({
      isSuccess: true,
      message: "Orden actualizada y evento agregado correctamente",
    });
  } catch (error) {
    console.error("Error en processOrder:", error);
    io.emit("orderProcessed", {
      status: "error",
      orderId,
      message: "Ocurrió un error al procesar la orden.",
    });
    return res.status(500).json({
      isSuccess: false,
      message: "Ocurrió un error interno en el servidor",
      error: error.message || error,
    });
  }
}
