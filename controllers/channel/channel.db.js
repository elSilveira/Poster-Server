const database = require("../db");

class ChannelDbController {

  static getChannelsByAccount(id = null) {
    return database.runQuery(`
      SELECT *, ac.id as accountchannel_id FROM channel c 
      JOIN accountchannel ac ON c.id = ac.channel_id 
      LEFT JOIN accountchannelauth ach ON ach.accountchannel_id = ac.id 
      where ac.account_id = ${id};`);
  }

  static getUserChannels(id = null) {
    return database.runQuery(`
      SELECT c.*, ac.id as accountchannel_id FROM channel c 
      JOIN accountchannel ac ON c.id = ac.channel_id 
      JOIN useraccount ua ON ac.account_id = ua.account_id
      where ua.user_id = ${id};`);
  }

  static getUserAuthorizedChannels(id = null) {
    return database.runQuery(`
      SELECT c.*, ac.id as accountchannel_id FROM channel c 
      JOIN accountchannel ac ON c.id = ac.channel_id 
      INNER JOIN accountchannelauth ach ON ach.accountchannel_id = ac.id
      JOIN useraccount ua ON ac.account_id = ua.account_id
      where ua.user_id = ${id};`);
  }

  static async pathToAccount(channelId, accountId) {
    let res = await database.insert(
      'accountChannel',
      'account_id, channel_id',
      `"${accountId}", 
        "${channelId}"`)
    return res.insertId;
  }

  static async patchAuthToChannel(authId, accountChannelId) {
    let res = await database.insert(
      'AccountChannelAuth',
      'accountchannel_id, auth_id',
      `"${accountChannelId}", 
        "${authId}"`);
    return res.insertId;
  }

  static async post(channel) {
    let res = await database.insert(
      'channel',
      'chave, nome, descricao, plataforma',
      `"${channel.chave}", 
        "${channel.nome}", 
        "${channel.descricao}", 
        "${channel.plataforma}"`)
    channel.id = res.insertId;
    return channel;
  }

  static delete(id) {
    return database.delete('channel', id);
  }
}

module.exports = ChannelDbController;