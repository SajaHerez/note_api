const { db } = require("./../configurations/admin");

const getNotes= async (req, res) => {
    const user_id = req.params["user_id"];
    if (user_id) {
      try {
        const noteRef = (
        await db.collection("notes").doc(`${user_id}`).get()
      ).data();
      if (noteRef) {
        res.status(200).json(noteRef);
      } else {
        res.status(404).json({ code: 404, message: "data not found" });
      } 
      } catch (error) {
        res.status(500).json({ code: 500, message: "Server error" });
      }
     
    } else {
      res.status(404).json({ code: 404, message: "data not found" });
    }
  }


  const createNote= async (req, res) => {
    const title = req.body.title;
    const createdAt = req.body.createdAt;
    const completedAt = req.body.completedAt;
    const isDone = JSON.parse(req.body.isDone);
    const isCancelled = JSON.parse(req.body.isCancelled);
    const user_id = req.params["user_id"];
    if(user_id){
    if (title && createdAt ) {
      
      const userRef = db.collection("notes").doc(`${user_id}`);
      try {
        await db.runTransaction(async (transaction) => {
          const doc = await transaction.get(userRef);
  
          const taskList = doc.get("task_list") || [];
  
          const note_id = taskList.length + 1;
          const note = {
            createdAt: createdAt,
            isCancelled: isCancelled,
            completedAt: completedAt,
            id: note_id,
            title: title,
            isDone: isDone,
            SubTaskList: [],
          };
          taskList.push(note);
  
          transaction.update(userRef, { task_list: taskList });
        });
  
        return res.status(200).json({
          code: 200,
          message: "Note created successfully",
        });
      } catch (err) {
        console.error(err);
        return res.status(500).json({
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



  const daleteNote =async (req, res) => {
    const user_id = req.params.user_id;
    const note_id = req.params.note_id;
    if(user_id){
  if(note_id){
    try {
      // Get the current task list for the user
      const snapshot = await db.collection("notes").doc(user_id).get();
      const taskList = snapshot.data().task_list;
  
      // Find the note to be deleted and remove it from the task list
      const noteIndex = taskList.findIndex((note) => note.id === +note_id);
      if (noteIndex === -1) {
        return res
          .status(404)
          .json({ code: 404, message: "Note not found for the given user" });
      }
      taskList.splice(noteIndex, 1);
  
      // Update the task list in Firestore
      await db.collection("notes").doc(user_id).update({ task_list: taskList });
  
      // Send response
      res.status(200).json({ code: 200, message: "Note deleted successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ code: 500, message: "Internal server error" });
    }
  }else{
      res
      .status(401)
      .json({
        code: 401,
        message: "unauthorized access is denied due to invalid credentials",
      });
  }}
  }


const updateNote= async (req, res) => {
    const user_id = req.params.user_id;
    const note_id = req.params.note_id;
    const { title, createdAt, completedAt, isDone, isCancelled } = req.body;
    if(user_id){
    if (title && createdAt ) {
   try {
    
    const taskList = (
      await db.collection("notes").doc(`${user_id}`).get()
    ).data().task_list;

    const noteIndex = taskList.findIndex((note) => note.id === Number(note_id));

    if (noteIndex !== -1) {
      taskList[noteIndex] = {
        createdAt: createdAt,
        isCancelled: isCancelled,
        completedAt: completedAt,
        id: Number(note_id),
        title: title,
        isDone: isDone,
        SubTaskList: taskList[noteIndex].SubTaskList,
      };

      await db.collection("notes").doc(`${user_id}`).update({
        task_list: taskList,
      });

      res.status(200).json({
        code: 200,
        message: "note updated successfully",
      });
    } else {
      res.status(404).json({
        code: 404,
        message: "note not found",
      });
    }
   } catch (error) {
    res.status(500).json({ code: 500, message: "Internal server error" });
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


  module.exports = {
    getNotes,createNote,daleteNote,updateNote
  }