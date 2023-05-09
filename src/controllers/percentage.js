
const { db } = require("./../configurations/admin");

const completedNote =async (req, res) => {
    const user_id = req.params.user_id;
    if (user_id) {
      try {
        let taskList = (await db.collection("notes").doc(`${user_id}`).get()).data()
        .task_list;
        var percentage=0;
        let sum = 0;
        let counterOfCancelledNote=0;
      taskList.forEach((note, index) => {
        
        if (!note.isCancelled) {
          if (note.isDone) {
              sum += 1;
          } else {
            const SubTaskList = note.SubTaskList;
           let subSum = 0;
            let counterOfCancelledSubNote=0;
            SubTaskList.forEach((subNote, index) => {
              if(!note.isCancelled){
              if (subNote.isDone) {
                  subSum += 1;
              }
          }else{
             ++counterOfCancelledSubNote
          }
            });
              
              sum+= subSum/(SubTaskList.length-counterOfCancelledSubNote)
          }
        }else{
          ++counterOfCancelledNote
        }
            
      });
      percentage=sum/(taskList.length-counterOfCancelledNote)
      res
        .status(200)
        .json({
          percentage: percentage,
         
        });
      } catch (error) {
        res.status(500).json({ code: 500, message: "Server error" });

      }
      
  
    } else {
      res
        .status(401)
        .json({
          code: 401,
          message: "unauthorized access is denied due to invalid credentials",
        });
    }
  }



const perceDailyNote =async(req,res)=>{
    const todayDate=req.body.date
    const user_id = req.params.user_id;
    if (user_id) {
        if(todayDate){
          try {
         let taskList = (await db.collection("notes").doc(`${user_id}`).get()).data()
        .task_list;
        var percentage=0;
        let sum = 0;
        let counterOfCancelledNote=0;

        taskList.forEach((note, index) => {
            if(note.createdAt.substring(0,10) === todayDate){
                if (!note.isCancelled) {
                    if (note.isDone) {
                        sum += 1;
                    } else {
                      const SubTaskList = note.SubTaskList;
                     let subSum = 0;
                      let counterOfCancelledSubNote=0;
                      SubTaskList.forEach((subNote, index) => {
                        if(!note.isCancelled){
                        if (subNote.isDone) {
                            subSum += 1;
                        }
                    }else{
                       ++counterOfCancelledSubNote
                    }
                      });
                        
                        sum+= subSum/(SubTaskList.length-counterOfCancelledSubNote)
                    }
                  }else{
                    ++counterOfCancelledNote
                  }
            }
        })

        percentage=sum/(taskList.length-counterOfCancelledNote)
        res
          .status(200)
          .json({
            percentage: percentage,
           
          });
          } catch (error) {
            res.status(500).json({ code: 500, message: "Server error" });
    
          }
     


}else{
    res.status(400).json({ code: 400, message: "date is empty" });
}


    }
        else{
            res
            .status(401)
            .json({
              code: 401,
              message: "unauthorized access is denied due to invalid credentials",
            });
        }



}





module.exports = {
    completedNote,perceDailyNote
  }