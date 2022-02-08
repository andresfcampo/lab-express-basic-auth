const express = require("express");
const mongoose = require("mongoose");
const handlebars = require('express-handlebars');

mongoose.connect("mongodb://localhost/blog-v2");

const app = express();

app.engine("hbs")
app.set("view engine", "hbs");
app.use(expressLayouts);
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(
  session({
    secret: "helloworld",
    resave: true,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1200000,
    },
    store: store.create({
      mongoUrl: "mongodb://localhost/blog-v2",
    }),
  })
);
// middle ware for making the user available to all templates
app.use((req, res, next) => {
  res.locals.currentUser = req.session.currentUser;
  next();
});

app.get("/", (req, res) => {
  res.render("home");
});

const userRouter = require("./routes/user.routes");
app.use("/user", userRouter);

const postRouter = require ('./routes/post.routes')
app.use('/posts', postRouter);

app.listen(3000);