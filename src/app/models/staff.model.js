import mongoose from 'mongoose';

const staffSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  // role: {
  //   type: String,
  //   enum: ['collector', 'supervisor', 'admin'],
  //   default: 'collector'
  // },
  active: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  token: {
    type: String
  }
}, {
  timestamps: true
});

// Method to safely return staff data without sensitive info
staffSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.token;
  return obj;
};

export default mongoose.models.Staff || mongoose.model('Staff', staffSchema);