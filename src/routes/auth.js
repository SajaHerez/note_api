const { Router } = require('express')
const { authController } = require('./../controllers')

const router = Router()

router.post('/auth/signup', authController.singup)
    .post('/auth/signin', authController.singin)
    .get('/logout/:user_id',authController.logout);

module.exports = router