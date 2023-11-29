const crypto = require('crypto-js');

module.exports.makeSignature = function makeSignature(service_id, timestamp) {
    const space = " ";
    const newLine = "\n";
    const method = "POST";
    const url = `/sms/v2/services/${service_id}/messages`;
    const accessKey = process.env.NAVER_ACCESS_KEY;
    const secretKey = process.env.NAVER_SECRET_KEY;

    const hmac = crypto.algo.HMAC.create(crypto.algo.SHA256, secretKey);
    hmac.update(method);
    hmac.update(space);
    hmac.update(url);
    hmac.update(newLine);
    hmac.update(timestamp);
    hmac.update(newLine);
    hmac.update(accessKey);

    const hash = hmac.finalize();

    console.log(hash.toString(crypto.enc.Base64));


    return hash.toString(crypto.enc.Base64);
}