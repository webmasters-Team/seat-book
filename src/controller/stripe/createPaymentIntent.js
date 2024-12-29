//import * as Stripe from "stripe.";
import Stripe from "stripe";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";
dotenv.config('/.env');
// export const sk = process.env.STRIPE_SECRET_KEY;
import { sk } from "../../config/stripe.js";
import {
  getOrder,
  updateDataOrder,
} from "../../repository/payment-orders/index.js";
import { JWT_SECRET } from "../../utils/utils.js";

const stripe = new Stripe(sk??process.env.STRIPE_SECRET_KEY);




export async function createStripePaymentIntent(req, res) {
  const { orderId, userToken } = req.body;
  try {
    const userId = jwt.verify(userToken, JWT_SECRET);

    if (!userId) {
      return res.status(401).json({ message: "no-token-error" });
    }

    const orderData = await getOrder(orderId, userId);
    if (!orderData) {
      return res.json({ isSuccess: false, message: "No se encontró la orden" });
    }

    if (orderData.isPaid) {
      return res.json({ isSuccess: false, message: "Tu orden ya esta pagada" });
    }

    const { products, amount, expirationDate, _id } = orderData;

    const paymentIntents = await stripe.paymentIntents.list({
      limit: 100, // Ajusta el límite según tus necesidades
    });

    const existingPaymentIntent = paymentIntents.data.find(
      (intent) => intent.metadata.orderId === _id.toString()
    );
    let paymentIntent;
    if (existingPaymentIntent) {
      // Si existe un PaymentIntent con el orderId en la metadata, lo actualizamos
      paymentIntent = await stripe.paymentIntents.update(
        existingPaymentIntent.id,
        {
          amount: amount * 100, // Actualizamos la cantidad si es necesario
        }
      );
    } else {
      // Si no existe, creamos un nuevo PaymentIntent
      paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100,
        currency: "usd", // Ajusta la moneda según tu caso
        metadata: { orderId: _id.toString() },
      });
    }

    // Crear el PaymentIntent
    // const paymentIntent = await stripe.paymentIntents.create({
    //   amount: amount * 100,
    //   currency: "usd", // Ajusta la moneda según tu caso
    //   metadata: { orderId: _id },
    // });

    const resUpdateORder = await updateDataOrder(orderId, userId, {
      stripe_record: { pi: paymentIntent.id, status: paymentIntent.status },
    });

    if (!resUpdateORder) {
      return res.json({
        isSuccess: false,
        message: "No se actualizo la orden",
      });
    }

    return res.status(200).send({
      isSuccess: true,
      cs: paymentIntent.client_secret,
      infoOrder: { products, amount, expirationDate },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      error,
      isSuccess: false,
      message: "Error al crear el PaymentIntent",
    });
  }
}
