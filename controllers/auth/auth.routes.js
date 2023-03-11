const SessionController = require("../session.controller");
const AuthController = require("../auth/auth.controller");

class AuthRoutes {
  static routes = [
    {
      method: 'GET',
      url: '/auth',
      preHandler: SessionController.validateToken,
      handler: async (req, res) => {
        const code = req.query.code;
        return await AuthController.finalizeGoogleAuth(code, req.user);
      },
    },
    {
      method: 'GET',
      url: '/google',
      preHandler: SessionController.validateToken,
      handler: async (req, res) => {
        const code = req.query.code;
        return await AuthController.googleAuth();
      },
    },
    {
      method: 'POST',
      url: '/login',
      handler: async (req, res) => {
        const email = req.body['email'];
        const password = req.body['password'];
        return await SessionController.createSession(email, password);
      },
    },

  ]
}
module.exports = AuthRoutes