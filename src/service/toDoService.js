const Todo = require("../models/ToDo");

const createTodo = async (data, userId) => {
    try {
        let { title, description, dueDate } = data;

        if (!dueDate) {
            const today = new Date();
            today.setDate(today.getDate() + 2);
            dueDate = today;
        }

        const todo = new Todo({
            title,
            description,
            userId,
            dueDate
        });

        const savedTodo = await todo.save();

        return savedTodo;

    } catch (err) {
        throw new Error(err.message);
    }
};


const getTodos = async (query, userId) => {
    try {
        const { search, completed, page = 1, limit = 5 } = query;

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
            .limit(Number(limit));

        return {
            page: Number(page),
            limit: Number(limit),
            todos
        };

    } catch (err) {
        throw new Error(err.message);
    }
};

const updateTodo = async (todoId, userId, data) => {
    try {
        const { title, description, isCompleted } = data;

        const updatedTodo = await Todo.findOneAndUpdate(
            { _id: todoId, userId },
            { title, description, isCompleted },
            { new: true }
        );

        if (!updatedTodo) {
            throw new Error("Todo not found");
        }

        return updatedTodo;

    } catch (err) {
        throw new Error(err.message);
    }
};

const toggleTodoCompletion = async (todoId, userId) => {
    try {
        const todo = await Todo.findOne({ _id: todoId, userId });

        if (!todo) {
            throw new Error("Todo not found");
        }

        const updatedTodo = await Todo.findOneAndUpdate(
            { _id: todoId, userId },
            { isCompleted: !todo.isCompleted },
            { new: true }
        );

        return updatedTodo;

    } catch (err) {
        throw new Error(err.message);
    }
};

const markAllTodosCompleted = async (userId) => {
    try {

        const result = await Todo.updateMany(
            { userId },
            { isCompleted: true }
        );

        return result;

    } catch (err) {
        throw new Error(err.message);
    }
};

const deleteTodo = async (todoId, userId) => {
    try {

        const deletedTodo = await Todo.findOneAndDelete({
            _id: todoId,
            userId
        });

        if (!deletedTodo) {
            throw new Error("Todo not found");
        }

        return deletedTodo;

    } catch (err) {
        throw new Error(err.message);
    }
};

const getAllTodosAdmin = async () => {
    try {

        const todos = await Todo.find()
            .populate("userId", "name");

        return todos;

    } catch (err) {
        throw new Error(err.message);
    }
};

const adminDeleteTodo = async (todoId) => {
    try {

        const deletedTodo = await Todo.findByIdAndDelete(todoId);

        if (!deletedTodo) {
            throw new Error("Todo not found");
        }

        return deletedTodo;

    } catch (err) {
        throw new Error(err.message);
    }
};



module.exports = {
    createTodo, getTodos,  updateTodo, toggleTodoCompletion,   markAllTodosCompleted,  deleteTodo, getAllTodosAdmin, adminDeleteTodo
};