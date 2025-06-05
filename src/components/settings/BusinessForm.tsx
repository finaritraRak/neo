import { useState, FormEvent } from 'react';
import { useStore } from '../../store/useStore';
import FormField from '../ui/FormField';
import { BusinessProfile } from '../../types';

const BusinessForm = () => {
  const { businessProfile, updateBusinessProfile } = useStore();
  
  const [profile, setProfile] = useState<BusinessProfile>({
    ...businessProfile
  });
  
  const handleChange = (field: string, value: string | number | object) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  
  const handleAddressChange = (field: string, value: string) => {
    setProfile((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value,
      },
    }));
  };
  
  const handleLegalChange = (field: string, value: string) => {
    setProfile((prev) => ({
      ...prev,
      legal: {
        ...prev.legal,
        [field]: value,
      },
    }));
  };
  
  const handleInvoiceSettingsChange = (field: string, value: string | number) => {
    setProfile((prev) => ({
      ...prev,
      invoiceSettings: {
        ...prev.invoiceSettings,
        [field]: typeof value === 'number' ? value : value,
      },
    }));
  };
  
  const handlePaymentInfoChange = (field: string, value: string) => {
    setProfile((prev) => ({
      ...prev,
      paymentInfo: {
        ...prev.paymentInfo,
        [field]: value,
      },
    }));
  };
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    updateBusinessProfile(profile);
    alert('Business profile updated successfully!');
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-x-4 gap-y-6 md:grid-cols-2">
        <div className="md:col-span-2">
          <h3 className="text-lg font-medium text-gray-900">Business Information</h3>
        </div>
        
        <FormField label="Business Name" htmlFor="name" required>
          <input
            id="name"
            type="text"
            className="form-input"
            value={profile.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
          />
        </FormField>
        
        <FormField label="Email" htmlFor="email" required>
          <input
            id="email"
            type="email"
            className="form-input"
            value={profile.email}
            onChange={(e) => handleChange('email', e.target.value)}
            required
          />
        </FormField>
        
        <FormField label="Phone" htmlFor="phone">
          <input
            id="phone"
            type="tel"
            className="form-input"
            value={profile.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
          />
        </FormField>
        
        <FormField label="Logo URL" htmlFor="logo">
          <input
            id="logo"
            type="text"
            className="form-input"
            value={profile.logo}
            onChange={(e) => handleChange('logo', e.target.value)}
            placeholder="https://example.com/logo.png"
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
            value={profile.address.street}
            onChange={(e) => handleAddressChange('street', e.target.value)}
          />
        </FormField>
        
        <FormField label="City" htmlFor="city">
          <input
            id="city"
            type="text"
            className="form-input"
            value={profile.address.city}
            onChange={(e) => handleAddressChange('city', e.target.value)}
          />
        </FormField>
        
        <FormField label="Postal Code" htmlFor="postal">
          <input
            id="postal"
            type="text"
            className="form-input"
            value={profile.address.postal}
            onChange={(e) => handleAddressChange('postal', e.target.value)}
          />
        </FormField>
        
        <FormField label="Country" htmlFor="country">
          <input
            id="country"
            type="text"
            className="form-input"
            value={profile.address.country}
            onChange={(e) => handleAddressChange('country', e.target.value)}
          />
        </FormField>
        
        <div className="md:col-span-2">
          <h3 className="text-lg font-medium text-gray-900">Legal Information</h3>
        </div>
        
        <FormField label="SIRET" htmlFor="siret">
          <input
            id="siret"
            type="text"
            className="form-input"
            value={profile.legal.siret}
            onChange={(e) => handleLegalChange('siret', e.target.value)}
          />
        </FormField>
        
        <FormField label="VAT Number" htmlFor="vatNumber">
          <input
            id="vatNumber"
            type="text"
            className="form-input"
            value={profile.legal.vatNumber}
            onChange={(e) => handleLegalChange('vatNumber', e.target.value)}
          />
        </FormField>
        
        <FormField label="RCS" htmlFor="rcs">
          <input
            id="rcs"
            type="text"
            className="form-input"
            value={profile.legal.rcs}
            onChange={(e) => handleLegalChange('rcs', e.target.value)}
          />
        </FormField>
        
        <div className="md:col-span-2">
          <h3 className="text-lg font-medium text-gray-900">Invoice Settings</h3>
        </div>
        
        <FormField label="Invoice Prefix" htmlFor="prefix">
          <input
            id="prefix"
            type="text"
            className="form-input"
            value={profile.invoiceSettings.prefix}
            onChange={(e) => handleInvoiceSettingsChange('prefix', e.target.value)}
          />
        </FormField>
        
        <FormField label="Starting Number" htmlFor="startNumber">
          <input
            id="startNumber"
            type="number"
            className="form-input"
            value={profile.invoiceSettings.startNumber}
            onChange={(e) => handleInvoiceSettingsChange('startNumber', parseInt(e.target.value) || 1001)}
            min="1"
          />
        </FormField>
        
        <FormField label="Default VAT Rate (%)" htmlFor="vatRate">
          <input
            id="vatRate"
            type="number"
            className="form-input"
            value={profile.invoiceSettings.vatRate}
            onChange={(e) => handleInvoiceSettingsChange('vatRate', parseFloat(e.target.value) || 20)}
            step="0.1"
            min="0"
          />
        </FormField>
        
        <div className="md:col-span-2">
          <h3 className="text-lg font-medium text-gray-900">Payment Information</h3>
        </div>
        
        <FormField label="IBAN" htmlFor="iban">
          <input
            id="iban"
            type="text"
            className="form-input"
            value={profile.paymentInfo.iban}
            onChange={(e) => handlePaymentInfoChange('iban', e.target.value)}
          />
        </FormField>
        
        <FormField label="BIC/SWIFT" htmlFor="bic">
          <input
            id="bic"
            type="text"
            className="form-input"
            value={profile.paymentInfo.bic}
            onChange={(e) => handlePaymentInfoChange('bic', e.target.value)}
          />
        </FormField>
        
        <FormField label="PayPal Email" htmlFor="paypalEmail">
          <input
            id="paypalEmail"
            type="email"
            className="form-input"
            value={profile.paymentInfo.paypalEmail}
            onChange={(e) => handlePaymentInfoChange('paypalEmail', e.target.value)}
          />
        </FormField>
      </div>
      
      <div className="flex justify-end pt-4 border-t">
        <button type="submit" className="btn btn-primary">
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default BusinessForm;