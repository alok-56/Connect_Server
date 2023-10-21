const { validationResult } = require("express-validator");
const AppErr = require("../Global/AppErr");
const UserModel = require("../Model/User");
const bcrypt = require("bcrypt");
const GenerateToken = require("../Global/GenerateToken");
const otpGenerator = require("otp-generator");
const SendEmail = require("../Global/SendMail");
const { response } = require("express");

//-----------------SignUp Student && Signup Teacher------------------------//
const UserSignup = async (req, res, next) => {
  try {
    //----Validation Check------//
    let error = validationResult(req);
    if (!error.isEmpty()) {
      return next(new AppErr(error.errors[0].msg, 404));
    }

    let { Email, Password, Number, role } = req.body;

    //-----Email Check-------//
    let userFound = await UserModel.find({ Email: Email });
    if (userFound.length > 0) {
      return next(new AppErr("Email Already in use", 404));
    }

    //----Phone Check--------//
    let userFoundNumber = await UserModel.find({ Number: Number });
    if (userFoundNumber.length > 0) {
      return next(new AppErr("Phone Number already in user", 404));
    }

    //-----Hashing Password------//
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(Password, salt);
    req.body.Password = hashedPassword;


    //-------Saveing document------//
    let user = await UserModel.create(req.body);

    //------generate Token---------//
    let token = GenerateToken(user._id);

    return res.status(200).json({
      status: "success",
      data: user,
      token: token,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

// //-----------------SignUp College------------------------------------------//
// const CollegeSignup = async (req, res, next) => {
//   try {
//     //----Validation Check------//
//     let error = validationResult(req);
//     if (!error.isEmpty()) {
//       return next(new AppErr(error.errors[0].msg, 404));
//     }

//     let { Email, Password, Number, role } = req.body;

//     //-----Email Check-------//
//     let userFound = await UserModel.find({ Email: Email });
//     if (userFound.length > 0) {
//       return next(new AppErr("Email Already in use", 404));
//     }

//     //----Phone Check--------//
//     let userFoundNumber = await UserModel.find({ Number: Number });
//     if (userFoundNumber.length > 0) {
//       return next(new AppErr("Phone Number already in user", 404));
//     }

//     //-----Hashing Password------//
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(Password, salt);
//     req.body.Password = hashedPassword;

//     //------Assigning Role--------//
//     if (req.body.role === "College") {
//       req.body.isCollege = true;
//     }

//     //-------Saveing document------//
//     let user = await UserModel.create(req.body);

//     //------generate Token---------//
//     let token = GenerateToken(user._id);

//     return res.status(200).json({
//       status: "success",
//       data: user,
//       token: token,
//     });
//   } catch (error) {
//     return next(new AppErr(error.message, 500));
//   }
// };

//-----------------SignUp Adwin--------------------------------------------//

const AdwinSignup = async (req, res, next) => {
  try {
    //----Validation Check------//
    let error = validationResult(req);
    if (!error.isEmpty()) {
      return next(new AppErr(error.errors[0].msg, 404));
    }

    let { Email, Password, Number, role } = req.body;

    //-----Email Check-------//
    let userFound = await UserModel.find({ Email: Email });
    if (userFound.length > 0) {
      return next(new AppErr("Email Already in use", 404));
    }

    //----Phone Check--------//
    let userFoundNumber = await UserModel.find({ Number: Number });
    if (userFoundNumber.length > 0) {
      return next(new AppErr("Phone Number already in user", 404));
    }

    //-----Hashing Password------//
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(Password, salt);
    req.body.Password = hashedPassword;

    //------Assigning Role--------//
    req.body.isAdwin = true;

    //-------Saveing document------//
    let user = await UserModel.create(req.body);

    //------generate Token---------//
    let token = GenerateToken(user._id);

    return res.status(200).json({
      status: "success",
      data: user,
      token: token,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//-----------------Login Student && College && Teacher---------------------//

const Loginuser = async (req, res, next) => {
  try {
    //-----Check Validation--------//
    let error = validationResult(req);
    if (!error.isEmpty()) {
      return next(new AppErr(error.errors[0].msg, 404));
    }

    let { Email, Password } = req.body;

    //-------Checking Email---------------//
    let userFound = await UserModel.find({ Email: Email });
    if (userFound.length != 1) {
      return next(new AppErr("User not found", 404));
    }

    //--------Matching Password------------//
    const isPasswordMatch = await bcrypt.compare(
      Password,
      userFound[0].Password
    );
    if (!isPasswordMatch) {
      return next(new AppErr("Invalid Login Credentials / password", 404));
    }

    //---Generate Token-------
    let token = GenerateToken(userFound[0]._id);

    res.status(200).json({
      data: userFound,
      token: token,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//-----------------Login Adwin---------------------------------------------//
const LoginAdwin = async (req, res, next) => {
  try {
    //----validation Checks-----//
    let error = validationResult(req);
    if (!error.isEmpty()) {
      return next(new AppErr(error.errors[0].msg, 404));
    }

    let { Email, Password, role } = req.body;
    //-----Checks Email---------//
    let userFound = await UserModel.find({ Email: Email });
    if (userFound.length != 1) {
      return next(new AppErr(error.errors[0].msg, 404));
    }
    //-----Checks Role----------//
    if (userFound[0].role != "Adwin") {
      return next(
        new AppErr("Adwin are only allowed to access Dashboard", 404)
      );
    }

    //----Checks password---------//
    const isPasswordMatch = await bcrypt.compare(
      Password,
      userFound[0].Password
    );
    if (!isPasswordMatch) {
      return next(new AppErr("Invalid Login Credentials / password", 404));
    }

    //------Generate Token---------//
    let token = GenerateToken(userFound._id);

    res.status(200).json({
      data: userFound,
      token: token,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//-----------------Email Otp-----------------------------------------------//
const OtpSend = async (req, res, next) => {
  try {
    //-------Validation Check----------//
    let error = validationResult(req);
    if (!error.isEmpty()) {
      return next(new AppErr(error.errors[0].msg, 500));
    }

    let { Email } = req.body;

    //--------Generate Otp-------------//
    let otp = otpGenerator.generate(4, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
      digits: true,
    });

    //---------Email Send---------------//
    SendEmail(Email, otp).catch((err) => {
      return next(new AppErr(err, 500));
    });

    res.status(200).json({
      message: "Success",
      otp: otp,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//-----------------Forget Passowrd-----------------------------------------//

const ForgetPassword = async (req, res, next) => {
  try {
    //---Vaildation Check------//
    let error = validationResult(req);
    if (!error.isEmpty()) {
      return next(new AppErr(error.errors[0].msg, 404));
    }

    const { Email, Password } = req.body;

    //-----Check Email---------//
    let userFound = await UserModel.find({ Email: Email });
    if (userFound.length < 1) {
      return next(new AppErr("User not Found/Plaese Check email", 404));
    }

    //---Hash Password--------//
    let salt = await bcrypt.genSalt(10);
    let hashedPassword = await bcrypt.hash(Password, salt);

    //-----Update Password-----//

    let updatePassword = await UserModel.updateOne(
      { _id: userFound[0]._id },
      {
        $set: {
          Password: hashedPassword,
        },
      }
    );

    res.status(200).json({
      message: "Success",
      data: updatePassword,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//-----------------Get Own Profile-----------------------------------------//

const GetOwnProfile = async (req, res, next) => {
  try {
    let userProfile = await UserModel.findById(req.user);
    if (!userProfile) {
      return next(new AppErr("User Not Found", 404));
    }

    res.status(200).json({
      message: "success",
      data: userProfile,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//-----------------Update Own Profile--------------------------------------//
const updateOwnProfile = async (req, res, next) => {
  try {
    //---Validation error----//
    let error = validationResult(req);
    if (!error.isEmpty()) {
      return next(new AppErr(error.errors[0].msg, 404));
    }

    let { Email, Number } = req.body;
    //---Check Email------//
    let EmailFound = await UserModel.find({ Email: Email });
    if (EmailFound.length > 0) {
      return next(new AppErr("Email already in used", 404));
    }
    //---Check Number---//
    let NumberFound = await UserModel.find({ Number: Number });
    if (NumberFound.length > 0) {
      return next(new AppErr("Number already in used", 404));
    }
    //---Update user-----//
    let userUpdate = await UserModel.findByIdAndUpdate(
      req.user,
      {
        Email: req.body.Email,
        Number: req.body.Number,
        FirstName: req.body.FirstName,
        LastName: req.body.LastName,
        College: req.body.College,
        address: req.body.Address,
      },
      { new: true }
    );

    res.status(200).json({
      message: "success",
      data: userUpdate,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//-----------------Deactivate Account--------------------------------------//
const deactivateAccount = async (req, res, next) => {
  try {
    let userFound = await UserModel.findById(req.user);
    if (userFound.length < 0) {
      return next(new AppErr("User not found", 404));
    }

    //--------Delete user--------------//

    let updateuser = await UserModel.findByIdAndUpdate(
      userFound._id,
      {
        isDeleted: true,
      },
      { new: true }
    );

    res.status(200).json({
      message: "success",
      data: updateuser,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//-----------Update Profile Picture--------------------//
const UpdateProfiePicture = async (req, res, next) => {
  try {
    if (req.file) {
      let userFound = await UserModel.findByIdAndUpdate(
        req.user,
        {
          ProfileImage: req.file.filename,
        },
        { new: true }
      );
      res.status(200).json({
        message: "Success",
        data: userFound,
      });
    } else {
      return next(new AppErr("Empty Profile picture", 400));
    }

    console.log(req.file.fileName);
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

module.exports = {
  UserSignup,
  // CollegeSignup,
  AdwinSignup,
  Loginuser,
  LoginAdwin,
  OtpSend,
  ForgetPassword,
  GetOwnProfile,
  updateOwnProfile,
  deactivateAccount,
  UpdateProfiePicture,
};
