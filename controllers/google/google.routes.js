const SessionController = require("../session.controller");
const GoogleController = require("./drive.controller");

module.exports = class GoogleRoutes {
  static routes = [
    {
      method: 'GET',
      preHandler: SessionController.validateToken,
      url: '/test',
      handler: async (req, res) => {
        return await GoogleController.getAuth(req.user);
      },
    }]
}