import { PlayFabAdmin, PlayFabClient, PlayFabServer } from "playfab-sdk";
import { CompileErrorReport } from "../../utils/utils.js";
import { error } from "console";
import { playfabConfig } from "../../config/playfab.js";

PlayFabServer.settings.developerSecretKey = playfabConfig.secretKey;
export async function addItemToUserInventory(itemId, userId) {
  try {
    if (itemId === undefined || userId === undefined) throw Error("Bad params");
    console.log(`addItemToUserInventory( ${itemId} , ${userId}`);
    PlayFabServer.GrantItemsToUser(
      {
        CatalogVersion: "HLS1",
        ItemIds: itemId,
        PlayFabId: userId,
      },
      (error, result) => {
        console.log(result);
        if (result !== null) {
          console.log(result);
          return result;
        } else if (error !== null) {
          console.log("error: " + CompileErrorReport(error));
          return error;
        }
      }
    );

    // PlayFabServer.GetUserInventory(
    //     { PlayFabId: userId },
    //     (error, result) => {
    //                 console.log(playfabConfig.secretKey);
    //                 console.log(userId);
    //                 console.log(PlayFabServer.settings.developerSecretKey);
    //                 console.log(PlayFabClient.settings.developerSecretKey);
    //                 console.log(PlayFabAdmin.settings.developerSecretKey);

    //                 console.log(result);
    //                 if (result !== null) {
    //                     console.log(result);
    //                     return result;
    //                 } else if (error !== null) {
    //                     console.log("error: " + JSON.stringify(error));
    //                     return error;
    //                 };
    //             }
    //     );
  } catch (error) {
    console.log(CompileErrorReport(error));
    return error;
  }
}
