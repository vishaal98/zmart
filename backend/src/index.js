const app = require("./app");
const mongoose = require("mongoose");
require("dotenv").config();
mongoose
  .connect(process.env.MONGO_DB)
  .then(() => {
    console.log("Connected to DB successfully");
  })
  .catch((err) => {
    console.log("DB connection Failed: ", err);
  });

const PORT = 8080;
app.listen(PORT, () => {
  console.log("Connected to server, Listening to PORT: ", PORT);
});
