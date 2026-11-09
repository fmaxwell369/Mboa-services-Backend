import mongoose from 'mongoose';
import User from './models/User.js';

try {
  await mongoose.connect('mongodb://127.0.0.1:27017/certifdoc', {
    serverSelectionTimeoutMS: 5000
  });

  console.log('MongoDB connecté');

  const user = await User.findOne({
    email: 'maxwellfonou@gmail.com'
  });

  if (!user) {
    console.log('Aucun compte trouvé avec cet email.');
  } else {
    user.role = 'admin';
    await user.save();

    console.log('Compte administrateur activé :');
    console.log({
      email: user.email,
      role: user.role
    });
  }

  await mongoose.disconnect();
} catch (error) {
  console.error('ERREUR :', error.message);
  process.exitCode = 1;
}
