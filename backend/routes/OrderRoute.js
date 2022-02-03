const express = require("express");
const { newOrder, getSingleOrder, myOrders, getAllOrders, updateOrder, deleteOrder } = require("../controllers/ordercontroller");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/tokenValidator");
const router = express.Router();
router.post("/order",newOrder)

// router.route("/order/new").post(isAuthenticatedUser, newOrder);

// router.route("/order/:id").get(isAuthenticatedUser, getSingleOrder);

// router.route("/orders/me").get(isAuthenticatedUser, myOrders);

// router
//   .route("/admin/orders")
//   .get(isAuthenticatedUser,  getAllOrders);

// router
//   .route("/admin/order/:id")
//   .put(isAuthenticatedUser,  updateOrder)
//   .delete(isAuthenticatedUser,  deleteOrder);

module.exports = router;