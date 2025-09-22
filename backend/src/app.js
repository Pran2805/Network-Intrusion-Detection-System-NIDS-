import express from "express"
import helmet from 'helmet'
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import allRoutes from './routes/index.route.js'

const app = express()
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });

app.use(cors({
    origin: true,
    credentials: true
}))
app.use(express.json())
app.use(helmet())
app.use("/api/v1", allRoutes)

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
});


export { io, httpServer };