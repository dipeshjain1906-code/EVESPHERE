const Booking = require('../models/Bookings.js');
const OTP = require('../models/OTP');
const Event = require('../models/Event');
const {sendOtpEmail, sendBookingEmail} = require('../utils/email');

const generateOtp = () => {
    return Math.floor(100000 + Math.floor(Math.random() * 900000)).toString();
}

exports.sendBookingOTP = async (req, res) => {
    try {
        const otp = generateOtp();

        await OTP.deleteMany({
            email: req.user.email,
            action: 'event_booking'
        });

        await OTP.create({
            email: req.user.email,
            otp,
            action: 'event_booking'
        });

        await sendOtpEmail(req.user.email, otp, 'event_booking');

        res.json({ message: 'OTP sent to email' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.bookEvent = async (req, res) => {
    const {eventId,otp} = req.body;
    const otpRecord = await OTP.findOne({ email: req.user.email, otp, action: 'event_booking' });
    if(!otpRecord) {
        return res.status(400).json({ error: 'Invalid OTP' });
    }

    const event = await Event.findById(eventId);
    if(!event) {
        return res.status(404).json({ error: 'Event not found' });
    }

    if(event.availableSeats <= 0) {
        return res.status(400).json({ error: 'No available seats for this event' });
    }

    const existingBooking = await Booking.findOne({
        userId: req.user._id,
        eventId
    });
    if(existingBooking) {
        return res.status(400).json({ error: 'You have already booked this event' });
    }

    const booking = await Booking.create({
        userId: req.user._id,
        eventId: eventId,
        status: 'pending',
        paymentStatus: 'non_paid',
        amount: event.ticketPrice
    });

    await OTP.deleteOne({ email: req.user.email, otp, action: 'event_booking' });
    res.json({ message: 'Event booked successfully', booking });
}


exports.confirmBooking = async (req, res) => {
    const paymentStatus = req.body.paymentStatus;
    if(!['paid', 'non_paid'].includes(paymentStatus)) {
        return res.status(400).json({ error: 'Invalid payment status' });
    }

    const booking = await Booking.findById(req.params.id).populate('eventId').populate('userId', 'name email');
    if(!booking) {
        return res.status(404).json({ error: 'Booking not found' });
    }

    if(booking.status === 'confirmed') {
        return res.status(400).json({ error: 'Booking is already confirmed' });
    }

    const event = await Event.findById(booking.eventId._id);
    if(event.availableSeats <= 0) {
        return res.status(400).json({ error: 'No available seats for this event' });
    }

    booking.status = 'confirmed';

    if(paymentStatus) {
        booking.paymentStatus = paymentStatus;
    }
    await booking.save();
    event.availableSeats -= 1;
    await event.save();

    //admin cnfrm booking, send email to user
    await sendBookingEmail(
        booking.userId.email,
        booking.userId.name,
        booking.eventId.title
    ); 
    res.json({ message: 'Booking confirmed successfully', booking });
}

exports.getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.user._id })
            .populate('eventId')
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getAdminBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({})
            .populate('eventId')
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });

        const paidConfirmedBookings = bookings.filter(
            booking => booking.status === 'confirmed' && booking.paymentStatus === 'paid'
        );

        res.json({
            bookings,
            stats: {
                totalRevenue: paidConfirmedBookings.reduce(
                    (total, booking) => total + (Number(booking.amount) || 0),
                    0
                ),
                paidClients: new Set(
                    paidConfirmedBookings
                        .map(booking => booking.userId?._id?.toString())
                        .filter(Boolean)
                ).size,
                pendingRequests: bookings.filter(booking => booking.status === 'pending').length
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        if (req.user.role !== 'admin' && booking.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'You are not authorized to cancel this booking' });
        }

        const wasConfirmed = booking.status === 'confirmed';

        if (wasConfirmed) {
            const event = await Event.findById(booking.eventId);

            if (event) {
                event.availableSeats += 1;
                await event.save();
            }
        }

        booking.status = 'cancelled';
        await booking.save();

        res.json({ message: 'Booking cancelled successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
