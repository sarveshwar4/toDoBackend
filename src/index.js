const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const connectDB = require("./config/database");
const authRouter = require("./routers/auth");
const cookieParser = require("cookie-parser");
const toDoRouter = require("./routers/toDo");
const cors = require("cors");

const app = express();


app.use(cors({
  origin: [
    // "http://localhost:5173",
    "https://todofrontend-dg3x.onrender.com",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]
}));



dotenv.config();
app.use(cookieParser());  

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/auth", authRouter);
app.use("/todo", toDoRouter);

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));


 // 

connectDB();
app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
})