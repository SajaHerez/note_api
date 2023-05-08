const { Router } = require('express')
const { subNoteController } = require('./../controllers')

const router = Router()

router.post('/subNote/sadd/:user_id/:note_id', subNoteController.addSubNote)
    .put('/subNote/update/:user_id/:note_id/:subtask_id', subNoteController.updateSubNote)
    .delete('/subNote/delete/:user_id/:note_id/:subtask_id',subNoteController.deleteSubNote)
  


module.exports = router