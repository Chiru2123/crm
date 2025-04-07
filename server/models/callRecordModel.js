import mongoose from 'mongoose';

const callRecordSchema = new mongoose.Schema({
  leadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lead',
    required: true
  },
  customerName: {
    type: String,
    required: true
  },
  telecallerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  telecallerName: {
    type: String,
    required: true
  },
  callStatus: {
    type: String,
    enum: ['connected', 'not_connected'],
    required: true
  },
  responseStatus: {
    type: String,
    enum: ['discussed', 'callback', 'interested', 'busy', 'rnr', 'switched_off'],
    required: true
  },
  callDateTime: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const CallRecord = mongoose.model('CallRecord', callRecordSchema);

export default CallRecord;