const express = require("express");
const {
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
} = require("../Controllers/User");
const { body } = require("express-validator");
const IsLogin = require("../Middleware/Islogin");
const userRouter = express.Router();
const multer = require("multer");

//---------------------Multer File Uploads------------------------//
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

userRouter
  .route("/Signup/Collegemember")
  .post(
    body("FirstName").notEmpty().withMessage("FirstName is required"),
    body("LastName").notEmpty().withMessage("LastName is required"),
    body("Email").notEmpty().withMessage("Email is required"),
    body("Email").isEmail().withMessage("Enter a vailed Email address"),
    body("Number").notEmpty().withMessage("Number is required"),
    body("College").notEmpty().withMessage("College is required"),
    body("role").notEmpty().withMessage("Role is required"),
    body("Password").notEmpty().withMessage("Password is required"),
    body("Password")
      .isLength({ min: 8, max: 16 })
      .withMessage("Password must be minimum 8 digit and maximum 16 digit"),
    UserSignup
  );

// userRouter
//   .route("/Signup/College")
//   .post(
//     body("FirstName").notEmpty().withMessage("FirstName is required"),
//     body("LastName").notEmpty().withMessage("LastName is required"),
//     body("Email").notEmpty().withMessage("Email is required"),
//     body("Email").isEmail().withMessage("Enter a vailed Email address"),
//     body("Number").notEmpty().withMessage("Number is required"),
//     body("College").notEmpty().withMessage("College is required"),
//     body("role").notEmpty().withMessage("Role is required"),
//     body("Password").notEmpty().withMessage("Password is required"),
//     body("Password")
//       .isLength({ min: 8, max: 16 })
//       .withMessage("Password must be minimum 8 digit and maximum 16 digit"),
//     CollegeSignup
//   );

userRouter
  .route("/Signup/Adwin")
  .post(
    body("FirstName").notEmpty().withMessage("FirstName is required"),
    body("LastName").notEmpty().withMessage("LastName is required"),
    body("Email").notEmpty().withMessage("Email is required"),
    body("Email").isEmail().withMessage("Enter a vailed Email address"),
    body("Number").notEmpty().withMessage("Number is required"),
    body("College").notEmpty().withMessage("College is required"),
    body("role").notEmpty().withMessage("Role is required"),
    body("Password").notEmpty().withMessage("Password is required"),
    body("Password")
      .isLength({ min: 8, max: 16 })
      .withMessage("Password must be minimum 8 digit and maximum 16 digit"),
    AdwinSignup
  );

userRouter
  .route("/Login/Student&&Teacher")
  .post(
    body("Email").notEmpty().withMessage("Email is required"),
    body("Email").isEmail().withMessage("Enter vailed email address"),
    body("Password").notEmpty().withMessage("Password is required"),
    Loginuser
  );

userRouter
  .route("/Login/Adwin")
  .post(
    body("Email").notEmpty().withMessage("Email is required"),
    body("Email").isEmail().withMessage("Enter vailed email address"),
    body("Password").notEmpty().withMessage("Password is required"),
    LoginAdwin
  );

userRouter
  .route("/Otp")
  .post(
    body("Email").notEmpty().withMessage("Email is required"),
    body("Email").isEmail().withMessage("Enter vailed email address"),
    OtpSend
  );

userRouter
  .route("/forgetPassword")
  .put(
    body("Email").notEmpty().withMessage("Email is required"),
    body("Email").isEmail().withMessage("Enter vailed email address"),
    body("Password").notEmpty().withMessage("Password is required"),
    body("Password")
      .isLength({ min: 8, max: 16 })
      .withMessage("Password must be minimum 8 digit and maximum 16 digit"),
    ForgetPassword
  );

userRouter.route("/Own-profile").get(IsLogin, GetOwnProfile);

userRouter.route("/update-profile").put(IsLogin, updateOwnProfile);

userRouter.route("/delete-Account").put(IsLogin, deactivateAccount);

userRouter
  .route("/Uploadprofile")
  .post(IsLogin, upload.single("image"), UpdateProfiePicture);

module.exports = userRouter;
