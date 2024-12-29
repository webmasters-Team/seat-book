import { JWT_SECRET } from "../../../utils/utils.js";
import jwt from "jsonwebtoken";

export async function loginWithGoogle(req, res) {
  const data = req.body;
  try {
    function calculateExpirationDate(days) {
      const currentDate = new Date();
      const expirationDate = new Date(currentDate);
      expirationDate.setDate(currentDate.getDate() + days);
      return expirationDate;
    }
    const payload = data.SessionTicket;
    const tokenSession = jwt.sign(payload, JWT_SECRET);
    const tokenUser = jwt.sign(data.PlayFabId, JWT_SECRET);

    return res.json({
      isSuccess: true,
      message: "¡Felicidades, Logeo exitoso!",
      tokenUser,
      session: tokenSession,
      expSession: data.EntityToken.TokenExpiration,
      exp: calculateExpirationDate(30),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
