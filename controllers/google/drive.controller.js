const jwt = require('jsonwebtoken');
const { OAuth2Client } = require("google-auth-library");
const { google } = require('googleapis');
const env = require('../../.env');
const AuthDbController = require('../auth/auth.db');
const { segredo } = require('../token.controller');
const fs = require('fs');
const auth = new OAuth2Client(env.GOOGLE.clientId, env.GOOGLE.clientSecret, env.GOOGLE.redirectUrl);
const { gaxios } = require('gaxios');


class GoogleController {

  static async googleAuth() {
    const authUrl = auth.generateAuthUrl({
      accessType: "offline",
      prompt: "consent",
      scope: ['email', 'https://www.googleapis.com/auth/drive.file', 'https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/drive.appdata']
    });

    return authUrl
  }

  static async postVideo(channel, youtubeVideo) {
    let auth = this.getChannelAuth(channel);
    return this.insertVideo(auth, youtubeVideo)
  }

  static getChannelAuth(channel = null) {
    let myJwt = jwt.decode(channel, segredo());

    return this.continueAuth(myJwt)
  }

  static async getAuth(user = null) {
    let myRes = await AuthDbController.getYoutubeAuthByUserId(user);
    let myJwt = jwt.decode(myRes[0]['token_acesso'], segredo());
    this.continueAuth(myJwt)
  }

  static continueAuth(myJwt) {
    // Retrieve the access token and refresh token from Google OAuth API
    const accessToken = myJwt.access_token;
    const refreshToken = myJwt.refresh_token;

    auth.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken
    });
    return auth
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

  static insertVideo(auth, myVideo) {
    const youtube = google.youtube({ version: 'v3', auth });
    const fileSize = fs.statSync('../assets/bee.mp4').size;
    return youtube.videos.insert({
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
    })
  }

}

class YoutubeVideo {
  constructor(title, description, videoPath, thumbPath, privacyStatus) {
    this.title = title;
    this.description = description;
    this.videoPath = videoPath;
    this.thumbPath = thumbPath;
    this.privacyStatus = privacyStatus;
  }
}

module.exports = {
  GoogleController,
  YoutubeVideo
};