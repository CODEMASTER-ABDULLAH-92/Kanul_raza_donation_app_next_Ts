import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
  // Donor Information
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

  // Charity Type (Main Category)
  charityType: {
    type: String,
    required: true,
    enum: ['sadaqah', 'zakat', 'usher', 'general']
  },

  // Sadaqah Sub-type (only for sadaqah)
  sadaqahType: {
    type: String,
    enum: ['wajibah', 'naflah', null],
    default: null
  },

  // Main Category Selection
  category: {
    type: String,
    enum: [
      // Wajibah Categories
      'qasam_ka_kaffara',
      'sadaqat_ul_fitr',
      
      // Naflah Categories
      'boys_madrasa',
      'girls_madrasa',
      'masjid',
      'islamic_books',
      'construction',
      'ration',
      'food_distribution',
      'water_wells',
      'medical_aid',
      'education_support',
      'orphan_support',
      'tree_plantation',
      'marriage_aid',
      'funeral_expenses',
      'debt_relief',
      'animal_sacrifice'
    ],
    required: function() {
      // Category is required for all except zakat
      return this.charityType !== 'zakat';
    }
  },

  // Animal Type (for animal sacrifice)
  animalType: {
    type: String,
    enum: ['bakra', 'gaaye', 'murghi', 'anda', null],
    default: null,
    required: function() {
      return this.category === 'animal_sacrifice';
    }
  },

  // Usher Type (for usher charity)
  usherType: {
    type: String,
    enum: ['gandum', 'sabziyan', 'kheti', 'phal', null],
    default: null,
    required: function() {
      return this.charityType === 'usher';
    }
  },

  // Additional Notes
  notes: {
    type: String,
    default: ''
  },

  // Staff Information
  staffName: {
    type: String,
    required: true
  },
  staffEmail: {
    type: String,
    required: true
  },

  // Notification Settings
  sendEmail: {
    type: Boolean,
    default: true
  },
  emailSent: {
    type: Boolean,
    default: false
  },

  // Receipt Information
  receiptNumber: {
    type: String,
    unique: true,
    sparse: true // Allows multiple null values
  },
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processed', 'cancelled'],
    default: 'confirmed'
  }
}, {
  timestamps: true
});

// Generate receipt number with category prefix - WITHOUT next() callback
donationSchema.pre('save', function() {
  try {
    if (!this.receiptNumber) {
      const timestamp = Date.now().toString().slice(-6);
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      const date = new Date();
      const dateStr = date.getFullYear().toString().slice(-2) + 
                     (date.getMonth() + 1).toString().padStart(2, '0') + 
                     date.getDate().toString().padStart(2, '0');
      
      // Add category prefix to receipt number
      let prefix = 'DON';
      switch(this.charityType) {
        case 'sadaqah':
          prefix = 'SDQ';
          break;
        case 'zakat':
          prefix = 'ZKT';
          break;
        case 'usher':
          prefix = 'USR';
          break;
        case 'general':
          prefix = 'GEN';
          break;
      }
      
      // Add sadaqah sub-type if applicable
      if (this.charityType === 'sadaqah' && this.sadaqahType) {
        prefix = this.sadaqahType === 'wajibah' ? 'SDW' : 'SDN';
      }
      
      // Add animal type indicator for animal sacrifice
      if (this.category === 'animal_sacrifice' && this.animalType) {
        const animalCode = {
          'bakra': 'GT',
          'gaaye': 'CW',
          'murghi': 'CH',
          'anda': 'EG'
        }[this.animalType] || '';
        prefix = prefix + animalCode;
      }
      
      this.receiptNumber = `${prefix}-${dateStr}-${timestamp}${random}`;
    }
    // No need to call next() - in modern Mongoose with async/await, just return
  } catch (error) {
    console.error('Error generating receipt number:', error);
    throw error; // Throw error instead of passing to next()
  }
});

// Indexes for better query performance
donationSchema.index({ receiptNumber: 1 });
donationSchema.index({ charityType: 1, createdAt: -1 });
donationSchema.index({ phone: 1 });
donationSchema.index({ email: 1 });
donationSchema.index({ status: 1 });
donationSchema.index({ category: 1 });
donationSchema.index({ createdAt: -1 });

// Virtual for formatted amount
donationSchema.virtual('formattedAmount').get(function() {
  return `PKR ${this.amount.toLocaleString()}`;
});

// Method to get category display name
donationSchema.methods.getCategoryDisplay = function() {
  const categoryMap = {
    // Wajibah
    'qasam_ka_kaffara': 'Qasam ka Kaffara',
    'sadaqat_ul_fitr': 'Sadaqat ul Fitr',
    
    // Naflah & General
    'boys_madrasa': 'Boys Madrasa',
    'girls_madrasa': 'Girls Madrasa',
    'masjid': 'Masjid Construction',
    'islamic_books': 'Islamic Books',
    'construction': 'Construction Work',
    'ration': 'Poor Families Support',
    'food_distribution': 'Food Distribution',
    'water_wells': 'Water Wells',
    'medical_aid': 'Medical Aid',
    'education_support': 'Education Support',
    'orphan_support': 'Orphan Support',
    'tree_plantation': 'Tree Plantation',
    'marriage_aid': 'Marriage Aid',
    'funeral_expenses': 'Funeral Expenses',
    'debt_relief': 'Debt Relief',
    'animal_sacrifice': 'Animal Sacrifice'
  };
  return categoryMap[this.category] || this.category;
};

// Method to get animal display name
donationSchema.methods.getAnimalDisplay = function() {
  const animalMap = {
    'bakra': 'Bakra (Goat)',
    'gaaye': 'Gaaye (Cow)',
    'murghi': 'Murghi (Chicken)',
    'anda': 'Anda (Eggs)'
  };
  return animalMap[this.animalType] || this.animalType;
};

// Method to get usher display name
donationSchema.methods.getUsherDisplay = function() {
  const usherMap = {
    'gandum': 'Gandum (Wheat)',
    'sabziyan': 'Sabziyan (Vegetables)',
    'kheti': 'Kheti (Farming)',
    'phal': 'Phal (Fruits)'
  };
  return usherMap[this.usherType] || this.usherType;
};

// Static method to get summary by charity type
donationSchema.statics.getSummaryByType = async function(startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate },
        status: { $ne: 'cancelled' }
      }
    },
    {
      $group: {
        _id: '$charityType',
        totalAmount: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    }
  ]);
};

// Static method to get category summary
donationSchema.statics.getCategorySummary = async function(charityType, startDate, endDate) {
  const matchStage = {
    createdAt: { $gte: startDate, $lte: endDate },
    status: { $ne: 'cancelled' }
  };
  
  if (charityType) {
    matchStage.charityType = charityType;
  }
  
  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$category',
        totalAmount: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    },
    { $sort: { totalAmount: -1 } }
  ]);
};

// Static method to get animal sacrifice summary
donationSchema.statics.getAnimalSacrificeSummary = async function(startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        category: 'animal_sacrifice',
        animalType: { $ne: null },
        createdAt: { $gte: startDate, $lte: endDate },
        status: { $ne: 'cancelled' }
      }
    },
    {
      $group: {
        _id: '$animalType',
        totalAmount: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    }
  ]);
};

// Static method to get usher summary
donationSchema.statics.getUsherSummary = async function(startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        charityType: 'usher',
        usherType: { $ne: null },
        createdAt: { $gte: startDate, $lte: endDate },
        status: { $ne: 'cancelled' }
      }
    },
    {
      $group: {
        _id: '$usherType',
        totalAmount: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    }
  ]);
};

// Create and export the model
const Donation = mongoose.models.Donation || mongoose.model('Donation', donationSchema);
export default Donation;