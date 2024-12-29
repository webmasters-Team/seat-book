import jwt from "jsonwebtoken";
import { PlayFabServer } from "playfab-sdk";
import { CompileErrorReport } from "../utils/utils.js";

export async function verifyDuplicatedItemInvetory(req, res, next) {
  const session = req.headers.authorization;

  const token = jwt.verify(session, "test");
  try {
    if (!token) {
      return res.status(401).json({ message: "no-token-error" });
    }
    PlayFabServer.GetUserInventory(
      { PlayFabId: token.data.PFuserId },
      (error, result) => {
        if (result !== null) {
          const exitsItem = products.every((p) =>
            result.data.Inventory.some((i) => i.ItemId === p)
          );
          console.log(exitsItem);
          if (exitsItem) {
            return res.json({
              isSuccess: false,
              message: "El producto esta duplicado",
              debugInfo: CompileErrorReport(error),
            });
          } else {
            next();
          }
        } else if (error !== null) {
          console.log(CompileErrorReport(error));

          return res.status(500).json({
            isSuccess: false,
            message: "Algo salió mal con tu primera llamada a la API.",
            debugInfo: CompileErrorReport(error),
          });
        }
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Error en la solicitud",
      isSuccess: false,
      error: error.response ? error.response.data : error.message,
    });
  }
}
