const database = require("../db");

class UserDbController {

  static get(id) {
    return database.get('user', id);
  }

  static get() {
    return database.get('user', null);
  }

  static async getUserByLogin(email, password) {
    return await database.getQuery('user', `password='${password}' AND email='${email}'`);
  }

  static async post(user) {
    let res = await database.insert(
      'user',
      'nome, sobrenome, email, password',
      `"${user.nome}", 
      "${user.sobrenome}", 
      "${user.email}", 
      "${user.password}"`)
    user.id = res.insertId;
    return user;
  }

  static async pathToken(user) {
    let values = `token="${user.token}"`;
    return await database.update('User', values, 'id=' + user.id);
  }

  static async pathAuth(auth, user) {
    let res = await database.insert(
      'userauth',
      'user_id, auth_id',
      `${user},${auth}`)
    return res.insertId;
  }

  static delete(id) {
    return database.delete('User', id);
  }
}

module.exports = UserDbController;