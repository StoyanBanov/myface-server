const Like = require("../models/Like");

exports.getLikes = ({ where = {}, count = false }) => {
    let query = Like.find().where(where)

    if (count)
        query = query.countDocuments()

    return query
}

exports.getLikeById = (id) => Like.findById(id)

exports.addLike = (data) => Like.create(data)

exports.deleteLike = (id) => Like.findByIdAndDelete(id)

exports.deleteLikes = ({ where = {} }) => Like.deleteMany(where)