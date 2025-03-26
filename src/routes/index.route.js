function initRoutes(app) {
  app.use("/api/v1/auth", require("@routes/auth.route"));
  app.use("/api/v1/post", require("@routes/post.route"));
}

exports.default = initRoutes;
