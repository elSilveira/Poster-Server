const { YoutubeVideo, GoogleController } = require("./google/drive.controller");
const PostDbController = require("./post/post.db");
const moment = require('moment-timezone');
const now = moment().tz('America/Sao_Paulo');

module.exports = class poster {
  timeouts;
  static async start() {
    if (this.timeouts != null) {
      clearTimeout(this.timeouts)
      this.timeouts = null;
    }
    let timePost = await PostDbController.getTimeToPost();
    this.setPosterService(timePost[0]);
  }

  static setPosterService(timePost) {
    if (timePost == null) {
      clearTimeout(this.timeouts);
    } else {
      let date = this.formatDate(timePost['time']);
      let time = new Date(timePost['time']).getTime() - new Date(now).getTime();
      if (time > 3600000 || time < 0) {
        console.log("Back in 24h: " + new Date(Date.now()));
        this.timeouts = setTimeout(() => this.start(), 3600000)
      }
      else {
        console.log("Ativado para: " + time + " $$ " + new Date(now + time));
        this.timeouts = setTimeout(() => this.doPost(timePost['id']), time)
      }
    }
  }

  static async postList(posts, index = 0) {
    if (posts && posts[index]) {
      let post = posts[index];
      console.log(post)
      let vid = new YoutubeVideo(post.title, post.description, post.file, post.thumbnail, 'private');
      let res = await GoogleController.postVideo(post.token_acesso, vid);
      // .finally(
      //   async () => {
      //     if (posts.length > index)
      //       await this.postList(posts, index++);
      //     else
      //       return
      //   });
      return res
    }
  }

  static async doPost(post_id) {
    console.log("DO")
    let posts = await PostDbController.getPostsById(post_id);
    let res = await this.postList(posts);
    // this.start();
  }

  static formatDate(date) { return (new Date(date)).toUTCString().replace('T', ' ').substring(0, 19); }
}