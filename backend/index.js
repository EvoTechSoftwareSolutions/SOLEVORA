import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import sequelize from './config/db.js';

// Import Models (to ensure they are registered with Sequelize)
import Category from './models/Category.js';
import Product from './models/Product.js';
import Order from './models/Order.js';
import OrderItem from './models/OrderItem.js';
import User from './models/User.js';
import Address from './models/Address.js';
import Wishlist from './models/Wishlist.js';
import Review from './models/Review.js';
import PromoCode from './models/PromoCode.js';

// Import Routes
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
import upload from './middleware/uploadMiddleware.js';
import { uploadImage } from './controllers/FileController.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Serve static upload files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Register Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/reviews', reviewRoutes);
app.use("/api/newsletter", newsLetter);
app.use("/api/contact", contactRoute);
app.use("/api/promo", promoRoutes);
app.post("/api/upload", upload.single('image'), uploadImage);


// The frontend calls these endpoints at the root (e.g. /register, not /api/register)
app.use('/', authRoutes);


// Test the database connection and sync models
const initDb = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection to MySQL has been established successfully.');
        
        // Sync models with database (creates tables if they don't exist, skips if already exist)
        // Disabled alter: true to prevent MySQL 'Too many keys specified' error on repeated restarts.
        await sequelize.sync();
        console.log('Database synced successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

initDb();

app.get('/', (req, res) => {
    res.json({ message: 'SoleVora Backend is healthy' });
});

app.get('/api/health', (req, res) => {
    res.json({
        status: 'online',
        timestamp: new Date().toISOString()
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
