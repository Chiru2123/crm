import asyncHandler from 'express-async-handler';
import Lead from '../models/leadModel.js';

/**
 * @desc    Get all leads
 * @route   GET /api/leads
 * @access  Private
 */
export const getLeads = asyncHandler(async (req, res) => {
  // For admin, get all leads
  // For telecaller, get only their assigned leads
  const filter = req.user.role === 'admin' ? {} : { telecallerId: req.user._id };
  
  const leads = await Lead.find(filter);
  res.json(leads);
});

/**
 * @desc    Get lead by ID
 * @route   GET /api/leads/:id
 * @access  Private
 */
export const getLeadById = asyncHandler(async (req, res) => {
  const lead = await Lead.findById(req.params.id);
  
  if (lead) {
    // Check if user has access to this lead
    if (req.user.role === 'admin' || lead.telecallerId.toString() === req.user._id.toString()) {
      res.json(lead);
    } else {
      res.status(403);
      throw new Error('Not authorized to access this lead');
    }
  } else {
    res.status(404);
    throw new Error('Lead not found');
  }
});

/**
 * @desc    Create a new lead
 * @route   POST /api/leads
 * @access  Private
 */
export const createLead = asyncHandler(async (req, res) => {
  const { name, email, phone, address } = req.body;
  
  const lead = await Lead.create({
    name,
    email,
    phone,
    address,
    telecallerId: req.user._id,
    telecallerName: req.user.name
  });
  
  if (lead) {
    res.status(201).json(lead);
  } else {
    res.status(400);
    throw new Error('Invalid lead data');
  }
});

/**
 * @desc    Update a lead
 * @route   PUT /api/leads/:id
 * @access  Private
 */
export const updateLead = asyncHandler(async (req, res) => {
  const lead = await Lead.findById(req.params.id);
  
  if (lead) {
    // Check if user has access to update this lead
    if (req.user.role === 'admin' || lead.telecallerId.toString() === req.user._id.toString()) {
      const { name, email, phone, address, callStatus, responseStatus } = req.body;
      
      lead.name = name || lead.name;
      lead.email = email || lead.email;
      lead.phone = phone || lead.phone;
      lead.address = address || lead.address;
      
      // Only update call status if provided
      if (callStatus) {
        lead.callStatus = callStatus;
      }
      
      // Only update response status if provided
      if (responseStatus) {
        lead.responseStatus = responseStatus;
      }
      
      // Update last updated timestamp
      lead.lastUpdated = Date.now();
      
      const updatedLead = await lead.save();
      res.json(updatedLead);
    } else {
      res.status(403);
      throw new Error('Not authorized to update this lead');
    }
  } else {
    res.status(404);
    throw new Error('Lead not found');
  }
});

/**
 * @desc    Delete a lead
 * @route   DELETE /api/leads/:id
 * @access  Private
 */
export const deleteLead = asyncHandler(async (req, res) => {
  const lead = await Lead.findById(req.params.id);
  
  if (lead) {
    // Check if user has access to delete this lead
    if (req.user.role === 'admin' || lead.telecallerId.toString() === req.user._id.toString()) {
      await lead.deleteOne();
      res.json({ message: 'Lead removed' });
    } else {
      res.status(403);
      throw new Error('Not authorized to delete this lead');
    }
  } else {
    res.status(404);
    throw new Error('Lead not found');
  }
});

/**
 * @desc    Update lead call status
 * @route   PUT /api/leads/:id/status
 * @access  Private
 */
export const updateLeadStatus = asyncHandler(async (req, res) => {
  const lead = await Lead.findById(req.params.id);
  
  if (lead) {
    // Check if user has access to update this lead
    if (req.user.role === 'admin' || lead.telecallerId.toString() === req.user._id.toString()) {
      const { callStatus, responseStatus } = req.body;
      
      lead.callStatus = callStatus;
      lead.responseStatus = responseStatus;
      lead.lastUpdated = Date.now();
      
      const updatedLead = await lead.save();
      res.json(updatedLead);
    } else {
      res.status(403);
      throw new Error('Not authorized to update this lead');
    }
  } else {
    res.status(404);
    throw new Error('Lead not found');
  }
});