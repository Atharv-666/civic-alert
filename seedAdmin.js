const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/civic_alert_salokhenagar';

async function seedAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('🔌 Connected to database for seeding...');

    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@salokhenagar.org').toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@12345';
    const adminName = process.env.ADMIN_NAME || 'Salokhenagar Municipal Admin';

    let existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log(`✅ Updated existing user ${adminEmail} role to 'admin'.`);
      } else {
        console.log(`ℹ️ Admin account ${adminEmail} already exists.`);
      }
    } else {
      const newAdmin = new User({
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        role: 'admin'
      });
      await newAdmin.save();
      console.log(`🎉 Seeded initial admin account successfully!`);
      console.log(`📧 Email: ${adminEmail}`);
      console.log(`🔑 Role: admin`);
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin user:', error);
    process.exit(1);
  }
}

seedAdmin();
