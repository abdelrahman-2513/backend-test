
import express from 'express';
import "reflect-metadata";
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { User } from './entities/userEntity';
import { Stats } from './entities/statsEntity';
import authRouter from './routes/authRoutes';
import { userRouter } from './routes/userRoutes';
import { statsRouter } from './routes/statsRoutes';
dotenv.config();

export const app = express();
const PORT = process.env.PORT || 3000;
console.log({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
})
export const myDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    entities: [User, Stats],
    logging: true,
    synchronize: true,

});

myDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!");
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err);
    });


export const Repositories = {
    userRepo: () => myDataSource.getRepository(User),
    statsRepo: () => myDataSource.getRepository(Stats),
};

app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/stats', statsRouter);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
