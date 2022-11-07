const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const date = require(__dirname + "/date.js")
const mongoose = require("mongoose");
const _ = require("lodash");
const { removeAllListeners } = require("nodemon");



app.use(bodyParser.urlencoded({extended: true,}));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect('mongodb+srv://admin-john:e6WPqSUJINAQ7Rpp@todolist.xjodj2z.mongodb.net/todolistDB');

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

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemsSchema]
});

const List = mongoose.model('List', listSchema);

app.get("/", (req, res) => {
  // const day = date.getDate();
  
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
      res.render("list", {listTitle: "Today", newItem: itemsFound});
    }
    
  });
});



app.get("/about", (req, res) => {
  res.render('about');
});



app.get("/:listId", (req, res) => {
  const requestedList = _.capitalize(req.params.listId);

  List.findOne({name: requestedList},(err, results) => {

    if(!err){
      if(!results){

//doesnt exists
      const list = new List({
        name: requestedList,
        items: defaultItems
      });
      list.save();
      res.redirect("/" + requestedList);

      } else {
//exists
//first param is the file name of ejs file, 2nd param is an object that contains a data by another 
//object which is from the database that we got in the results in line 75 (LIst.findOne)
        res.render("list", {listTitle: results.name, newItem: results.items});
      }
    }
    }
  )
});



app.post("/", (req, res) => {
  const itemName = req.body.newItem;
  const listName = req.body.list;
  const newItem = new Item({
    name: itemName
  });
//this will check if you are in the home route it will be saved directly there BUT the title should be "Today" but I used the DATE sorry
//if not it will look for that listTitle name and push the newItem into the Items then saved it there because it is embedded already in the line 37 which is the (ListSchema)
  if(listName === "Today"){
    newItem.save();
    res.redirect('/');
  } else {
    List.findOne({name: listName}, (err, foundList) => {
      foundList.items.push(newItem);
      foundList.save();
      res.redirect('/' + listName); //this will be passed in line 72 (app.get("/:listId")) and render the data there
    });
  }  
});



app.post("/delete", (req, res)=> {
  const id = req.body.checkbox;
  const list = req.body.list;

  if(list === "Today"){ 
    Item.findByIdAndDelete(id, (err)=> {
      if(err){
        console.log(err);
      } else {
        console.log(`${id} is removed`);
      }
    });
    res.redirect('/');
  } else {
//will search and delete 
    List.findOneAndUpdate({name: list}, { $pull: {items: {_id: id}} }, (err, result)=>{
      if(!err){
        res.redirect("/" + list);
      }
    });
  }
});


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port);

app.listen(port, () => {
  console.log(`server is running...`);
});
