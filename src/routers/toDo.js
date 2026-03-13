const express = require("express");
const toDoRouter = express.Router();
const Todo = require("../module/ToDo");
const { userAuth } = require("../utils/userAuth");
const { adminAuth } = require("../utils/adminAuth");


toDoRouter.post("/add", userAuth, async (req, res) => {
    try {

        const { title, description } = req.body;

        const userId = req.user._id;

        const todo = new Todo({
            title,
            description,
            userId: userId
        });

        const savedTodo = await todo.save();

        res.status(201).json({
            message: "Todo created successfully",
            todo: savedTodo
        });

    }
    catch (err) {
        res.status(400).json({
            error: err.message
        });
    }
});


toDoRouter.get("/all", userAuth, async (req, res) => {

    const userId = req.user._id;
    const search = req.query.search;
    const completed = req.query.completed;

   
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    let filter = { userId };

   
    if (search) {
        filter.title = { $regex: search, $options: "i" };
    }

    
    if (completed !== undefined) {
        filter.isCompleted = completed === "true";
    }

    const todos = await Todo.find(filter)
        .skip(skip)
        .limit(limit);

    res.json({
        page,
        limit,
        todos
    });
});

toDoRouter.put("/update/:id", userAuth, async (req, res) => {
    try {

        const userId = req.user._id;
        const todoId = req.params.id;

        const { title, description, isCompleted } = req.body;

        const updatedTodo = await Todo.findOneAndUpdate(
            { _id: todoId, userId: userId },
            { title, description, isCompleted },
            { new: true }
        );

 
        if (!updatedTodo) {
            return res.status(404).json({
                message: "Todo not found"
            });
        }

        res.status(200).json({
            message: "Todo updated successfully",
            todo: updatedTodo
        });

    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
});


toDoRouter.put("/markallcompleted", userAuth, async (req, res) => {
    try {

        const userId = req.user._id;

        const result = await Todo.updateMany(
            { userId },
            { isCompleted: true }
        );

        res.status(200).json({
            message: "All todos marked as completed",
            result
        });

    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
});

toDoRouter.delete("/delete/:id", userAuth, async (req, res) => {
    try{

        const toDoId = req.params.id;
        const userId = req.user._id;
        const response = await Todo.findOneAndDelete({_id:toDoId, userId:userId});

    if(!response){
        return res.status(404).json({
                message: "Todo not found"
            });
    }

    res.status(200).json({
        message: "Todo deleted successfully",
        response:response
    });

    }
    catch(error){
         res.status(500).json({
            error: error.message
        });
    }
});

toDoRouter.get("/admin/all/Todos", userAuth, adminAuth, async (req, res) => {
    try {

        const todos = await Todo.find();

        res.status(200).json({
            message: "All todos fetched successfully",
            todos: todos
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });
    }
});




module.exports =
    toDoRouter;  