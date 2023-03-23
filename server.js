const SessionRoutes = require('./routes/session.routes');
const UserRoutes = require('./controllers/user/user.routes');
const AuthRoutes = require('./controllers/auth/auth.routes');
const AccountRoutes = require('./controllers/account/account.routes');
const ChannelRoutes = require('./controllers/channel/channel.routes');
const PostRoutes = require('./controllers/post/post.routes');
const poster = require('./controllers/poster');
const GoogleRoutes = require('./controllers/google/google.routes');
const fastify = require('fastify')({ logger: true });

fastify.register(require("fastify-cors"), {
  origin: true
});

async function addRoutes() {
  SessionRoutes.routes.forEach(route => fastify.route(route));
  AuthRoutes.routes.forEach(route => fastify.route(route));
  UserRoutes.routes.forEach(route => fastify.route(route));
  AccountRoutes.routes.forEach(route => fastify.route(route));
  ChannelRoutes.routes.forEach(route => fastify.route(route));
  PostRoutes.routes.forEach(route => fastify.route(route));
  GoogleRoutes.routes.forEach(route => fastify.route(route));
}

addRoutes()

// Declare a route
const start = async () => {
  try {
    await fastify.listen({ port: 3000 })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
poster.start();