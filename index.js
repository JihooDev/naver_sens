const express = require('express');
const cors = require('cors');
const { default: axios } = require('axios');

require('dotenv').config();

const app = express();
const router = express.Router();

app.use(cors());
app.use(express.json());
app.use(router);

app.listen(process.env.PORT, () => {
    console.log(`open port ${process.env.PORT}`);
})

const serviceId = process.env.NAVER_SMS_SERVICE_ID;
const { makeSignature } = require('./utils/makeSignature');

router.post('/message_test', async (req, res) => {
    try {
        const { phone_number, country_code } = req.body;

        const timestamp = Date.now().toString();

        // ramdom number
        const auth_number_string = `${Math.floor(Math.random() * (9 - 1 + 1)) + 1}${Math.floor(Math.random() * (9 - 1 + 1)) + 1}${Math.floor(Math.random() * (9 - 1 + 1)) + 1}${Math.floor(Math.random() * (9 - 1 + 1)) + 1}`;  // 1~9 로 이뤄진 4자리 인증값
        const auth_number = parseInt(auth_number_string);

        const { data } = await axios.post(`https://sens.apigw.ntruss.com/sms/v2/services/${serviceId}/messages`, {
            "type": "SMS",
            "contentType": "COMM",
            "countryCode": country_code,
            "from": "01092205162",
            "subject": "테스트임당",
            "content": `[Trust Bridge X]\nVerification Code: ${auth_number}`,
            "messages": [
                {
                    "to": phone_number,
                }
            ]
        }, {
            headers: {
                'x-ncp-apigw-timestamp': timestamp,
                'x-ncp-iam-access-key': process.env.NAVER_ACCESS_KEY,
                'x-ncp-apigw-signature-v2': makeSignature(serviceId, timestamp),
            }
        })

        return res.json({
            status: true,
            data: auth_number
        })
    } catch (err) {
        res.json(err);
    }
})