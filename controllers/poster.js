const PostDbController = require("./post/post.db");
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
      clearInterval();
    } else {
      let time = new Date(timePost['time']).getTime() - Date.now();
      if (time > 3600000) {
        console.log("Back in 24h: " + new Date(Date.now()));
        this.timeouts = setTimeout(() => this.start(), 3600000)
      }
      else {
        console.log("Ativado para: " + time + " $$ " + new Date(Date.now() + time));
        this.timeouts = setTimeout(() => this.doPost(timePost['time']), time)
      }
    }
  }

  static async doPost(time) {
    let posts = await PostDbController.getPostsByTime(this.formatDate(time));
    this.start();
  }

  static formatDate(date) { return (new Date(date)).toISOString().replace('T', ' ').substring(0, 19); }
}