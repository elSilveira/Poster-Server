
const ChannelDbController = require("./channel.db");
const env = require('../../.env.js');
const { OAuth2Client } = require("google-auth-library");
const AuthDbController = require("../auth/auth.db");
const { segredo } = require("../token.controller");
const jwt = require('jsonwebtoken');

class ChannelController {

  static async finalizeGoogleAuth(code, accountChannelId) {
    const auth = new OAuth2Client(env.GOOGLE.clientId, env.GOOGLE.clientSecret, env.GOOGLE.redirectChannelUrl + `?id=` + accountChannelId);
    const { tokens } = await auth.getToken(code);
    auth.setCredentials(tokens);

    var authObj = {
      provedor: 'google',
      provedor_id: 'youtube_permissions',
      token_acesso: jwt.sign(tokens, segredo()),
      token_atualizacao: Date.now(),
      expiracao_token: new Date().toISOString().slice(0, 19).replace('T', ' ')
    }

    let newAuth = await AuthDbController.addAuth(authObj);
    console.log(accountChannelId)
    console.log(newAuth)
    return await this.authorizeChannel(newAuth.id, accountChannelId);
  }

  static async authorizeChannel(authId, accountChannelId) {
    return await ChannelDbController.patchAuthToChannel(authId, accountChannelId)
  }

  static async getChannelByUser(userId) {
    return await ChannelDbController.getChannelByLogin(email, password)
  }

  static async getUserAuthorizedChannels(userId) {
    return await ChannelDbController.getUserAuthorizedChannels(userId)
  }
  
  static async getChannelsByAccount(accountId) {
    return await ChannelDbController.getChannelsByAccount(accountId)
  }

  static async getUserChannels(userId) {
    return await ChannelDbController.getUserChannels(userId)
  }

  static async addChannel(incoming) {
    if (incoming.channel && incoming.accountId) {
      let newChannel = await ChannelDbController.post(incoming.channel);
      return await ChannelDbController.pathToAccount(newChannel.id, incoming.accountId);
    }
    return `Please check object to be {accountId=1, channel={channel}}`
  }

  static async authChannel(accountChannelId) {
    const auth = new OAuth2Client(env.GOOGLE.clientId, env.GOOGLE.clientSecret, env.GOOGLE.redirectChannelUrl + `?id=` + accountChannelId);
    const authUrl = await auth.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/youtube.upload',
        'https://www.googleapis.com/auth/youtube',
        'https://www.googleapis.com/auth/youtubepartner',
        'https://www.googleapis.com/auth/youtube.force-ssl']
    });
    return {url: authUrl}
  }

}

module.exports = ChannelController;