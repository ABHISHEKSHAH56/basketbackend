const catchasyncError = require("../middleware/catchasyncError");
const User = require("../model/userModel");
const ErrorHandeller = require("../utlis/errorhandller");
const sendToken = require("../utlis/jwtToken");
const sendEmail = require("../utlis/sendEmail");
const crypto= require('crypto')
const  cloudinary =require("cloudinary");
const { signAccessToken, signRefreshToken } = require("../utlis/AccessTokencreate");
const { getAppCookies } = require("../utlis/verifyTokens");
const createHttpError = require("http-errors");
const blacklistedRefreshTokens = require("../model/blacklistRefresh");
const jwtDecode = require("jwt-decode");
const {verifyRefreshToken} =require("../utlis/verifyTokens")


// Register a User
exports.registerUser = catchasyncError(async (req, res, next) => {
  const myCloud = await cloudinary.v2.uploader.upload(req.body.image, {
    folder: "avatars",
    
  });

  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
  });
  const accestoken = await signAccessToken(user._id)
  const RefreshTokenGenerated = await signRefreshToken(user._id)
  res.cookie("refresh", RefreshTokenGenerated, { httpOnly: true });
  res.send({
    accessToken: accestoken,
    referseToken:RefreshTokenGenerated,
    user
  })

  
});
  // Login User
  exports.loginUser = catchasyncError(async (req, res, next) => {
    const { email, password } = req.body;
  
    // checking if user has given password and email both
  
    if (!email || !password) {
      return next(new ErrorHandeller("Please Enter Email & Password", 400));
    }
  
    const user = await User.findOne({ email }).select("+password");
  
    if (!user) {
      return next(new ErrorHandeller("Invalid email or password", 401));
    }
  
    const isPasswordMatched = await user.comparePassword(password);
  
    if (!isPasswordMatched) {
      return next(new ErrorHandeller("Invalid email or password", 401));
    }
    const accestoken = await signAccessToken(user._id)
    const RefreshTokenGenerated = await signRefreshToken(user._id)
    res.cookie("refresh", RefreshTokenGenerated, { httpOnly: true });
    res.send({
    accessToken: accestoken,
    user
  })
  
    
  });

exports.Refersetokenfun= async(req,res,next)=>{
 
  try {
    const refreshToken = getAppCookies(req, res)["refresh"];
    console.log(refreshToken);
    if (!refreshToken)
      throw next(createHttpError.BadRequest("refreshToken Not Found"));
    const userId = await verifyRefreshToken(refreshToken);
    console.log(userId);
    if (!userId) throw next(createHttpError.Unauthorized("jwt expired"));

    const findInBlacklistedTokens = await blacklistedRefreshTokens.findOne({
      refreshToken,
    });
    console.log("findInBlacklistedTokens", findInBlacklistedTokens);
    if (findInBlacklistedTokens)
      throw next(createHttpError.Unauthorized("jwt expired"));
    else {
      const AccessTokenGenerated = signAccessToken(userId);
      const RefreshTokenGenerated = signRefreshToken(userId);
      res.cookie("refresh", RefreshTokenGenerated, { httpOnly: true });
      return res.status(200).json({ accessToken: AccessTokenGenerated });
    }
  } catch (error) {
    next(createHttpError.BadRequest(error))
   
  }

}

exports.logout=async(req,res,next)=>{
  const refreshToken = getAppCookies(req, res)["refresh"];
  if (!refreshToken)
    throw next(createHttpError.BadRequest("refreshToken Not Found"));
  const userId = await verifyRefreshToken(refreshToken);
  if (!userId) throw next(createHttpError.Unauthorized("jwt expired"));
  const token = jwtDecode(refreshToken);
  const d = new Date(0);
  d.setUTCSeconds(token.exp);
  const newBlacklistToken = new blacklistedRefreshTokens({
    refreshToken,
    expireAt: new Date(d),
  });
  await newBlacklistToken.save();

  res.cookie("refresh", "", { httpOnly: true });
  return res.send({ success: true });
}


  
 
  

  exports.forgotPassword = catchasyncError(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
  
    if (!user) {
      return next(new ErrorHandeller("User not found", 404));
    }
  
    // Get ResetPassword Token
    const resetToken = user.getResetPasswordToken();
  
    await user.save({ validateBeforeSave: false });
  
    const resetPasswordUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/auth/password/reset/${resetToken}`;
  
    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;
  
    try {
      await sendEmail({
        email: user.email,
        subject: `Ecommerce Password Recovery`,
        message,
      });
  
      res.status(200).json({
        success: true,
        message: `Email sent to ${user.email} successfully`,
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
  
      await user.save({ validateBeforeSave: false });
  
      return next(new ErrorHandeller(error.message, 500));
    }
  });
  
  // Reset Password
  exports.resetPassword = catchasyncError(async (req, res, next) => {
    // creating token hash
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");
  
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
  
    if (!user) {
      return next(
        new ErrorHandeller(
          "Reset Password Token is invalid or has been expired",
          400
        )
      );
    }
  
    if (req.body.password !== req.body.confirmPassword) {
      return next(new ErrorHandeller("Password does not password", 400));
    }
  
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
  
    await user.save();
  
    sendToken(user, 200, res);
  });


  
// Get User Detail
exports.getUserDetails = catchasyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

// update User password
exports.updatePassword = catchasyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandeller("Old password is incorrect", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandeller("password does not match", 400));
  }

  user.password = req.body.newPassword;

  await user.save();

  sendToken(user, 200, res);
});

// update User Profile
exports.updateProfile = catchasyncError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  if (req.body.avatar !== "") {
    const user = await User.findById(req.user.id);

    const imageId = user.avatar.public_id;

    await cloudinary.v2.uploader.destroy(imageId);

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });

    newUserData.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

// Get all users(admin)
exports.getAllUser = catchasyncError(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});

// Get single user (admin)
exports.getSingleUser = catchasyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandeller(`User does not exist with Id: ${req.params.id}`)
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// update User Role -- Admin
exports.updateUserRole = catchasyncError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

// Delete User --Admin
exports.deleteUser = catchasyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandeller(`User does not exist with Id: ${req.params.id}`, 400)
    );
  }

  const imageId = user.avatar.public_id;

  await cloudinary.v2.uploader.destroy(imageId);

  await user.remove();

  res.status(200).json({
    success: true,
    message: "User Deleted Successfully",
  });
});
  