import express from 'express';
import {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  updateLeadStatus
} from '../controllers/leadController.js';
import { protect, admin, telecaller } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.route('/')
  .get(protect, getLeads)
  .post(protect, createLead);

router.route('/:id')
  .get(protect, getLeadById)
  .put(protect, updateLead)
  .delete(protect, deleteLead);

// Update lead status route
router.route('/:id/status')
  .put(protect, updateLeadStatus);

export default router;