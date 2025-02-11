const userRoute = require("./userRoute");
const productRoute = require("./productRoute");
const orderRoute = require("./orderRoute");
const cartRoute = require("./cartRoute");

const routes = (app) => {
  app.use("/api/user", userRoute);
  app.use("/api/product", productRoute);
  app.use("/api/order", orderRoute);
  app.use("/api/cart", cartRoute);
};

module.exports = routes;
