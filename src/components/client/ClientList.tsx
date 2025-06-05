import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useStore } from '../../store/useStore';
import EmptyState from '../ui/EmptyState';
import { Search, Users } from 'lucide-react';

const ClientList = () => {
  const { clients, invoices } = useStore();
  const [search, setSearch] = useState('');
  
  const filteredClients = useMemo(() => {
    return clients
      .filter((client) => {
        if (!search) return true;
        
        const searchLower = search.toLowerCase();
        return (
          client.name.toLowerCase().includes(searchLower) ||
          client.email.toLowerCase().includes(searchLower) ||
          client.company.name.toLowerCase().includes(searchLower)
        );
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [clients, search]);
  
  // Get invoice counts for each client
  const getClientInvoiceCount = (clientId: string) => {
    return invoices.filter((invoice) => invoice.clientId === clientId).length;
  };
  
  if (clients.length === 0) {
    return (
      <EmptyState
        title="No clients yet"
        description="Create your first client to get started."
        actionText="Create Client"
        actionLink="/clients/new"
        icon={<Users className="h-12 w-12 text-gray-400" />}
      />
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-3 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="relative flex-1 md:max-w-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="form-input block w-full rounded-md border-gray-300 pl-10 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Search clients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredClients.map((client) => (
          <Link
            key={client.id}
            to={`/clients/${client.id}`}
            className="card hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col h-full">
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900 truncate">{client.name}</h3>
                <p className="text-sm text-gray-500 truncate">{client.email}</p>
                {client.company.name && (
                  <p className="text-xs text-gray-500 mt-1">{client.company.name}</p>
                )}
              </div>
              
              <div className="mt-auto flex items-center justify-between pt-4 text-sm text-gray-500 border-t">
                <span>{getClientInvoiceCount(client.id)} invoices</span>
                <span>Added {format(new Date(client.createdAt), 'MMM d, yyyy')}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {filteredClients.length === 0 && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">No clients match your search</p>
        </div>
      )}
    </div>
  );
};

export default ClientList;