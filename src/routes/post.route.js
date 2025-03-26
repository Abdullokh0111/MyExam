const multer = require("multer");
const router = require("express").Router();
const addPost = require("@controllers/posts/addPost");
const getPosts = require("@controllers/posts/getPosts");
const updAndDel = require("@controllers/posts/updAndDel");
const path = require("path");

const generateRandomFilename = (originalname) => {
  const randomString = Math.random().toString(36).substring(2, 12);
  const ext = path.extname(originalname).toLowerCase();

  return `${randomString}${
    [".png", ".img", ".jpg"].includes(ext) ? ext : ".png"
  }`;
};

const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    const newFilename = generateRandomFilename(file.originalname);
    cb(null, newFilename);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ["image/png", "image/img", "image/jpeg"];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only .png, .img, and .jpg files are allowed!"));
    }
  },
});

router
  .post("/addPost", upload.single("image"), addPost)
  .get("/posts", getPosts.getPosts)
  .get("/posts/:id", getPosts.getPostById)
  .patch("/posts/:id", updAndDel.updatePost)
  .delete("/posts/:id", updAndDel.deletePost);

module.exports = router;
