const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    description: {
        type: String
    },

    isCompleted: {
        type: Boolean,
        default: false
    },

   dueDate: {
    type: Date,
    validate: {
        validator: function(v) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return !v || v >= today;
        },
        message: "Due date cannot be in the past!"
    }
},

    createdAt: {
        type: Date,
       
    },

    updatedAt: {
        type : Date,
        default : Date.now  
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

});

const Todo = mongoose.model("Todo", todoSchema);

module.exports = Todo;