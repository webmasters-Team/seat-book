import { PlayFab, PlayFabClient, PlayFabServer } from "playfab-sdk";

export async function processItemInventoryUser(productsId, token) {
  console.log("token");
  console.log(token);
  try {
    // console.log("Iniciando proceso de verificación de items...");

    PlayFab._internalSettings.sessionTicket = token.data.PFsessionUser;

    // Verificar si el item está duplicado en el inventario del usuario
    console.log(
      "Verificando si el item está duplicado en el inventario del usuario..."
    );
    const userInventory = await new Promise((resolve, reject) => {
      PlayFabServer.GetUserInventory(
        { PlayFabId: token.data.PFuserId },
        (error, result) => {
          if (result) {
            resolve(result.data.Inventory);
          } else {
            reject(error);
          }
        }
      );
    });

    const isDuplicated = productsId.some((p) =>
      userInventory.some((i) => i.ItemId === p)
    );

    if (isDuplicated) {
      console.log("Item duplicado en el inventario del usuario.");
      return {
        message: "El producto está duplicado en el inventario",
        isSuccess: false,
      };
    }

    PlayFabServer.GrantItemsToUser(
      {
        CatalogVersion: "HLS1",
        ItemIds: productsId,
        PlayFabId: token.data.PFuserId,
      },
      (error, result) => {
        console.log(error);
        console.log(result.data.ItemGrantResults);
        if (result !== null) {
          console.log(result);
        } else if (error !== null) {
          console.log("error en la API");
          console.log(CompileErrorReport(error));

          return {
            isSuccess: false,
            message: "Algo salió mal con tu primera llamada a la API.",
            debugInfo: CompileErrorReport(error),
          };
        }
      }
    );

    if (result.isSuccess) {
      return { message: "Item agregado", isSuccess: true };
    } else {
      return { message: "Ocurrio un error", isSuccess: false, result };
    }
  } catch (err) {
    console.error("Error en processItemInventoryUser:", err);
    return {
      message: "Error al procesar el inventario del usuario",
      isSuccess: false,
      error: err.message || err,
    };
  }
}
