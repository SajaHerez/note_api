const express = require("express");
// Create application/x-www-form-urlencoded parser
var bodyParser = require("body-parser");
const app = express();
const { db } = require("./src/util/admin");

// Parse JSON request body
app.use(bodyParser.json());
// Parse URL-encoded form request body
app.use(bodyParser.urlencoded({ extended: false }));

app.post("/signup", async (req, res) => {
  console.log(JSON.stringify(req.body));

  const email = await req.body.email;
  const passowrd = await req.body.password;
  const name = await req.body.name;
  if (email && passowrd && name) {
    let users = db.collection("users");
    let notes = db.collection("notes");
    let user = await db.collection("users").where("email", "==", email).get();
    console.log(user.docs.length == 0);
    if (user.docs.length > 0) {
      res.json({ code: 400, message: "email already in use" });
    } else {
      user_id = ++(await users.get()).docs.length;
      console.log(user_id);
      await users.add({
        email: email,
        id: user_id,
        name: name,
        password: passowrd,
      });
      notes.doc(`${user_id}`).set({
        task_list: [],
        user_id: user_id,
      });

      res.json({ code: 200, message: "account successfully created" });
    }
  } else {
    res.json({ code: 400, message: "one or more fields are empty" });
  }
});

app.post("/signin", async (req, res) => {
  const email = await req.body.email;
  const passowrd = await req.body.password;
  if (email && passowrd) {
    let users = await db.collection("users").where("email", "==", email).get();
    if (users.docs.length > 0) {
      for (const user of users.docs) {
        const user_email = user.data().email;
        const user_pass = user.data().password;

        if (email === user_email && passowrd === user_pass) {
          res.json({
            code: 200,
            message: "login success",
            data: {
              id: user.data().id,
              name: user.data().name,
              email: user_email,
            },
          });
        } else {
          res.json({ code: 400, message: "incorrect email or password" });
        }
        console.log(user_email);
        console.log(user_pass);
      }
    } else {
      res.json({ code: 400, message: "email is not used" });
    }
  } else {
    res.json({ code: 400, message: "email or password is empty" });
  }
});

app.get("/notes/:user_id", async (req, res) => {
  const user_id = req.params["user_id"];
  if (user_id) {
    const noteRef = (
      await db.collection("notes").doc(`${user_id}`).get()
    ).data();
    if (noteRef) {
      res.status(200).json(noteRef);
    } else {
      res.status(404).json({ code: 404, message: "data not found" });
    }
  } else {
    res.status(404).json({ code: 404, message: "data not found" });
  }
});

app.post("/createNote/:user_id", async (req, res) => {
  const title = req.body.title;
  const createdAt = req.body.createdAt;
  const completedAt = req.body.completedAt;
  const isDone = JSON.parse(req.body.isDone);
  const isCancelled = JSON.parse(req.body.isCancelled);
  const user_id = req.params["user_id"];
  if (title && createdAt && user_id) {
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
});





app.delete("/deleteNote/:user_id/:note_id", async (req, res) => {
    const user_id = req.params.user_id;
    const note_id = req.params.note_id;
    
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
      res
        .status(200)
        .json({ code: 200, message: "Note deleted successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ code: 500, message: "Internal server error" });
    }
  });
  

  app.put("/updateNote/:user_id/:note_id", async (req, res) => {
    const user_id = req.params.user_id
    const note_id = req.params.note_id
    const { title, createdAt, completedAt, isDone, isCancelled } = req.body;
  
    if (title && createdAt && user_id) {
      const taskList = (await db.collection("notes").doc(`${user_id}`).get()).data().task_list;
  
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
    } else {
      res.status(400).json({ code: 400, message: "one or more fields are empty" });
    }
  });
  
  app.post("/addSubTask/:user_id/:note_id", async (req, res) => {
    const subTaskTitle = req.body.title;
    const subTaskCreatedAt = req.body.createdAt;
    const subTaskCompletedAt = req.body.completedAt;
    const subTaskIsDone = JSON.parse(req.body.isDone);
    const subTaskIsCancelled = JSON.parse(req.body.isCancelled);
  
    const user_id = req.params.user_id;
    const note_id = req.params.note_id;
  
    if (subTaskTitle && subTaskCreatedAt && user_id) {
      let taskList = (await db.collection("notes").doc(`${user_id}`).get()).data().task_list;
  
      const noteIndex = taskList.findIndex((note) => note.id == note_id);
  
      if (noteIndex !== -1) {
        const subTaskId = taskList[noteIndex].SubTaskList.length + 1;
  
        taskList[noteIndex].SubTaskList.push({
          createdAt: subTaskCreatedAt,
          isCancelled: subTaskIsCancelled,
          completedAt: subTaskCompletedAt,
          id: subTaskId,
          title: subTaskTitle,
          isDone: subTaskIsDone,
        });
  
        await db.collection("notes").doc(`${user_id}`).update({
          task_list: JSON.parse(JSON.stringify(taskList)),
        });
  
        res.status(200).json({
          code: 200,
          message: "sub task added successfully",
        });
      } else {
        res.status(400).json({ code: 400, message: "note not found" });
      }
    } else {
      res.status(400).json({ code: 400, message: "one or more fields are empty" });
    }
  });




 app.put("/updateSubTask/:user_id/:note_id/:subtask_id", async (req, res) => {
  const subTaskTitle = req.body.title;
  const subTaskCreatedAt = req.body.createdAt;
  const subTaskCompletedAt = req.body.completedAt;
  const subTaskIsDone = JSON.parse(req.body.isDone);
  const subTaskIsCancelled = JSON.parse(req.body.isCancelled);

  const user_id = req.params.user_id;
  const note_id = req.params.note_id;
  const subtask_id = req.params.subtask_id;

  if (subTaskTitle && subTaskCreatedAt && user_id && note_id  && subtask_id) {
    let taskList = (await db.collection("notes").doc(`${user_id}`).get()).data().task_list;

    const noteIndex = taskList.findIndex((note) => note.id === +note_id);

    if (noteIndex !== -1) {
      const subTaskIndex = taskList[noteIndex].SubTaskList.findIndex((subtask) => subtask.id === +subtask_id);

      if (subTaskIndex !== -1) {
        taskList[noteIndex].SubTaskList[subTaskIndex] = {
          createdAt: subTaskCreatedAt,
          isCancelled: subTaskIsCancelled,
          completedAt: subTaskCompletedAt,
          id: +subtask_id,
          title: subTaskTitle,
          isDone: subTaskIsDone,
        };

        await db.collection("notes").doc(`${user_id}`).update({
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
  } else {
    res.status(400).json({ code: 400, message: "one or more fields are empty" });
  }
});
 


app.delete("/deleteSubTask/:user_id/:note_id/:subtask_id", async (req, res) => {
    const user_id = req.params.user_id;
    const note_id = req.params.note_id;
    const subtask_id = req.params.subtask_id;
  
    let taskList = (await db.collection("notes").doc(`${user_id}`).get()).data().task_list;
    const noteIndex = taskList.findIndex((note) => note.id === +note_id);
  
    if (noteIndex !== -1) {
      let subTaskIndex = taskList[noteIndex].SubTaskList.findIndex((subTask) => subTask.id === +subtask_id);
  
      if (subTaskIndex !== -1) {
        taskList[noteIndex].SubTaskList.splice(subTaskIndex, 1);
  
        await db.collection("notes").doc(`${user_id}`).update({
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
  });
  


module.exports = app;
