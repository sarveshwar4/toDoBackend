const User = require("../models/User");
const { comparePassword, hashPassword } = require("../utils/hash");
const { createAuthToken } = require("../utils/token");

const loginUser = async (email, password) => {

    const user = await User.findOne({ email });

    if (!user) {
        throw new Error("Invalid credentials");
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
        throw new Error("Invalid credentials");
    }

    const token = createAuthToken(user);

    return { user, token };
};

const registerAdmin = async (name, email, password) => {

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new Error("User already exists");
    }

    const passwordHash = await hashPassword(password);

    const user = new User({
        name,
        email,
        password: passwordHash,
        role: "admin"
    });

    const savedUser = await user.save();

    const token = createAuthToken(savedUser);

    return { user: savedUser, token };
};

const loginAdmin = async (email, password) => {

    const user = await User.findOne({ email });

    if (!user) {
        throw new Error("Invalid credentials"); // avoid revealing user existence
    }

    if (user.role !== "admin") {
        throw new Error("Access denied");
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
        throw new Error("Invalid credentials");
    }

    const token = createAuthToken(user);

    return { user, token };
};


const registerUser = async (name, email, password) => {

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new Error("User already exists");
    }

    const passwordHash = await hashPassword(password);

    const user = new User({
        name,
        email,
        password: passwordHash,
        role: "user"
    });

    const savedUser = await user.save();

    const token = createAuthToken(savedUser);

    return { user: savedUser, token };
};

module.exports = { loginUser, registerAdmin, loginAdmin, registerUser};