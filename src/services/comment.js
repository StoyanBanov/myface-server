const Comment = require("../models/Comment");

exports.getComments = ({ where, orderBy = { createdAt: -1 }, skip = 0, limit = 10 }) =>
    Comment.find()
        .where(where)
        .sort(orderBy)
        .skip(skip)
        .limit(limit)
        .populate('user')

exports.getCommentById = (id) => Comment.findById(id)

exports.addComment = (data) => {
    if (!data.text && !data.images)
        throw new Error('Empty post!')

    return Comment.create(data)
}

exports.deleteCommentById = (id) => Comment.findByIdAndDelete(id)