import dotenv from "dotenv";
import jwt from "jsonwebtoken";

import { STATUS_CODE } from "../../../utils/status.js";
import { updateOrderFields } from "../../../repository/payment-orders/index.js";
import { JWT_SECRET } from "../../../utils/utils.js";
dotenv.config();

export async function caducateOrder(req, res) {
    const { orderId, userToken } = req.body;
    console.log('order')
  try {
    const userId = jwt.verify(userToken, JWT_SECRET);
    const result = await updateOrderFields(orderId, userId,STATUS_CODE.expired);


    if (!result) {
      return res.status(200).send({
        isSuccess: false,
        message: "Ocurrio un error",
      });
    }

  
    return res.status(200).send({
      isSuccess: true,
      message:
        "Tu orden ya expiro. Por favor vuelva a VRSEAT y compre de nuevo",
    });
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      isSuccess: false,
      error,
    });
  }
}
