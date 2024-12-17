const express = require("express");
const dotenv = require("dotenv");
const { default: mongoose } = require("mongoose");
const routes = require("./routes");
dotenv.config();

const app = express();
app.use(express.json());

const port = process.env.PORT || 3001;

routes(app);
mongoose
  .connect(
    `mongodb+srv://hungdungn47:${process.env.MONGO_DB_PASSWORD}@tiki-clone-db.ell2o.mongodb.net/`
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log(error);
  });

app.listen(port, () => {
  console.log("Server running on port", port);
});
