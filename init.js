const mongoose = require("mongoose");
const Chat = require("./models/chats.js");

main()
  .then(() => {
    console.log("connection Successful");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/whatsapp");
}

let allChats = [
  {
    from: "priya",
    to: "prakash",
    msg: "send me your notes",
    created_at: Date.now(),
    updated_at: Date.now(),
  },
  {
    from: "vishal",
    to: "subodh",
    msg: "how are you",
    created_at: Date.now(),
    updated_at: Date.now(),
  },
  {
    from: "niraj",
    to: "suraj",
    msg: "sup dude",
    created_at: Date.now(),
    updated_at: Date.now(),
  },
  {
    from: "adarsh",
    to: "rana",
    msg: "how you doin",
    created_at: Date.now(),
    updated_at: Date.now(),
  },
];

Chat.insertMany(allChats);
