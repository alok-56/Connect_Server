const express = require("express");
const { body, param } = require("express-validator");
const PostRouter = express.Router();
const multer = require("multer");
const {
  CreatePost,
  getAllPosts,
  Singlepost,
  UpdatePost,
  LikePost,
  DislikePost,
  ShareCount,
} = require("../Controllers/Post");
const IsLogin = require("../Middleware/Islogin");
const postModel = require("../Model/Post");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "Upload");
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split("/")[1];
    const uniqueSuffix = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}.${ext}`;
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

PostRouter.route("/createPost").post(
  upload.single("post_img"),
  IsLogin,
  CreatePost
);

PostRouter.route("/getAllpost").get(IsLogin, getAllPosts);

PostRouter.route("/getAllPost/:id").get(
  param("id")
    .exists()
    .withMessage("Please provide post Id")
    .isMongoId()
    .withMessage("Please provide correct format of post Id"),
  IsLogin,
  Singlepost
);

PostRouter.route("/UpdatePost/:id").put(
  param("id")
    .exists()
    .withMessage("Please provide post Id")
    .isMongoId()
    .withMessage("Please provide correct format of post Id"),
  IsLogin,
  UpdatePost
);

PostRouter.route("/likepost/:id").post(
  param("id")
    .exists()
    .withMessage("Please provide post Id")
    .isMongoId()
    .withMessage("Please provide correct format of post Id"),
  IsLogin,
  LikePost
);

PostRouter.route("/dislikepost/:id").post(
  param("id")
    .exists()
    .withMessage("Please provide post Id")
    .isMongoId()
    .withMessage("Please provide correct format of post Id"),
  IsLogin,
  DislikePost
);

PostRouter.route("/shareCount/:id").post(
  param("id")
    .exists()
    .withMessage("Please provide post Id")
    .isMongoId()
    .withMessage("Please provide correct format of post Id"),
  IsLogin,
  ShareCount
)

module.exports = PostRouter;
