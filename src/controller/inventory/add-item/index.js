import { PlayFabServer } from "playfab-sdk";
import jwt from "jsonwebtoken";
import { CompileErrorReport } from "../../../utils/utils.js";

export async function addItemInventoryUser(req, res, next) {
    console.log('verify-add')

  const body = req.body;
  const session = req.headers.authorization;

  try {
    const token = jwt.verify(session, "test");

    if (!token) {
      return res.status(401).json({ message: "no-token-error" });
    }

    PlayFabServer.GrantItemsToUser(
      {
        CatalogVersion: "HLS1",
        ItemIds: body.products,
        PlayFabId: token.data.PFuserId,
      },
      (error, result) => {
        console.log(error)
        console.log(result)
        if (result !== null) {
          
          console.log(result);
          return res.status(200).json({
            isSuccess:true,
            message: "¡Felicidades, Agregaste el item al usuario",
            result,
          });
        } else if (error !== null) {
          console.log("error en la API");
          console.log(CompileErrorReport(error));

          return res.status(200).json({
            isSuccess:false,
            message: "Algo salió mal con tu primera llamada a la API.",
            debugInfo: CompileErrorReport(error),
          });
        }
      }
    );
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "Error en la solicitud",
      isSuccess: false,
      error: error.response ? error.response.data : error.message,
    });
  }
}
