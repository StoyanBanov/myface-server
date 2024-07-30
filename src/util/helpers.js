exports.getSearchRegex = (search) => {
    return new RegExp(search, 'i')
}

exports.getPossibleFriendshipIndices = (id1, id2) => {
    return [
        `${id1} ${id2}`,
        `${id2} ${id1}`
    ]
}