import axios from "axios";
import { playfabConfig } from "../../../config/playfab.js";

export async function removeItemInventory(req, res) {
  try {
    const call = await axios.post(
      `https://${playfabConfig.titleId}.playfabapi.com/Admin/RevokeInventoryItem`,
      { PlayFabId: "A4438A4A3C384AB", ItemInstanceId: "928713FFD6907" },
      {
        headers: {
          "X-SecretKey": playfabConfig.secretKey,
          
        },
      }
    );

    const data = call.data;
    res.send({ message: "Test funcionando", isSuccess: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Error en la solicitud",
      isSuccess: false,
      error: error.response ? error.response.data : error.message,
    });
  }
}
