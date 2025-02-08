
import express from 'express';
import "reflect-metadata";
import dotenv from 'dotenv';
import { User } from './entities/userEntity';
import authRouter from './routes/authRoutes';
import { userRouter } from './routes/userRoutes';
import { connectDatabase, myDataSource } from './data-source';
import { Product } from './entities/productEntity';
import router  from './routes/productRoutes';
dotenv.config();

export const app = express();
const PORT = process.env.PORT || 3000;

connectDatabase();



export const Repositories = {
    userRepo: () => myDataSource.getRepository(User),
    productRepo: () => myDataSource.getRepository(Product),
};

app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/products', router);


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
