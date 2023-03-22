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
  static async getPostsByTime() {
    let res = await database.runQuery(`    
    SELECT p.*, pc.id as postchannel_id, au.token_acesso, pc.time
    FROM post AS p
    JOIN postchannel AS pc ON p.id = pc.post_id
    JOIN accountchannel AS ac ON pc.channel_id = ac.channel_id
    JOIN accountchannelauth AS aca ON aca.accountchannel_id = ac.id
    JOIN auth AS au ON au.id = aca.auth_id
    INNER JOIN (
    SELECT Time, MIN(ABS(TIMESTAMPDIFF(SECOND, NOW(), Time))) AS diff
      FROM postchannel
      GROUP BY Time
      ORDER BY diff ASC
      LIMIT 1
    ) t2 ON DATE_FORMAT(t2.Time, '%Y-%m-%d %H:%i') = DATE_FORMAT(pc.Time, '%Y-%m-%d %H:%i')
    where pc.done is NULL;`);
    console.log(res)
    return res;
  }
  static async getTimeToPost() {
    return database.runQuery(`
    SELECT p.id, po.time
    FROM postchannel po
    join post as p on p.id = po.post_id 
    WHERE time > NOW()
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

  static async setDone(id, done) {
    return database.update('postchannel', 'done = ' + done, 'id = ' + id)
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

/**
SELECT p.*, au.token_acesso
FROM post AS p
JOIN postchannel AS pc ON p.id = pc.post_id
JOIN accountchannel AS ac ON pc.channel_id = ac.channel_id
JOIN accountchannelauth AS aca ON aca.accountchannel_id = ac.id
JOIN auth AS au ON au.id = aca.auth_id
WHERE pc.time = (
  SELECT pc2.time 
   FROM post AS p2
   JOIN postchannel AS pc2 ON p2.id = pc2.post_id
   WHERE p2.id = 111
   order by pc2.time
   LIMIT 1
); 
GROUP BY p.ID, au.token_acesso


SELECT pc2.time 
   FROM post AS p2
   JOIN postchannel AS pc2 ON p2.id = pc2.post_id
   WHERE pc2.id = 156;
*/