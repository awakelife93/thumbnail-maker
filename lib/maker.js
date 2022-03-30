'use strict';

const ffmpeg = require('fluent-ffmpeg');
const s3 = require('./s3');
const fs = require('fs');

/**
 * fluent-ffmpeg Only Create Video Thumbnail
 * @author Hyunwoo.Park
 * @param {String} [path] video file path
 * @param {Object} [config] make thumbnail config options
 * @param {Number} [config.count=1] fluent-ffmpeg exports thumbnail count
 * @param {String} [config.filename="thumbnail-at-%s-seconds.png"] exports thumbnail file name
 * @param {String} [config.outputPath="./output"] output directory path
 * @param {String} [config.size="320x240"] exports thumbnail size
 * @param {Boolean} [config.isS3Upload=false] s3 service flag
 * @param {String} [config.bucketName] s3 bucket name
 */

module.exports = function(path, config) {

    // fluent-ffmepg format
    const options = {
        count: config.count || 1,
        filename: config.filename ? `${config.filename}-at-%s-seconds.png` : 'thumbnail-at-%s-seconds.png',
        folder: config.outputPath || './output',
        size: config.size || '320x240'
    };

    return new Promise((resolve, reject) => {
        
        if (!path || typeof path !== 'string') {
            errorHandler(new Error('Can not find path'));
        }

        let filename = '';

        ffmpeg(path)
        .on('filenames', (name) => filename = name)
        .on('end', () => {
            
            if (config.isS3Upload) {
                return new Promise((resolve, reject) => {
                    const ssh = JSON.parse(fs.readFileSync(`${__dirname}/s3.json`));
    
                    if (!config.bucketName) {
                        reject(new Error('Can not find bucket'));
                    }
    
                    if (!ssh.accessKeyId || !ssh.secretAccessKey || !ssh.region) {
                        reject(new Error('Can not find ssh'));
                    }
    
                    resolve(s3.init());
                })
                .then(() => {
                    return s3.upload({
                        Bucket: config.bucketName,
                        Key: new Date().getTime() + "_" + filename,
                        Body: fs.createReadStream(`${options.folder}/${filename}`),
                        ACL: "public-read",
                        Pragma: "public"
                    });
                })
                .then((response) => finishHandler(response))
                .catch((err) => errorHandler(err));

            } else {
                return finishHandler();
            }
        })
        .screenshots(options);
    
        function finishHandler(args = "complete") {
            resolve(args);
        }
    
        function errorHandler(err) {
            reject(err);
        }
    });
};
