const { Router } = require('express')
const {percentageController } = require('./../controllers')

const router = Router()

router.get('/percentage/completedTask/:user_id', percentageController.completedNote)
    .post('/percentage/dailyTask/:user_id', percentageController.perceDailyNote)
 
module.exports = router