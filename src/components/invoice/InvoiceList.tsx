import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useStore } from '../../store/useStore';
import StatusBadge from '../ui/StatusBadge';
import { formatCurrency } from '../../utils/formatters';
import { Status } from '../../types';
import EmptyState from '../ui/EmptyState';
import { FileText, Search } from 'lucide-react';

const InvoiceList = () => {
  const { invoices, clients } = useStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status | 'all'>('all');
  
  const filteredInvoices = useMemo(() => {
    return invoices
      .filter((invoice) => {
        // Apply status filter
        if (statusFilter !== 'all' && invoice.status !== statusFilter) {
          return false;
        }
        
        // Apply search filter (search by invoice number or client name)
        if (search) {
          const client = clients.find((c) => c.id === invoice.clientId);
          const searchLower = search.toLowerCase();
          
          return (
            invoice.number.toLowerCase().includes(searchLower) ||
            (client && client.name.toLowerCase().includes(searchLower))
          );
        }
        
        return true;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [invoices, clients, search, statusFilter]);
  
  if (invoices.length === 0) {
    return (
      <EmptyState
        title="No invoices yet"
        description="Create your first invoice to get started."
        actionText="Create Invoice"
        actionLink="/invoices/create"
        icon={<FileText className="h-12 w-12 text-gray-400" />}
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
            placeholder="Search invoices..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <label htmlFor="status-filter" className="text-sm font-medium text-gray-700">
            Status:
          </label>
          <select
            id="status-filter"
            className="form-select rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as Status | 'all')}
          >
            <option value="all">All</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>
      
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Invoice
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Client
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Due Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredInvoices.map((invoice) => {
              const client = clients.find((c) => c.id === invoice.clientId);
              
              return (
                <tr 
                  key={invoice.id}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <td className="whitespace-nowrap px-6 py-4">
                    <Link to={`/invoices/${invoice.id}`} className="text-blue-600 hover:text-blue-900 font-medium">
                      {invoice.number}
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {client?.name || 'Unknown Client'}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {format(new Date(invoice.dates.created), 'dd MMM yyyy')}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {format(new Date(invoice.dates.due), 'dd MMM yyyy')}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <StatusBadge status={invoice.status} />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {formatCurrency(invoice.totals.total)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {filteredInvoices.length === 0 && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">No invoices match your filters</p>
        </div>
      )}
    </div>
  );
};

export default InvoiceList;