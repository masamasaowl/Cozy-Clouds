// ================ BASIC SETUP =================

let express = require ("express");
const app = express();
const port = 8080;
// require express.Router()
const listings = require("./routes/listingRoutes.js");
const reviews = require("./routes/reviewRoutes.js");

const methodOverride = require ("method-override");
const path = require("path");
const ExpressError = require("./utils/ExpressError.js");
// ejs-mate
const ejsMate = require ("ejs-mate");
// express-session
const session = require("express-session");
// flash
const flash = require("connect-flash");
// mongoose
const mongoose = require('mongoose');

// mongoDB setup
main()
    .then(() => {
    console.log("connection successful");
    })
    .catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/cozyClouds');
};

// sessions
const sessionOptions = {
  secret: 'mySuperSecret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true
  },
}
app.use(session(sessionOptions));

// flash
app.use(flash());
app.use((req,res,next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// Request-Middlewares
app.use(methodOverride("_method"));

app.use(express.urlencoded({extended : true}));

app.set("view engine", "ejs");

app.engine("ejs", ejsMate);

app.set("views", path.join(__dirname, "views/pages"));

app.set(express.static(path.join(__dirname, "public")));

app.use('/static', express.static('public'));

app.listen(port, () => {
    console.log("App is listening on port : 8080")
});

//  =============================================


// ================ Test document ===============
// app.get("/testListing", async(req,res) => {
//     let sampleListing = new Listing ({
//       title : "The Angkor Wat",
//       description : "beautiful place",
//       price : 1,
//       location : "Cambodia"
//     });

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful");
// });


// =================== Home Routes =================
app.get("/", (req,res) => {
  res.render("home.ejs");
});

// ================== Listings Routes ===============
app.use("/listings", listings);


// ================== Reviews Routes ===============
app.use("/listings/:id/review", reviews);



// ================== Undefined Route ===================
app.all("*", (req, res) => {
  throw new ExpressError(404,'Page not found');
});


// ================ Error handling middlewares ================
app.use((err,req,res,next)=>{
  // give default values to status and message
  let {statusCode = 500, message = "An Unknown error seems to have been occurred", name} = err;
  
  console.log(err.stack);
  res.status(statusCode).render("error.ejs", {statusCode, message, name})
});