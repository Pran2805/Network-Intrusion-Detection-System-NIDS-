import express from "express"
import helmet from 'helmet'
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
const app = express()
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });

app.use(cors({
    origin: true,
    credentials: true
}))
app.use(express.json())
app.use(helmet())

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
});
export default httpServer