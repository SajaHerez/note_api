const express = require("express");
// Create application/x-www-form-urlencoded parser  
var bodyParser = require('body-parser');  
const app = express();
const { db } = require('./src/util/admin');

// // Parse JSON request body
app.use(bodyParser.json())
 // Parse URL-encoded form request body
app.use(bodyParser.urlencoded({ extended: false }))

app.post("/signup",async (req, res) => {

     console.log(JSON.stringify(req.body))

    const email= await req.body.email
    const passowrd=await req.body.password
    const name=await req.body.name
    if(email && passowrd && name ){
        let users =  db.collection("users")
        let notes =  db.collection("notes")
        let user =  await db.collection("users").where("email", "==", email).get();
        console.log(user.docs.length==0)
        if (user.docs.length>0) {
          res
          .json({ code: 400, message: "email already in use" });
      
        } else {

             user_id= ++(await users.get()).docs.length
             console.log(user_id)
          await users.add({
            email:email,
            id:user_id,
            name:name,
            password: passowrd
          });
          res
            .json({ code: 200, message: "account successfully created" });
        }
    }else{
        res
        .json({ code: 400, message: "one or more fields are empty" });

    }

});





app.post("/signin",async (req, res) => {

   const email= await req.body.email
   const passowrd=await req.body.password
   if(email && passowrd){
     let us=[]
       let users =  await db.collection("users").where("email", "==", email).get();
        if(users.docs.length > 0){
       for(const user of users.docs ){
             const user_email=user.data().email
             const user_pass=user.data().password
             
             if(email=== user_email && passowrd=== user_pass){
                res.json({
                    code:200,
                    message:"login success",
                    data:{
                     id:user.data().id,
                    name:user.data().name,
                    email:user_email, 
                    }
                        
                })
             }else{
                res
    .json({ code: 400, message: "incorrect email or password" });
             }
             console.log(user_email)
             console.log(user_pass)
       }
        }else{
            res
            .json({ code: 400, message: "email is not used" });
        }
   }else{
    res
    .json({ code: 400, message: "email or password is empty" });
   }

});


app.post('')






const { notes } = require("./src/models/note");
app.get("/notes", notes);

app.post("/notes", async (req, res) => {
  let docRef = db.collection("notes").set();
  await docRef.set({
    email: req.body.user.email,
    password: req.body.user.password,
  });
  res.json({ message: "done" });
});
