const validator = require("validator");

const validatSignUpData = (req)=>{
     const {name, email, password} = req.body;
     if(!name){
        throw new Error("name is not present");
     }
     if(!validator.isEmail(email)){
       throw new Error("email is not valid");
     }
     if(!validator.isStrongPassword(password)){
        throw new Error("Password is not valid");
    }
}



module.exports = {validatSignUpData};