import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
type AuthRequest = Request & { user?: any };

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): any => {
    const token = req.headers.authorization?.split(' ')[1];
    console.log({token})
    if (!token) return res.status(401).json({ message: 'Access Denied' });
    
    jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
        console.log(err)
        if (err) return res.status(403).json({ message: 'Invalid Token' });
        req.user = user;
        next();
    });
};

export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || req.user.role !== 'admin') {
         res.status(403).json({ message: 'Forbidden: Admins only' });
    }
    next();
};