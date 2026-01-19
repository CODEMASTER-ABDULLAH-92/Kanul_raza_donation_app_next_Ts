
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
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 1
  },
  charityType: {
    type: String,
    required: true,
    enum: ['sadaqah', 'zakat', 'sadaqah_nafilah', 'general']
  },
  category: {
    type: String,
    required: true,
    enum: [
      'boys_madrasa', 
      'girls_madrasa', 
      'masjid', 
      'cement', 
      'islamic_books', 
      'construction', 
      'ration', 
      'food_distribution'
    ]
  },
  notes: {
    type: String,
    default: ''
  },

  staffName: {
    type: String,
    required: true
  },
  sendEmail: {
    type: Boolean,
    default: true
  },
  sendSMS: {
    type: Boolean,
    default: false
  },
  emailSent: {
    type: Boolean,
    default: false
  },
  smsSent: {
    type: Boolean,
    default: false
  },
  receiptNumber: {
    type: String,
    unique: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processed'],
    default: 'confirmed'
  }
}, {
  timestamps: true
});

// Generate receipt number - SIMPLIFIED VERSION
donationSchema.pre('save', function() {
  try {
    if (!this.receiptNumber) {
      const timestamp = Date.now().toString().slice(-6);
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      const date = new Date();
      const dateStr = date.getFullYear().toString().slice(-2) + 
                     (date.getMonth() + 1).toString().padStart(2, '0') + 
                     date.getDate().toString().padStart(2, '0');
      
      this.receiptNumber = `DON-${dateStr}-${timestamp}${random}`;
    }
    // next();
  } catch (error) {
    console.error('Error generating receipt number:', error);
    // next(error);
  }
});

export default mongoose.models.Donation || mongoose.model('Donation', donationSchema);