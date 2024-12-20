import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  telegramId: { type: String, required: true, unique: true },
  username: String,
  points: { type: Number, default: 0 },
  level: { type: Number, default: 0 },
  lastDaily: Date,
  lastCipher: Date,
  lastCombo: Date
});

export const User = mongoose.model('User', userSchema); 