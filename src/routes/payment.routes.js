import { Router } from "express";
import {  createStripePaymentIntent } from "../controller/stripe/createPaymentIntent.js";
// import { verifyDuplicatedItemUserInvetory } from "../middleware/verifyDuplicateItemUserInventory.js";
import { verifyOrder } from "../controller/payment-orders/verify-order/index.js";



const routes = Router();

routes.post("/stripe/create-payment-intent-stripe",verifyOrder, createStripePaymentIntent);




export default routes;
