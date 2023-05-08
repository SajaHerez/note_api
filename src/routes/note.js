const { Router } = require('express')
const { noteController } = require('./../controllers')

const router = Router()

router.post('/createNote/:user_id', noteController.createNote)
    .get('/:user_id', noteController.getNotes)
    .delete('/deleteNote/:user_id/:note_id',noteController.daleteNote)
    .put('/updateNote/:user_id/:note_id',noteController.updateNote);


module.exports = router