const { db } = require("./../configurations/admin");
const { v4: uuidv4 } = require('uuid');

const addSubNote=async (req, res) => {
    const subTaskTitle = req.body.title;
    const subTaskCreatedAt = req.body.createdAt;
    const subTaskCompletedAt = req.body.completedAt;
    const subTaskIsDone = JSON.parse(req.body.isDone);
    const subTaskIsCancelled = JSON.parse(req.body.isCancelled);
  
    const user_id = req.params.user_id;
    const note_id = req.params.note_id;
  if(user_id){
    if (subTaskTitle && subTaskCreatedAt) {
      try {
         let taskList = (await db.collection("notes").doc(`${user_id}`).get()).data()
        .task_list;
      
      const noteIndex = taskList.findIndex((note) => note.id == note_id);
      
      if (noteIndex !== -1) {
        const subTaskId = uuidv4();
      const subNote={
        createdAt: subTaskCreatedAt,
        isCancelled: subTaskIsCancelled,
        completedAt: subTaskCompletedAt,
        id: subTaskId,
        title: subTaskTitle,
        isDone: subTaskIsDone,}
        taskList[noteIndex].SubTaskList.push(subNote);
  
        await db
          .collection("notes")
          .doc(`${user_id}`)
          .update({
            task_list: JSON.parse(JSON.stringify(taskList)),

          });
  
        res.status(200).json({
          code: 200,
          message: "sub task added successfully",
          data:subNote
        });
      } else {
        res.status(400).json({ code: 400, message: "note not found" });
      }
      } catch (error) {
        res.status(500).json({
          code: 500,
          message: "Internal server error",
        });
      }
     
    } else {
      res
        .status(400)
        .json({ code: 400, message: "one or more fields are empty" });
    }
  }else{
      res
      .status(401)
      .json({
        code: 401,
        message: "unauthorized access is denied due to invalid credentials",
      });
  }
  }


 const updateSubNote= async (req, res) => {
    const subTaskTitle = req.body.title;
    const subTaskCreatedAt = req.body.createdAt;
    const subTaskCompletedAt = req.body.completedAt;
    const subTaskIsDone = JSON.parse(req.body.isDone);
    const subTaskIsCancelled = JSON.parse(req.body.isCancelled);
  
    const user_id = req.params.user_id;
    const note_id = req.params.note_id;
    const subtask_id = req.params.subtask_id;
    if (user_id) {
      if (subTaskTitle && subTaskCreatedAt && note_id && subtask_id) {
        try {
            let taskList = (
          await db.collection("notes").doc(`${user_id}`).get()
        ).data().task_list;
  
        const noteIndex = taskList.findIndex((note) => note.id === note_id);
  
        if (noteIndex !== -1) {
          const subTaskIndex = taskList[noteIndex].SubTaskList.findIndex(
            (subtask) => subtask.id === subtask_id
          );
  
          if (subTaskIndex !== -1) {
            taskList[noteIndex].SubTaskList[subTaskIndex] = {
              createdAt: subTaskCreatedAt,
              isCancelled: subTaskIsCancelled,
              completedAt: subTaskCompletedAt,
              id: subtask_id,
              title: subTaskTitle,
              isDone: subTaskIsDone,
            };
  
            await db
              .collection("notes")
              .doc(`${user_id}`)
              .update({
                task_list: JSON.parse(JSON.stringify(taskList)),
              });
  
            res.status(200).json({
              code: 200,
              message: "sub task updated successfully",
            });
          } else {
            res.status(400).json({ code: 400, message: "sub task not found" });
          }
        } else {
          res.status(400).json({ code: 400, message: "note not found" });
        }
        } catch (error) {
          res.status(500).json({
            code: 500,
            message: "Internal server error",
          });
        }
      
      } else {
        res
          .status(400)
          .json({ code: 400, message: "one or more fields are empty" });
      }
    }else{
      res
        .status(401)
        .json({
          code: 401,
          message: "unauthorized access is denied due to invalid credentials",
        });
    }
  }

  const deleteSubNote=async (req, res) => {
    const user_id = req.params.user_id;
    const note_id = req.params.note_id;
    const subtask_id = req.params.subtask_id;
  if(user_id){
    try {
     let taskList = (await db.collection("notes").doc(`${user_id}`).get()).data()
      .task_list;
    const noteIndex = taskList.findIndex((note) => note.id === note_id);
   
    if (noteIndex !== -1) {
      let subTaskIndex = taskList[noteIndex].SubTaskList.findIndex(
        (subTask) => subTask.id === subtask_id
      );
  
      if (subTaskIndex !== -1) {
        taskList[noteIndex].SubTaskList.splice(subTaskIndex, 1);
  
        await db
          .collection("notes")
          .doc(`${user_id}`)
          .update({
            task_list: JSON.parse(JSON.stringify(taskList)),
          });
  
        res.status(200).json({
          code: 200,
          message: "sub task deleted successfully",
        });
      } else {
        res.status(400).json({ code: 400, message: "sub task not found" });
      }
    } else {
      res.status(400).json({ code: 400, message: "note not found" });
    } 
    } catch (error) {
      res.status(500).json({
        code: 500,
        message: "Internal server error",
      });
    }
    
  }else{
      res
      .status(401)
      .json({
        code: 401,
        message: "unauthorized access is denied due to invalid credentials",
      }); 
  }
  }


  
  module.exports = {
    addSubNote,updateSubNote,deleteSubNote
  }

  