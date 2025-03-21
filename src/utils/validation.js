// const validator = require("validator")


// const validateSignUpData = (req)=>{
//    const {firstName,lastName,password,emailId} = req.body;
//    if(!firstName || !lastName){
//    throw new Error("name is not valid");
//    }
//    else if(!validator.isEmail(emailId)){
//     throw new Error("email is not valid");
//    }
//    else if( !validator.isStrongPassword(password)){
//     throw new Error("please enter strong password");
//    }
// }
// const validateEditProfileData = (req) =>{
//    const editableFields = ["firstName", "lastName", "age", "skills", "about", "gender", " photoUrl"];
//    const isValidate = Object.keys(req.body).every((field) => editableFields.includes(field))
//    return isValidate;

// }
// const validateNewPassword = (password) => {
//    if( !validator.isStrongPassword(password)){
//       throw new Error("please enter strong password");
//      }
// }

// module.exports = {validateSignUpData,
//    validateEditProfileData,
//    validateNewPassword
// }









const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Name is not valid!");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid!");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong Password!");
  }
};

const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "emailId",
    "photoUrl",
    "gender",
    "age",
    "about",
    "skills",
  ];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );

  return isEditAllowed;
};

module.exports = {
  validateSignUpData,
  validateEditProfileData,
};