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
    .collection("contact")
    .find({})
    .sort({ username: 1 })
    .toArray();
  res.send(data);
});
app.get("/select-search", async (req, res) => {
  fullname: req.body.fullname;
  var data = await db
    .collection("contact")
    .find({ fullname: req.body.fullname })
    .sort({ fullname: 1 })
    .toArray();
  res.send(data);
});
app.post("/select-pagination", async (req, res) => {
  fullname: req.body.fullname;
  let page = 3;
  let limit = 2;
  var data = await db
    .collection("contact")
    .find({})
    .limit(limit)
    .sort({ fullname: 1 })
    .skip((page - 1) * limit)
    .toArray();
  res.send(data);
  console.log(data);
});
// ---------------------------------------
app.get("/delete", async (req, res) => {
  var data = await db.collection("contact").find({}).toArray();
  res.send(data);
});

app.post("/delete", async (req, res) => {
  var fullname = req.body.fullname;
  db.collection("contact").deleteOne({ fullname: fullname });
  console.log("deleted...");
  var data = await db.collection("contact").find({}).toArray();
  res.send(data);
});
// ---------------------------------------
app.get("/add", async (req, res) => {
  var data = await db.collection("contact").find({}).toArray();
  res.send(data);
});
app.post("/add", function (req, res) {
  var fullname = req.body.fullname;
  var mobilenumber = req.body.mobilenumber;
  var address = req.body.address;
  var data = {
    fullname: fullname,
    mobilenumber: mobilenumber,
    address: address,
  };
  db.collection("contact").insertOne(data, function (err, collection) {
    if (err) throw err;
    console.log("Record inserted Successfully");
  });
  res.send(data);
});
// ---------------------------------------
app.get("/update", async (req, res) => {
  var data = await db.collection("contact").find({}).toArray();
  res.send(data);
});
app.post("/update", async (req, res) => {
  var fullname = req.body.fullname;
  var mobilenumber = req.body.mobilenumber;
  var address = req.body.address;
  db.collection("contact").updateOne(
    { fullname: fullname },
    { $set: { mobilenumber: mobilenumber } }
  );
  var data = await db.collection("contact").find({}).toArray();
  res.send(data);
});
// ---------------------------------------

app.listen(5000);
