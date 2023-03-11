const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const env = require('../.env.js');

module.exports = class TokenController {
  static gerarToken(user) {
    const payload = { AA: user.id, AB: user.email };
    const opcoes = { expiresIn: '30d' };
    const token = jwt.sign(payload, this.segredo(), opcoes);
    return token;
  }

  static segredo = () => crypto.createHash('sha256').update(env.APP.secret).digest('hex');
}