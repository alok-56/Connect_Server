const express = require("express");
const { param } = require("express-validator");
const {
  CreateComment,
  getComments,
  Repliedcomment,
  commentUpdate,
  RepliedcommentUpdate,
  DeleteComents,
} = require("../Controllers/Comments");
const IsLogin = require("../Middleware/Islogin");
const CommentRouter = express.Router();

CommentRouter.route("/CreateComment/:id").post(
  param("id")
    .exists()
    .withMessage("Please provide post Id")
    .isMongoId()
    .withMessage("Please provide correct format of post Id"),
  IsLogin,
  CreateComment
);

CommentRouter.route("/getComments/:id").get(
  param("id")
    .exists()
    .withMessage("Please provide post Id")
    .isMongoId()
    .withMessage("Please provide correct format of post Id"),
  IsLogin,
  getComments
);

CommentRouter.route("/reply/:id").post(
  param("id")
    .exists()
    .withMessage("Please provide post Id")
    .isMongoId()
    .withMessage("Please provide correct format of post Id"),
  IsLogin,
  Repliedcomment
);

CommentRouter.route("/updateComment/:id").put(
  param("id")
    .exists()
    .withMessage("Please provide post Id")
    .isMongoId()
    .withMessage("Please provide correct format of post Id"),
  IsLogin,
  commentUpdate
);

CommentRouter.route("/repliedComment/:id").put(
  param("id")
    .exists()
    .withMessage("Please provide post Id")
    .isMongoId()
    .withMessage("Please provide correct format of post Id"),
  IsLogin,
  RepliedcommentUpdate
);

CommentRouter.route("/deleteComment/:id").delete(
  param("id")
    .exists()
    .withMessage("Please provide post Id")
    .isMongoId()
    .withMessage("Please provide correct format of post Id"),
  IsLogin,
  DeleteComents
);
module.exports = CommentRouter;
