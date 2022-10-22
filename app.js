const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
app.set('view engine', 'ejs');
let items = ['Cook', 'Eat'];




app.get("/", (req, res) => {
  let today = new Date();
  const currentDay = today.getDay();
  let day = '';
  const name = 'John Brian';
  switch (currentDay) {
    case 0:
      day = 'Sunday';
      break;
    case 1:
      day = 'Monday';
      break;
    case 2:
      day = 'Tuesday';
      break;
    case 3:
      day = 'Wednesday';
      break;
    case 4:
      day = 'Thursday';
      break;
    case 5:
      day = 'Friday';
      break;
    case 6:
      day = 'Saturday';
      break;
    default:

  }

  res.render('list', {
    kindOfDay: day,
    name: name,
    newItem: items,

  });


});

app.post('/', (req, res) => {
  items.push(req.body.newItem);
  res.redirect('/');
});

app.listen(3000, () => {
  console.log("server is running...");
});
