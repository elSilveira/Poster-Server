
const TokenController = require("../token.controller");
const UserDbController = require("./user.db");

class UserController {


  static async getUserByLogin(email, password) {
    return await UserDbController.getUserByLogin(email, password)
  }

  static async addUser(user) {
    let newUser = await UserDbController.post(user);
    newUser.token = TokenController.gerarToken(newUser);
    return await this.updateUserToken(newUser);
  }

  static async updateUserToken(user) {
    if (user) {
      await UserDbController.pathToken(user);
    } 
    user.password = '***';
    return user;
  }

  static async authorizeUser(authId, userId) {
    return await UserDbController.pathAuth(authId, userId);
  }

}

module.exports = UserController;