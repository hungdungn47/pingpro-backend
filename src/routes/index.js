const userRoute = require("./userRoute");
const productRoute = require("./productRoute");
const orderRoute = require("./orderRoute");

const routes = (app) => {
  app.use("/api/user", userRoute);
  app.use("/api/product", productRoute);
  app.use("/api/order", orderRoute);
};

module.exports = routes;
