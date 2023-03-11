const PostsController = require("../controllers/posts.controller");
const SessionController = require("../controllers/session.controller");
const multer = require('fastify-multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

class Routes {
  static routes = [
    {
      method: 'POST',
      url: '/post',
      preHandler: upload.array('chunk'),
      handler: PostsController.fileUploadHandler
    }, {
      method: 'GET',
      url: '/login',
      handler: async () => {
        return await SessionController.login();
      },
    },
    {
      method: 'GET',
      url: '/continue',
      handler: async (request, res) => {
        let code = request.query.code;
        res.statusCode = code ? 200 : 500;
        let result = await SessionController.login(code);
        if (result != undefined) {
          return code ? result : JSON.stringify('Check your code!');
        } else
          res.status(301).redirect('http://localhost:4200/continue?logged=true')
      },
    },
    app.get('/continue', async (req, res) => {
      // Get the code from the redirect URL
      const code = req.query.code;

      const { tokens } = await auth.getToken(code);
      localTokens = tokens;
      auth.setCredentials(tokens);
    })
  ]
}

module.exports = Routes;