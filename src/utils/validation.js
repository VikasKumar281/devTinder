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

module.exports = {
    validateSignUpData,
};