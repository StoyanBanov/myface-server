const { isUser } = require('../middleware/routeGuards')
const router = require('express').Router()

router.get('/posts', isUser(), (req, res) => {

})

router.get('/posts/:id', (req, res) => {

})

router.post('/posts/:id', isUser(), (req, res) => {

})

router.put('/posts/:id', isUser(), (req, res) => {

})

router.delete('/posts/:id', isUser(), (req, res) => {

})

module.exports = router