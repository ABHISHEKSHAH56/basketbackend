const JWT = require('jsonwebtoken') // using jwt for auth purpose 

/* Function To Sign Access Token Started */
exports.signAccessToken = (userId) => {
        //auth/login    return accessTOken. cookie http ---> REfresjh tokemn

        const payload = {} // creating payload 
        const jwtSecret = process.env.ACCESS_TOKEN_SECRET
        const option = {
                expiresIn: '59m',
                issuer: 'www.cyberxplorer.in',
                audience: `${userId}`
        }
        try {
                var AccessTokenGenerated = JWT.sign(payload, jwtSecret, option)
                return AccessTokenGenerated
        }
        catch (err) {
                console.log("Error Occured Signing Access Token ", err)
        }

}

exports.signRefreshToken = (userId) => {
    const payload = {}; // creating payload
    const jwtSecret = process.env.REFRESH_TOKEN_SECRET;
    const option = {
      expiresIn: "30d",
      issuer: "www.cyberxplorer.in",
      audience: `${userId}`,
    };
    try {
      const RefershTokenGenerated = JWT.sign(payload, jwtSecret, option);
      return RefershTokenGenerated;
    } catch (err) {
      console.log("Error Occured Signing Access Token ", err);
    }
  };