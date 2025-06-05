import { useState, FormEvent } from 'react';
import { Client } from '../../types';
import FormField from '../ui/FormField';

interface ClientFormProps {
  initialClient?: Partial<Client>;
  onSubmit: (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel?: () => void;
}

const ClientForm = ({ initialClient = {}, onSubmit, onCancel }: ClientFormProps) => {
  const [client, setClient] = useState<Partial<Client>>({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      postal: '',
      country: '',
    },
    company: {
      name: '',
      siret: '',
      vatNumber: '',
    },
    paymentTerms: 30,
    ...initialClient,
  });
  
  const handleChange = (field: string, value: string | number | object) => {
    setClient((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  
  const handleAddressChange = (field: string, value: string) => {
    setClient((prev) => ({
      ...prev,
      address: {
        ...prev.address!,
        [field]: value,
      },
    }));
  };
  
  const handleCompanyChange = (field: string, value: string) => {
    setClient((prev) => ({
      ...prev,
      company: {
        ...prev.company!,
        [field]: value,
      },
    }));
  };
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(client as Omit<Client, 'id' | 'createdAt' | 'updatedAt'>);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-x-4 gap-y-6 md:grid-cols-2">
        <div className="md:col-span-2">
          <h3 className="text-lg font-medium text-gray-900">Client Information</h3>
        </div>
        
        <FormField label="Name" htmlFor="name" required>
          <input
            id="name"
            type="text"
            className="form-input"
            value={client.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            required
          />
        </FormField>
        
        <FormField label="Email" htmlFor="email" required>
          <input
            id="email"
            type="email"
            className="form-input"
            value={client.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
            required
          />
        </FormField>
        
        <FormField label="Phone" htmlFor="phone">
          <input
            id="phone"
            type="tel"
            className="form-input"
            value={client.phone || ''}
            onChange={(e) => handleChange('phone', e.target.value)}
          />
        </FormField>
        
        <FormField label="Payment Terms (Days)" htmlFor="paymentTerms">
          <input
            id="paymentTerms"
            type="number"
            className="form-input"
            value={client.paymentTerms || 30}
            onChange={(e) => handleChange('paymentTerms', parseInt(e.target.value) || 30)}
            min="1"
          />
        </FormField>
        
        <div className="md:col-span-2">
          <h3 className="text-lg font-medium text-gray-900">Address</h3>
        </div>
        
        <FormField label="Street" htmlFor="street">
          <input
            id="street"
            type="text"
            className="form-input"
            value={client.address?.street || ''}
            onChange={(e) => handleAddressChange('street', e.target.value)}
          />
        </FormField>
        
        <FormField label="City" htmlFor="city">
          <input
            id="city"
            type="text"
            className="form-input"
            value={client.address?.city || ''}
            onChange={(e) => handleAddressChange('city', e.target.value)}
          />
        </FormField>
        
        <FormField label="Postal Code" htmlFor="postal">
          <input
            id="postal"
            type="text"
            className="form-input"
            value={client.address?.postal || ''}
            onChange={(e) => handleAddressChange('postal', e.target.value)}
          />
        </FormField>
        
        <FormField label="Country" htmlFor="country">
          <input
            id="country"
            type="text"
            className="form-input"
            value={client.address?.country || ''}
            onChange={(e) => handleAddressChange('country', e.target.value)}
          />
        </FormField>
        
        <div className="md:col-span-2">
          <h3 className="text-lg font-medium text-gray-900">Company Details</h3>
        </div>
        
        <FormField label="Company Name" htmlFor="companyName">
          <input
            id="companyName"
            type="text"
            className="form-input"
            value={client.company?.name || ''}
            onChange={(e) => handleCompanyChange('name', e.target.value)}
          />
        </FormField>
        
        <FormField label="SIRET" htmlFor="siret">
          <input
            id="siret"
            type="text"
            className="form-input"
            value={client.company?.siret || ''}
            onChange={(e) => handleCompanyChange('siret', e.target.value)}
          />
        </FormField>
        
        <FormField label="VAT Number" htmlFor="vatNumber">
          <input
            id="vatNumber"
            type="text"
            className="form-input"
            value={client.company?.vatNumber || ''}
            onChange={(e) => handleCompanyChange('vatNumber', e.target.value)}
          />
        </FormField>
      </div>
      
      <div className="flex justify-end space-x-3 pt-4 border-t">
        {onCancel && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
        <button type="submit" className="btn btn-primary">
          {initialClient.id ? 'Update Client' : 'Create Client'}
        </button>
      </div>
    </form>
  );
};

export default ClientForm;