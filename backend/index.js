import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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


// The frontend calls these endpoints at the root (e.g. /register, not /api/register)
app.use('/', authRoutes);


// Test the database connection and sync models
const initDb = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection to MySQL has been established successfully.');
        
        // Sync models with database (creates tables if they don't exist, skips if already exist)
        //await sequelize.sync({ alter: true }); 
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

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
