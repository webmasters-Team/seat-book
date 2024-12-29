import { sk } from "../../../../config/stripe";
import { verifyOrder } from "../../../../repository/payment-orders";


const stripe = require("stripe")(sk);

export async function processPaymentx(req, res) {
  const { orderId, userId } = req.body;
  try {
    const orderData = await verifyOrder(orderId, userId);
    if (!orderData) {
      return res.json({ isSuccess: false, message: "No se encontró la orden" });
    }

    const { products, amount } = orderData;

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
