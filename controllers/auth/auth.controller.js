const AuthDbController = require("./auth.db");
const jwt = require('jsonwebtoken');
const { segredo } = require("../token.controller");
const UserController = require("../user/user.controller");
const env = require('../../.env.js');
const { OAuth2Client } = require("google-auth-library");
const auth = new OAuth2Client(env.GOOGLE.clientId, env.GOOGLE.clientSecret, env.GOOGLE.redirectUrl);

class AuthController {

  static async googleAuth() {
    const authUrl = auth.generateAuthUrl({
      accessType: "offline",
      prompt: "consent",
      scope: ["email"]
    });
    return authUrl
  }

  static async getAuth(user) {
    return await AuthDbController.getQuery('user', `password='${password}' AND email='${email}'`);
  }

  static async finalizeGoogleAuth(code, user) {
    const { tokens } = await auth.getToken(code);
    auth.setCredentials(tokens);
    var authObj = {
      provedor: 'google',
      provedor_id: 'google_consent',
      token_acesso: jwt.sign(tokens, segredo()),
      token_atualizacao: Date.now(),
      expiracao_token: new Date().toISOString().slice(0, 19).replace('T', ' ')
    }

    let newAuth = await AuthDbController.addAuth(authObj);
    await UserController.authorizeUser(newAuth.id, user);
  }
}

module.exports = AuthController;