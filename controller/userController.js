const asyncHandler = require("express-async-handler");
const User = require("../models/userModels");
const generateToken = require("../utils/generateToken");

//Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password").lean();

        if (!users) {
            return res.status(400).json({ message: "No users found" });
        }
        res.json({ users });
    } catch (err) {
        console.log(err);
    }
};

//register a user
const registerUser = asyncHandler(async (req, res) => {
    const { name, phoneNumber, address, zipcode, email, password } = req.body;

    //confirm data
    if (!name || !phoneNumber || !address || !zipcode || !email || !password) {
        return res.status(400).json({ message: "All Feilds are required" });
    }

    //check if user isalready exist
    const userExist = await User.findOne({ email });

    if (userExist) {
        return res.status(404).json({ message: "User is already exist" });
    }

    //create user
    const user = await User.create({
        name,
        phoneNumber,
        address,
        zipcode,
        email,
        password,
    });

    if (user) {
        const accessToken = generateToken.accessToken(user);
        generateToken.refreshToken(res, user._id);

        res.status(201).json({ accessToken });
    } else {
        res.status(400).json({ message: "Invalid user data" });
    }
});

// get userprofile
const getUserProfile = asyncHandler(async (req, res) => {
    const id = req.id;

    const user = await User.findById(id).select("-role");
    user.password = undefined;
    if (!user) {
        return res.status(400).json({
            message: "User Profile not Found",
        });
    }
    res.status(200).json({ user });
});

//update user profile
const updateUserProfile = asyncHandler(async (req, res) => {
    const { id, email, password, name, phoneNumber, address, zipcode } =
        req.body;

    // confirm if id exist
    if (!id) {
        return res.status(400).json({
            message: "ID is Required",
        });
    }

    const user = await User.findById(id).exec();

    if (!user) {
        return res.status(400).json({
            message: "User not Found",
        });
    }

    if (user) {
        user.name = name || user.name;
        user.email = email || user.email;
        user.address = address || user.address;
        user.zipcode = zipcode || user.zipcode;
        user.phoneNumber = phoneNumber || user.phoneNumber;

        if (password) {
            user.password = password;
        }

        const updatedUser = await user.save();

        res.status(200).json({
            message: `${updatedUser.email} updated successfully`,
        });
    } else {
        res.status(404).json({ message: "User not Found" });
    }
});
//delete users
const deleteUser = async (req, res) => {
    try {
        const { id } = req.body;

        //confirm id exist
        if (!id) {
            return res.status(400).json({ message: "User ID Required" });
        }

        const user = await User.findById(id).exec();

        if (!user) {
            return res.status(400).json({ message: "User not Found" });
        }

        const result = await user.deleteOne();

        const reply = `Name ${result.name} with Email ${result.email} deleted`;

        res.json({ message: reply });
    } catch (err) {
        return res.status(500).json({
            message: "Error in deleting User",
            error: err,
        });
    }
};
module.exports = {
    getAllUsers,
    deleteUser,
    registerUser,
    getUserProfile,
    updateUserProfile,
};
