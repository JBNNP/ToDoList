const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const date = require(__dirname + "/date.js")
const mongoose = require("mongoose");
const { removeAllListeners } = require("nodemon");


app.use(bodyParser.urlencoded({extended: true,}));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect('mongodb://localhost:27017/todolistDB');

const itemsSchema = new mongoose.Schema({
  name: String
});

const Item = mongoose.model('Item', itemsSchema);

const cook = new Item({
  name: "Cook"
});

const play = new Item({
  name: "play"
});

const eat = new Item({
  name: "eat"
});

const defaultItems = [cook, play, eat];



app.get("/", (req, res) => {
  const day = date.getDate();
  
  if(Item)
  Item.find({}, (err , itemsFound)=>{

    if(itemsFound.length === 0){

      Item.insertMany(defaultItems, (err)=> {
        if(err){
          console.log(err);
        } else {
          console.log("success");
        }
      }); 

      res.redirect("/");
    } else {
      res.render("list", {listTitle: day, newItem: itemsFound});
    }
    
  });
});

app.post("/", (req, res) => {
  const itemName = req.body.newItem;
  const newItem = new Item({
    name: itemName
  });

  newItem.save();
  res.redirect('/');
});

app.post("/delete", (req, res)=> {
  const id = req.body.checkbox;
  Item.findByIdAndDelete(id, (err)=> {
    if(err){
      console.log(err);
    } else {
      console.log(`${id} is removed`);
    }
  });
  res.redirect('/');
});


app.get("/work", (req,res) => {
  res.render('list', {listTitle: 'Work List', newItem: workItem});
});

app.get("/about", (req, res) => {
  res.render('about');
})

app.listen(3000, () => {
  console.log(`server is running...`);
});
