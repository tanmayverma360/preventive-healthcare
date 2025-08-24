import mongoose from 'mongoose';
const { Schema, model } = mongoose;

// Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  healthData: [{
    date: {
      type: Date,
      default: Date.now,
    },
    sleep: Number,
    steps: Number,
    water: Number,
    stress: Number,
    risk: String,
  }],
  nutrition: [{
    date: { type: Date, default: Date.now },
    mealType: { type: String, enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack'], required: true },
    description: { type: String, required: true },
    balance: { type: String, default: 'Balanced' }
  }],
});

const User = model('user', UserSchema);
export default User; // Changed from module.exports