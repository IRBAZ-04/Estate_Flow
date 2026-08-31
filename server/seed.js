const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('./models/User');
const Property = require('./models/Property');
const Favorite = require('./models/Favorite');
const Inquiry = require('./models/Inquiry');
const Visit = require('./models/Visit');
const Agreement = require('./models/Agreement');
const Payment = require('./models/Payment');
const Maintenance = require('./models/Maintenance');
const Notification = require('./models/Notification');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/realestate_db';
    console.log('[Seed] Connecting to MongoDB:', mongoUri);
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected successfully.');

    // Clear existing data
    console.log('[Seed] Clearing existing collections...');
    await Promise.all([
      User.deleteMany({}),
      Property.deleteMany({}),
      Favorite.deleteMany({}),
      Inquiry.deleteMany({}),
      Visit.deleteMany({}),
      Agreement.deleteMany({}),
      Payment.deleteMany({}),
      Maintenance.deleteMany({}),
      Notification.deleteMany({}),
    ]);
    console.log('[Seed] All collections cleared.');

    // 1. Create Users
    console.log('[Seed] Seeding demo users...');
    const admin = await User.create({
      name: 'System Administrator',
      email: 'admin@estateflow.com',
      phone: '+91 98765 00001',
      password: 'Admin@123456',
      role: 'admin',
      status: 'active',
    });

    const owner1 = await User.create({
      name: 'Rajesh Sharma',
      email: 'rajesh.sharma@estateflow.com',
      phone: '+91 98765 11111',
      password: 'Password@123',
      role: 'owner',
      status: 'active',
    });

    const owner2 = await User.create({
      name: 'Ananya Deshmukh',
      email: 'ananya.deshmukh@estateflow.com',
      phone: '+91 98765 22222',
      password: 'Password@123',
      role: 'owner',
      status: 'active',
    });

    const tenant1 = await User.create({
      name: 'Karthik Ramachandran',
      email: 'karthik.ram@estateflow.com',
      phone: '+91 98765 33333',
      password: 'Password@123',
      role: 'tenant',
      status: 'active',
    });

    const tenant2 = await User.create({
      name: 'Priya Nair',
      email: 'priya.nair@estateflow.com',
      phone: '+91 98765 44444',
      password: 'Password@123',
      role: 'tenant',
      status: 'active',
    });

    console.log(`[Seed] Created 5 users (1 Admin, 2 Owners, 2 Tenants).`);

    // 2. Create Properties
    console.log('[Seed] Seeding properties...');
    const prop1 = await Property.create({
      title: 'Grand Azure Luxury Penthouse',
      description: 'Stunning 4BHK sea-facing penthouse in ECR with panoramic Bay of Bengal views, private plunge pool, and Italian marble flooring.',
      propertyType: 'Apartment',
      purpose: 'Rent',
      price: 85000,
      location: 'ECR, Chennai',
      address: 'Plot 42, Golden Beach Road, ECR',
      bedrooms: 4,
      bathrooms: 4,
      area: 3400,
      furnishingStatus: 'Furnished',
      parking: 'Covered',
      amenities: ['Swimming Pool', 'Private Plunge Pool', 'Gymnasium', '24/7 Security', 'Power Backup', 'Sea View'],
      images: [
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
      ],
      owner: owner1._id,
      status: 'Approved',
    });

    const prop2 = await Property.create({
      title: 'Serene Green Gated Community Villa',
      description: 'Contemporary 3BHK duplex villa nestled in lush green landscape with private terrace garden, solar power, and clubhouse access.',
      propertyType: 'Villa',
      purpose: 'Sale',
      price: 16500000,
      location: 'Anna Nagar, Chennai',
      address: '15, 3rd Avenue, Anna Nagar West',
      bedrooms: 3,
      bathrooms: 3,
      area: 2600,
      furnishingStatus: 'Semi-Furnished',
      parking: 'Covered',
      amenities: ['Clubhouse', 'Garden', 'Children Play Area', 'EV Charging Station', 'Solar Backup'],
      images: [
        'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80',
      ],
      owner: owner1._id,
      status: 'Approved',
    });

    const prop3 = await Property.create({
      title: 'Premium IT Tech Park Office Space',
      description: 'Plug-and-play modern corporate office space in prime OMR IT corridor with 40 workstations, 2 conference rooms, and cafeteria.',
      propertyType: 'Office',
      purpose: 'Rent',
      price: 125000,
      location: 'OMR, Chennai',
      address: 'Level 5, Olympia Cyber City, OMR',
      bedrooms: 0,
      bathrooms: 4,
      area: 4200,
      furnishingStatus: 'Furnished',
      parking: 'Covered',
      amenities: ['Central AC', 'High Speed Elevators', 'Cafeteria', 'Conference Hall', 'Biometric Access', 'Fire Safety'],
      images: [
        'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1000&q=80',
      ],
      owner: owner2._id,
      status: 'Approved',
    });

    const prop4 = await Property.create({
      title: 'Heritage Courtyard Independent House',
      description: 'Traditional Chettinad architectural charm blended with modern amenities in historic Nungambakkam heartland.',
      propertyType: 'Independent House',
      purpose: 'Rent',
      price: 60000,
      location: 'Nungambakkam, Chennai',
      address: '8, Sterling Road, Nungambakkam',
      bedrooms: 3,
      bathrooms: 3,
      area: 2200,
      furnishingStatus: 'Semi-Furnished',
      parking: 'Available',
      amenities: ['Pooja Room', 'Rainwater Harvesting', 'Private Courtyard', 'Servant Quarters'],
      images: [
        'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1000&q=80',
      ],
      owner: owner2._id,
      status: 'Pending', // Pending admin approval for moderation demo
    });

    const prop5 = await Property.create({
      title: 'Modern High-Rise Skyline Apartment',
      description: 'Centrally located 2BHK apartment overlooking Guindy National Park with modular kitchen and clubhouse membership.',
      propertyType: 'Apartment',
      purpose: 'Rent',
      price: 38000,
      location: 'Guindy, Chennai',
      address: 'Tower B, Skyline Residency, Guindy',
      bedrooms: 2,
      bathrooms: 2,
      area: 1250,
      furnishingStatus: 'Furnished',
      parking: 'Covered',
      amenities: ['Gymnasium', 'Badminton Court', 'CCTV Surveillance', 'Intercom'],
      images: [
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80',
      ],
      owner: owner1._id,
      status: 'Rented',
    });

    console.log(`[Seed] Created 5 properties across various statuses and types.`);

    // 3. Create Favorites
    console.log('[Seed] Seeding favorites...');
    await Favorite.create({
      user: tenant1._id,
      property: prop1._id,
    });
    await Favorite.create({
      user: tenant1._id,
      property: prop2._id,
    });
    await Favorite.create({
      user: tenant2._id,
      property: prop1._id,
    });

    // 4. Create Inquiries
    console.log('[Seed] Seeding inquiries...');
    const inq1 = await Inquiry.create({
      user: tenant1._id,
      owner: owner1._id,
      property: prop1._id,
      name: tenant1.name,
      email: tenant1.email,
      phone: tenant1.phone,
      message: 'Hello Rajesh, I am looking to move in next month. Is the monthly maintenance fee included in the ₹85,000 rent?',
      responseMessage: 'Hi Karthik, yes, society maintenance and access to the private pool are included.',
      status: 'Contacted',
    });

    const inq2 = await Inquiry.create({
      user: tenant2._id,
      owner: owner2._id,
      property: prop3._id,
      name: tenant2.name,
      email: tenant2.email,
      phone: tenant2.phone,
      message: 'Interested in leasing the OMR office for a fintech startup. Are flexible lease tenures available?',
      status: 'Pending',
    });

    // 5. Create Visits
    console.log('[Seed] Seeding site visits...');
    await Visit.create({
      property: prop1._id,
      requester: tenant1._id,
      owner: owner1._id,
      date: new Date(Date.now() + 2 * 86400000),
      time: '11:00 AM',
      status: 'Confirmed',
      notes: 'Requester requested evening inspection of the terrace.',
    });

    await Visit.create({
      property: prop2._id,
      requester: tenant2._id,
      owner: owner1._id,
      date: new Date(Date.now() + 4 * 86400000),
      time: '03:30 PM',
      status: 'Pending',
      notes: 'First-time villa buyer visit with family.',
    });

    // 6. Create Agreements
    console.log('[Seed] Seeding rental agreements...');
    const agreement = await Agreement.create({
      property: prop1._id,
      owner: owner1._id,
      tenant: tenant1._id,
      monthlyRent: 85000,
      securityDeposit: 170000,
      startDate: new Date(),
      endDate: new Date(Date.now() + 365 * 86400000),
      terms: 'Standard 11-month residential tenancy agreement. Rent is due on the 5th of each calendar month. 2 months notice period required prior to vacation.',
      status: 'Active',
    });

    // 7. Create Payments
    console.log('[Seed] Seeding payment ledger records...');
    await Payment.create({
      agreement: agreement._id,
      property: prop1._id,
      tenant: tenant1._id,
      owner: owner1._id,
      amount: 170000,
      paymentType: 'Security Deposit',
      month: 'Initial Move-in Deposit',
      paymentDate: new Date(Date.now() - 15 * 86400000),
      paymentMethod: 'Bank Transfer',
      status: 'Paid',
      transactionReference: 'TXN_DEP_20260801',
      notes: 'Security deposit transferred via NEFT/RTGS.',
    });

    await Payment.create({
      agreement: agreement._id,
      property: prop1._id,
      tenant: tenant1._id,
      owner: owner1._id,
      amount: 85000,
      paymentType: 'Rent',
      month: 'August 2026',
      paymentDate: new Date(Date.now() - 5 * 86400000),
      paymentMethod: 'UPI / Net Banking',
      status: 'Paid',
      transactionReference: 'TXN_RENT_20260805',
      notes: 'August month advance rent payment.',
    });

    // 8. Create Maintenance Requests
    console.log('[Seed] Seeding maintenance requests...');
    await Maintenance.create({
      property: prop1._id,
      tenant: tenant1._id,
      owner: owner1._id,
      title: 'Plumbing Valve Leakage in Master Bathroom',
      description: 'The hot water inlet valve beneath the basin is dripping intermittently.',
      category: 'Plumbing',
      priority: 'High',
      status: 'Resolved',
      technicianNotes: 'Plumber visited on 28th Aug and replaced washer seals. Pressure tested.',
      resolvedAt: new Date(Date.now() - 2 * 86400000),
    });

    await Maintenance.create({
      property: prop1._id,
      tenant: tenant1._id,
      owner: owner1._id,
      title: 'Air Conditioner Filter Cleaning & Gas Top-up',
      description: 'Living room split AC cooling performance has dropped.',
      category: 'Appliance',
      priority: 'Medium',
      status: 'In Progress',
      technicianNotes: 'Technician scheduled to visit on Saturday morning.',
    });

    // 9. Create Notifications
    console.log('[Seed] Seeding notifications...');
    await Notification.create({
      recipient: owner1._id,
      type: 'property_approval',
      title: 'Listing Approved: "Grand Azure Luxury Penthouse"',
      message: 'Your property listing has been reviewed and approved by the administrator.',
      relatedId: prop1._id,
      link: `/properties/${prop1._id}`,
      read: true,
    });

    await Notification.create({
      recipient: owner1._id,
      type: 'inquiry_received',
      title: 'New Property Inquiry',
      message: 'Karthik Ramachandran sent an inquiry regarding Grand Azure Luxury Penthouse.',
      relatedId: inq1._id,
      link: '/owner/inquiries',
      read: false,
    });

    await Notification.create({
      recipient: tenant1._id,
      type: 'inquiry_updated',
      title: 'Inquiry Update: Contacted',
      message: 'Rajesh Sharma replied to your inquiry: "Hi Karthik, yes, society maintenance..."',
      relatedId: inq1._id,
      link: '/tenant/inquiries',
      read: false,
    });

    console.log('\n=============================================================');
    console.log(' SEED COMPLETED SUCCESSFULLY! DEMO DATA READY                ');
    console.log('=============================================================');
    console.log('DEMO ACCOUNTS:');
    console.log('1. Admin:  admin@estateflow.com          / Admin@123456');
    console.log('2. Owner:  rajesh.sharma@estateflow.com   / Password@123');
    console.log('3. Owner:  ananya.deshmukh@estateflow.com / Password@123');
    console.log('4. Tenant: karthik.ram@estateflow.com     / Password@123');
    console.log('5. Tenant: priya.nair@estateflow.com      / Password@123');
    console.log('=============================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]', error);
    process.exit(1);
  }
};

seedData();
