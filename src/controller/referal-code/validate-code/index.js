import  dotenv  from 'dotenv';
import { getCodesInfo } from '../../../repository/referal-code/index.js';

dotenv.config();

export async function executeCodeValidation(req, res){
    try {
        const codes = await getCodesInfo(req.body.code);
        if(codesValidation(codes)){
            return res.status(200).send({
                message: true,
                isSuccess: true,
              });
        } else {
            return res.status(200).send({
                message: false,
                isSuccess: true,
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

export function codesValidation(codesToValidate){
    if (codesToValidate == null || codesToValidate.length < 1) return false;
    try{
        console.log(codesToValidate);
        for (const code of codesToValidate) {
            if (!code.active) return false;
          }
        return true;
    } catch (err) {
        console.error(err);
    }
}