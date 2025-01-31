const express = require("express");

const app = express();

app.get("/getUserData" , (req , res) => {

    // try{
    //Logic of DB call and get user data 

    throw new Error ("hdbhef");
    
    res.send("User Data sent");
    // }
    // catch(err){
    //     res.status(500).send("Something Went wrong Vikas");
    // }
});

app.use("/" , (err ,req ,res , next ) => {
    if(err){
        //Log your Errors
        res.status(500).send("Something Went Wrong!!");
    }
});

app.listen(7777 , () => {
    console.log("Server is successfully listening on port 7777....");
});//Port no. --> 7777
