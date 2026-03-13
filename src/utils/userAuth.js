const jwt = require("jsonwebtoken");
const User = require("../module/User");
const userAuth = async (req, res, next) => {
  try {
   
    const { token } = req.cookies;
  
    if (!token) {
      return res.status(401).send("please Login");
    }
    
    const decodedData = jwt.verify(token, process.env.SECRET_KEY);
    const { _id } = decodedData;
    const user = await User.findById({_id});

    if (!user) {
      throw new Error("Invalid Credentials");
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(404).send("ERROR:" + error.message);
  }
};

module.exports = { userAuth };
