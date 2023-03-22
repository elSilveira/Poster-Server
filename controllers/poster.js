const { YoutubeVideo, GoogleController } = require("./google/drive.controller");
const PostDbController = require("./post/post.db");
const moment = require('moment-timezone');
const now = moment().tz('America/Sao_Paulo');

module.exports = class poster {
  timeout;
  static async start() {
    if (this.timeout != null) {
      clearTimeout(this.timeout)
    }
    let timePost = await PostDbController.getTimeToPost();
    this.setPosterService(timePost[0]);
  }

  static setPosterService(timePost) {
    if (timePost == null) {
      console.log("Post List empty! ");
      clearTimeout(this.timeout);
    } else {
      let time = new Date(timePost['time']).getTime() - new Date(Date.now()).getTime();

      if (time > 86400000 || time < 0) {
        let nextTimer = Date.now() + 86400000;
        console.log("Back in 24h: " + new Date(nextTimer).toLocaleString());
        this.timeout = setTimeout(() => this.start(), 86400000)
      }
      else {
        console.log("Ativado para: " + time + " $$ " + new Date(Date.now() + time));
        console.log(new Date(Date.now() + time).toLocaleString())
        this.timeout = setTimeout(() => { this.doPost() }, time) //change to time
      }
    }
  }
  static myposts = [];

  static async postList() {
    if (this.myposts.length == 0) {
      return
    }
    if (this.myposts && this.myposts[0]) {
      let post = this.myposts[0];
      let vid = new YoutubeVideo(post.title, post.description, post.file, post.thumbnail, 'private');
      GoogleController.postVideo(post.token_acesso, vid)
        .then(
          async (ev) => {
            console.log(`Video was published.`);
            var res = await PostDbController.setDone(post['postchannel_id'], true)
            this.postNext()
          },
          async (err) => {
            console.log(`Post Error.`);
            var res = await PostDbController.setDone(post['postchannel_id'], false)
            this.postNext()
          },
          () => {
            console.log("Last")
          }
        );
    }
  }

  static async postNext() {
    this.myposts.splice(0, 1);
    console.log("Do Next")
    if (this.myposts.length == 0) {
      this.start()
      return
    }
    await this.postList()
  }

  static async doPost() {
    console.log("Do Post")
    this.myposts = await PostDbController.getPostsByTime();
    await this.postList();
  }
  static formatDate(date) { return (new Date(date)).toUTCString().replace('T', ' ').substring(0, 19); }
}