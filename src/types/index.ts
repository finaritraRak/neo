// Common types used throughout the application

export type Status = 'draft' | 'sent' | 'paid' | 'overdue';

export interface Address {
  street: string;
  city: string;
  postal: string;
  country: string;
}

export interface Company {
  name: string;
  siret: string;
  vatNumber: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: Address;
  company: Company;
  paymentTerms: number;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
  total: number;
}

export interface InvoiceTotals {
  subtotal: number;
  vatAmount: number;
  total: number;
  discount: number;
}

export interface InvoiceDates {
  created: string;
  due: string;
  paid: string | null;
}

export interface Invoice {
  id: string;
  number: string;
  clientId: string;
  status: Status;
  dates: InvoiceDates;
  items: InvoiceItem[];
  totals: InvoiceTotals;
  template: string;
  notes: string;
  paymentTerms: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentInfo {
  iban: string;
  bic: string;
  paypalEmail: string;
}

export interface InvoiceSettings {
  prefix: string;
  startNumber: number;
  vatRate: number;
}

export interface BusinessProfile {
  name: string;
  logo: string;
  email: string;
  phone: string;
  address: Address;
  legal: {
    siret: string;
    vatNumber: string;
    rcs: string;
  };
  invoiceSettings: InvoiceSettings;
  paymentInfo: PaymentInfo;
}

export type InvoiceTemplate = 'classic' | 'modern' | 'corporate' | 'creative' | 'minimal';