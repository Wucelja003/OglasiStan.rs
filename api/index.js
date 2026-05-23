import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import userRouter from './routes/user.routes.js';
import authRouter from './routes/auth.routes.js';
import listingRouter  from  './routes/listing.routes.js'
import uploadRouter   from  './routes/upload.routes.js'
import cookieParser from 'cookie-parser';
import path from 'path';


dotenv.config();

mongoose.connect(process.env.MONGO).then(() => {
    console.log('Connect to MongoDb!');
}).catch((err) => {
    console.log(err);
});

const __dirname = path.resolve();

const app = express();


app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());

app.use(cookieParser());

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use('/api/listing', listingRouter);
app.use('/api/upload',  uploadRouter);


app.use(express.static(path.join(__dirname, '/oglasiStan/dist')));

app.get('/*splat', (req, res) => {
    res.sendFile(path.join(__dirname, 'oglasiStan', 'dist', 'index.html'));
});

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    console.error(`[${statusCode}] ${req.method} ${req.path} →`, message);
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});