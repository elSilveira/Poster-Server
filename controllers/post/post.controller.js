
const poster = require("../poster");
const PostDbController = require("./post.db");

class PostController {
  
  static async finalizePost(post, done){
    return await PostDbController.setDone(post['postchannel_id'], done)

  }static async getPostsByTime(){
    return await PostDbController.getPostsByTime()
  }
  static async getTimeToPost(){
    return await PostDbController.getTimeToPost()
  }

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
      newPost = await PostDbController.post(incoming);
      poster.start();
    }
    return newPost
  }

}

module.exports = PostController;