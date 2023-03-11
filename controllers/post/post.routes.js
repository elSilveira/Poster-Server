const PostDb = require("./post.db");
const PostController = require("./post.controller");
const SessionController = require("../session.controller");

class PostRoutes {
  static routes = [
    {
      method: 'GET',
      preHandler: SessionController.validateToken,
      url: '/post',
      handler: async (request, reply) => {
        if (request.query['deep'])
          return await PostController.getUserWithPlatform(request.user);
        return await PostController.getUserPosts(request.user);
      },
    },
    {
      method: 'POST',
      url: '/post',
      preHandler: SessionController.validateToken,
      handler: async (request, reply) => {
        let json = request.body;
        return await PostController.addPost(json);
      },
    },
    {
      method: 'POST',
      url: '/post/:id',
      preHandler: SessionController.validateToken,
      handler: async (request, reply) => {
        let json = request.body;
        return await PostDb.path(json);
      },
    },
    {
      method: 'DELETE',
      url: '/post/:id',
      preHandler: SessionController.validateToken,
      handler: async () => {
        return await PostDb.delete(request.params['id']);
      },
    }]
}

module.exports = PostRoutes