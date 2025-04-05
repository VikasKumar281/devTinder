const cron = require("node-cron");
const ConnectionRequestModel = require("../models/connectionRequest");
const {subDays ,startOfDay , endOfDay} = require("date-fns");


cron.schedule("0 8 * * *",async () => {
    // console.log("Hello World  , " + new Date());
    
    //Send Emails  to all people who got requests the previous day
    try{
      
      const yesterday = subDays(new Date() ,1);  
      const yesterdayStart = startOfDay(yesterday);
      const yesterdayEnd = endOfDay(yesterday);

      const pendingRequests = await ConnectionRequestModel.find({
         status: "interested",
         createdAt: {
             $gte: yesterdayStart,
             $lt: yesterdayEnd,
         },
      }).populate("fromUserId toUserId"); 

      // You passes this map inside a Set and this Set will find the all unique items and this (...) will converted back arrau.
      const listOfEmails = [...new Set(pendingRequests,map(req => req.toUserId.emailId))];
      for (const email of listOfEmails){
        //Send Emails
      }
    }
    catch(err){
        console.error(err);
    }
});