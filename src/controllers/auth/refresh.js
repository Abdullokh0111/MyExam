const jwt = require("jsonwebtoken");
const model = require("@models/user.model");

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
module.exports = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ error: "Refresh token is required" });
    }

    const user = await model.findOne({ refreshToken });
    if (!user) {
      return res.status(403).json({ error: "Invalid refresh token" });
    }

    // Проверяем refresh-токен
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: "Invalid refresh token" });
      }

      // Генерируем новый access-токен
      const accessToken = jwt.sign(
        { userId: user._id, username: user.username },
        process.env.JWT_SECRET_TOKEN,
        { expiresIn: "1m" } // Можно поставить больше, например "15m"
      );

      res.json({ accessToken });
    });
  } catch (error) {
    console.error("Refresh error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
