const { validationResult } = require("express-validator");
const AppErr = require("../Global/AppErr");
const UserModel = require("../Model/User");
const { ChatModel } = require("../Model/Chat");

//---------------Create Chat---------------//
const CreateChat = async (req, res, next) => {
  try {
    let error = validationResult(req);
    if (!error.isEmpty()) {
      return next(new AppErr(error.errors[0].msg, 404));
    }

    let { message, ReceiverId } = req.body;

    let receiverUser = await UserModel.findById(ReceiverId);
    if (!receiverUser) {
      return next(new AppErr("Recevier not found"), 404);
    }

    req.body.message = message;
    req.body.ReceiverId = receiverUser._id;
    req.body.SenderId = req.user;

    let chat = await ChatModel.create(req.body);

    res.status(200).json({
      message: "success",
      data: chat,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//---------------Get our send Chat------------------//

const GetChat = async (req, res, next) => {
  try {
    let message = await ChatModel.find({
      SenderId: req.user,
      ReceiverId: req.params.id,
    });
    if (!message) {
      return next(new AppErr("Not chat Found", 404));
    }

    res.status(200).json({
      message: "success",
      data: message,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//------------Update chat--------------------//

const UpdateChat = async (req, res, next) => {
  try {
    let user = await UserModel.findById(req.user);
    let chat = await ChatModel.findOne({
      _id: req.params.id,
      SenderId: req.user,
    });
    if (!chat) {
      return next(new AppErr("chat Not Found", 404));
    }

    if (user._id != chat.SenderId) {
      return next(new AppErr("You are not Authenticated to do this", 404));
    }

    let updateChat = await ChatModel.findByIdAndUpdate(
      chat._id,
      {
        message: req.body.message,
      },
      {
        new: true,
      }
    );

    res.status(200).json({
      message: "success",
      data: updateChat,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//-------------Delete Chat-------------------//

const deleteChat = async (req, res) => {
  try {
    let user = await UserModel.findById(req.user);
    let chat = await ChatModel.findOne({
      _id: req.params.id,
      SenderId: req.user,
    });
    if (!chat) {
      return next(new AppErr("chat Not Found", 404));
    }

    if (user._id != chat.SenderId) {
      return next(new AppErr("You are not Authenticated to do this", 404));
    }

    let updateChat = await ChatModel.findByIdAndRemove(chat._id);

    res.status(200).json({
      message: "success",
      data: updateChat,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

module.exports = {
  CreateChat,
  GetChat,
  UpdateChat,
  deleteChat,
};
