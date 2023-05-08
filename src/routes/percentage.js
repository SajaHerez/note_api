const { Router } = require('express')
const {percentageController } = require('./../controllers')

const router = Router()

router.get('/completedTask/:user_id', percentageController.completedNote)
    .post('/dailyTask/:user_id', percentageController.perceDailyNote)
 
module.exports = router