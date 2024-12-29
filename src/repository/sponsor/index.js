import dotenv from "dotenv";
import { connectToCluster, dbName } from "../../config/mongoDB.js";
dotenv.config();
const uri = process.env.MONGO_URI;

let mongoClient;

// Reutilización de la conexión a la base de datos
async function getMongoClient() {
  if (!mongoClient) {
    mongoClient = await connectToCluster(uri);
  }
  return mongoClient;
}

export async function getDataSponsor(id) {
  const client = await getMongoClient();
  const db = client.db(dbName);

  try {
    const result = await db.collection("sponsors").findOne({ _id: id });
    if (!result) {
      return false;
    }
    return result;
  } catch (error) {
    console.error("Error al obtener los campos de la orden:", error);
    return {
      isSuccess: false,
      message: "Error al obtener los campos de la orden",
      error,
    };
  }
}
