/**

CREATE TABLE User (
  id INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(255) NOT NULL,
  sobrenome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  token VARCHAR(255),
  PRIMARY KEY (id)
); 

CREATE TABLE Auth (
  id INT NOT NULL AUTO_INCREMENT,
  provedor VARCHAR(255) NOT NULL,
  provedor_id VARCHAR(255) NOT NULL,
  token_acesso TEXT NOT NULL,
  token_atualizacao VARCHAR(255),
  expiracao_token DATETIME NOT NULL  ,
  PRIMARY KEY (id)
); 

CREATE TABLE UserAuth (
  id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  auth_id INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES User(id),
  FOREIGN KEY (auth_id) REFERENCES Auth(id)
);

CREATE TABLE Account (
  id INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(255) NOT NULL,
  descricao VARCHAR(255),
  PRIMARY KEY (id)
);

CREATE TABLE UserAccount (
  id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  account_id INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES User(id),
  FOREIGN KEY (account_id) REFERENCES Account(id)
);

CREATE TABLE Channel (
  id INT NOT NULL AUTO_INCREMENT,
  chave VARCHAR(255) NOT NULL,
  plataforma VARCHAR(255) NOT NULL,
  nome VARCHAR(255) NOT NULL,
  descricao VARCHAR(255),
  PRIMARY KEY (id)
);

CREATE TABLE AccountChannel (
  id INT NOT NULL AUTO_INCREMENT,
  account_id INT NOT NULL,
  channel_id INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (account_id) REFERENCES Account(id),
  FOREIGN KEY (channel_id) REFERENCES Channel(id)
);

CREATE TABLE AccountChannelAuth (
  id INT NOT NULL AUTO_INCREMENT,
  accountchannel_id INT NOT NULL,
  auth_id INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (accountchannel_id) REFERENCES AccountChannel(id),
  FOREIGN KEY (auth_id) REFERENCES Auth(id)
);

CREATE TABLE Post (
  id INT NOT NULL AUTO_INCREMENT,
  file VARCHAR(500),
  thumbnail VARCHAR(500),
  title VARCHAR(500),
  description TEXT,
  tags TEXT,
  PRIMARY KEY (id)
);

CREATE TABLE PostChannel (
  id INT NOT NULL AUTO_INCREMENT,
  time DATETIME NOT NULL,
  post_id INT NOT NULL,
  channel_id INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (post_id) REFERENCES Post(id),
  FOREIGN KEY (channel_id) REFERENCES Channel(id)
);

*/
/**

  drop table AccountChannelAuth;
  drop table AccountChannel;
  drop table Channel;
  drop table userAccountChannel;
  drop table Account;
  drop table User;
  drop table Auth;
  drop table UserAuth;

  delete from AccountChannelAuth;
  delete from AccountChannel;
  delete from UserAccountChannel;
  delete from UserAccount;
  delete from Channel;
  delete from UserAuth;
  delete from User;
  delete from Auth;
 */

