import asyncHandler from 'express-async-handler';
import CallRecord from '../models/callRecordModel.js';
import Lead from '../models/leadModel.js';
import User from '../models/userModel.js';

/**
 * @desc    Get all call records
 * @route   GET /api/call-records
 * @access  Private
 */
export const getCallRecords = asyncHandler(async (req, res) => {
  // For admin, get all call records
  // For telecaller, get only their call records
  const filter = req.user.role === 'admin' ? {} : { telecallerId: req.user._id };
  
  const callRecords = await CallRecord.find(filter).sort({ callDateTime: -1 });
  res.json(callRecords);
});

/**
 * @desc    Get call record by ID
 * @route   GET /api/call-records/:id
 * @access  Private
 */
export const getCallRecordById = asyncHandler(async (req, res) => {
  const callRecord = await CallRecord.findById(req.params.id);
  
  if (callRecord) {
    // Check if user has access to this call record
    if (req.user.role === 'admin' || callRecord.telecallerId.toString() === req.user._id.toString()) {
      res.json(callRecord);
    } else {
      res.status(403);
      throw new Error('Not authorized to access this call record');
    }
  } else {
    res.status(404);
    throw new Error('Call record not found');
  }
});

/**
 * @desc    Create a new call record
 * @route   POST /api/call-records
 * @access  Private
 */
export const createCallRecord = asyncHandler(async (req, res) => {
  const { leadId, callStatus, responseStatus } = req.body;
  
  // Verify the lead exists
  const lead = await Lead.findById(leadId);
  
  if (!lead) {
    res.status(404);
    throw new Error('Lead not found');
  }
  
  // Check if user has access to create call record for this lead
  if (req.user.role !== 'admin' && lead.telecallerId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to create call record for this lead');
  }
  
  const callRecord = await CallRecord.create({
    leadId,
    customerName: lead.name,
    telecallerId: req.user._id,
    telecallerName: req.user.name,
    callStatus,
    responseStatus,
    callDateTime: new Date()
  });
  
  if (callRecord) {
    // Update the lead's status
    lead.callStatus = callStatus;
    lead.responseStatus = responseStatus;
    lead.lastUpdated = new Date();
    await lead.save();
    
    res.status(201).json(callRecord);
  } else {
    res.status(400);
    throw new Error('Invalid call record data');
  }
});

/**
 * @desc    Get call records for a specific lead
 * @route   GET /api/call-records/lead/:leadId
 * @access  Private
 */
export const getCallRecordsByLead = asyncHandler(async (req, res) => {
  const { leadId } = req.params;
  
  // Verify the lead exists
  const lead = await Lead.findById(leadId);
  
  if (!lead) {
    res.status(404);
    throw new Error('Lead not found');
  }
  
  // Check if user has access to view call records for this lead
  if (req.user.role !== 'admin' && lead.telecallerId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to view call records for this lead');
  }
  
  const callRecords = await CallRecord.find({ leadId }).sort({ callDateTime: -1 });
  res.json(callRecords);
});

/**
 * @desc    Get dashboard metrics
 * @route   GET /api/call-records/metrics
 * @access  Private/Admin
 */
export const getDashboardMetrics = asyncHandler(async (req, res) => {
  // Only admin can access dashboard metrics
  if (req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to access dashboard metrics');
  }
  
  try {
    // Use Promise.all to handle multiple async operations efficiently
    const [totalTelecallers, totalCalls, totalCustomers] = await Promise.all([
      // Count total telecallers (excluding admin)
      User.countDocuments({ role: 'telecaller' }),
      // Count total calls
      CallRecord.countDocuments(),
      // Count total customers/leads
      Lead.countDocuments()
    ]);
    
    // Ensure we're returning the exact structure expected by the frontend
    const metrics = {
      totalTelecallers,
      totalCalls,
      totalCustomers
    };
    
    res.json(metrics);
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    res.status(500);
    throw new Error(`Failed to fetch dashboard metrics: ${error.message}`);
  }
});

/**
 * @desc    Get call trends for the past week
 * @route   GET /api/call-records/trends
 * @access  Private/Admin
 */
/**
 * Helper function to fill in missing dates in the trends data
 * @param {Array} trends - Array of trend objects with date and calls
 * @param {Date} startDate - The start date to fill from
 * @returns {Array} - Array with all dates filled in
 */
const fillMissingDates = (trends, startDate) => {
  const filledTrends = [];
  const endDate = new Date(); // Today
  const trendMap = {};
  
  // Create a map of existing trends
  trends.forEach(trend => {
    // Make sure we're using the date string as key
    trendMap[trend.date] = trend.calls;
  });
  
  // Loop through each day and fill in missing dates
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    // Format as YYYY-MM-DD consistently
    const dateStr = currentDate.toISOString().split('T')[0]; 
    filledTrends.push({
      date: dateStr,
      calls: trendMap[dateStr] || 0
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return filledTrends;
};

export const getCallTrends = asyncHandler(async (req, res) => {
  // Only admin can access call trends
  if (req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to access call trends');
  }
  
  try {
    // Get date for 7 days ago
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    // Aggregate call records by date
    const callTrends = await CallRecord.aggregate([
      {
        $match: {
          callDateTime: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$callDateTime' }
          },
          calls: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          date: '$_id',
          calls: 1
        }
      },
      {
        $sort: { date: 1 }
      }
    ]);
    
    // Fill in missing dates with zero calls
    const filledTrends = fillMissingDates(callTrends, sevenDaysAgo);
    
    res.json(filledTrends);
  } catch (error) {
    console.error('Error fetching call trends:', error);
    res.status(500);
    throw new Error(`Failed to fetch call trends: ${error.message}`);
  }
});