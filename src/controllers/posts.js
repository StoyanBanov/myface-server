const { isUser } = require('../middleware/routeGuards');
const { getPostById, addPost } = require('../services/post');
const router = require('express').Router()

router.get('/posts', isUser(), async (req, res) => {
    try {
        res.status(200).json(await getPosts(userId, req.query))
    } catch (error) {
        console.log(error);
        res.status(400).json(error.message)
    }
})

router.get('/posts/:id', async (req, res) => {
    try {
        res.status(200).json(await getPostById(req.params.id))
    } catch (error) {
        console.log(error);
        res.status(404).json(error.message)
    }
})

router.post('/posts/:id', isUser(), async (req, res) => {
    try {
        res.status(200).json(await addPost(req.params.id))
    } catch (error) {
        console.log(error);
        res.status(400).json(error.message)
    }
})

router.put('/posts/:id', isUser(), (req, res) => {

})

router.delete('/posts/:id', isUser(), (req, res) => {

})

module.exports = router