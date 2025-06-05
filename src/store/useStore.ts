import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import { format, addDays } from 'date-fns';
import type {
  Client,
  Invoice,
  InvoiceItem,
  BusinessProfile,
  InvoiceTemplate,
  Status
} from '../types';

interface State {
  clients: Client[];
  invoices: Invoice[];
  businessProfile: BusinessProfile;
  activeTemplate: InvoiceTemplate;
  
  // Client actions
  addClient: (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateClient: (id: string, client: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  getClient: (id: string) => Client | undefined;
  
  // Invoice actions
  createInvoice: (invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateInvoice: (id: string, invoice: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  getInvoice: (id: string) => Invoice | undefined;
  updateInvoiceStatus: (id: string, status: Status) => void;
  
  // Invoice items actions
  addInvoiceItem: (invoiceId: string, item: Omit<InvoiceItem, 'id' | 'total'>) => void;
  updateInvoiceItem: (invoiceId: string, itemId: string, item: Partial<InvoiceItem>) => void;
  removeInvoiceItem: (invoiceId: string, itemId: string) => void;
  
  // Business profile actions
  updateBusinessProfile: (profile: Partial<BusinessProfile>) => void;
  
  // Template actions
  setActiveTemplate: (template: InvoiceTemplate) => void;
  
  // Utility methods
  generateInvoiceNumber: () => string;
  calculateInvoiceTotals: (items: InvoiceItem[]) => { subtotal: number; vatAmount: number; total: number; discount: number };
}

// Default business profile
const defaultBusinessProfile: BusinessProfile = {
  name: 'Your Business Name',
  logo: '',
  email: 'contact@yourbusiness.com',
  phone: '+33 1 23 45 67 89',
  address: {
    street: '123 Business Street',
    city: 'Paris',
    postal: '75001',
    country: 'France'
  },
  legal: {
    siret: '12345678900012',
    vatNumber: 'FR12345678900',
    rcs: 'Paris B 123 456 789'
  },
  invoiceSettings: {
    prefix: 'INV-',
    startNumber: 1001,
    vatRate: 20
  },
  paymentInfo: {
    iban: 'FR76 1234 5678 9012 3456 7890 123',
    bic: 'ABCDEFGHXXX',
    paypalEmail: 'payments@yourbusiness.com'
  }
};

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      clients: [],
      invoices: [],
      businessProfile: defaultBusinessProfile,
      activeTemplate: 'classic',
      
      // Client actions
      addClient: (client) => {
        const id = nanoid();
        const now = new Date().toISOString();
        
        set((state) => ({
          clients: [
            ...state.clients,
            {
              ...client,
              id,
              createdAt: now,
              updatedAt: now
            }
          ]
        }));
        
        return id;
      },
      
      updateClient: (id, client) => {
        set((state) => ({
          clients: state.clients.map((c) => 
            c.id === id ? { ...c, ...client, updatedAt: new Date().toISOString() } : c
          )
        }));
      },
      
      deleteClient: (id) => {
        set((state) => ({
          clients: state.clients.filter((client) => client.id !== id)
        }));
      },
      
      getClient: (id) => {
        return get().clients.find((client) => client.id === id);
      },
      
      // Invoice actions
      createInvoice: (invoice) => {
        const id = nanoid();
        const now = new Date().toISOString();
        
        set((state) => ({
          invoices: [
            ...state.invoices,
            {
              ...invoice,
              id,
              createdAt: now,
              updatedAt: now
            }
          ]
        }));
        
        return id;
      },
      
      updateInvoice: (id, invoice) => {
        set((state) => ({
          invoices: state.invoices.map((inv) => 
            inv.id === id ? { ...inv, ...invoice, updatedAt: new Date().toISOString() } : inv
          )
        }));
      },
      
      deleteInvoice: (id) => {
        set((state) => ({
          invoices: state.invoices.filter((invoice) => invoice.id !== id)
        }));
      },
      
      getInvoice: (id) => {
        return get().invoices.find((invoice) => invoice.id === id);
      },
      
      updateInvoiceStatus: (id, status) => {
        set((state) => ({
          invoices: state.invoices.map((invoice) => 
            invoice.id === id 
              ? { 
                  ...invoice, 
                  status,
                  // If status is paid, set the paid date
                  dates: status === 'paid' 
                    ? { ...invoice.dates, paid: new Date().toISOString() } 
                    : invoice.dates,
                  updatedAt: new Date().toISOString()
                } 
              : invoice
          )
        }));
      },
      
      // Invoice items actions
      addInvoiceItem: (invoiceId, item) => {
        const invoice = get().getInvoice(invoiceId);
        if (!invoice) return;
        
        const newItem = {
          ...item,
          id: nanoid(),
          total: item.quantity * item.unitPrice
        };
        
        const updatedItems = [...invoice.items, newItem];
        const totals = get().calculateInvoiceTotals(updatedItems);
        
        get().updateInvoice(invoiceId, { 
          items: updatedItems,
          totals
        });
      },
      
      updateInvoiceItem: (invoiceId, itemId, item) => {
        const invoice = get().getInvoice(invoiceId);
        if (!invoice) return;
        
        const updatedItems = invoice.items.map((i) => {
          if (i.id === itemId) {
            const updatedItem = { ...i, ...item };
            // Recalculate the total for this item
            updatedItem.total = updatedItem.quantity * updatedItem.unitPrice;
            return updatedItem;
          }
          return i;
        });
        
        const totals = get().calculateInvoiceTotals(updatedItems);
        
        get().updateInvoice(invoiceId, { 
          items: updatedItems,
          totals
        });
      },
      
      removeInvoiceItem: (invoiceId, itemId) => {
        const invoice = get().getInvoice(invoiceId);
        if (!invoice) return;
        
        const updatedItems = invoice.items.filter((item) => item.id !== itemId);
        const totals = get().calculateInvoiceTotals(updatedItems);
        
        get().updateInvoice(invoiceId, { 
          items: updatedItems,
          totals
        });
      },
      
      // Business profile actions
      updateBusinessProfile: (profile) => {
        set((state) => ({
          businessProfile: {
            ...state.businessProfile,
            ...profile
          }
        }));
      },
      
      // Template actions
      setActiveTemplate: (template) => {
        set({ activeTemplate: template });
      },
      
      // Utility methods
      generateInvoiceNumber: () => {
        const { prefix, startNumber } = get().businessProfile.invoiceSettings;
        const invoicesCount = get().invoices.length;
        return `${prefix}${startNumber + invoicesCount}`;
      },
      
      calculateInvoiceTotals: (items) => {
        const subtotal = items.reduce((sum, item) => sum + item.total, 0);
        
        // For now, we're not implementing discounts, but the structure is ready
        const discount = 0;
        const subtotalAfterDiscount = subtotal - discount;
        
        // Calculate VAT amount for each item based on its VAT rate
        const vatAmount = items.reduce((sum, item) => {
          return sum + (item.total * (item.vatRate / 100));
        }, 0);
        
        const total = subtotalAfterDiscount + vatAmount;
        
        return {
          subtotal,
          vatAmount,
          total,
          discount
        };
      }
    }),
    {
      name: 'invoice-generator-storage'
    }
  )
);

// Helper to create a new invoice with default values
export const createNewInvoice = (clientId: string, template: InvoiceTemplate = 'classic') => {
  const store = useStore.getState();
  const client = store.getClient(clientId);
  
  if (!client) {
    throw new Error('Client not found');
  }
  
  const today = new Date();
  const invoiceNumber = store.generateInvoiceNumber();
  const dueDate = addDays(today, client.paymentTerms);
  
  return {
    number: invoiceNumber,
    clientId,
    status: 'draft' as Status,
    dates: {
      created: today.toISOString(),
      due: dueDate.toISOString(),
      paid: null
    },
    items: [],
    totals: {
      subtotal: 0,
      vatAmount: 0,
      total: 0,
      discount: 0
    },
    template,
    notes: '',
    paymentTerms: client.paymentTerms,
    createdAt: today.toISOString(),
    updatedAt: today.toISOString()
  };
};