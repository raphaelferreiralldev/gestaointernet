export type ClientStatus = 'active' | 'suspended' | 'cancelled';
export type ConnectionStatus = 'online' | 'offline';
export type InvoiceStatus = 'paid' | 'pending' | 'overdue';
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';
export type TicketCategory = 'connection' | 'billing' | 'equipment' | 'other';
export type Technology = 'Fibra' | 'Radio' | 'Cabo';

export interface Client {
  id: string;
  name: string;
  cpf: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  planId: string;
  planName: string;
  status: ClientStatus;
  connectionStatus: ConnectionStatus;
  joinDate: string;
  ip: string;
  downloadUsage: number;
  uploadUsage: number;
  mac: string;
}

export interface Plan {
  id: string;
  name: string;
  download: number;
  upload: number;
  price: number;
  clientCount: number;
  technology: Technology;
  active: boolean;
}

export interface Invoice {
  id: string;
  clientId: string;
  clientName: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: InvoiceStatus;
  month: string;
  description: string;
}

export interface Ticket {
  id: string;
  clientId: string;
  clientName: string;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: string;
  updatedAt: string;
  category: TicketCategory;
}

export interface NetworkEvent {
  id: string;
  type: 'outage' | 'degraded' | 'maintenance' | 'resolved';
  description: string;
  affectedClients: number;
  startTime: string;
  endTime?: string;
  region: string;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  value2?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'support' | 'financial';
  avatar?: string;
}
