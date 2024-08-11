const busboy = require('busboy');
const { ALLOWED_FILE_TYPES } = require('../../constants');
const { uploadStream } = require('../util/fileManagement');

module.exports = () => (req, res, next) => {
    if (['POST', 'PUT'].includes(req.method) && req.headers['content-type'].startsWith('multipart/form-data')) {
        const body = {}
        const fileUploadResponses = {}

        const bb = busboy({ headers: req.headers })

        bb.on('file', async (name, file, info) => {
            const type = info.mimeType

            if (!ALLOWED_FILE_TYPES.includes(type)) {
                bb.destroy()

                return res.status(400).json(`File ${name} of type "${type}" isn\'t supported!`)
            }

            const arr = fileUploadResponses[name]
            if (arr) arr.push(uploadStream(file, type))
            else fileUploadResponses[name] = [uploadStream(file, type)]
        })

        bb.on('error', (error) => {
            console.log(error);
        })

        bb.on('field', (name, value) => {
            if (Array.isArray(body[name])) body[name].push(value)

            else if (!body[name] && name.endsWith('s')) body[name] = [value]
            else body[name] = value
        })

        bb.on('close', async () => {
            req.body = body

            const rawInfo = await Promise.all(Object.values(fileUploadResponses).flat())
            const fileIds = rawInfo.map(d => d.public_id)

            let i = 0
            for (const key in fileUploadResponses) {
                const length = fileUploadResponses[key].length
                i += length
                req.body[key] = key.endsWith('s') ? fileIds.slice(0, i) : fileIds[0]
            }

            next()
        })

        req.pipe(bb)
    } else next()
}