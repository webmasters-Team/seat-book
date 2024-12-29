import { PlayFab, PlayFabClient } from "playfab-sdk";
import {
  encrypt,
  CompileErrorReport,
  JWT_SECRET,
} from "../../../utils/utils.js";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

export async function login(req, res) {
  const { userEmail, userPassword } = req.body;
  try {
    const loginRequest = {
      TitleId: PlayFab.settings.titleId,
      Email: userEmail,
      Password: userPassword,
    };

    PlayFabClient.LoginWithEmailAddress(loginRequest, (error, result) => {
      if (result !== null) {
        const { data } = result;

        // Cifrar los datos sensibles
        // const encryptedPayloadEntity = encrypt(data.EntityToken.EntityToken);
        // Datos sensibles a cifrar
        const payload = data.SessionTicket;

        function calculateExpirationDate(days) {
          const currentDate = new Date();
          const expirationDate = new Date(currentDate);
          expirationDate.setDate(currentDate.getDate() + days);
          return expirationDate;
        }

        // Firmar el JWT con el payload cifrado
        const tokenSession = jwt.sign(payload, JWT_SECRET);
        const tokenUser = jwt.sign(data.PlayFabId, JWT_SECRET);
        // const serializedToken = serialize("session", token, {
        //   httpOnly: true,
        //   secure: true, // Asegúrate de que esté en true en producción
        //   sameSite: 'lax', // 'None' permite que la cookie se envíe en solicitudes cross-site
        //   maxAge: 60 * 60 * 720, // 720 horas en segundos

        //   path: "/",
        // });

        // res.setHeader("Set-Cookie", serializedToken);
        return res.json({
          isSuccess: true,
          message: "¡Felicidades, Logeo exitoso!",
          tokenUser,
          session: tokenSession,
          expSession: data.EntityToken.TokenExpiration,
          exp: calculateExpirationDate(30),
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
    res.status(500).json({ message: "Internal Server Error" });
  }
}
