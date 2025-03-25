const multer = require("multer");
const router = require("express").Router();
const addPost = require("@controllers/posts/addPost");
const path = require("path");

// Функция генерации случайного имени файла
const generateRandomFilename = (originalname) => {
  const randomString = Math.random().toString(36).substring(2, 12); // Генерируем случайную строку
  const ext = path.extname(originalname).toLowerCase(); // Получаем расширение

  // Если расширение не .png, .img или .jpg, ставим .png по умолчанию
  return `${randomString}${
    [".png", ".img", ".jpg"].includes(ext) ? ext : ".png"
  }`;
};

// Настройка хранилища
const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    const newFilename = generateRandomFilename(file.originalname);
    cb(null, newFilename);
  },
});

// Настройка multer (разрешаем загружать только изображения)
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Ограничение 5MB
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ["image/png", "image/img", "image/jpeg"];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only .png, .img, and .jpg files are allowed!"));
    }
  },
});

// Роут с загрузкой ОДНОГО файла
router.post("/addPost", upload.single("image"), addPost);

module.exports = router;
