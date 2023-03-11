const UserDb = require("./user.db");
const UserController = require("./user.controller");

class UserRoutes {
  static routes = [
    {
      method: 'GET',
      url: '/user',
      handler: async () => {
        return await UserDb.get();
      },
    },
    {
      method: 'GET',
      url: '/user/:id',
      handler: async (request, reply) => {
        return await UserDb.get(request.params['id']);
      }
    },
    {
      method: 'POST',
      url: '/user',
      handler: async (request, reply) => {
        let json = request.body;
        return await UserController.addUser(json);
      },
    },
    {
      method: 'POST',
      url: '/user/:id',
      handler: async (request, reply) => {
        let json = request.body;
        return await UserDb.path(json);
      },
    },
    {
      method: 'DELETE',
      url: '/user/:id',
      handler: async () => {
        return await UserDb.delete(request.params['id']);
      },
    }]
}

module.exports = UserRoutes