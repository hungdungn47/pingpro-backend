const userRoute = require("./userRoute");
const productRoute = require("./productRoute");

const routes = (app) => {
  app.use("/api/user", userRoute);
  app.use("/api/product", productRoute);
};

module.exports = routes;
