import { Router } from 'express';
import { loginUser, registerUser } from '../controllers/authController';
import { validateCreateUser, validateLoginUser } from '../dtos/user-dto';
import { asyncHandler } from '../utils/asyncHandler';


const authRouter = Router();

authRouter.post('/register', validateCreateUser, asyncHandler(registerUser));
authRouter.post('/login', validateLoginUser, asyncHandler(loginUser));

export default authRouter;