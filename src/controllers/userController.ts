import { Repositories } from ".."; // Adjust based on your project structure
import { asyncHandler } from "../utils/asyncHandler";
import bcrypt from "bcryptjs";
const userModel = require("../models/userModel");
import { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();

const isMongoDB = process.env.DB_TYPE === "mongodb";

/**
 * @desc    Create a new user (works with both MongoDB and PostgreSQL)
 * @param   userData { name, email, password, role }
 * @returns User
 */
export const createUser = async (userData: { name: string; email: string; password: string; role?: string }) => {
    try {
        const { name, email, password, role } = userData;
        
        if (isMongoDB) {
            
            const existingUser = await userModel.findOne({ email });
            console.log({existingUser})
            if (existingUser) throw new Error("User already exists");

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = new userModel({ name, email, password: hashedPassword, role });
            return await newUser.save();
        } else {
 
            const existingUser = await Repositories.userRepo().findOne({ where: { email } });
            if (existingUser) throw new Error("User already exists");

        
            const newUser = Repositories.userRepo().create({ name, email, password });
            return await Repositories.userRepo().save(newUser);
        }
    } catch (error:any) {
        throw new Error(`Error creating user: ${error.message}`);
    }
};

/**
 * @route   GET /users
 * @desc    Get all users with pagination
 */
export const getAllUsers = asyncHandler(async (req:Request, res:Response) => {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    let users, totalUsers;

    if (isMongoDB) {
        users = await userModel.find().skip(skip).limit(Number(limit));
        totalUsers = await userModel.countDocuments();
    } else {
        const query = Repositories.userRepo().createQueryBuilder("user");
        users = await query.skip(skip).take(Number(limit)).getMany();
        totalUsers = await query.getCount();
    }

    res.json({ totalUsers, currentPage: Number(page), usersPerPage: Number(limit), users });
});

/**
 * @route   GET /users/:id
 * @desc    Get a single user by ID
 */
export const getUserById = asyncHandler(async (req:Request, res:Response) => {
    const { id } = req.params;
    let user;

    if (isMongoDB) {
        user = await userModel.findById(id);
    } else {
        user = await Repositories.userRepo().findOne({ where: { id: Number(id) } });
    }

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user });
});
export const getUserByEmail = async (email: string) => {
    let user;

    if (isMongoDB) {
        user = await userModel.findOne({ email: email });
    } else {
        user = await Repositories.userRepo().findOne({ where: { email: email } });
    }

   return user
}

/**
 * @route   PUT /users/:id
 * @desc    Update a user
 */
export const updateUser = asyncHandler(async (req:Request, res:Response) => {
    const { id } = req.params;
    let updatedUser;

    if (isMongoDB) {
        let user = await userModel.findById(id);
        if (!user) return res.status(404).json({ message: "User not found" });

        Object.assign(user, req.body);

        if (req.body.password) {
            user.password = await bcrypt.hash(req.body.password, 10);
        }

        updatedUser = await user.save();
    } else {
        let user = await Repositories.userRepo().findOne({ where: { id: Number(id) } });
        if (!user) return res.status(404).json({ message: "User not found" });

        Object.assign(user, req.body);

        if (req.body.password) {
            user.password = await bcrypt.hash(req.body.password, 10);
        }

        updatedUser = await Repositories.userRepo().save(user);
    }

    res.status(200).json({ updatedUser, message: "User updated successfully" });
});

/**
 * @route   DELETE /users/:id
 * @desc    Delete a user (soft delete for MongoDB)
 */
export const deleteUser = asyncHandler(async (req:Request, res:Response) => {
    const { id } = req.params;

    let user;
    if (isMongoDB) {
        user = await userModel.findById(id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.isDeleted = true;
        await user.save();
    } else {
        user = await Repositories.userRepo().findOne({ where: { id: Number(id) } });
        if (!user) return res.status(404).json({ message: "User not found" });

        await Repositories.userRepo().softDelete(id);
    }

    res.status(204).json({ message: "User deleted successfully" });
});
