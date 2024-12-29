//import * as Stripe from "stripe.";
import Stripe from "stripe";
import { sk } from "../../../../config/stripe.js";
import { getOrder } from "../../../../repository/payment-orders/index.js";

const stripe = new Stripe(sk)


export async function createPaymentIntentx(req, res) {
  const { orderId, userId } = req.body;
  try {
    const orderData = await getOrder(orderId, userId);
    if (!orderData) {
      return res.json({ isSuccess: false, message: "No se encontró la orden" });
    }

    const { products, amount } = orderData;
// console.log(orderData)
    // Crear el PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd", // Ajusta la moneda según tu caso
      metadata: { orderId: orderId, userId: userId },
    });

    return res.status(200).send({
      isSuccess: true,
      cs: paymentIntent.client_secret,
      infoOrder: { products, amount },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      isSuccess: false,
      message: "Error al crear el PaymentIntent",
    });
  }
}
