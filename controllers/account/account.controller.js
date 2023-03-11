
const TokenController = require("../token.controller");
const AccountDbController = require("./account.db");

class AccountController {


  static async getAccountByUser( userId) {
    return await AccountDbController.getAccountByLogin(email, password)
  }

  static async addAccount(account, userId) {
    let newAccount = await AccountDbController.post(account);
    return await AccountDbController.pathToUser(newAccount.id, userId);
  }

}

module.exports = AccountController;