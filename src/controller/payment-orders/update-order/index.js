import dotenv from "dotenv";
import { updateDataOrder } from "../../../repository/payment-orders/index.js";
dotenv.config();

export async function updateOrder(req, res) {
  const body = req.body;
  try {
    const result = await updateDataOrder(body.orderId, body.PFuserId,body.dataUpdate);
    if (!result) {
      return res.status(200).send({
        isSuccess: false,
        message: "Ocurrio un error",
      });
    }
    return res.status(200).send({
      isSuccess: true,
      message: "se actualizo la orden",
    });
  } catch (error) {
    return res.status(200).send({
      isSuccess: false,
      error,
    });
  }
}
