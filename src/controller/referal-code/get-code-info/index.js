import  dotenv  from 'dotenv';
import { getCodesInfo } from '../../../repository/referal-code/index.js';
dotenv.config();

export async function executeGetCodeInfo(req, res){
  try {
    const codesInfo = await getCodesInfo(req.body.code);
    return res.status(200).send({
      isSuccess: true,
      message: codesInfo,
    });
      
  } catch (error) {
      console.error(error);
      return res.status(500).send({
        message: "Error en la solicitud",
        isSuccess: false,
        error: error.response ? error.response.data : error.message,
      });
    }
}