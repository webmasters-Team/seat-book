

import dotenv from "dotenv";
import { server } from "./app.js";



dotenv.config();
server.listen(process.env.PORT ?? 8000);




console.log("server running on", process.env.PORT ?? 8000);
