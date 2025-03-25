function initRoutes(app) {
  app.use("/api/v1/auth", require("@routes/auth.route"));
}

exports.default = initRoutes;
