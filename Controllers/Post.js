const { validationResult } = require("express-validator");
const AppErr = require("../Global/AppErr");
const UserModel = require("../Model/User");
const postModel = require("../Model/Post");

//-------------------Create Post------------------------//
const CreatePost = async (req, res, next) => {
  try {
    //----Validation Check--------//
    let error = validationResult(req);
    if (!error.isEmpty()) {
      return next(new AppErr(error.errors[0].msg, 404));
    }
    //---Check User-------------//
    let userFound = await UserModel.findById(req.user);
    console.log(userFound);
    if (userFound.isDeleted || !userFound.isVerified) {
      return next(
        new AppErr("User Not Verfied or user Account Deactivated", 404)
      );
    }
    req.body.users = req.user;
    //----Create Post----------//
    if (req.file) {
      req.body.Image = req.file.filename;
      console.log(req.file);
    }
    let postCtrl = await postModel.create({
      ...req.body,
    });

    //---------Push in userProfile---------------//
    userFound.posts.push(postCtrl._id);
    await userFound.save();

    res.status(200).json({
      message: "Success",
      data: postCtrl,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//-------------------Get All Post-----------------------//
const getAllPosts = async (req, res, next) => {
  try {
    let postFound = await postModel
      .find()
      .populate("users")
      .populate("comments");
    res.status(200).json({
      message: "Success",
      data: postFound,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//-------------------Single Post------------------------//
const Singlepost = async (req, res, next) => {
  try {
    //---Check validation----//
    let error = validationResult(req);
    if (!error.isEmpty()) {
      return next(new AppErr(error.errors[0].msg, 404));
    }
    let postfound = await postModel
      .findOne({ _id: req.params.id })
      .populate("users");
    res.status(200).json({
      message: "success",
      data: postfound,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//------------------Update Post-------------------------//

const UpdatePost = async (req, res, next) => {
  try {
    //-checkvalidation--//
    let error = validationResult(req);
    if (!error.isEmpty()) {
      return next(new AppErr(error.errors[0].msg), 404);
    }

    //---------Check Post----------//
    let user = await UserModel.findById(req.user);
    let updatepost = await postModel.findOne({
      _id: req.params.id,
    });

    if (!updatepost) {
      return next(new AppErr(error.errors[0].msg), 404);
    }

    //--------Check post belong to that user or not---//
    if (!user.posts.includes(updatepost._id)) {
      return next(
        new AppErr("you are not authorized to update this post", 404)
      );
    }

    //---update the post--------//
    let updatedata = await postModel.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
      },
      {
        new: true,
      }
    );

    res.status(200).json({
      message: "success",
      data: updatedata,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//------------------Delete Post-------------------------//

const DeletePost = async (req, res, next) => {
  try {
    //-------validation check---------//
    let error = validationResult(req);
    if (!error.isEmpty()) {
      return next(new AppErr(error.errors[0].msg, 404));
    }

    //----------Get user and post----------//
    let user = await UserModel.findById(req.user);
    let post = await postModel.findOne({
      _id: req.params.id,
    });

    if (!post) {
      return next(new AppErr("post not found", 404));
    }

    //-----Check post belong to that user or not-----//

    if (!user.posts.includes(post._id)) {
      return next(new AppErr("you are not allowed to delete post", 404));
    }

    //-----------Delete post------------//

    let deletePost = await postModel.findByIdAndDelete(req.params.id, {
      new: true,
    });

    //------------Remove from User-------//

    res.status(200).json({
      message: "success",
      data: deletePost,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//------------------Like Post---------------------------//

const LikePost = async (req, res, next) => {
  try {
    let error = validationResult(req);
    if (!error.isEmpty()) {
      return next(new AppErr(error.errors[0].msg, 404));
    }

    //-------------Check post--------//
    let user = await UserModel.findById(req.user);
    let post = await postModel.findOne({ _id: req.params.id });
    if (!post) {
      return next(new AppErr("post not found", 404));
    }

    //--------Check like-----------//
    if (!post.likeby.includes(user._id)) {
      post.likeby.push(user._id);
    }

    await post.save();

    res.status(200).json({
      message: "success",
      data: post,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//--------------------DisLike Post-----------------------//
const DislikePost = async (req, res, next) => {
  try {
    let error = validationResult(req);
    if (!error.isEmpty()) {
      return next(new AppErr(error.errors[0].msg, 404));
    }

    //-----------check post--------------//
    let user = await UserModel.findById(req.user);
    let post = await postModel.findOne({ _id: req.params.id });
    if (!post) {
      return next(new AppErr(error.errors[0].msg, 404));
    }

    //----------Dislike--------------//
    if (post.likeby.includes(user._id)) {
      post.likeby.pop(user._id);
    }

    await post.save();

    res.status(200).json({
      message: "Success",
      data: post,
    });
  } catch (error) {
    return next(new AppErr(error.message), 500);
  }
};

//-------------------Share count------------------------//

const ShareCount = async (req, res, next) => {
  try {
    let post = await postModel.findById(req.params.id);
    if (!post) {
      return next(new AppErr("Post not found"), 404);
    }
    post.Sharecount = post.Sharecount + 1;
    res.status(200).json({
      message: "success",
      data: post,
    });

    await post.save();
  } catch (error) {
    return next(new AppErr(error.message), 500);
  }
};

module.exports = {
  CreatePost,
  getAllPosts,
  Singlepost,
  UpdatePost,
  DeletePost,
  LikePost,
  DislikePost,
  ShareCount,
};
