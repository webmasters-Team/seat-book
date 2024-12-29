import { connectToCluster, dbName } from "../../config/mongoDB.js";
import { getOrder } from "../payment-orders/index.js";
import dotenv from 'dotenv';
dotenv.config();
const uri = process.env.MONGO_URI;

let mongoClient;

async function getMongoClient() {
  if (!mongoClient) {
    mongoClient = await connectToCluster(uri);
  }
  return mongoClient;
}

export async function createSales(orderRef, userId) {
  const client = await getMongoClient();
  const db = client.db(dbName);

  const resultGetOrder = await getOrder(orderRef, userId);
  if (!resultGetOrder) {
    return { isSuccess: false, message: "No existe la orden" };
  }
  if (resultGetOrder.billingId) {
    return { isSuccess: false, message: "La orden ya está asociada a una venta." };
  }

  const dataObject = {
    orderId: resultGetOrder._id,
    ref: resultGetOrder.orderId,
    ...resultGetOrder,
  };

  try {
    const result = await db.collection("sales").insertOne(dataObject);
    if (!result.insertedId) {
      return { isSuccess: false, message: "Error al crear la venta" };
    }
    return {
      isSuccess: true,
      message: "Se creó la venta",
      billingId: result.insertedId,
    };
  } catch (error) {
    console.error("Error al crear la venta:", error);
    return { isSuccess: false, message: "Error al crear la venta", error };
  }
}
