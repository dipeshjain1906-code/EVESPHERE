const express = require('express');
const dotenv = require('dotenv');

// Load environment variables from server/.env explicitly before loading routes
dotenv.config({ path: './server/.env' });
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const eventRoute = require('./routes/events');
const bookingRoutes = require('./routes/booking');

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

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoute);
app.use('/api/bookings', bookingRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not configured in server/.env');
        }

        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 10000,
            connectTimeoutMS: 10000
        });

        console.log('MongoDB connected');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1);
    }
};

startServer();
