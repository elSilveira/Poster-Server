const database = require("../db");

class PostDbController {
  static async getUserPosts(id = null) {
    return database.runQuery(`
    SELECT p.*, ch.* 
    FROM post p
    JOIN postchannel as ps ON ps.post_id = p.id
    LEFT JOIN channel as ch ON ps.channel_id = ch.id
    JOIN accountchannel as ac ON ac.channel_id = ps.channel_id
    JOIN useraccount as ua ON ua.account_id = ac.account_id
    WHERE ua.user_id = ${id};`);
  }
  static async getPostsById(post_id) {
    return database.runQuery(`
    SELECT p.*, au.*
    FROM postchannel pc
    join post as p on p.id = pc.post_id
    join accountchannel as ac on pc.channel_id = ac.channel_id
    join accountchannelauth as aca on aca.accountchannel_id = ac.id
    join auth as au on au.id = aca.auth_id
    WHERE pc.id = ${post_id};`);
  }
  static async getTimeToPost() {
    return database.runQuery(`
    SELECT id, time
    FROM postchannel 
    WHERE time >= NOW()
    ORDER BY time ASC
    LIMIT 1;`);
  }
  static async getUserWithPlatform(id = null) {
    return database.runQuery(`
    SELECT p.*, 
    GROUP_CONCAT(DISTINCT ch.plataforma) as channel_platform
    FROM post p
    JOIN postchannel as ps ON ps.post_id = p.id
    JOIN channel as ch ON ps.channel_id = ch.id
    JOIN accountchannel as ac ON ac.channel_id = ps.channel_id
    JOIN useraccount as ua ON ua.account_id = ac.account_id
    WHERE ua.user_id = ${id} 
    GROUP BY p.id;`);
  }

  static async post(income) {
    let res = await database.insert(
      'post',
      'file, thumbnail, title, description, tags',
      `"${income.post.file}", 
        "${income.post.thumbnail}", 
        "${income.post.title}", 
        "${income.post.description}", 
        "${income.post.tags}"`)

    let PostChannel = await database.insertMany(
      'postchannel',
      'time, last_update, post_id, channel_id',
      this.formatTuples(income.postChannels, res.insertId))

    return income.post;
  }

  static delete(id) {
    return database.delete('post', id);
  }

  static formatTuples(arr, post_id) {
    return arr.map((obj) => `('${obj.time}', '${this.formattedDate}', ${post_id}, ${obj.channel_id})`).join(', ');
  }
  static formattedDate = (new Date(Date.now())).toISOString().replace('T', ' ').substring(0, 19);
}

module.exports = PostDbController;


