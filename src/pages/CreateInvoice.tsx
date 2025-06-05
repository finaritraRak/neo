import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useStore } from '../store/useStore';
import { createNewInvoice } from '../store/useStore';
import PageHeader from '../components/ui/PageHeader';
import ClientSelector from '../components/invoice/ClientSelector';
import InvoiceItemsList from '../components/invoice/InvoiceItemsList';
import TemplateSelector from '../components/invoice/TemplateSelector';
import FormField from '../components/ui/FormField';
import { Client, InvoiceTemplate, InvoiceItem } from '../types';

// Steps for creating an invoice
const STEPS = [
  { id: 'client', name: 'Client' },
  { id: 'items', name: 'Items' },
  { id: 'details', name: 'Details' },
  { id: 'preview', name: 'Preview' },
];

const CreateInvoice = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { clients, createInvoice } = useStore();
  
  // Get client ID from URL if provided
  const params = new URLSearchParams(location.search);
  const initialClientId = params.get('client');
  
  const [currentStep, setCurrentStep] = useState('client');
  const [selectedClientId, setSelectedClientId] = useState(initialClientId);
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  const [template, setTemplate] = useState<InvoiceTemplate>('classic');
  const [notes, setNotes] = useState('');
  
  // Handle client selection
  const handleClientSelect = (client: Client) => {
    setSelectedClientId(client.id);
  };
  
  // Handle next step
  const handleNextStep = () => {
    const currentIndex = STEPS.findIndex((step) => step.id === currentStep);
    if (currentIndex < STEPS.length - 1) {
      setCurrentStep(STEPS[currentIndex + 1].id);
    }
  };
  
  // Handle previous step
  const handlePreviousStep = () => {
    const currentIndex = STEPS.findIndex((step) => step.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(STEPS[currentIndex - 1].id);
    }
  };
  
  // Create the invoice
  const handleCreateInvoice = () => {
    if (!selectedClientId || invoiceItems.length === 0) {
      alert('Please select a client and add at least one item.');
      return;
    }
    
    try {
      // Create a new invoice with default values
      const newInvoice = createNewInvoice(selectedClientId, template);
      
      // Add our items and notes
      newInvoice.items = invoiceItems;
      newInvoice.notes = notes;
      
      // Calculate totals
      const subtotal = invoiceItems.reduce((sum, item) => sum + item.total, 0);
      const vatAmount = invoiceItems.reduce(
        (sum, item) => sum + item.total * (item.vatRate / 100),
        0
      );
      
      newInvoice.totals = {
        subtotal,
        vatAmount,
        total: subtotal + vatAmount,
        discount: 0,
      };
      
      // Save the invoice
      const invoiceId = createInvoice(newInvoice);
      
      // Navigate to the invoice
      navigate(`/invoices/${invoiceId}`);
    } catch (error) {
      console.error('Error creating invoice:', error);
      alert('An error occurred while creating the invoice.');
    }
  };
  
  // Validate current step
  const canProceed = () => {
    switch (currentStep) {
      case 'client':
        return !!selectedClientId;
      case 'items':
        return invoiceItems.length > 0;
      case 'details':
        return true; // No required fields in details
      case 'preview':
        return true;
      default:
        return false;
    }
  };
  
  return (
    <div>
      <PageHeader
        title="Create New Invoice"
        backLink="/invoices"
      />
      
      {/* Steps */}
      <div className="mb-6">
        <nav aria-label="Progress">
          <ol className="divide-y divide-gray-300 rounded-md border border-gray-300 md:flex md:divide-y-0">
            {STEPS.map((step, stepIdx) => (
              <li key={step.id} className="relative md:flex md:flex-1">
                <button
                  onClick={() => {
                    const currentIndex = STEPS.findIndex((s) => s.id === currentStep);
                    const targetIndex = STEPS.findIndex((s) => s.id === step.id);
                    
                    // Only allow going back or to current step
                    if (targetIndex <= currentIndex) {
                      setCurrentStep(step.id);
                    }
                  }}
                  className={`group flex w-full items-center ${
                    stepIdx !== STEPS.length - 1 ? 'md:pr-0' : ''
                  }`}
                >
                  <span
                    className={`flex items-center px-6 py-4 text-sm font-medium ${
                      currentStep === step.id
                        ? 'text-blue-600'
                        : 'text-gray-500 group-hover:text-gray-900'
                    }`}
                  >
                    <span
                      className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full ${
                        currentStep === step.id
                          ? 'border-2 border-blue-600 bg-white text-blue-600'
                          : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'
                      }`}
                    >
                      {stepIdx + 1}
                    </span>
                    <span className="ml-2 text-sm">{step.name}</span>
                  </span>
                  
                  {stepIdx !== STEPS.length - 1 && (
                    <div className="absolute right-0 top-0 hidden h-full w-5 md:block">
                      <ChevronRight className="h-full w-5 text-gray-300" />
                    </div>
                  )}
                </button>
              </li>
            ))}
          </ol>
        </nav>
      </div>
      
      {/* Step content */}
      <div className="card">
        {/* Step 1: Client Selection */}
        {currentStep === 'client' && (
          <div>
            <h2 className="mb-4 text-lg font-medium text-gray-900">Select Client</h2>
            {clients.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">You don't have any clients yet.</p>
                <a
                  href="/clients/new"
                  className="mt-2 inline-block text-blue-600 hover:text-blue-800"
                >
                  Create a client first
                </a>
              </div>
            ) : (
              <div className="max-w-md">
                <FormField label="Client" htmlFor="client-selector" required>
                  <ClientSelector
                    selectedClientId={selectedClientId}
                    onClientSelect={handleClientSelect}
                    required
                  />
                </FormField>
              </div>
            )}
          </div>
        )}
        
        {/* Step 2: Invoice Items */}
        {currentStep === 'items' && (
          <div>
            <InvoiceItemsList
              items={invoiceItems}
              onChange={setInvoiceItems}
            />
          </div>
        )}
        
        {/* Step 3: Invoice Details */}
        {currentStep === 'details' && (
          <div className="space-y-6">
            <TemplateSelector
              selectedTemplate={template}
              onChange={setTemplate}
            />
            
            <div>
              <h3 className="text-lg font-medium text-gray-900">Additional Details</h3>
              
              <div className="mt-4">
                <FormField label="Notes" htmlFor="notes">
                  <textarea
                    id="notes"
                    className="form-textarea"
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Additional notes to display on the invoice"
                  />
                </FormField>
              </div>
            </div>
          </div>
        )}
        
        {/* Step 4: Preview */}
        {currentStep === 'preview' && (
          <div>
            <h2 className="mb-4 text-lg font-medium text-gray-900">Invoice Preview</h2>
            
            <div className="rounded-lg border p-4">
              <p className="text-sm text-gray-500">
                Preview will be available in the full version. Click "Create Invoice" to generate and view the invoice.
              </p>
            </div>
            
            <div className="mt-4">
              <p className="text-sm text-gray-500">
                The invoice will be created with status "Draft". You can change the status after creation.
              </p>
            </div>
          </div>
        )}
        
        {/* Navigation buttons */}
        <div className="mt-8 flex justify-between border-t pt-4">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handlePreviousStep}
            disabled={currentStep === STEPS[0].id}
          >
            Previous
          </button>
          
          {currentStep === STEPS[STEPS.length - 1].id ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleCreateInvoice}
              disabled={!canProceed()}
            >
              Create Invoice
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleNextStep}
              disabled={!canProceed()}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateInvoice;