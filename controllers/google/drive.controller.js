const jwt = require('jsonwebtoken');
const { OAuth2Client } = require("google-auth-library");
const { google } = require('googleapis');
const env = require('../../.env');
const AuthDbController = require('../auth/auth.db');
const { segredo } = require('../token.controller');
const fs = require('fs');
const { title } = require('process');
const auth = new OAuth2Client(env.GOOGLE.clientId, env.GOOGLE.clientSecret, env.GOOGLE.redirectUrl);

module.exports = class GoogleController {

  static async googleAuth() {
    const authUrl = auth.generateAuthUrl({
      accessType: "offline",
      prompt: "consent",
      scope: ['email', 'https://www.googleapis.com/auth/drive.file', 'https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/drive.appdata']
    });

    return authUrl
  }

  static async getAuth(user) {
    let myRes = await AuthDbController.getYoutubeAuthByUserId(user);
    let myJwt = jwt.decode(myRes[0]['token_acesso'], segredo());

    console.log(myJwt);
    // Retrieve the access token and refresh token from Google OAuth API
    const accessToken = myJwt.access_token;
    const refreshToken = myJwt.refresh_token;

    auth.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken
    });

    await this.insertFile(auth)
  }

  static async insertFile(auth) {
    // Create a new Drive API client
    const drive = google.drive({ version: 'v3', auth });
    // Upload a file to Google Drive
    const fileMetadata = {
      name: 'tests/test.txt'
    };
    const media = {
      mimeType: 'text/plain',
      body: 'Hello World!',
      parents: ['13C8HgnYNGCCsQ_74RnTY1A6Tkua16tO9']
    };
    drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id'
    }, (err, file) => {
      if (err) throw err;
      console.log(`File ID: ${file.data.id}`);
    });
  }

  static async insertVideo(auth) {
    const myVideo = {
      title: "Desvendando o Futuro da Inteligência Artificial (IA) - Episódio Especial!",
      description: `Neste episódio especial do canal Fronteira Digital, vamos explorar alguns dos tópicos mais interessantes e atuais da tecnologia de inteligência artificial. 
      Conheça as tendências, trilhas do futuro, avanços e como isso está mudando o mundo, statups, analisys, educação, ciencia...
    
      #tech #chatgpt #chatbots #educação #medical #startup #inteligenciaartificial 
      Não perca essa jornada incrível através da tecnologia!`,
      videoPath: '../assets/bee.mp4',
      thumbPath: '../assets/thumbs/mythumb.png',
      privacyStatus: 'private'
    }
    const youtube = google.youtube({ version: 'v3', auth });
    const fileSize = fs.statSync('../assets/bee.mp4').size;
    const res = youtube.videos.insert({
      part: 'snippet,status',
      notifySubscribers: false,
      requestBody: {
        snippet: {
          title: myVideo.title,
          description: myVideo.description
        },
        status: {
          privacyStatus: myVideo.privacyStatus
        }
      },
      media: {
        body: fs.createReadStream('../assets/bee.mp4')
      }
    }, {
      // Use the `onUploadProgress` event from Axios to track the
      // number of bytes uploaded to this point.
      onUploadProgress: evt => {
        const progress = (evt.bytesRead / fileSize) * 100;
        console.log(`${progress}% complete`);
      }
    }, () => {
      console.log(`Video was published.`);
    }, () => {
      console.log(`Video was error.`);
    })
  }
}