const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const env = require('../.env.js');
const UserController = require('./user/user.controller.js');
const { segredo } = require('./token.controller.js');
module.exports = class SessionController {
  
  static async validateToken(req, res, next) {
    // Get the authorization header from the request
    const authHeader = req.headers['authorization'];

    // Check if the authorization header is present
    if (authHeader) {
      // Extract the token from the authorization header
      const token = jwt.decode(authHeader);

      try {
        // Verify the token using the secret key
        const decodedToken = jwt.verify(authHeader, segredo());
        req.user = decodedToken["AA"];
        // Add the decoded token to the request object
        req.decodedToken = decodedToken;

      } catch (err) {
        // Return an error response if the token is invalid
        res.status(401).json({ error: 'Invalid token' });
      }
    } else {
      // Return an error response if the authorization header is missing
      res.status(401).json({ error: 'Authorization header missing' });
    }
  }

  static async createSession(email, password) {
    let user = await UserController.getUserByLogin(email, password);
    if (!user) {
      return "Not Found!"
    }

    var token;
    try {
      token = (jwt.verify(user.token, segredo()).exp < Date.now() / 1000);
    } catch (err) {
      token = null;
    }
    return token ? user.token : UserController.updateUserToken(user);
  }

}
