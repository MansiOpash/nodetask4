const express = require("express");
var bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const { TIMEOUT } = require("dns");
mongoose.connect("mongodb://127.0.0.1:27017/college");
var db = mongoose.connection;
db.on("error", console.log.bind(console, "connection error"));
db.once("open", function (callback) {
  console.log("connection succeeded");
});
var http = require("http");
const jwt = require("jsonwebtoken");
const secretkey = "mansi";
const app = express();
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
// ---------------------------------------
app.get("/select", async (req, res) => {
  username: req.body.username;
  var data = await db
    .collection("student")
    .find({})
    .sort({ username: 1 })
    .toArray();
  res.send(data);
});
app.post("/select-search", async (req, res) => {
  username: req.body.username;
  var data = await db
    .collection("student")
    .find({ username: req.body.username })
    .sort({ username: 1 })
    .toArray();
  res.send(data);
});
app.post("/select-pagination", async (req, res) => {
  username: req.body.username;
  let page = 3;
  let limit = 2;
  var data = await db
    .collection("student")
    .find({})
    .limit(limit)
    .sort({ username: 1 })
    .skip((page - 1) * limit)
    .toArray();
  res.send(data);
  console.log(data);
});
// ---------------------------------------
app.get("/delete", async (req, res) => {
  var data = await db.collection("student").find({}).toArray();
  res.send(data);
});
app.post("/delete", async (req, res) => {
  var fullname = req.body.fullname;
  db.collection("student").deleteOne({ fullname: fullname });
  console.log("deleted...");
  var data = await db.collection("student").find({}).toArray();
  res.send(data);
});
// ---------------------------------------
app.get("/signup", async (req, res) => {
  var data = await db.collection("student").find({}).toArray();
  res.send(data);
});
app.post("/signup", function (req, res) {
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var fullname = req.body.fullname;
  var data = {
    email: email,
    username: username,
    password: password,
    fullname: fullname,
  };
  db.collection("student").insertOne(data, function (err, collection) {
    if (err) throw err;
    console.log("Record inserted Successfully");
  });
  res.send(data);
});
// ---------------------------------------
app.get("/update", async (req, res) => {
  var data = await db.collection("student").find({}).toArray();
  res.send(data);
});
app.post("/update", async (req, res) => {
  var username = req.body.username;
  var fullname = req.body.fullname;
  db.collection("student").updateOne(
    { username: username },
    { $set: { fullname: fullname } }
  );
  var data = await db.collection("student").find({}).toArray();
  res.send(data);
});
// ---------------------------------------
app.get("/signin", (req, res) => {
  res.send("user data inserted");
});
app.get("/", (req, res) => {
  res.json({
    message: "This is response",
  });
});
app.post("/signin", async function (req, res) {
  var data = {
    email: req.body.email,
    password: req.body.password,
  };
  token = tokengen(data);
  var data = await db.collection("student").find({}).toArray();
  var f = 0;
  data.forEach(function (element) {
    if (
      element.email == req.body.email &&
      element.password == req.body.password
    ) {
      f = 1;
      res.send("user successfully login");
    }
  });
  if (f == 0) {
    res.send("user not login");
  }
  function tokengen(data) {
    jwt.sign(data, secretkey, { expiresIn: "30000s" }, (err, token) => {
      console.log(token);
      res.json({ token });
      return token;
    });
  }
});

app.listen(5001);
