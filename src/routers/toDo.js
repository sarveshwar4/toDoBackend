const express = require("express");
const toDoRouter = express.Router();
const Todo = require("../models/ToDo");
const { userAuth } = require("../utils/userAuth");
const { adminAuth } = require("../utils/adminAuth");
const { createTodo, getTodos, updateTodo, toggleTodoCompletion, markAllTodosCompleted, deleteTodo, getAllTodosAdmin, adminDeleteTodo } = require("../service/toDoService");


toDoRouter.post("/add", userAuth, async (req, res) => {
    try {
        const response = await createTodo(req.body, req.user._id);
        res.status(201).json({
            message: "Todo created successfully",
            todo: response
        });
    }
    catch (err) {
        res.status(400).json({
            error: err.message
        });
    }
});


toDoRouter.get("/all", userAuth, async (req, res) => {
    try {
        const userId = req.user._id;

        const result = await getTodos(req.query, userId);

        res.json(result);

    } catch (err) {
        res.status(400).json({
            error: err.message
        });
    }
});


toDoRouter.put("/update/:id", userAuth, async (req, res) => {
    try {
        const userId = req.user._id;
        const todoId = req.params.id;

        const updatedTodo = await updateTodo(todoId, userId, req.body);

        res.status(200).json({
            message: "Todo updated successfully",
            todo: updatedTodo
        });

    } catch (error) {

        if (error.message === "Todo not found") {
            return res.status(404).json({
                message: error.message
            });
        }

        res.status(400).json({
            error: error.message
        });
    }
});



toDoRouter.put("/markAsCompleted/:id", userAuth, async (req, res) => {
    try {
        const userId = req.user._id;
        const todoId = req.params.id;

        const updatedTodo = await toggleTodoCompletion(todoId, userId);

        res.status(200).json({
            message: "Todo status toggled successfully",
            todo: updatedTodo
        });

    } catch (error) {

        if (error.message === "Todo not found") {
            return res.status(404).json({
                message: error.message
            });
        }

        res.status(400).json({
            error: error.message
        });
    }
});
toDoRouter.put("/markallcompleted", userAuth, async (req, res) => {
    try {

        const userId = req.user._id;

        const result = await markAllTodosCompleted(userId);

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
    try {

        const todoId = req.params.id;
        const userId = req.user._id;

        const deletedTodo = await deleteTodo(todoId, userId);

        res.status(200).json({
            message: "Todo deleted successfully",
            todo: deletedTodo
        });

    } catch (error) {

        if (error.message === "Todo not found") {
            return res.status(404).json({
                message: error.message
            });
        }

        res.status(500).json({
            error: error.message
        });
    }
});

toDoRouter.get("/admin/all/Todos", userAuth, adminAuth, async (req, res) => {
    try {

        const todos = await getAllTodosAdmin();

        res.status(200).json({
            message: "All todos fetched successfully",
            todos
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });
    }
});


toDoRouter.delete("/admin/delete/:id", userAuth, adminAuth, async (req, res) => {
    try {

        const todoId = req.params.id;

        const deletedTodo = await adminDeleteTodo(todoId);

        res.status(200).json({
            message: "Todo deleted successfully",
            todo: deletedTodo
        });

    } catch (error) {

        if (error.message === "Todo not found") {
            return res.status(404).json({
                message: error.message
            });
        }

        res.status(500).json({
            error: error.message
        });
    }
});

module.exports =
    toDoRouter;  