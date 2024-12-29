import express from "express";
import { Router } from "express";
import Stripe from "stripe";
import { io } from "../app.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const routes = Router();

// Middleware específico para el webhook de Stripe
routes.post(
    "/webhook",
    (req, res) => {
        const sig = req.headers['stripe-signature'];
        const endpointSecret = process.env.WH_SECRET; // Tu secreto del webhook
        let event;

        try {
            event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
        } catch (err) {
            res.status(400).send(`Webhook Error: ${err.message}`);
            console.log(`Webhook Error: ${err.message}`)
            return;
        }
        // let event;

        // try {
        //   // Verificar la firma del evento
        //   event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        // } catch (err) {
        //   console.error("⚠️ Error verificando webhook: ", err.message);
        //   return res.status(400).send(`Webhook Error: ${err.message}`);
        // }

        // Manejar los eventos de Stripe
        switch (event.type) {
            case "payment_intent.succeeded":
                const paymentIntent = event.data.object;
                console.log("✅ Pago exitoso:", paymentIntent.id);
                console.log("Emitiendo evento paymentStatus...");
                // Emitir evento de éxito a través de Socket.IO
                io.emit("paymentStatus", {
                    status: "success",
                    orderId: paymentIntent.metadata.orderId,
                    message: "El pago fue procesado exitosamente.",
                }); 
                break;

            case "payment_intent.payment_failed":
                const failedIntent = event.data.object;
                console.error("❌ Pago fallido:", failedIntent.id);

                // Emitir evento de error a través de Socket.IO
                io.emit("paymentStatus", {
                    status: "failed",
                    orderId: failedIntent.metadata.orderId,
                    message: "El pago no se pudo completar.",
                });
                break;

            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        // Confirmar que el evento fue recibido correctamente
        res.status(200).send("Evento recibido");
    }
);

export default routes;
