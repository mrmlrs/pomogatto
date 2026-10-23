import http from "http";
import { handleGetSessions, handlePostSessions } from "./routes/sessions.js";

export function router(req: http.IncomingMessage, res: http.ServerResponse): void {
    if (req.method === "GET" && req.url === "/api/sessions") {
        handleGetSessions(res);
    } else if (req.method === "POST" && req.url === "/api/sessions") {
        handlePostSessions(req, res);
    } else {
        res.statusCode = 404;
        res.end();
    }
}