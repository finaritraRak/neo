import { useState } from 'react';
import PageHeader from '../components/ui/PageHeader';
import BusinessForm from '../components/settings/BusinessForm';

const TABS = [
  { id: 'business', label: 'Business Profile' },
  { id: 'invoice', label: 'Invoice Settings' },
  { id: 'templates', label: 'Templates' },
  { id: 'export', label: 'Export/Import' },
];

const Settings = () => {
  const [activeTab, setActiveTab] = useState('business');
  
  return (
    <div>
      <PageHeader
        title="Settings"
        description="Manage your business settings and preferences."
      />
      
      <div className="mb-6 border-b">
        <nav className="-mb-px flex space-x-8">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`
                whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium
                ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }
              `}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      
      <div className="card">
        {activeTab === 'business' && <BusinessForm />}
        
        {activeTab === 'invoice' && (
          <div className="text-center py-8">
            <p className="text-gray-500">Invoice settings will be available in the full version.</p>
          </div>
        )}
        
        {activeTab === 'templates' && (
          <div className="text-center py-8">
            <p className="text-gray-500">Template customization will be available in the full version.</p>
          </div>
        )}
        
        {activeTab === 'export' && (
          <div className="text-center py-8">
            <p className="text-gray-500">Export/Import functionality will be available in the full version.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;