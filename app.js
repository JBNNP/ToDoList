const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const date = require(__dirname + "/date.js")

app.use(bodyParser.urlencoded({extended: true,}));
app.use(express.static("public"));
app.set("view engine", "ejs");


let items = ["Cook", "Eat"];
let workItem = [];

app.get("/", (req, res) => {
  const day = date.getDate();
  res.render("list", {listTitle: day,newItem: items,});
});

app.post("/", (req, res) => {
  if(req.body.button == "Work"){
    workItem.push(req.body.newItem);
    res.redirect("/work");
  }else{
    items.push(req.body.newItem);
    res.redirect("/");
  }
});

app.get("/work", (req,res) => {
  res.render('list', {listTitle: 'Work List', newItem: workItem});
});

app.get("/about", (req, res) => {
  res.render('about');
})

app.listen(3000, () => {
  console.log("server is running...");
});
