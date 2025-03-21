// const mongoose = require("mongoose");

// const connectDB = async()=>{
//      await mongoose.connect("mongodb+srv://NamasteDev:UrZxrn4TTTDkwBeH@namastenode.j3gsi.mongodb.net/devTinder")
// }
//  module.exports = {connectDB}
// //  mongodb+srv://NamasteDev:<db_password>@namastenode.j3gsi.mongodb.net/?retryWrites=true&w=majority&appName=NamasteNode

// // mongodb+srv://NamasteDev:UrZxrn4TTTDkwBeH@namastenode.j3gsi.mongodb.net/devTinder


const mongoose = require("mongoose");

const connectDB = async () => {
//   console.log(process.env.DB_CONNECTION_SECRET);
  await mongoose.connect("mongodb+srv://NamasteDev:UrZxrn4TTTDkwBeH@namastenode.j3gsi.mongodb.net/devTinder");
};

module.exports = connectDB;




