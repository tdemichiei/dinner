//jshint esversion 6

//JS Packages
const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const lodash = require("lodash");
const ejs = require("ejs");

const app = express();

app.set("view engine", "ejs");

//This sets up public folder and that is where you put all static files like css and images
app.use(express.static("public"));
app.use(bodyparser.urlencoded({ extended: true }));


//Local database
mongoose.connect("mongodb://localhost:27017/dinnerDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

//online db
// mongoose.connect(
//   "mongodb+srv://admin-td:test1234@cluster0-qynnc.mongodb.net/todolistDB",
//   {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   }
// );
// mongoose.set("useFindAndModify", false);

//this is connection checking/erroring
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  console.log("Connection achived!");
});


//global variables


//Schemas

//score
const scoreSchema = new mongoose.Schema({
  rating: Number,
  reviewer: String,
  review: String,
  scoreDate: Date,
  eatenDate: Date
})

const Score = mongoose.model("Score", scoreSchema);

//Dish schema
const dishSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
})

//dish model
const Dish = mongoose.model("Dish", dishSchema);

//meal schema
const mealSchema = new mongoose.Schema({
  dishSet: [dishSchema],
  eatenDate: Date
})

//meal Model
const Meal = mongoose.model("Meal", mealSchema);

//routes
app.get("/", function(req, res) {
  res.render("home");
});

app.get("/dishes", function(req, res){
  res.render("dishes");
});

app.get("/meals", function(req, res){
  Dish.find({}, function(err, results) {
    res.render("meals", {
      //this is the object of each dish
    newDish: results
    });
  });

});

//display all dishes
app.get("/alldishes", function(req, res){
  Dish.find({}, function(err, results) {
    //console.log(results);
    res.render("alldishes", {
      //this is the object of each dish
    newDish: results
    });
  });

});

//display all meals
app.get("/allmeals", function(req, res){
  Meal.find({}, function(err, results) {
    //console.log(results);
    res.render("allmeals", {
      //this is the object of each dish
    newMeal: results
    });
  });

});

//post route to save dishes
app.post("/dishes", function(req, res){
  const dish = req.body.dishName;
  const desc = req.body.dishDescription;


  const newDish = new Dish({
    name: dish,
    description: desc
  });
  //console.log("Dish: " + dish);
  //console.log("Desc: " + desc);

  newDish.save();

  res.redirect("/alldishes");
});

//post route to save meals
app.post("/meals", function(req, res){
  // const meal = req.body.mealName;
  const dishes = req.body.dishes;
  const date = req.body.dateEaten;
  const array = [];

  console.log("length: " + dishes.length);

  // console.log("Meal: " + meal + " dishes: " + dishes + " date: " + date);

  // console.log("Dishesi " + dishes[i]);
  // console.log("Dishesi " + typeof dishes[i]);
  // array.push(dishes[i]);
  for(let i = 0; i<dishes.length; i++) {

    Dish.findById(dishes[i], function(err, dish){
      if(err){
        console.log(err);
      } else {
        console.log("dish: " + dish);
        array.push(dish);
        console.log("array Late: " + array);
      }
      if(i=dishes.length){
        const newMeal = new Meal({
          dishSet: array,
          eatenDate: date
        })
          newMeal.save();
          console.log("saved meal: " + newMeal);
      }
    })

  } //for close


res.redirect("/meals");
});

//Server listener
app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000 if local");
});
