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
});

const User = model('user', UserSchema);
export default User; // Changed from module.exports