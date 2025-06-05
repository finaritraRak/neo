import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, ChevronDown } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Client } from '../../types';

interface ClientSelectorProps {
  selectedClientId: string | null;
  onClientSelect: (client: Client) => void;
  required?: boolean;
}

const ClientSelector = ({ selectedClientId, onClientSelect, required }: ClientSelectorProps) => {
  const { clients } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  
  // Find selected client
  useEffect(() => {
    if (selectedClientId) {
      const client = clients.find((c) => c.id === selectedClientId);
      if (client) {
        setSelectedClient(client);
      }
    } else {
      setSelectedClient(null);
    }
  }, [selectedClientId, clients]);
  
  // Filter clients based on search
  const filteredClients = search
    ? clients.filter((client) =>
        client.name.toLowerCase().includes(search.toLowerCase()) ||
        client.email.toLowerCase().includes(search.toLowerCase())
      )
    : clients;
  
  const handleSelectClient = (client: Client) => {
    onClientSelect(client);
    setIsOpen(false);
    setSearch('');
  };
  
  return (
    <div className="relative">
      <button
        type="button"
        className="form-input flex w-full items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedClient ? (
          <span>{selectedClient.name}</span>
        ) : (
          <span className="text-gray-500">
            {required ? 'Select a client *' : 'Select a client'}
          </span>
        )}
        <ChevronDown className="h-4 w-4 text-gray-500" />
      </button>
      
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg">
          <div className="p-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                className="form-input w-full pl-9"
                placeholder="Search clients..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          
          <ul className="max-h-60 overflow-y-auto p-2">
            {filteredClients.length > 0 ? (
              filteredClients.map((client) => (
                <li key={client.id}>
                  <button
                    type="button"
                    className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-gray-100"
                    onClick={() => handleSelectClient(client)}
                  >
                    <div className="font-medium">{client.name}</div>
                    <div className="text-xs text-gray-500">{client.email}</div>
                  </button>
                </li>
              ))
            ) : (
              <li className="px-3 py-2 text-sm text-gray-500">No clients found</li>
            )}
          </ul>
          
          <div className="border-t p-2">
            <Link
              to="/clients"
              className="flex w-full items-center justify-center rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200"
            >
              <Plus className="mr-1 h-4 w-4" />
              New Client
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientSelector;