const app = require("./app");
const mongoose = require("mongoose");
const config = require("./config/config");

require("dotenv").config();
mongoose
  .connect(config.mongoose.url)
  .then(() => {
    console.log("Connected to DB successfully");
  })
  .catch((err) => {
    console.log("DB connection Failed: ", err);
  });

// const PORT = 8080;
app.listen(config.port, () => {
  console.log("Connected to server, Listening to PORT: ", config.port);
});
