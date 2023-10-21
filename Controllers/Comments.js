const { validationResult } = require("express-validator");
const AppErr = require("../Global/AppErr");
const postModel = require("../Model/Post");
const commentmodel = require("../Model/Comments");
const UserModel = require("../Model/User");

//----------------Create Comments-----------------//
const CreateComment = async (req, res, next) => {
  try {
    let error = validationResult(req);
    if (!error.isEmpty()) {
      return next(new AppErr(error.errors[0].msg, 404));
    }
    const { message } = req.body;
    let post = await postModel.findById(req.params.id);
    if (!post) {
      return nexr(new AppErr("Post not found", 404));
    }
    req.body.userId = req.user;
    req.body.postId = post._id;
    req.body.message = message;

    let commentcreate = await commentmodel.create(req.body);

    post.comments.push(commentcreate._id);
    await post.save();

    res.status(200).json({
      message: "success",
      data: commentcreate,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//--------Get Comments------------//
const getComments = async (req, res, next) => {
  try {
    let error = validationResult(req);
    if (!error.isEmpty()) {
      return next(new AppErr(error.errors[0].msg, 404));
    }

    let comment = await commentmodel.find({
      postId: req.params.id,
    });

    if (!comment) {
      return next(new AppErr("No Comment found", 404));
    }

    res.status(200).json({
      message: "success",
      data: comment,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//-------------------Replied Comment------------------//

const Repliedcomment = async (req, res, next) => {
  try {
    let error = validationResult(req);
    if (!error.isEmpty()) {
      return next(new AppErr(error.errors[0].msg, 404));
    }
    const { message } = req.body;
    //------------Getting comment---------------//
    let comment = await commentmodel.findOne({
      _id: req.params.id,
    });
    if (!comment) {
      return next(new AppErr("Comment not found", 404));
    }

    comment.repliedMessage.push({
      userId: req.user,
      message: message,
    });

    await comment.save();

    res.status(200).json({
      message: "success",
      data: comment,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//------------------Update Own Comment-----------------//
const commentUpdate = async (req, res, next) => {
  try {
    let error = validationResult(req);
    if (!error.isEmpty()) {
      return next(new AppErr(error.errors[0].msg, 404));
    }

    //-------find user Comment----------//
    let user = await UserModel.findById(req.user);
    let comment = await commentmodel.findOne({
      userId: user._id,
      _id: req.params.id,
    });
    console.log(comment);
    if (!comment) {
      return next(new AppErr("Comment not found", 404));
    }

    //-----------Update comment-----------//

    let updateComment = await commentmodel.findByIdAndUpdate(
      comment._id,
      {
        message: req.body.message,
      },
      { new: true }
    );

    res.status(200).json({
      message: "success",
      data: updateComment,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//------------------Update Own RepiledComment-----------------//
const RepliedcommentUpdate = async (req, res, next) => {
  try {
    let error = validationResult(req);
    if (!error.isEmpty()) {
      return next(new AppErr(error.errors[0].msg, 404));
    }
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//--------------Delete Comments-----------------------//
const DeleteComents = async (req, res, next) => {
  try {
    let error = validationResult(req);
    if (!error.isEmpty()) {
      return next(new AppErr(error.errors[0].msg, 404));
    }

    let comments = await commentmodel.findOne({
      _id: req.params.id,
      userId: req.user,
    });

    if (!comments) {
      return next(new AppErr("Comment not found", 404));
    }

    let deletecomment = await commentmodel.findOneAndDelete(comments._id, {
      new: true,
    });

    res.status(200).json({
      message: "success",
      data: deletecomment,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

module.exports = {
  CreateComment,
  getComments,
  Repliedcomment,
  commentUpdate,
  RepliedcommentUpdate,
  DeleteComents,
};
