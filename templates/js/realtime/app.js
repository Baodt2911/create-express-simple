import express from "express";
import http from "http";
import { Server } from "socket.io";
import routes from "./routes/index.js";
import { configSocket } from "./configs/index.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use("/api", routes);

configSocket(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () =>
  console.log(`🚀 Realtime API running on port ${PORT}`)
);
