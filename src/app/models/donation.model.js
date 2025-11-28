// models/Donation.js
import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
  donorName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  donationType: {
    type: String,
    required: true,
    enum: ['money', 'rashan', 'clothes', 'books', 'furniture', 'other']
  },
  amount: {
    type: Number,
    required: function() {
      return this.donationType === 'money';
    }
  },
  description: {
    type: String,
    required: true
  },
  purpose: {
    type: String,
    required: true,
    enum: ['masjid', 'girls-madrass', 'boys-madrass', 'rashan-program', 'general']
  },
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'confirmed', 'delivered']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Donation || mongoose.model('Donation', donationSchema);