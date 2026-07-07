const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const authRoutes = require('./routes/auth');
const eventRoute = require('./routes/events');
const bookingRoutes = require('./routes/booking');

// Load local environment variables from server/.env
// On Vercel, env variables will come from Vercel dashboard
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

app.use(cors());
app.use(express.json());

// Handle malformed JSON payloads from clients
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ message: 'Invalid JSON payload' });
    }
    next();
});

// Reuse MongoDB connection in serverless environment
let cachedConnection = null;

const connectDB = async () => {
    if (cachedConnection && mongoose.connection.readyState === 1) {
        return cachedConnection;
    }

    if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI is not configured');
    }

    cachedConnection = await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000
    });

    console.log('MongoDB connected');
    return cachedConnection;
};

// Health check route
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'EVESPHERE backend is running'
    });
});

// Connect DB before API routes
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);

        return res.status(500).json({
            success: false,
            message: 'Database connection failed'
        });
    }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoute);
app.use('/api/bookings', bookingRoutes);

// Local development only
if (require.main === module) {
    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

// Export app for Vercel serverless function
module.exports = app;