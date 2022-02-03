const express=require("express");
const { getallproduct, createProduct } = require("../controllers/productcontroller");
const { loginUser, registerUser, logout, forgotPassword, resetPassword, getUserDetails, updatePassword, updateProfile, getAllUser, getSingleUser, updateUserRole, deleteUser, Refersetokenfun } = require("../controllers/usercontroller");
const { isAuthenticatedUser, authorizeRoles, authCheck, adminCheck } = require("../middleware/tokenValidator");
const { verifyAccessToken } = require("../utlis/verifyTokens");

const router = express.Router();


router.route("/login").post(loginUser);
router.route("/signup").post(registerUser);
router.post("/referse-token",Refersetokenfun)
// router.route("/logout").get(logout);
// router.route("/password/forget").post(forgotPassword)
// router.route("/password/reset/:token").put(resetPassword)


// router.route("/me").get(isAuthenticatedUser, getUserDetails);

// router.route("/password/update").put(isAuthenticatedUser, updatePassword);

// router.route("/me/update").put(isAuthenticatedUser, updateProfile);

router.route("/admin/users").get(verifyAccessToken,authCheck,adminCheck,  getAllUser);

// router
//   .route("/admin/user/:id")
//   .get(isAuthenticatedUser,  getSingleUser)
//   .put(isAuthenticatedUser,  updateUserRole)
//   .delete(isAuthenticatedUser,  deleteUser);


module.exports=router