import express from 'express';
import {
  getCallRecords,
  getCallRecordById,
  createCallRecord,
  getCallRecordsByLead,
  getDashboardMetrics,
  getCallTrends
} from '../controllers/callRecordController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import mongoose from 'mongoose';

const router = express.Router();

// Middleware to validate if a parameter is a valid MongoDB ObjectId
// This will prevent Express from trying to match non-ObjectId routes to the /:id pattern
const validateObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: `Invalid ID format: ${req.params.id}` });
  }
  next();
};

// All routes are protected
router.route('/')
  .get(protect, getCallRecords)
  .post(protect, createCallRecord);

// Define specific routes first with explicit paths to avoid ObjectId conversion issues
// Dashboard metrics and trends (admin only)
router.get('/metrics', protect, admin, getDashboardMetrics);
router.get('/trends', protect, admin, getCallTrends);

// Get call records for a specific lead
router.route('/lead/:leadId')
  .get(protect, getCallRecordsByLead);

// Get call record by ID - this must be last to avoid conflicts with named routes
// All other specific routes should be defined before this catch-all route
// Add validateObjectId middleware to ensure the id parameter is a valid ObjectId
router.route('/:id')
  .get(protect, validateObjectId, getCallRecordById);

export default router;