import { PlayFabClient } from "playfab-sdk";
import { CompileErrorReport } from "../../../utils/utils.js";

export async function singup(req, res) {
  try {
    const registerRequest = {
      TitleId: PlayFab.settings.titleId,
      CustomId: "test-vitto",
      Email: "vitto@test.com",
      Password: "123456",
      Username: "vitto",
      DisplayName: "vittoTest",
      CreateAccount: true,
    };
    PlayFabClient.RegisterPlayFabUser(registerRequest, (error, result) => {
      if (result !== null) {
        res.json({
          message: "¡Felicidades, Create un usuario!",
          result,
        });
      } else if (error !== null) {
        res.status(500).json({
          message: "Algo salió mal con tu primera llamada a la API.",
          debugInfo: CompileErrorReport(error),
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error en la solicitud",
      isSuccess: false,
      error: error.response ? error.response.data : error.message,
    });
  }
}
