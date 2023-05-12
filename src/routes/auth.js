const { Router } = require('express')
const { authController } = require('./../controllers')

const router = Router()

router.post('/signup', authController.singup)
    .post('/signin', authController.singin)
    .get('/logout/:user_id',authController.logout);

module.exports = router