import dotenv from "dotenv";
import { updateStatusOrder } from "../../../repository/payment-orders/index.js";
dotenv.config();

export async function statusOrder(req, res) {
  const body = req.body;
  try {
    const result = await updateStatusOrder(
      body.orderId,
      body.PFuserId,
      body.status
    );
    if (!result) {
      return res.status(200).send({
        isSuccess: false,
        message: "Ocurrio un error",
      });
    }
    return res.status(200).send({
      isSuccess: true,
      message: "se actualizo el status de la orden",
    });
  } catch (error) {
    return res.status(200).send({
      isSuccess: false,
      error,
    });
  }
}
