import { connectToCluster, dbName } from "../../config/mongoDB.js";
import dotenv from "dotenv";
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

export async function queryCreatePaymentOrder(orderData) {
  const { products, amount, PFuserId } = orderData;

  const client = await getMongoClient();
  const db = client.db(dbName);

  let expDate = new Date();
  let currentMinutes = expDate.getMinutes();
  expDate.setMinutes(currentMinutes + 30);

  const orderId = await generateAndVerifyOrderId(client);

  const dataObject = {
    products,
    amount,
    userId: PFuserId,
    orderId: orderId,
    billingId: "",
    createdAt: new Date(),
    orderStatus: "pending-for-pay",
    isPaid: false,
    taxes: [],
    totals: {
      totalItems: products.length,
      totalWithoutTaxes: amount,
      totalWithTaxes: amount,
      totalTaxes: 0,
    },
    billingAddress: {
      region: "",
      coordinates: {
        latitude: "",
        longitude: "",
      },
      postalCode: "",
      address: "",
      ipAddress: "",
    },
    comments: [],
    orderType: "stripe-payment",
    referralCode: "",
    currency: {
      name: "Dollar American",
      iso: "USD",
      exchange: 1,
    },
    expirationDate: expDate,
  };

  try {
    const result = await db.collection("orders").insertOne(dataObject)
    
    return {
      isSuccess: true,
      orderId,
      dataOrder: { ...dataObject }, // Nueva propiedad que incluye los datos completos

    };
  } catch (error) {
    console.error("Error al crear la orden:", error);
    return { isSuccess: false, message: "Error al crear la orden", error };
  }
}

export async function getOrder(orderId, userId) {
  const client = await getMongoClient();
  const db = client.db(dbName);

  try {
    const result = await db
      .collection("orders")
      .findOne({ orderId: orderId, userId: userId });
    if (!result) {
      return false;
    }
    return result;
  } catch (error) {
    console.error("Error al obtener la orden:", error);
    return { isSuccess: false, message: "Error al obtener la orden", error };
  }
}

export async function getUserOrders(userId) {
  const client = await getMongoClient();
  const db = client.db(dbName);

  try {
    const result = await db.collection("orders").find({ userId: userId }).toArray();

    if (!result) {
      return false;
    }
    return result;
  } catch (error) {
    console.error("Error al obtener la orden:", error);
    return { isSuccess: false, message: "Error al obtener la orden", error };
  }
}

export async function updateStatusOrder(orderId, userId, status) {
  const client = await getMongoClient();
  const db = client.db(dbName);

  try {
    const res = await db
      .collection("orders")
      .updateOne(
        { orderId: orderId, userId: userId },
        { $set: { orderStatus: status } }
      );
    if (res.matchedCount === 0) {
      return {
        isSuccess: false,
        message: "No se encontró la orden para actualizar",
      };
    }
    return { isSuccess: true, message: "Orden actualizada correctamente" };
  } catch (error) {
    console.error("Error al actualizar el estado de la orden:", error);
    return {
      isSuccess: false,
      message: "Error al actualizar el estado de la orden",
      error,
    };
  }
}



export async function updateOrderFields(orderId, userId, statusOrder) {
  const client = await getMongoClient();
  const db = client.db(dbName);

  try {
    const res = await db
      .collection("orders")
      .updateOne(
        { orderId: orderId, userId: userId },
        { $set: {orderStatus:statusOrder}}
      );

      console.log(res)
    if (res.matchedCount === 0) {
      return {
        isSuccess: false,
        message: "No se encontró la orden para actualizar",
      };
    }
    return { isSuccess: true, message: "Orden actualizada correctamente" };
  } catch (error) {
    console.error("Error al actualizar el estado de la orden:", error);
    return {
      isSuccess: false,
      message: "Error al actualizar el estado de la orden",
      error,
    };
  }
}
export async function updateDataOrder(orderId, userId, orderUpdate) {
  const client = await getMongoClient();
  const db = client.db(dbName);

  try {
    const res = await db
      .collection("orders")
      .updateOne({ orderId: orderId, userId: userId }, { $set: orderUpdate });
    if (res.matchedCount === 0) {
      return {
        isSuccess: false,
        message: "No se encontró la orden para actualizar",
      };
    }
    return { isSuccess: true, message: "Orden actualizada correctamente" };
  } catch (error) {
    console.error("Error al actualizar la orden:", error);
    return { isSuccess: false, message: "Error al actualizar la orden", error };
  }
}

export async function getOrderFields(orderId, userId, fields) {
  const client = await getMongoClient();
  const db = client.db(dbName);

  // Convertir el array de campos en un objeto
  const fieldsToReturn = fields.reduce((acc, field) => {
    acc[field] = 1;
    return acc;
  }, {});

  // Añadir la exclusión de _id en el objeto de proyección
  const projection = { projection: { ...fieldsToReturn, _id: 0 } };

  try {
    const result = await db
      .collection("orders")
      .findOne({ orderId: orderId, userId: userId }, projection);
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

export async function verifyOrderByUser(orderId, userId) {
  const client = await getMongoClient();
  const db = client.db(dbName);

  // Convertir el array de campos en un objeto

  // Añadir la exclusión de _id en el objeto de proyección

  try {
    const result = await db
      .collection("orders")
      .findOne({ userId: userId, isPaid: false });
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

async function generateAndVerifyOrderId(client) {
  const db = client.db("sample_mflix");
  const collection = db.collection("orders");

  const lastOrderId = await getLastOrderId(collection);
  let newCode;

  if (!lastOrderId) {
    newCode = "000001";
  } else {
    const lastCode = parseInt(lastOrderId, 10);
    newCode = (lastCode + 1).toString().padStart(6, "0");
  }

  return `${newCode}`;
}

async function getLastOrderId(collection) {
  const lastOrder = await collection
    .find()
    .sort({ orderId: -1 })
    .limit(1)
    .toArray();
  return lastOrder.length > 0 ? lastOrder[0].orderId : null;
}
