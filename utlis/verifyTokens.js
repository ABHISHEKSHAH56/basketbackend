const JWT = require("jsonwebtoken"); // using jwt for auth purpose
const createHttpError = require("http-errors");

exports.verifyAccessToken = (req, res, next) => {
  if (!req.headers["authorization"])
    return next(createHttpError.Unauthorized());
  const authHeader = req.headers["authorization"];
  const bearerToken = authHeader.split(" ");
  const token = bearerToken[1];
  JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
    //create type of error
    if (err) {
      if (err.name === "JsonWebTokenError") {
        return next(createHttpError.Unauthorized());
      } else {
        return next(createHttpError.Unauthorized(err.message));
      }
    }
    req.payload = payload;

    next();
  });
};

// verify a Refresh Token function started
exports.verifyRefreshToken = (RefreshToken) => {
  try {
    var payload = JWT.verify(RefreshToken, process.env.REFRESH_TOKEN_SECRET);

    return payload.aud;
  } catch (error) {
    console.log(error);
    return null;
  }
};

exports.getAppCookies = (req) => {
    // We extract the raw cookies from the request headers
    const rawCookies = req.headers.cookie.split('; ');
    // rawCookies = ['myapp=secretcookie, 'analytics_cookie=beacon;']
   
    const parsedCookies = {};
    rawCookies.forEach(rawCookie=>{
    const parsedCookie = rawCookie.split('=');
    // parsedCookie = ['myapp', 'secretcookie'], ['analytics_cookie', 'beacon']
     parsedCookies[parsedCookie[0]] = parsedCookie[1];
    });
    return parsedCookies;
};