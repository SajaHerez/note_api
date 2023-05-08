const { Router } = require('express')
const { noteController } = require('./../controllers')

const router = Router()

router.post('/notes/createNote/:user_id', noteController.createNote)
    .get('/notes/:user_id', noteController.getNotes)
    .delete('/notes/deleteNote/:user_id/:note_id',noteController.daleteNote)
    .put('/notes/updateNote/:user_id/:note_id',noteController.updateNote);


module.exports = router