const express=require("express");
const { getAllProducts, getAdminProducts, createProduct, updateProduct, deleteProduct, getProductDetails, createProductReview, getProductReviews, deleteReview } = require("../controllers/productcontroller");
const { authorizeRoles, isAuthenticatedUser, authCheck, adminCheck } = require("../middleware/tokenValidator");
const { verifyAccessToken } = require("../utlis/verifyTokens");
const router = express.Router();


router.get("/products", getAllProducts);
router.post("/admin/product/new",verifyAccessToken,authCheck,adminCheck,createProduct)
// router
//   .route("/admin/products")
//   .get(isAuthenticatedUser,  getAdminProducts);

// router.route("/admin/product/new")
//   .post(isAuthenticatedUser,  createProduct  );

// router
//   .route("/admin/product/:id")
//   .put(isAuthenticatedUser,  updateProduct)
//   .delete(isAuthenticatedUser,  deleteProduct);

// router.route("/product/:id").get(getProductDetails);

// router.route("/review").put(isAuthenticatedUser, createProductReview);

// router
//   .route("/reviews")
//   .get(getProductReviews)
//   .delete(isAuthenticatedUser, deleteReview);












module.exports=router