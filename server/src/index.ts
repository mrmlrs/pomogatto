import http from "http";
import { router } from "./router.js";

const server = http.createServer(router);

const PORT = process.env.PORT ?? 3000;
server.listen(PORT);
