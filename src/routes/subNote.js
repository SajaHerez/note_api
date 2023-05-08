const { Router } = require('express')
const { subNoteController } = require('./../controllers')

const router = Router()

router.post('/add/:user_id/:note_id', subNoteController.addSubNote)
    .put('/update/:user_id/:note_id/:subtask_id', subNoteController.updateSubNote)
    .delete('/delete/:user_id/:note_id/:subtask_id',subNoteController.deleteSubNote)
  


module.exports = router