const busboy = require('busboy');
const { ALLOWED_FILE_TYPES } = require('../../constants');
const { uploadStream } = require('../util/fileManagement');

module.exports = () => (req, res, next) => {
    if (req.method === 'POST' && req.headers['content-type'].startsWith('multipart/form-data')) {
        const body = {}
        const fileUploadResponses = {}

        const bb = busboy({ headers: req.headers })

        bb.on('file', async (name, file, info) => {
            const type = info.mimeType

            if (!ALLOWED_FILE_TYPES.includes(type)) {
                bb.destroy()

                return res.status(400).json(`File ${name} of type "${type}" isn\'t supported`)
            }

            const arr = fileUploadResponses[name]
            if (arr) arr.push(uploadStream(file, type))
            else fileUploadResponses[name] = [uploadStream(file, type)]
        })

        bb.on('error', (error) => {
            console.log(error);
        })

        bb.on('field', (name, value) => {
            body[name] = value
        })

        bb.on('close', async () => {
            req.body = body

            const rawInfo = await Promise.all(Object.values(fileUploadResponses).flat())
            const fileIds = rawInfo.map(d => d.public_id)
            let i = 0
            for (const key in fileUploadResponses) {
                i += fileUploadResponses[key].length
                req.body[key] = fileIds.slice(0, i)
            }

            next()
        })

        req.pipe(bb)
    } else next()
}