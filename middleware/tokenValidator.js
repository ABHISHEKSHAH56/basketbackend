const User = require("../model/userModel");


exports.authCheck = async (req, res, next) => {
  return User.findOne({ _id: req.payload.aud })
    .then((response) => {
      req.user = response;
      next();
    })
    .catch((err) => res.status(400).json({ error: "User not found" }));
};

exports.adminCheck = async (req, res, next) =>
  await User.findOne({ _id: req.payload.aud })
    .then((response) => {
      if (response.role != "admin")
        return res.status(400).json({ error: "Admin resource. Access denied" });
      req.user = response;
      next();
    })
    .catch((err) => {
      console.log("_id:", req.payload.aud);
      return res.status(400).json({ error: "User not found" });
    });
