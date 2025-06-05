import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ChevronRight } from 'lucide-react';
import { useStore } from '../../store/useStore';
import StatusBadge from '../ui/StatusBadge';
import { formatCurrency } from '../../utils/formatters';

const RecentInvoices = () => {
  const { invoices, clients } = useStore();
  
  // Get the 5 most recent invoices
  const recentInvoices = [...invoices]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
  
  return (
    <div className="card">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Recent Invoices</h3>
        <Link to="/invoices" className="text-sm text-blue-600 hover:text-blue-800">
          View all
        </Link>
      </div>
      
      <div className="overflow-hidden">
        {recentInvoices.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {recentInvoices.map((invoice) => {
              const client = clients.find((c) => c.id === invoice.clientId);
              
              return (
                <li key={invoice.id} className="py-3">
                  <Link to={`/invoices/${invoice.id}`} className="block hover:bg-gray-50 -mx-4 px-4 py-2 rounded-md transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col sm:flex-row sm:items-center">
                        <p className="font-medium text-gray-900">{invoice.number}</p>
                        <span className="hidden sm:inline text-gray-500 mx-2">•</span>
                        <p className="text-sm text-gray-500">{client?.name || 'Unknown Client'}</p>
                      </div>
                      
                      <div className="flex items-center">
                        <StatusBadge status={invoice.status} />
                        <p className="ml-4 text-sm font-medium text-gray-900">
                          {formatCurrency(invoice.totals.total)}
                        </p>
                        <ChevronRight className="ml-2 h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    
                    <div className="mt-1 flex text-xs text-gray-500">
                      <p>Created: {format(new Date(invoice.dates.created), 'dd MMM yyyy')}</p>
                      <span className="mx-2">•</span>
                      <p>Due: {format(new Date(invoice.dates.due), 'dd MMM yyyy')}</p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="py-6 text-center">
            <p className="text-sm text-gray-500">No invoices yet</p>
            <Link to="/invoices/create" className="mt-2 inline-block text-sm font-medium text-blue-600 hover:text-blue-800">
              Create your first invoice
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentInvoices;