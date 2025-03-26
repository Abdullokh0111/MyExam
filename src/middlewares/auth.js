const jwt = require("jsonwebtoken");
const model = require("@models/user.model");

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "Access token is required" });
    }

    const token = authHeader.replace("Bearer ", "").trim(); // Оптимизированный разбор токена

    const decoded = jwt.verify(token, process.env.JWT_SECRET_TOKEN);
    const user = await model.findById(decoded.userId);

    if (!user) {
      return res.status(403).json({ error: "User not found" });
    }

    // Доп. проверка, если у пользователя есть флаг 'disabled' или 'status: inactive'
    if (user.disabled || user.status === "inactive") {
      return res.status(403).json({ error: "User is disabled or inactive" });
    }

    req.user = user; // Передаём пользователя в req
    next();
  } catch (error) {
    console.error("Access token error:", error);
    return res.status(403).json({ error: "Invalid or expired access token" });
  }
};

module.exports = protect;

