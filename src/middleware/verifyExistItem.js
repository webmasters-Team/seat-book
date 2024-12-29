import { PlayFab, PlayFabClient } from "playfab-sdk";
import jwt from "jsonwebtoken";
import { CompileErrorReport } from "../utils/utils.js";

export async function verifyExistItem(req, res, next) {
    console.log('verify-item')
  const { products } = req.body;

  const session = req.headers.authorization;

  const token = jwt.verify(session, "test");
  try {
    if (!token) {
      return res.status(401).json({ message: "no-token-error" });
    }
    
    PlayFab._internalSettings.sessionTicket = token.data.PFsessionUser;

    PlayFabClient.GetCatalogItems(
      { CatalogVersion: "HLS1" },
      (errors, result) => {
        if (result !== null) {
          const exitsItem = products.every((p) =>
            result.data.Catalog.some((i) => i.ItemId === p)
          );
        
          if (exitsItem) {
            next();
          } else {
            return res.json({
              isSuccess:false,
              message: "No existe el producto",
              debugInfo: CompileErrorReport(errors),
            });
          }
        } else if (errors !== null) {
          console.log("error en la API");
          console.log(CompileErrorReport(errors));

          return res.status(500).json({
            isSuccess:false,
            message: "Algo salió mal con tu primera llamada a la API.",
            debugInfo: CompileErrorReport(errors),
          });
        }
      }
    );
  } catch (error) {
    return res.status(500).send({
      message: "Error en la solicitud",
      isSuccess: false,
      error: error.response ? error.response.data : error.message,
    });
  }
}
