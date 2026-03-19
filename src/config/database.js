const mongoose = require('mongoose');
const connectDB = async()=>{
    const url = process.env.MONGOURI;
    await mongoose.connect(url);
}
module.exports = connectDB;