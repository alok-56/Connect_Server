const express = require("express");
const ChatRouter = express.Router();
const { param, body } = require("express-validator");
const IsLogin = require("../Middleware/Islogin");
const { CreateChat, GetChat, UpdateChat, deleteChat } = require("../Controllers/Chat");

ChatRouter.route("/create").post(
  body("message").notEmpty().withMessage("Enter the message"),
  IsLogin,
  CreateChat
);

ChatRouter.route("/getchat/:id").get(IsLogin, GetChat);

ChatRouter.route("/updateChat/:id").put(IsLogin, UpdateChat);

ChatRouter.route("/deleteChat/:id").delete(IsLogin, deleteChat);

module.exports = ChatRouter;
