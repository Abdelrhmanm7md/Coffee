import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import dbConnection from "./database/DBConnection.js";
import { init } from "./src/modules/index.js";
import { globalError } from "./src/utils/middleWare/globalError.js";

import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import helmet from "helmet";
import xssSanitizer from "./src/utils/middleWare/sanitization.js";
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    rejectUnauthorized: false,
  },
});
const app = express();

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed methods
  credentials: true, // Allow credentials to be sent with requests
};
app.use(cors(corsOptions));
app.use(hpp());  // Prevent HTTP Parameter Pollution  --> in case of query string parameters
app.use(express.json({limit:'10kb'}));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("uploads"));
app.use(mongoSanitize());
app.use(xssSanitizer);
app.use(helmet());


// Apply the rate limiting middleware to all requests.
app.use("/api",limiter)
dbConnection();
app.use((err, req, res, next) => {
  if (err.code === 'ENOTFOUND') {
    return res.status(500).send('Network error, please try again later.');
  }
  res.status(500).send(err.message);
});
init(app);
app.use(globalError);


app.listen(process.env.PORT || 8000, () =>
  console.log(`Server is running on port ${process.env.PORT || 8000}!`)
);
httpServer.listen(8001);
export const sio = io;
