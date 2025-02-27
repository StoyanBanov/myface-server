const cloudinary = require('cloudinary').v2

require('dotenv').config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

exports.uploadStream = async (fileStream) => {
    return new Promise((resolve) => {
        fileStream.pipe(
            cloudinary.uploader.upload_stream((error, result) => {
                resolve(result)
            })
        )
    })
}

exports.deleteFIleById = async (id) => {
    try {
        return await new Promise((resolve) => {
            cloudinary.uploader.destroy(id, (result) => {
                resolve(result)
            })
        })
    } catch (error) {
        console.log(error);
    }
}

exports.deleteFilesById = async (ids) => {
    try {
        return await new Promise((resolve) => {
            fileStream.pipe(
                cloudinary.api.delete_resources(ids, (result) => {
                    resolve(result)
                })
            )
        })
    } catch (error) {
        console.log(error);
    }
}