
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, default: 'user' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB...');

  await User.deleteMany({});
  console.log('Cleared existing users...');

  const hashedPassword = await bcrypt.hash('admin123', 10);

  await User.create({
    name: 'Admin',
    email: 'admin@gmail.com',
    password: hashedPassword,
    role: 'admin',
    isActive: true,
  });

  for (let i = 1; i <= 5; i++) {
    const pw = await bcrypt.hash('user123', 10);
    await User.create({
      name: `User${i}`,
      email: `user${i}@example.com`,
      password: pw,
      role: 'user',
      isActive: true,
    });
  }

  console.log('✅ Seed complete! Admin: admin@example.com / admin123');
  mongoose.connection.close();
};

seed().catch(console.error)