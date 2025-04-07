import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/userModel.js';
import Lead from './models/leadModel.js';
import CallRecord from './models/callRecordModel.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected for seeding'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Sample data matching the frontend mock data
const users = [
  {
    name: 'Admin User',
    email: 'admin@leadnexus.com',
    password: bcrypt.hashSync('password123', 10),
    role: 'admin',
    avatar: '/placeholder.svg',
  },
  {
    name: 'Sarah Johnson',
    email: 'sarah@leadnexus.com',
    password: bcrypt.hashSync('password123', 10),
    role: 'telecaller',
    avatar: '/placeholder.svg',
  },
  {
    name: 'Mike Peterson',
    email: 'mike@leadnexus.com',
    password: bcrypt.hashSync('password123', 10),
    role: 'telecaller',
    avatar: '/placeholder.svg',
  },
  {
    name: 'Emily Richards',
    email: 'emily@leadnexus.com',
    password: bcrypt.hashSync('password123', 10),
    role: 'telecaller',
    avatar: '/placeholder.svg',
  },
];

// Import data into database
const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Lead.deleteMany();
    await CallRecord.deleteMany();

    // Insert users
    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0]._id;
    const sarahUser = createdUsers[1]._id;
    const mikeUser = createdUsers[2]._id;
    const emilyUser = createdUsers[3]._id;

    // Create leads with references to users
    const leads = [
      {
        name: 'John Smith',
        email: 'john.smith@example.com',
        phone: '555-123-4567',
        address: '123 Main St, Boston, MA',
        callStatus: 'connected',
        responseStatus: 'interested',
        lastUpdated: new Date('2025-04-05T10:30:00'),
        telecallerId: sarahUser,
        telecallerName: 'Sarah Johnson',
      },
      {
        name: 'Mary Johnson',
        email: 'mary.johnson@example.com',
        phone: '555-234-5678',
        address: '456 Oak Ave, Chicago, IL',
        callStatus: 'not_connected',
        responseStatus: 'rnr',
        lastUpdated: new Date('2025-04-05T11:45:00'),
        telecallerId: sarahUser,
        telecallerName: 'Sarah Johnson',
      },
      {
        name: 'Robert Brown',
        email: 'robert.brown@example.com',
        phone: '555-345-6789',
        address: '789 Pine St, San Francisco, CA',
        callStatus: 'connected',
        responseStatus: 'callback',
        lastUpdated: new Date('2025-04-04T14:15:00'),
        telecallerId: mikeUser,
        telecallerName: 'Mike Peterson',
      },
      {
        name: 'Patricia Davis',
        email: 'patricia.davis@example.com',
        phone: '555-456-7890',
        address: '101 Maple Rd, New York, NY',
        callStatus: 'connected',
        responseStatus: 'discussed',
        lastUpdated: new Date('2025-04-04T16:30:00'),
        telecallerId: mikeUser,
        telecallerName: 'Mike Peterson',
      },
      {
        name: 'James Wilson',
        email: 'james.wilson@example.com',
        phone: '555-567-8901',
        address: '202 Cedar Ln, Seattle, WA',
        callStatus: 'not_connected',
        responseStatus: 'busy',
        lastUpdated: new Date('2025-04-03T09:10:00'),
        telecallerId: emilyUser,
        telecallerName: 'Emily Richards',
      },
      {
        name: 'Jennifer Garcia',
        email: 'jennifer.garcia@example.com',
        phone: '555-678-9012',
        address: '303 Birch Dr, Miami, FL',
        callStatus: 'not_connected',
        responseStatus: 'switched_off',
        lastUpdated: new Date('2025-04-03T13:20:00'),
        telecallerId: emilyUser,
        telecallerName: 'Emily Richards',
      },
      {
        name: 'David Miller',
        email: 'david.miller@example.com',
        phone: '555-789-0123',
        address: '404 Elm Blvd, Austin, TX',
        telecallerId: sarahUser,
        telecallerName: 'Sarah Johnson',
      },
    ];

    const createdLeads = await Lead.insertMany(leads);

    // Create call records for connected calls
    const callRecords = [
      {
        leadId: createdLeads[0]._id,
        customerName: 'John Smith',
        telecallerId: sarahUser,
        telecallerName: 'Sarah Johnson',
        callStatus: 'connected',
        responseStatus: 'interested',
        callDateTime: new Date('2025-04-05T10:30:00'),
      },
      {
        leadId: createdLeads[2]._id,
        customerName: 'Robert Brown',
        telecallerId: mikeUser,
        telecallerName: 'Mike Peterson',
        callStatus: 'connected',
        responseStatus: 'callback',
        callDateTime: new Date('2025-04-04T14:15:00'),
      },
      {
        leadId: createdLeads[3]._id,
        customerName: 'Patricia Davis',
        telecallerId: mikeUser,
        telecallerName: 'Mike Peterson',
        callStatus: 'connected',
        responseStatus: 'discussed',
        callDateTime: new Date('2025-04-04T16:30:00'),
      },
    ];

    await CallRecord.insertMany(callRecords);

    console.log('Data imported successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error importing data: ${error.message}`);
    process.exit(1);
  }
};

// Delete all data from database
const destroyData = async () => {
  try {
    await User.deleteMany();
    await Lead.deleteMany();
    await CallRecord.deleteMany();

    console.log('Data destroyed successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error destroying data: ${error.message}`);
    process.exit(1);
  }
};

// Run script based on command line argument
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}