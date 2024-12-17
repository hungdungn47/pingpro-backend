const userRoute = require("./userRoute");

const routes = (app) => {
  app.use("/api/user", userRoute);
};

module.exports = routes;
