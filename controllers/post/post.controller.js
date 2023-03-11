
const PostDbController = require("./post.db");

class PostController {
  static async getUserWithPlatform(accountId) {
    return await PostDbController.getUserWithPlatform(accountId)
  }

  static async getPostsByAccount(accountId) {
    return await PostDbController.getPostsByAccount(accountId)
  }

  static async getUserPosts(userId) {
    return await PostDbController.getUserPosts(userId)
  }

  static async addPost(incoming) {
    let newPost;
    if (incoming.post && incoming.postChannels) {
      console.log(incoming)
      newPost = await PostDbController.post(incoming);
    }
    return newPost
  }

}

module.exports = PostController;