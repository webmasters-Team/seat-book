import dotenv from "dotenv";
import { getOrder } from "../../../repository/payment-orders/index.js";
import { PlayFabAdmin, PlayFabServer } from "playfab-sdk";
import { CompileErrorReport, JWT_SECRET } from "../../../utils/utils.js";
import jwt from "jsonwebtoken";
import { STATUS_CODE } from "../../../utils/status.js";

dotenv.config();

export async function verifyOrder(req, res, next) {
  const { userToken, orderId } = req.body;

  const auth = req.headers.authorization;
  
  try {
    const userId = jwt.verify(userToken, JWT_SECRET);
    const authId = jwt.verify(auth, JWT_SECRET);
    console.log(authId);
   
    const orderData = await getOrder(orderId, userId);
    console.log(orderData);
    if (!orderData) {
      return res.json({ isSuccess: false, message: "No se encontró la orden" });
    }

    if (orderData.isPaid) {
      return res.json({ isSuccess: false, message: "Tu orden ya esta pagada" });
    }

    if (orderData.orderStatus === STATUS_CODE.expired) {
      return res.json({ isSuccess: false, message: "Tu orden ya expiro." });
    }
    PlayFabAdmin.GetUserInventory({ PlayFabId: userId }, (error, result) => {
      if (result !== null) {
        
        const exitsItem = orderData.products.every((p) =>
          result.data.Inventory?.some((i) => i.ItemId === p.id)
        );
        // console.log(exitsItem);
        if (exitsItem) {
          return res.json({
            isSuccess: false,
            message: "Ya tienes este evento, no puedes volver a comprarla",
            debugInfo: CompileErrorReport(error),
          });
        } else {
          next();
        }
      } else if (error !== null) {
        console.log(CompileErrorReport(error));

        return res.status(500).json({
          isSuccess: false,
          message: "Algo salió mal con tu primera llamada a la API.",
          debugInfo: CompileErrorReport(error),
        });
      }
    });
  } catch (error) {
    console.error("Error en processOrder:", error);
    return res.status(500).json({
      isSuccess: false,
      message: "Ocurrió un error interno en el servidor",
      error: error.message || error,
    });
  }
}
