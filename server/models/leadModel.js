import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required']
  },
  address: {
    type: String,
    required: [true, 'Address is required']
  },
  callStatus: {
    type: String,
    enum: ['connected', 'not_connected'],
    required: false
  },
  responseStatus: {
    type: String,
    enum: ['discussed', 'callback', 'interested', 'busy', 'rnr', 'switched_off'],
    required: false
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  telecallerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  telecallerName: {
    type: String
  }
}, {
  timestamps: true
});

const Lead = mongoose.model('Lead', leadSchema);

export default Lead;