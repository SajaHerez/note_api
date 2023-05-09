
const { db } = require("./../configurations/admin");

const singup= async (req, res) => {
    const email = await req.body.email;
    const passowrd = await req.body.password;
    const name = await req.body.name;
    if (email && passowrd && name) {
      try {
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
        
      } catch (error) {
        res.status(500).json({ code: 500, message: "Server error" });
      }
      
    } else {
      res.json({ code: 400, message: "one or more fields are empty" });
    }
  }


const singin=async (req, res) => {
    const email = await req.body.email;
    const passowrd = await req.body.password;
    
    if (email && passowrd) {
   try {
       
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
   } catch (error) {
    res.status(500).json({ code: 500, message: "Server error" });
   }
    } else {
      res.json({ code: 400, message: "email or password is empty" });
    }
  }

const logout=(req, res) => {
    const user_id = req.params.user_id;
    if (user_id) {
      res.status(200).json({ code: 200, message: "logout successfully" });
    } else {
      res
        .status(401)
        .json({
          code: 401,
          message: "unauthorized access is denied due to invalid credentials",
        });
    }
  }

  module.exports = {
    singup,singin,logout
  }