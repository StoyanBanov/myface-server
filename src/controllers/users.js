const { isUser } = require('../middleware/routeGuards');
const { getUsers, getUserById, addFriend, removeFriend } = require('../services/user');

const router = require('express').Router()

router.get('/', isUser(), async (req, res) => {
    try {
        res.status(200).json(await getUsers(req.query))
    } catch (error) {
        console.log(error);
        res.status(400).json(error.message)
    }
})

router.post('/', isUser(), async (req, res) => {
    try {
        res.status(200).json(await addFriend(req.user._id, req.body.id))
    } catch (error) {
        console.log(error);
        res.status(400).json(error.message)
    }
})

router.get('/:id', async (req, res) => {
    try {
        res.status(200).json(await getUserById(req.params.id))
    } catch (error) {
        console.log(error);
        res.status(400).json(error.message)
    }
})

router.delete('/:id', async (req, res) => {
    try {
        res.status(200).json(await removeFriend(req.user._id, req.params.id))
    } catch (error) {
        console.log(error);
        res.status(400).json(error.message)
    }
})

module.exports = router