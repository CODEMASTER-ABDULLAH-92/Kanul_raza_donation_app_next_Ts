import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  adminId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
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
    trim: true,
    index: true
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
  role: {
    type: String,
    enum: ['admin', 'super_admin'],
    default: 'admin'
  },
  active: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  token: {
    type: String,
    index: true
  },
  permissions: {
    type: [String],
    default: ['manage_staff', 'view_reports', 'export_data', 'system_settings']
  }
}, {
  timestamps: true
});

// Remove sensitive information when converting to JSON
adminSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.token;
  return obj;
};

export default mongoose.models.Admin || mongoose.model('Admin', adminSchema);