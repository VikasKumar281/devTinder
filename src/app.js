//Importing the Express by using require() method from node_modules folder 
const express = require("express");


//I am creating new express js application->
const app = express();

//Handling The Incoming Request-->
// app.use(( req , res) => {
//     res.send("Hello from the Server!! 😄");
// });

app.use("/test" , ( req , res) => {
    res.send("Hello from the test Server!! 😄");
});

app.use("/Vikas" , ( req , res) => {
    res.send("Hello onbehalf of Vikas!! 😄");
});

app.use("/Vishal" , ( req , res) => {
    res.send("Hello onbehalf of Vishal!! 😄");
});


app.listen(7777 , () => {
    console.log("Server is successfully listening on port 7777....");
});//Port no. --> 3000
