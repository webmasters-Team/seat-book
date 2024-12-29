import { Router } from "express";
import { executeGetCodeInfo } from "../controller/referal-code/get-code-info/index.js";
import { executeCodeValidation } from "../controller/referal-code/validate-code/index.js";
import { executeRedeemCode } from "../controller/referal-code/redeem-code/index.js";


const routes = Router();

routes.get("/validate-code", executeCodeValidation);
routes.get("/get-code-info", executeGetCodeInfo);
routes.post("/redeem-code", executeRedeemCode)


export default routes;