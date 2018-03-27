
//define environment variables
require("dotenv").config({ path: "variables.env" });

// connect to the database
require('./database/connect');

// import models
require("./database/models/Ad");
require("./database/models/User");

// define elements
const app = require('./app');
const debug = require("debug")("nodepop-2:server");
const http = require("http");
const cluster = require("cluster");
const port = normalizePort(process.env.PORT || "3000");
const server = http.createServer(app);

// start app with cluster
app.set("port", port);

if (cluster.isMaster) {
  cluster
  .on("listening", (worker, address) => {
    console.log(
      `Worker ${worker.id} with pid ${
        worker.process.pid
      } is connected to port ${address.port}`
    );
  })
  .on("exit", (worker, code, signal) => {
    console.log(
      `Worker ${
        worker.process.pid
      } died with code: ${code}, and signal: ${signal}`
    );
    console.log("Starting new worker");
    cluster.fork();
  });

  const numCPUs = require("os").cpus().length;

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
} else {
  server.listen(port);
  server.on("error", onError);
  server.on("listening", onListening);}


// define functions used to start app
function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }

  return false;
}

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}





































