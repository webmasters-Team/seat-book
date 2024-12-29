import { getUserOrders } from "../../../repository/payment-orders/index.js";

export async function getOrdesByUser(req, res) {
  //   const { PFuserId } = req.body;
  const { PFuserId } = req.query;

  try {
    if (!PFuserId) {
      return res.status(200).send({
        isSuccess: false,
        message: `Te faltan params:  ${!PFuserId ? "id del usuario" : ""}`,
      });
    }

    const result = await getUserOrders(PFuserId);
// console.log(result)
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
