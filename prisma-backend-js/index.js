import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Patch BigInt for JSON Serialization
BigInt.prototype.toJSON = function () {
    return this.toString();
};

// Routes
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';
import addressRoutes from './routes/addressRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import newsLetter from './routes/newsLetter.js';
import contactRoute from './routes/contactRoute.js';
import promoRoutes from './routes/promoRoutes.js';

// Middleware
import upload from './middleware/uploadMiddleware.js';
import { uploadImage } from './controllers/FileController.js';

// Prisma Client
import prisma from './lib/prisma.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

// ─── CORS ────────────────────────────────────────────────────────────────────
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// ─── Body Parsers ─────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Static Files ─────────────────────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/newsletter', newsLetter);
app.use('/api/contact', contactRoute);
app.use('/api/promo', promoRoutes);
app.post('/api/upload', upload.single('image'), uploadImage);

// Auth routes are served at root (e.g. /login, /register)
app.use('/', authRoutes);

// ─── Health Checks ────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
    res.json({ status: 'online', orm: 'Prisma', timestamp: new Date().toISOString() });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
const startServer = async () => {
    try {
        // Test Prisma connection
        await prisma.$connect();
        console.log('✅ Prisma connected to MySQL successfully.');
        app.listen(PORT, () => {
            console.log(`🚀 Prisma backend running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Failed to connect to database:', error);
        process.exit(1);
    }
};

startServer();

// Graceful shutdown
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    console.log('Prisma disconnected. Server shut down.');
    process.exit(0);
});
