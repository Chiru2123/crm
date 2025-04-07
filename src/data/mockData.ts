
import { User, Lead, CallRecord, DashboardMetrics, CallTrend } from '../types/types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'user1',
    name: 'Admin User',
    email: 'admin@leadnexus.com',
    role: 'admin',
    avatar: '/placeholder.svg',
  },
  {
    id: 'user2',
    name: 'Sarah Johnson',
    email: 'sarah@leadnexus.com',
    role: 'telecaller',
    avatar: '/placeholder.svg',
  },
  {
    id: 'user3',
    name: 'Mike Peterson',
    email: 'mike@leadnexus.com',
    role: 'telecaller',
    avatar: '/placeholder.svg',
  },
  {
    id: 'user4',
    name: 'Emily Richards',
    email: 'emily@leadnexus.com',
    role: 'telecaller',
    avatar: '/placeholder.svg',
  },
];

// Mock Leads
export const mockLeads: Lead[] = [
  {
    id: 'lead1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '555-123-4567',
    address: '123 Main St, Boston, MA',
    callStatus: 'connected',
    responseStatus: 'interested',
    lastUpdated: new Date('2025-04-05T10:30:00'),
    telecallerId: 'user2',
    telecallerName: 'Sarah Johnson',
  },
  {
    id: 'lead2',
    name: 'Mary Johnson',
    email: 'mary.johnson@example.com',
    phone: '555-234-5678',
    address: '456 Oak Ave, Chicago, IL',
    callStatus: 'not_connected',
    responseStatus: 'rnr',
    lastUpdated: new Date('2025-04-05T11:45:00'),
    telecallerId: 'user2',
    telecallerName: 'Sarah Johnson',
  },
  {
    id: 'lead3',
    name: 'Robert Brown',
    email: 'robert.brown@example.com',
    phone: '555-345-6789',
    address: '789 Pine St, San Francisco, CA',
    callStatus: 'connected',
    responseStatus: 'callback',
    lastUpdated: new Date('2025-04-04T14:15:00'),
    telecallerId: 'user3',
    telecallerName: 'Mike Peterson',
  },
  {
    id: 'lead4',
    name: 'Patricia Davis',
    email: 'patricia.davis@example.com',
    phone: '555-456-7890',
    address: '101 Maple Rd, New York, NY',
    callStatus: 'connected',
    responseStatus: 'discussed',
    lastUpdated: new Date('2025-04-04T16:30:00'),
    telecallerId: 'user3',
    telecallerName: 'Mike Peterson',
  },
  {
    id: 'lead5',
    name: 'James Wilson',
    email: 'james.wilson@example.com',
    phone: '555-567-8901',
    address: '202 Cedar Ln, Seattle, WA',
    callStatus: 'not_connected',
    responseStatus: 'busy',
    lastUpdated: new Date('2025-04-03T09:10:00'),
    telecallerId: 'user4',
    telecallerName: 'Emily Richards',
  },
  {
    id: 'lead6',
    name: 'Jennifer Garcia',
    email: 'jennifer.garcia@example.com',
    phone: '555-678-9012',
    address: '303 Birch Dr, Miami, FL',
    callStatus: 'not_connected',
    responseStatus: 'switched_off',
    lastUpdated: new Date('2025-04-03T13:20:00'),
    telecallerId: 'user4',
    telecallerName: 'Emily Richards',
  },
  {
    id: 'lead7',
    name: 'David Miller',
    email: 'david.miller@example.com',
    phone: '555-789-0123',
    address: '404 Elm Blvd, Austin, TX',
    telecallerId: 'user2',
    telecallerName: 'Sarah Johnson',
  },
];

// Mock Call Records - only connected calls
export const mockCallRecords: CallRecord[] = [
  {
    id: 'call1',
    leadId: 'lead1',
    customerName: 'John Smith',
    telecallerId: 'user2',
    telecallerName: 'Sarah Johnson',
    callStatus: 'connected',
    responseStatus: 'interested',
    callDateTime: new Date('2025-04-05T10:30:00'),
  },
  {
    id: 'call2',
    leadId: 'lead3',
    customerName: 'Robert Brown',
    telecallerId: 'user3',
    telecallerName: 'Mike Peterson',
    callStatus: 'connected',
    responseStatus: 'callback',
    callDateTime: new Date('2025-04-04T14:15:00'),
  },
  {
    id: 'call3',
    leadId: 'lead4',
    customerName: 'Patricia Davis',
    telecallerId: 'user3',
    telecallerName: 'Mike Peterson',
    callStatus: 'connected',
    responseStatus: 'discussed',
    callDateTime: new Date('2025-04-04T16:30:00'),
  },
];

// Mock Dashboard Metrics
export const mockDashboardMetrics: DashboardMetrics = {
  totalTelecallers: 3,
  totalCalls: mockLeads.filter(lead => lead.callStatus).length,
  totalCustomers: mockLeads.length,
};

// Mock Call Trends for the past week
export const mockCallTrends: CallTrend[] = [
  { date: '2025-03-31', calls: 12 },
  { date: '2025-04-01', calls: 18 },
  { date: '2025-04-02', calls: 15 },
  { date: '2025-04-03', calls: 22 },
  { date: '2025-04-04', calls: 26 },
  { date: '2025-04-05', calls: 20 },
  { date: '2025-04-06', calls: 8 },
];
