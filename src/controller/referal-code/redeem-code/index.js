import dotenv from "dotenv";

import {
  deactivateCode,
  getCodesInfo,
} from "../../../repository/referal-code/index.js";
import { codesValidation } from "../validate-code/index.js";
import { addItemToUserInventory } from "../../../repository/playfab-utils/index.js";
import { getDataSponsor } from "../../../repository/sponsor/index.js";
dotenv.config();

export async function executeRedeemCode(req, res) {
  const { userId, code } = req.body;

  const codesInfo = await getCodesInfo(code);
  console.log("executeRedeemCode" + JSON.stringify(codesInfo));
  try {
    if (codesValidation(codesInfo)) {
      for (const code of codesInfo) {
        console.log("for from codes validation" + JSON.stringify(code));
        const resSponsor = await getDataSponsor(code.client);
        if (!resSponsor) {
          console.log("El codigo no esta asociado a ningun sponsor");
          res.status(200).send({
            isSuccess: false,
            message: "El codigo no esta asociado a ningun sponsor",
          });
        }

        const objectData = {
          clientId: code.client.toString(),
          codeRef: code.code.toString(),
          clientName: resSponsor.company_name.toString(),
        };
        addItemToUserInventory(code.product_id, userId, objectData);
        if (!String(code.code).includes("VINOTINTO1")) {
          deactivateCode(code.code);
        }
      }
      return res.status(200).send({
        isSuccess: true,
        message: "Codigo activo",
      });
    } else {
      return res.status(200).send({
        message: "El codigo se encuentra inactivo",
        isSuccess: false,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "Error en la solicitud",
      isSuccess: false,
      error: error.response ? error.response.data : error.message,
    });
  }
}
