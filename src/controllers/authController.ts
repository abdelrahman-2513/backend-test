import { validationResult } from 'express-validator';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {  createUser, getUserByEmail } from './userController';
import { asyncHandler } from '../utils/asyncHandler';

export const registerUser = asyncHandler(async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array().map(error => error.msg) });
        }

        const { name, email, password } = req.body;
        const userData = { name, email,password }
        
        
        const savedUser = await createUser(userData);
        res.status(201).json({ message: 'User registered successfully', user: savedUser });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error registering user', error });
    }
});

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array().map(error => error.msg) });
        }

        const { email, password } = req.body;
        const user = await getUserByEmail(email);
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(400).json({ message: 'Invalid credentials' });


        const token = jwt.sign({ id: user.id ,role: user.role}, process.env.JWT_SECRET!, { expiresIn: '1h' });

        res.json({ token, message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
});

