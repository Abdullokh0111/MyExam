const User = require("@models/user.model");
const bcrypt = require("bcrypt");

/**
 * @param {import('express').Request} req - The incoming request object from Express
 * @param {import('express').Response} res - The outgoing response object from Express
 * @param {import('express').NextFunction} next - The next middleware function
 */
module.exports = async (req, res, next) => {
  let { username, password, name } = req.body;

  if (!username || !password || !name) {
    return res.status(400).json({
      error: "Missing required fields",
      missingFields: [
        !username ? "username" : null,
        !password ? "password" : null,
        !name ? "name" : null,
      ].filter((field) => field !== null),
    });
  }

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      error: "Password does not meet security requirements",
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, one digit, one special character, and be at least 8 characters long.",
    });
  }

  try {
    const existingUser = await User.findOne({
      username: { $regex: username.toLowerCase(), $options: "i" },
    });

    if (existingUser) {
      return res.status(400).json({
        error: "Username already taken",
        message: "Please choose a different username.",
      });
    }

    // 🔹 **ХЕШИРУЕМ ПАРОЛЬ ПЕРЕД СОХРАНЕНИЕМ**
    console.log("password: ", password);
    const hashedPassword = await bcrypt.hash(password, 10);

    // Сохраняем пользователя с хешированным паролем
    const newUser = await User.create({
      username: username,
      name: name,
      password: hashedPassword,
    });
    console.log("user: ", newUser);
    

    return res.status(201).json({
      message: "User created successfully",
      data: newUser,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Server Error",
      message: "There was a problem creating the user.",
    });
  }
};
