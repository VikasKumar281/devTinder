//Importing the Express by using require() method from node_modules folder 
const express = require("express");


//I am creating new express js application----------------------->
const app = express();

//<-----------------------------------Handling The Incoming Request-------------------------------------------->

// app.use("/user" , ( req , res) => {
//    //This will override all the lower code
//     res.send("I will be a richest person in  India");
// });


//This will only handle only GET call to /user.
app.get("/user" , ( req , res) => {
    res.send({firstName:"Vikas" , secondName:"Kumar"});
});


app.post("/user" , ( req , res) => {
    // saving data to DB
    res.send("Data succesfully saved to the database");
});


app.delete("/user" , ( req , res) => {
    res.send("Deleted succesfully");
});

//This will match all the HTTP method API calls to /test
app.use("/test" , ( req , res) => {
    // This Handler will not only handle my /test but it will also handle anything that will come after /test . eg:- /test/xyz , /test/Vikas , /test/Vishal..These all will gave lower output.
    res.send("Hello from the test Server!! 😄");
});

app.listen(7777 , () => {
    console.log("Server is successfully listening on port 7777....");
});//Port no. --> 3000
