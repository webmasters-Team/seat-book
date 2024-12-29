export async function stripePayment(req, res) {
  const event = req.body;

  switch (event.type) {
    case "payment_intent.succeeded":
      const email = event.data.object["receipt_email"];
      //console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
      console.log("PaymentIntent was successful for" + email);
      // Then define and call a method to handle the successful payment intent.
      // handlePaymentIntentSucceeded(paymentIntent);
      break;
    case "payment_method.attached":
      const paymentMethod = event.data.object;
      // Then define and call a method to handle the successful attachment of a PaymentMethod.
      // handlePaymentMethodAttached(paymentMethod);
      break;
    default:
      return res.status(400).end();
    // Unexpected event type
    //   console.log(`Unhandled event type ${event.type}.`);
  }
  res.json({ received: true });
}
