const express = require("express");
const http = require("http");
const { WebSocketServer } = require("ws");
const { setupWSConnection } = require("y-websocket/bin/utils");

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// Connect the Yjs logic to the WebSocket
wss.on("connection", (conn, req) => {
  setupWSConnection(conn, req);
});

// Start on Port 3001
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});