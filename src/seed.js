
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';

dotenv.config();

const run = async () => {
  await connectDB();

  await User.deleteMany({
    email: {
      $in: ['admin@test.com', 'agent@test.com', 'citizen@test.com']
    }
  });

  await User.create([
    { name: 'Admin', email: 'admin@test.com', password: 'password123', role: 'admin' },
    { name: 'Agent', email: 'agent@test.com', password: 'password123', role: 'agent' },
    { name: 'Citoyen', email: 'citizen@test.com', password: 'password123', role: 'citizen' },
  ]);

  console.log('✅ Comptes créés : admin@test.com / agent@test.com / citizen@test.com (password123)');

  await mongoose.connection.close();
  process.exit(0);
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
