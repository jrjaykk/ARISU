const http = require("http");
const OpenAI = require("openai");

const PORT = process.env.PORT || 3000;

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const server = http.createServer(async (req, res) => {

    // CORS
    res.setHeader("Access-Control-Allow-Origin", "https://jrjaykk.github.io");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // Preflight request
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
            message: "ARISU AI backend is working."
        }));

        return;
    }

    // AI route
    if (req.method === "POST" && req.url === "/api/chat") {

        let body = "";

        req.on("data", function(chunk) {
            body += chunk;
        });

        req.on("end", async function() {

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

                const response = await client.responses.create({
                    model: "gpt-5.6-luna",
                    instructions:
                        "You are ARISU, a helpful personal AI assistant. Answer clearly, naturally and concisely.",
                    input: userMessage
                });

                const reply = response.output_text;

                res.writeHead(200, {
                    "Content-Type": "application/json"
                });

                res.end(JSON.stringify({
                    reply: reply
                }));

            } catch (error) {

                console.error("OPENAI ERROR:", error);

                res.writeHead(500, {
                    "Content-Type": "application/json"
                });

                res.end(JSON.stringify({
                    error: "AI request failed."
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

server.listen(PORT, function() {
    console.log("ARISU backend running on port " + PORT);
});
