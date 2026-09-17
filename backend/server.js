const http = require("http");

const server = http.createServer((req, res) => {

    res.writeHead(200, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
    });

    res.end(JSON.stringify({
        status: "online",
        assistant: "ARISU",
        message: "ARISU backend is working."
    }));

});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(ARISU backend running on port ${PORT});
});
