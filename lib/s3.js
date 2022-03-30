const AWS = require('aws-sdk');
const s3 = new AWS.S3();

function init() {
  return AWS.config.loadFromPath(`${__dirname}/s3.json`);
}

function upload(params, options) {
  return new Promise((resolve, reject) => {
      s3.upload(params, options, function (err, data) {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

module.exports = {
  init,
  upload
}