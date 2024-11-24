const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Export the app instead of calling app.listen
module.exports = app;
