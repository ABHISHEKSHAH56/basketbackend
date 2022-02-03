const mongoose = require("mongoose");

const blacklistSchema = new mongoose.Schema({
  refreshToken: { type: String, required: true, max: 1000 },
  expireAt: { type: Date, default: Date.now() },
});

const blacklistedRefreshTokens = mongoose.model(
  "blacklistedRefreshTokens",
  blacklistSchema
);
module.exports = blacklistedRefreshTokens;
