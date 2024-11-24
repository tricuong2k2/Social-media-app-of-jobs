const express = require("express");
const { createServer } = require("node:http");

const app = express();
const server = createServer(app);

require('dotenv').config();

const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const route = require("./routes");
const { runMessageService } = require("./app/controllers/MessageService");

const db = require("./config/database");

// HTTP request logger middleware for node.js
app.use(morgan("dev"));

// Middleware for response: x-www-form-urlencoded and json
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Middleware for cookie
app.use(cookieParser());

// Middleware for CORS policy
app.use(cors({
  origin: ["http://127.0.0.1:3000", "http://localhost:3000", 
    "http://127.0.0.1:5000", "http://localhost:5000", 
  "http://127.0.0.1:7000", "http://localhost:7000"],
  credentials: true,  
}));

// Connect to database
db.connect();

// Route app
route(app);

// Connect message service
runMessageService(server);

const PORT = process.env.PORT || 8000;

server.listen(PORT);
