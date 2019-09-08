const express = require("express");
const router = require("./routes");

class App {
  constructor() {
    this.server = express();
    this.middleware();
    this.router();
  }

  middleware() {
    this.server.use(express.json());
  }

  router() {
    this.server.use(router);
  }
}

module.exports = new App().server;
