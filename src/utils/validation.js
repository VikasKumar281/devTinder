const validator = require("validator");

const validateSignUpData = (req) => {
  const {firstName  , lastName , emailId , password} = req.body;

  if(!firstName || !lastName){
    throw new Error("Name is necessary");
  }
  else if((firstName,lastName).length < 4 || (firstName,lastName).length > 50){
    throw new Error("Your Name is not valid");
  }
  else if(!validator.isEmail(emailId)){ 
     throw new Error("Entered Email is not valid ");
  }
  else if(!validator.isStrongPassword(password)){
    throw new Error("Password is not strong,Please enter a new strong password ");
  }
};

const validateEditProfileData = (req) =>  {
   const allowedEditFields = ["firstName" , "lastName" , "emailId" , "photoUrl" , "gender" , "about" , "age" , "skills"];

   const isEditAllowed = Object.keys(req.body).every((field) => allowedEditFields.includes(field));

   return isEditAllowed;
};

module.exports = {
    validateSignUpData,
    validateEditProfileData,
};