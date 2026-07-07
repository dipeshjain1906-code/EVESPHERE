/* ======================================
Database Seeded Successfully
======================================

Admin
------
Email    : dipeshjain1906@gmail.com
Password : admin@evesphere

Main Demo User
--------------
Email    : aarush@evesphere.com
Password : user@evesphere

Other Demo Users
----------------
Password for all users: user@evesphere
aditi@evesphere.com
rohan@evesphere.com
priya@evesphere.com
sneha@evesphere.com
rahul@evesphere.com
neha@evesphere.com
karan@evesphere.com

Summary
-------
Demo Users Created : 8
Events Created     : 14
Bookings Created   : 29

======================================
*/

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const Event = require('./models/Event');
const Booking = require('./models/Bookings');
const OTP = require('./models/OTP');

dotenv.config();

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is missing in .env file');
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('MongoDB connected for seeding');
};

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const getPaymentStatus = (status) => {
  if (status === 'confirmed') return 'paid';
  return 'non_paid';
};

const seedDatabase = async () => {
  await connectDB();

  // WARNING:
  // This clears old demo data from these collections.
  // Run this only on your development/testing database.
  await Booking.deleteMany({});
  await Event.deleteMany({});
  await OTP.deleteMany({});
  await User.deleteMany({});

  console.log('Old demo data removed');

  const adminPassword = await hashPassword('admin@evesphere');
  const userPassword = await hashPassword('user@evesphere');

  const users = await User.insertMany([
    {
      name: 'Dipesh Jain',
      email: 'dipeshjain1906@gmail.com',
      password: adminPassword,
      role: 'admin',
      isVerified: true,
    },
    {
      name: 'Aarush',
      email: 'aarush@evesphere.com',
      password: userPassword,
      role: 'user',
      isVerified: true,
    },
    {
      name: 'Aditi Sharma',
      email: 'aditi@evesphere.com',
      password: userPassword,
      role: 'user',
      isVerified: true,
    },
    {
      name: 'Rohan Mehta',
      email: 'rohan@evesphere.com',
      password: userPassword,
      role: 'user',
      isVerified: true,
    },
    {
      name: 'Priya Verma',
      email: 'priya@evesphere.com',
      password: userPassword,
      role: 'user',
      isVerified: true,
    },
    {
      name: 'Sneha Gupta',
      email: 'sneha@evesphere.com',
      password: userPassword,
      role: 'user',
      isVerified: true,
    },
    {
      name: 'Rahul Singh',
      email: 'rahul@evesphere.com',
      password: userPassword,
      role: 'user',
      isVerified: true,
    },
    {
      name: 'Neha Kapoor',
      email: 'neha@evesphere.com',
      password: userPassword,
      role: 'user',
      isVerified: true,
    },
    {
      name: 'Karan Malhotra',
      email: 'karan@evesphere.com',
      password: userPassword,
      role: 'user',
      isVerified: true,
    },
  ]);

  const userByEmail = (email) => users.find((user) => user.email === email);

  const admin = userByEmail('dipeshjain1906@gmail.com');
  const aarush = userByEmail('aarush@evesphere.com');
  const aditi = userByEmail('aditi@evesphere.com');
  const rohan = userByEmail('rohan@evesphere.com');
  const priya = userByEmail('priya@evesphere.com');
  const sneha = userByEmail('sneha@evesphere.com');
  const rahul = userByEmail('rahul@evesphere.com');
  const neha = userByEmail('neha@evesphere.com');
  const karan = userByEmail('karan@evesphere.com');

  console.log('Users created');

  const events = await Event.insertMany([
    {
      title: 'Tech Conference 2026',
      description:
        'A large technology conference with talks on software development, cloud computing, product building, and career growth.',
      date: new Date('2026-08-20T10:00:00.000Z'),
      location: 'Bengaluru, Karnataka',
      category: 'Technology',
      totalSeats: 120,
      availableSeats: 120,
      ticketPrice: 499,
      imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
      createdBy: admin._id,
    },
    {
      title: 'Startup Pitch Fest',
      description:
        'An event for student founders and early-stage startups to pitch ideas, network with mentors, and meet investors.',
      date: new Date('2026-09-05T09:30:00.000Z'),
      location: 'Delhi, India',
      category: 'Business',
      totalSeats: 80,
      availableSeats: 80,
      ticketPrice: 299,
      imageUrl: 'https://images.unsplash.com/photo-1556761175-b413da4baf72',
      createdBy: admin._id,
    },
    {
      title: 'AI/ML Hands-on Workshop',
      description:
        'A beginner-friendly workshop covering machine learning fundamentals, model training, and real-world AI project workflows.',
      date: new Date('2026-09-18T11:00:00.000Z'),
      location: 'IIT Dhanbad, Jharkhand',
      category: 'AI',
      totalSeats: 60,
      availableSeats: 60,
      ticketPrice: 699,
      imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995',
      createdBy: admin._id,
    },
    {
      title: 'College Coding Hackathon',
      description:
        'A 24-hour coding hackathon for teams to build web apps, backend systems, dashboards, and AI-based solutions.',
      date: new Date('2026-10-02T04:30:00.000Z'),
      location: 'Dhanbad, Jharkhand',
      category: 'Hackathon',
      totalSeats: 100,
      availableSeats: 100,
      ticketPrice: 0,
      imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d',
      createdBy: admin._id,
    },
    {
      title: 'Music Night 2026',
      description:
        'An evening of live music, band performances, DJ night, food stalls, and open-air entertainment.',
      date: new Date('2026-10-15T13:30:00.000Z'),
      location: 'Mumbai, Maharashtra',
      category: 'Music',
      totalSeats: 200,
      availableSeats: 200,
      ticketPrice: 999,
      imageUrl: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4',
      createdBy: admin._id,
    },
    {
      title: 'Web Development Bootcamp',
      description:
        'A practical bootcamp on HTML, CSS, JavaScript, React, Node.js, Express, MongoDB, and API testing using Postman.',
      date: new Date('2026-11-01T05:00:00.000Z'),
      location: 'Online',
      category: 'Education',
      totalSeats: 150,
      availableSeats: 150,
      ticketPrice: 199,
      imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
      createdBy: admin._id,
    },
    {
      title: 'Inter College Sports Championship',
      description:
        'A sports event featuring badminton, cricket, football, athletics, table tennis, and fitness challenges.',
      date: new Date('2026-11-20T03:30:00.000Z'),
      location: 'Kolkata, West Bengal',
      category: 'Sports',
      totalSeats: 90,
      availableSeats: 90,
      ticketPrice: 149,
      imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211',
      createdBy: admin._id,
    },
    {
      title: 'Photography Walk',
      description:
        'A guided city photography walk for beginners and hobby photographers focused on composition, lighting, and storytelling.',
      date: new Date('2026-12-03T01:30:00.000Z'),
      location: 'Jaipur, Rajasthan',
      category: 'Photography',
      totalSeats: 40,
      availableSeats: 40,
      ticketPrice: 99,
      imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee',
      createdBy: admin._id,
    },
    {
      title: 'Blockchain Summit',
      description:
        'A summit covering blockchain fundamentals, Web3 products, smart contracts, decentralised applications, and startup opportunities.',
      date: new Date('2026-12-12T09:00:00.000Z'),
      location: 'Hyderabad, Telangana',
      category: 'Technology',
      totalSeats: 100,
      availableSeats: 100,
      ticketPrice: 799,
      imageUrl: 'https://images.unsplash.com/photo-1639322537228-f710d846310a',
      createdBy: admin._id,
    },
    {
      title: 'Cyber Security Workshop',
      description:
        'A practical workshop on ethical hacking basics, web security, authentication issues, network security, and safe coding practices.',
      date: new Date('2027-01-08T10:00:00.000Z'),
      location: 'Pune, Maharashtra',
      category: 'Workshop',
      totalSeats: 70,
      availableSeats: 70,
      ticketPrice: 599,
      imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3',
      createdBy: admin._id,
    },
    {
      title: 'Data Science Meetup',
      description:
        'A community meetup for data science learners, analysts, and engineers with sessions on Python, visualization, and data storytelling.',
      date: new Date('2027-01-22T08:30:00.000Z'),
      location: 'Gurugram, Haryana',
      category: 'Data Science',
      totalSeats: 85,
      availableSeats: 85,
      ticketPrice: 0,
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
      createdBy: admin._id,
    },
    {
      title: 'React Conference India',
      description:
        'A frontend-focused conference covering React, component design, hooks, state management, performance, and modern UI patterns.',
      date: new Date('2027-02-10T09:30:00.000Z'),
      location: 'Noida, Uttar Pradesh',
      category: 'Technology',
      totalSeats: 110,
      availableSeats: 110,
      ticketPrice: 899,
      imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee',
      createdBy: admin._id,
    },
    {
      title: 'Entrepreneurship Expo',
      description:
        'A free expo for students, creators, and founders to explore startup ideas, business models, funding, and product-market fit.',
      date: new Date('2027-02-25T06:30:00.000Z'),
      location: 'Ahmedabad, Gujarat',
      category: 'Startup',
      totalSeats: 140,
      availableSeats: 140,
      ticketPrice: 0,
      imageUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952',
      createdBy: admin._id,
    },
    {
      title: 'Food Festival 2027',
      description:
        'A city food festival featuring street food, regional cuisines, live counters, cultural performances, and family activities.',
      date: new Date('2027-03-12T12:00:00.000Z'),
      location: 'Chandigarh, India',
      category: 'Food',
      totalSeats: 180,
      availableSeats: 180,
      ticketPrice: 0,
      imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1',
      createdBy: admin._id,
    },
  ]);

  console.log('Events created');

  const eventByTitle = (title) => events.find((event) => event.title === title);

  const createBooking = (user, eventTitle, status = 'confirmed') => {
    const event = eventByTitle(eventTitle);

    return {
      userId: user._id,
      eventId: event._id,
      status,
      paymentStatus: getPaymentStatus(status),
      amount: event.ticketPrice,
    };
  };

  const bookingsData = [
    // Aarush - 8 bookings
    createBooking(aarush, 'Tech Conference 2026', 'confirmed'),
    createBooking(aarush, 'AI/ML Hands-on Workshop', 'confirmed'),
    createBooking(aarush, 'College Coding Hackathon', 'confirmed'),
    createBooking(aarush, 'Web Development Bootcamp', 'confirmed'),
    createBooking(aarush, 'Blockchain Summit', 'confirmed'),
    createBooking(aarush, 'Cyber Security Workshop', 'pending'),
    createBooking(aarush, 'React Conference India', 'confirmed'),
    createBooking(aarush, 'Data Science Meetup', 'confirmed'),

    // Rohan - 5 bookings
    createBooking(rohan, 'Tech Conference 2026', 'confirmed'),
    createBooking(rohan, 'Startup Pitch Fest', 'pending'),
    createBooking(rohan, 'College Coding Hackathon', 'confirmed'),
    createBooking(rohan, 'Blockchain Summit', 'confirmed'),
    createBooking(rohan, 'React Conference India', 'cancelled'),

    // Aditi - 4 bookings
    createBooking(aditi, 'Startup Pitch Fest', 'confirmed'),
    createBooking(aditi, 'Music Night 2026', 'confirmed'),
    createBooking(aditi, 'Photography Walk', 'confirmed'),
    createBooking(aditi, 'Entrepreneurship Expo', 'pending'),

    // Priya - 3 bookings
    createBooking(priya, 'AI/ML Hands-on Workshop', 'confirmed'),
    createBooking(priya, 'Web Development Bootcamp', 'confirmed'),
    createBooking(priya, 'Food Festival 2027', 'confirmed'),

    // Sneha - 3 bookings
    createBooking(sneha, 'Music Night 2026', 'cancelled'),
    createBooking(sneha, 'Data Science Meetup', 'confirmed'),
    createBooking(sneha, 'Cyber Security Workshop', 'confirmed'),

    // Rahul - 2 bookings
    createBooking(rahul, 'Inter College Sports Championship', 'confirmed'),
    createBooking(rahul, 'College Coding Hackathon', 'pending'),

    // Neha - 2 bookings
    createBooking(neha, 'Photography Walk', 'confirmed'),
    createBooking(neha, 'Entrepreneurship Expo', 'confirmed'),

    // Karan - 2 bookings
    createBooking(karan, 'Food Festival 2027', 'confirmed'),
    createBooking(karan, 'React Conference India', 'pending'),
  ];

  await Booking.insertMany(bookingsData);

  // Update availableSeats based only on confirmed bookings.
  const confirmedBookingCountByEvent = {};

  bookingsData.forEach((booking) => {
    if (booking.status === 'confirmed') {
      const eventId = booking.eventId.toString();
      confirmedBookingCountByEvent[eventId] =
        (confirmedBookingCountByEvent[eventId] || 0) + 1;
    }
  });

  for (const event of events) {
    const confirmedCount = confirmedBookingCountByEvent[event._id.toString()] || 0;

    await Event.findByIdAndUpdate(event._id, {
      availableSeats: event.totalSeats - confirmedCount,
    });
  }

  console.log('Bookings created');
  console.log('Available seats updated');

  console.log('\n======================================');
  console.log('Database Seeded Successfully');
  console.log('======================================');

  console.log('\nAdmin');
  console.log('------');
  console.log('Email    : dipeshjain1906@gmail.com');
  console.log('Password : admin@evesphere');

  console.log('\nMain Demo User');
  console.log('--------------');
  console.log('Email    : aarush@evesphere.com');
  console.log('Password : user@evesphere');

  console.log('\nOther Demo Users');
  console.log('----------------');
  console.log('Password for all users: user@evesphere');
  console.log('aditi@evesphere.com');
  console.log('rohan@evesphere.com');
  console.log('priya@evesphere.com');
  console.log('sneha@evesphere.com');
  console.log('rahul@evesphere.com');
  console.log('neha@evesphere.com');
  console.log('karan@evesphere.com');

  console.log('\nSummary');
  console.log('-------');
  console.log(`Demo Users Created : ${users.length - 1}`);
  console.log(`Events Created     : ${events.length}`);
  console.log(`Bookings Created   : ${bookingsData.length}`);

  console.log('\n======================================\n');
};

seedDatabase()
  .then(async () => {
    await mongoose.connection.close();
    process.exit(0);
  })
  .catch(async (error) => {
    console.error('Seed failed:', error.message);
    await mongoose.connection.close();
    process.exit(1);
  });