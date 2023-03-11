const database = require("../db");

class AccountDbController {

  static getUserAccounts(id = null, populate = false) {
    if (populate == true) {
      return database.runQuery(`
    select ua.*, c.* from account a
    join userAccount ua on ua.account_id = a.id 
    join accountchannel ac on ac.account_id = a.id 
    join channel c on c.id = ac.channel_id
    join accountchannelauth as ach on ach.accountchannel_id = c.id
    where ua.user_id = ${id} group by account_id;`);
    } else
      return database.runQuery(`
    select a.* from account as a
    join userAccount ua on ua.account_id = a.id
    where ua.user_id = ${id}`);
  }

  static async pathToUser(accountId, userId) {
    let res = await database.insert(
      'userAccount',
      'user_id, account_id',
      `"${userId}", 
      "${accountId}"`)
    return res.insertId;
  }

  static async post(account) {
    let res = await database.insert(
      'account',
      'nome, descricao',
      `"${account.nome}", 
      "${account.descricao}"`)
    account.id = res.insertId;
    return account;
  }

  static delete(id) {
    return database.delete('account', id);
  }
}

module.exports = AccountDbController;

/**

    select a.*, c.* from account a
    join userAccount ua on ua.account_id = a.id 
    join accountchannel ac on ac.account_id = a.id
    join channel c on c.id = ac.channel_id
    join accountchannelauth as ach on ach.accountchannel_id = c.id
    where ua.user_id = 1 group by a.account_id;

 */