// ================ BASIC SETUP =================
if(process.env.NODE_ENV != "production"){
  require('dotenv').config();
}

let express = require ("express");
const app = express();
const port = 8080;
// require express.Router()
const listingRoutes = require("./routes/listingRoutes.js");
const reviewRoutes = require("./routes/reviewRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
// methodOverride
const methodOverride = require ("method-override");
const path = require("path");
// error class
const ExpressError = require("./utils/ExpressError.js");
// ejs-mate
const ejsMate = require ("ejs-mate");

// express-session
const session = require("express-session");
// Mongo sessions store
const MongoStore = require("connect-mongo");
// flash
const flash = require("connect-flash");
// passport
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require('./models/user.js');
// mongoose
const mongoose = require('mongoose');

// Mongo Atlas URL
const dbURL = process.env.MONGO_ATLAS_URL

// mongoDB setup
main()
    .then(() => {
    console.log("connection successful");
    })
    .catch(err => console.log(err));
async function main() {
  await mongoose.connect(dbURL);
};

// sessions
// Mongo Sessions Store
const store = MongoStore.create({
  mongoUrl: dbURL,
  crypto:{
    secret: process.env.SESSION_SECRET
  },
  touchAfter:24*3600,
});

store.on("error", () => {
  console.log("Error in MONGO SESSIONS STORE", err);
});

const sessionOptions = {
  store: store,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true
  },
}
app.use(session(sessionOptions));

// passport middlewares
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// flash middlewares
app.use(flash());
app.use((req,res,next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.info = req.flash("info");
  res.locals.currUser = req.user;
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


// landing page
app.get("/", (req,res) => {
  res.redirect("/listings");
})

// Listings Routes 
app.use("/listings", listingRoutes);

// Reviews Routes
app.use("/listings/:id/review", reviewRoutes);

// User Routes
app.use("/", userRoutes);



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