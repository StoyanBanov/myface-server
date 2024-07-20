const { google } = require('googleapis');
const { randomBytes } = require('crypto');

const { GOOGLEAPIS_SCOPE, GOOGLEAPIS_EMAIL, GOOGLEAPIS_PRIVATE_KEY } = require('./constants');

const random = () => randomBytes(8).toString("hex")

exports.uploadFile = async (fileStream, mimeType) => {
    const drive = google.drive({ version: 'v3', auth: await authorize() });

    return drive.files.create({
        requestBody: {
            name: random(),
            mimeType,
            parents: ['1Xec_KPQoT6omhLOP8Y89FwqCZSlq0Boa']
        },
        media: {
            body: fileStream
        }
    })
}

exports.deleteFile = async (fileId) => {
    const drive = google.drive({ version: 'v3', auth: await authorize() });

    return drive.files.delete({ fileId })
}

async function authorize() {
    const jwtClient = new google.auth.JWT(
        GOOGLEAPIS_EMAIL,
        null,
        GOOGLEAPIS_PRIVATE_KEY,
        [GOOGLEAPIS_SCOPE]
    )

    await jwtClient.authorize();
    return jwtClient;
}