import express from "express"
import helmet from 'helmet'
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import allRoutes from './routes/index.route.js'

const app = express()
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });

app.use(helmet())
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "default-src": ["'self'"],
      "img-src": ["'self'", "data:", "https:"],
      "script-src": ["'self'", "'unsafe-inline'"], // allow inline only if needed
      "style-src": ["'self'", "'unsafe-inline'"],
    },
  })
);
app.use(helmet.crossOriginOpenerPolicy({ policy: "same-origin" }));
app.use(helmet.crossOriginResourcePolicy({ policy: "same-origin" }));
app.use(helmet.crossOriginEmbedderPolicy());
app.use(helmet.dnsPrefetchControl({ allow: false }));
app.use(helmet.frameguard({ action: "deny" }));
app.use(helmet.hidePoweredBy());
app.use(helmet.hsts({ maxAge: 63072000, includeSubDomains: true, preload: true }));
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.originAgentCluster());
app.use(helmet.permittedCrossDomainPolicies({ permittedPolicies: "none" }));
app.use(helmet.referrerPolicy({ policy: "no-referrer" }));
app.use(helmet.xssFilter()); // legacy XSS header for older browsers

// ✅ CORS
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json())
app.use("/api/v1", allRoutes)

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
});


export { io, httpServer };