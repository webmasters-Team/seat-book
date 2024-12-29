import dotenv from "dotenv";
import { queryCreatePaymentOrder } from "../../../repository/payment-orders/index.js";
import { io } from "../../../app.js";
dotenv.config();

export async function createPayOrder(req, res) {
  const body = req.body;
  try {
    if (
      body?.products === undefined ||
      body?.amount === undefined ||
      body?.PFuserId === undefined
    ) {
      return res.status(200).send({
        isSuccess: false,

        message: `Te faltan elementos: ${
          body?.products === undefined ? "products" : ""
        } ${body?.amount === undefined ? "amount" : ""} ${
          body?.PFuserId === undefined ? "PFuserId" : ""
        }`,
      });
    }

    const result = await queryCreatePaymentOrder(body);
    if (!result) {
      console.log({
        isSuccess: false,
        message: "Ocurrio un error",
      })
      return res.status(200).send({
        isSuccess: false,
        message: "Ocurrio un error",
      });
    }

    // io.emit("orderCreated", result.dataOrder);
    io.emit("orderCreated", result.dataOrder);


console.log({
  isSuccess: true,
  data: result,
})

    return res.status(200).send({
      isSuccess: true,
      data: result,
    });
  } catch (error) {
    console.log({
      isSuccess: false,
      error,
    })
    return res.status(200).send({
      isSuccess: false,
      error,
    });
  }
}
 