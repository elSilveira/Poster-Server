const ChannelDb = require("./channel.db");
const ChannelController = require("./channel.controller");
const SessionController = require("../session.controller");

class ChannelRoutes {
  static routes = [
    {
      method: 'GET',
      preHandler: SessionController.validateToken,
      url: '/channel',
      handler: async (request, reply) => {
        if (request.query['auth'])
          return await ChannelController.getUserAuthorizedChannels(request.user)
        return await ChannelController.getUserChannels(request.user);
      },
    },
    {
      method: 'GET',
      url: '/channel/:id',
      preHandler: SessionController.validateToken,
      handler: async (request, reply) => {
        return await ChannelController.getChannelsByAccount(request.params['id']);
      }
    },
    {
      method: 'GET',
      url: '/channel/auth',
      preHandler: SessionController.validateToken,
      handler: async (request, reply) => {
        const code = request.query.code;
        return await ChannelController.finalizeGoogleAuth(code, request.query['id']);
      }
    },
    {
      method: 'GET',
      url: '/channel/auth/:id',
      preHandler: SessionController.validateToken,
      handler: async (request, reply) => {
        return await ChannelController.authChannel(request.params['id']);
      }
    },
    {
      method: 'POST',
      url: '/channel',
      preHandler: SessionController.validateToken,
      handler: async (request, reply) => {
        let json = request.body;
        return await ChannelController.addChannel(json);
      },
    },
    {
      method: 'POST',
      url: '/channel/:id',
      preHandler: SessionController.validateToken,
      handler: async (request, reply) => {
        let json = request.body;
        return await ChannelDb.path(json);
      },
    },
    {
      method: 'DELETE',
      url: '/channel/:id',
      preHandler: SessionController.validateToken,
      handler: async () => {
        return await ChannelDb.delete(request.params['id']);
      },
    }]
}

module.exports = ChannelRoutes