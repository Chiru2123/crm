
export type Role = 'admin' | 'telecaller';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  password?: string;
  confirmPassword?: string;
}

export interface RegisterUserData {
  name: string;
  email: string;
  password: string;
  role: Role;
}

export type CallStatus = 'connected' | 'not_connected';

export type ConnectedResponse = 'discussed' | 'callback' | 'interested';

export type NotConnectedResponse = 'busy' | 'rnr' | 'switched_off';

export type ResponseStatus = ConnectedResponse | NotConnectedResponse;

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  callStatus?: CallStatus;
  responseStatus?: ResponseStatus;
  lastUpdated?: Date;
  telecallerId?: string;
  telecallerName?: string;
}

export interface CallRecord {
  id: string;
  _id?: string; // MongoDB ObjectId as string
  leadId: string;
  customerName: string;
  telecallerId: string;
  telecallerName: string;
  callStatus: CallStatus;
  responseStatus: ResponseStatus;
  callDateTime: Date;
}

export interface DashboardMetrics {
  totalTelecallers: number;
  totalCalls: number;
  totalCustomers: number;
}

export interface CallTrend {
  date: string;
  calls: number;
}
