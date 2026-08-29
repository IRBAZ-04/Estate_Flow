const User = require('../models/User');

/**
 * Ensures a default system administrator exists in the database
 */
const seedAdminUser = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@estateflow.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';

    const existingAdmin = await User.findOne({ email: adminEmail.toLowerCase() });

    if (!existingAdmin) {
      await User.create({
        name: 'System Administrator',
        email: adminEmail.toLowerCase(),
        phone: '+91 99999 88888',
        password: adminPassword,
        role: 'admin',
        status: 'active',
      });
      console.log(`[Admin Seeder] Default Admin account created: ${adminEmail}`);
    }
  } catch (error) {
    console.error('[Admin Seeder Error]:', error.message);
  }
};

module.exports = seedAdminUser;
