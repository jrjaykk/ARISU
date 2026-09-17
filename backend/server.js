const http = require("http");

const PORT = process.env.PORT || 3000;

const server = http.createServer(async (req, res) => {

    // CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // OPTIONS request
    if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
    }

    // Test route
    if (req.method === "GET" && req.url === "/") {

        res.writeHead(200, {
            "Content-Type": "application/json"
        });

        res.end(JSON.stringify({
            status: "online",
            assistant: "ARISU",
            message: "ARISU backend is working."
        }));

        return;
    }

    // AI route
    if (req.method === "POST" && req.url === "/api/chat") {

        let body = "";

        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", async () => {

            try {

                const data = JSON.parse(body);

                const userMessage = data.message;

                if (!userMessage) {
                    res.writeHead(400, {
                        "Content-Type": "application/json"
                    });

                    res.end(JSON.stringify({
                        error: "Message is required."
                    }));

                    return;
                }

                /*
                 * AI connection will be added here.
                 * API key will NOT be stored in GitHub.
                 */

                res.writeHead(200, {
                    "Content-Type": "application/json"
                });

                res.end(JSON.stringify({
                    reply: "I received your message: " + userMessage
                }));

            } catch (error) {

                console.error(error);

                res.writeHead(500, {
                    "Content-Type": "application/json"
                });

                res.end(JSON.stringify({
                    error: "Server error."
                }));
            }

        });

        return;
    }

    // Not found
    res.writeHead(404, {
        "Content-Type": "application/json"
    });

    res.end(JSON.stringify({
        error: "Route not found."
    }));
});


server.listen(PORT, () => {
    console.log(ARISU backend running on port ${PORT});
});
