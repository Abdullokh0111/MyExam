const jwt = require("jsonwebtoken");
const model = require("@models/user.model");
const bcrypt = require("bcrypt");


module.exports = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await model.findOne({ username });

    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const accessToken = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET_TOKEN,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    console.log("Generated refreshToken:", refreshToken);

    // ПРОБЛЕМА: refreshToken может не сохраняться!
    user.refreshToken = refreshToken;
    await user.save(); // Тут сохраняем, но проверь, что model поддерживает это поле

    console.log("Saved refreshToken in DB:", user.refreshToken);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
      accessToken,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
