import { getOrder } from "../../../repository/payment-orders/index.js";

export async function getOrderById(req, res) {
  //   const { PFuserId } = req.body;
  const { orderId, PFuserId } = req.query;

  try {
    if (!orderId||!PFuserId) {
      return res.status(200).send({
        isSuccess: false,
        message: `Te faltan params: ${!orderId?'id de la orden':''} ${!PFuserId?'id del usuario':''}`,
      });
    }
    

    const result = await getOrder(orderId, PFuserId);

    if (!result) {
      return res.status(200).send({
        isSuccess: false,
        message: "Ocurrio un error",
      });
    }
    return res.status(200).send({
      isSuccess: true,
      data: result,
    });
  } catch (error) {
    return res.status(200).send({
      isSuccess: false,
      error,
    });
  }
}
