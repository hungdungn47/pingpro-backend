const express = require("express");
const dotenv = require("dotenv");
const routes = require("./routes");
const errorHandlingMiddleware = require("./middlewares/errorHandlingMiddleware");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require('mongoose')
dotenv.config();


const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", // Frontend origin
    credentials: true, // Allow cookies to be sent
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));
app.use(cookieParser());

const port = process.env.PORT || 3001;

routes(app);

app.use(errorHandlingMiddleware);

mongoose
  .connect(
    process.env.MONGO_DB_CONNECTION_STRING
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
