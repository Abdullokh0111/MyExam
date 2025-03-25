const jwt = require("jsonwebtoken");
const model = require("@models/user.model");

module.exports = async (req, res) => {
  const { refreshToken } =  req.cookies.refreshToken;// Исправляем, чтобы достать токен из body

  console.log("refreshToken from request:", refreshToken);

  if (!refreshToken) {
    return res.status(401).json({ error: "Refresh token is required" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await model.findById(decoded.userId);

    if (!user) {
      return res.status(403).json({ error: "User not found" });
    }

    console.log("Stored refresh token in DB:", user.refreshToken);
    console.log("Received refresh token:", refreshToken);

    if (user.refreshToken !== refreshToken) {
      console.log("Refresh token mismatch!");
      user.refreshToken = null;
      await user.save();
      return res.status(403).json({ error: "Invalid refresh token" });
    }

    console.log("Refresh token is valid. Generating new access token...");

    const accessToken = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET_TOKEN,
      { expiresIn: "1m" }
    );

    res.status(200).json({ accessToken });
  } catch (error) {
    console.error("Refresh token error:", error);
    return res.status(403).json({ error: "Invalid or expired refresh token" });
  }
};
