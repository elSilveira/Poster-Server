const database = require("../db");

class AuthDbController {

  static async getAuthByUserId(userId) {
    return await database.runQuery(`SELECT a.id AS auth_id
      FROM Auth AS a
      JOIN UserAuth AS au ON a.id = au.authid
      WHERE au.userid = ${userId}`);
  }

  static get() {
    return database.get('auth', null);
  }

  static async addAuth(auth) {
    let res = await database.insert(
      'auth',
      'provedor, provedor_id, token_acesso, token_atualizacao, expiracao_token',
      `"${auth.provedor}", 
      "${auth.provedor_id}", 
      "${auth.token_acesso}", 
      "${auth.token_atualizacao}", 
      "${auth.expiracao_token}"`)
    auth.id = res.insertId;
    return auth;
  }
}
module.exports = AuthDbController;