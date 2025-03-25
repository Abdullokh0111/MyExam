const model = require("@models/user.model");

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
module.exports = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ error: "Refresh token is required" });
    }

    const user = await model.findOne({ refreshToken });
    if (!user) {
      return res.status(400).json({ error: "Invalid refresh token" });
    }

    // Удаляем refresh-токен у пользователя
    user.refreshToken = null;
    await user.save();

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
