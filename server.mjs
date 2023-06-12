import http from "node:http";

import express from "express";

const app = express();

app.use(express.json());
app.use("/uploads", express.static("public/uploads"));
app.use("/voices", express.static("public/voices"));

app.get("/files/:fileName", async (request, response) => {
	console.log(request.params);
	response.send(`<audio controls src="/uploads/${request.params.fileName}"/>`);
});

const server = http.createServer(app);
let currentPort = 9000;

function startServer() {
	server.listen(currentPort, () => {
		console.log(`Server is running on port ${currentPort}`);
	});
}

function handleListenError(error) {
	if (error.code === "EADDRINUSE") {
		console.log(`Port ${currentPort} is already in use. Trying the next port …`);
		currentPort++;
		startServer();
	} else {
		console.error(error);
	}
}

startServer();
server.on("error", handleListenError);
