const uri = process.env.MONGO_URI;
import { connectToCluster, dbName } from "../../config/mongoDB.js";

export async function getCodesInfo(codeToSearch) {
  let mongoClient;
  let result = [];
  let cursor;

  try {
    mongoClient = await connectToCluster(uri);
    const db = mongoClient.db(dbName);
    const collection = db.collection("referal_codes");
    if (codeToSearch) {
      cursor = collection.find({ code: codeToSearch });
    } else {
      cursor = collection.find();
    }
    for await (const code of cursor) {
      result.push(code);
    }
    return result;
  } catch (error) {
    console.error(error);
  } finally {
    await mongoClient.close();
  }
}



export async function deactivateCode(codeToDeactivate) {
  let mongoClient;
  let filter= { code: codeToDeactivate };
  const updateDocument = {
    $set: {active : false},
  };

  try {
    mongoClient = await connectToCluster(uri);
    const db = mongoClient.db(dbName);
    const collection = db.collection("referal_codes");
    if (codeToDeactivate !== null) {
      console.log("deactivateCode: " + codeToDeactivate);
      const result = await collection.updateOne(filter, updateDocument);
      console.log(result);
      return result;
    } else {
      return false
    }
  } catch (error) {
    console.error(error);
  } finally {
    await mongoClient.close();
  }
}