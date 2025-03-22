const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Chat = require("./models/chats.js");
const methodOverride = require("method-override");
const ExpressError = require("./ExpressError.js");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

main()
  .then(() => {
    console.log("connection Successful");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/whatsapp");
}

// Index Route
app.get(
  "/chats",
  asyncWrap(async (req, res, next) => {
    let Chats = await Chat.find(); // Chat.find is async function since it's bringing data from the db.
    res.render("index.ejs", { Chats });
  })
);

//New Route
app.get("/chats/new", (req, res) => {
  // throw new ExpressError(404, "errorrrrrr"); // error occureing in normal route will work fine.
  res.render("new.ejs");
});

//Create Route
app.post(
  "/chats",
  asyncWrap(async (req, res, next) => {
    let { from, msg, to } = req.body;
    let newChat = new Chat({
      from: from,
      msg: msg,
      to: to,
      created_at: new Date(),
    });

    await newChat.save().then((res) => {
      console.log("chat was saved..");
    });
    res.redirect("/chats");
  })
);

// edit route
app.get(
  "/chats/:id/edit",
  asyncWrap(async (req, res) => {
    let { id } = req.params;
    let chat = await Chat.findById(id);
    res.render("edit.ejs", { chat });
  })
);

//Defining ASYNCWRAP FUNCTION
function asyncWrap(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch((err) => next(err));
  };
}

//show route
app.get(
  "/chats/:id",
  asyncWrap(async (req, res, next) => {
    let { id } = req.params;
    let chat = await Chat.findById(id);
    if (!chat) {
      next(new ExpressError(404, "chat not found"));
    }
    res.render("show.ejs", { chat });
  })
);

//Update route
app.put(
  "/chats/:id",
  asyncWrap(async (req, res) => {
    let { id } = req.params;
    let { msg: newContent } = req.body;
    let updChat = await Chat.findByIdAndUpdate(
      id,
      { msg: newContent, updated_at: new Date() },
      { runValidators: true, new: true }
    );
    console.log(updChat);
    res.redirect("/chats");
  })
);

//Destory Route
app.delete(
  "/chats/:id",
  asyncWrap(async (req, res) => {
    let { id } = req.params;
    let deletedChat = await Chat.findByIdAndDelete(id);
    console.log(deletedChat);
    res.redirect("/chats");
  })
);

app.get("/", (req, res) => {
  res.send("server is Working");
});

//defining error handler for Validation error
function validationHandler(err) {
  console.log("this is a validation error.. Please follow the Rules");
  console.log(err.message);
  return err;
}

//Error handler (printing name)
app.use((err, req, res, next) => {
  console.log(err.name);
  if ((err.name = "ValidationError")) {
    err = validationHandler(err);
  }
  next(err);
});

//Error Handling (Main handler)
app.use((err, req, res, next) => {
  let { status = 500, message = "this is default err" } = err;
  res.status(status).send(message);
});

app.listen("8080", () => {
  console.log("server is listening at 8080");
});
