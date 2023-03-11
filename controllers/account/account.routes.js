const AccountDb = require("./account.db");
const AccountController = require("./account.controller");
const SessionController = require("../session.controller");

class AccountRoutes {
  static routes = [
    {
      method: 'GET',
      preHandler: SessionController.validateToken,
      url: '/account',
      handler: async (request, reply) => {
        return await AccountDb.getUserAccounts(request.user, request.query['populate']);
      },
    },
    {
      method: 'GET',
      url: '/account/:id',
      preHandler: SessionController.validateToken,
      handler: async (request, reply) => {
        return await AccountDb.getUserAccounts(request.params['id']);
      }
    },
    {
      method: 'POST',
      url: '/account',
      preHandler: SessionController.validateToken,
      handler: async (request, reply) => {
        let json = request.body;
        return await AccountController.addAccount(json, request.user);
      },
    },
    {
      method: 'POST',
      url: '/account/:id',
      preHandler: SessionController.validateToken,
      handler: async (request, reply) => {
        let json = request.body;
        return await AccountDb.path(json);
      },
    },
    {
      method: 'DELETE',
      url: '/account/:id',
      preHandler: SessionController.validateToken,
      handler: async () => {
        return await AccountDb.delete(request.params['id']);
      },
    }]
}

module.exports = AccountRoutes