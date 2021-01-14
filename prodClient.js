const express = require("express");
const fs = require("fs");
const app = express();
const path = require("path");

app.use(express.static("dist"));

// viewed at http://localhost:8080
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname + "/dist/index.html"));
});

app.listen(80);
