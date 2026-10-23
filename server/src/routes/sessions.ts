import http from "http";

type Session = {
    duration: number;
    status: "completed" | "waiting";
    task?: string;
};

const sessions: Session[] = [];

export function handleGetSessions(res: http.ServerResponse): void {
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 200;
    res.end(JSON.stringify(sessions));
}

export function handlePostSessions(req: http.IncomingMessage, res: http.ServerResponse): void {
    let body = "";
    req.on("data", (chunk) => {
        body += chunk;
        if (body.length > 1024) {
            res.statusCode = 413;
            res.end();
            req.destroy();
        }
    });
    req.on("end", () => {
        try {
            const data = JSON.parse(body);
            if (data.duration === undefined || data.status === undefined) {
                res.statusCode = 400;
                res.end();
            } else if (data.duration < 1 || data.duration > 120 || (data.status !== "completed" && data.status !== "waiting")) {
                res.statusCode = 400;
                res.end();
            } else {
                const session: Session = {
                    duration: data.duration,
                    status: data.status,
                };
                if (data.task) session.task = data.task;
                sessions.push(session);
                res.statusCode = 201;
                res.end();
            }
        } catch (e) {
            res.statusCode = 400;
            res.end();
        }
    });
}