import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import userRouter from './routes/user.routes.js';
import authRouter from './routes/auth.routes.js';
import listingRouter from './routes/listing.routes.js';
import uploadRouter from './routes/upload.routes.js';
import cookieParser from 'cookie-parser';

dotenv.config();

mongoose.connect(process.env.MONGO).then(() => {
    console.log('Connected to MongoDB!');
}).catch((err) => {
    console.log(err);
});

const app = express();

// CORS — dozvoljeni origin-i (Vite dev + Vercel produkcija)
const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL, // npr. https://oglasistan.vercel.app ili https://oglasistan.rs
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Dozvoli zahtjeve bez origin-a (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// Health check za Railway
app.get('/', (req, res) => res.json({ status: 'OglasiStan API radi' }));

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use('/api/listing', listingRouter);
app.use('/api/upload', uploadRouter);

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
