import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Pencil, Trash2, ArrowLeft } from 'lucide-react';
import { useStore } from '../store/useStore';
import PageHeader from '../components/ui/PageHeader';
import ClientForm from '../components/client/ClientForm';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const ClientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getClient, updateClient, deleteClient, invoices } = useStore();
  
  const [client, setClient] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Get client data
  useEffect(() => {
    if (id) {
      const clientData = getClient(id);
      if (clientData) {
        setClient(clientData);
      } else {
        navigate('/clients');
      }
    }
    setLoading(false);
  }, [id, getClient, navigate]);
  
  // Get invoices for this client
  const clientInvoices = invoices.filter((invoice) => invoice.clientId === id);
  
  const handleUpdateClient = (updatedClient) => {
    if (id) {
      updateClient(id, updatedClient);
      setIsEditing(false);
      // Refresh client data
      setClient(getClient(id));
    }
  };
  
  const handleDeleteClient = () => {
    if (clientInvoices.length > 0) {
      alert(
        `Cannot delete client with ${clientInvoices.length} invoices. Please delete the invoices first.`
      );
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this client?')) {
      deleteClient(id);
      navigate('/clients');
    }
  };
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!client) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-medium text-gray-900">Client not found</h2>
        <p className="mt-2 text-gray-500">
          The client you're looking for doesn't exist or has been deleted.
        </p>
        <Link to="/clients" className="mt-4 inline-block text-blue-600 hover:text-blue-800">
          <ArrowLeft className="mr-1 h-4 w-4 inline" />
          Back to Clients
        </Link>
      </div>
    );
  }
  
  if (isEditing) {
    return (
      <div>
        <PageHeader
          title="Edit Client"
          backLink={`/clients/${id}`}
        />
        <div className="card">
          <ClientForm
            initialClient={client}
            onSubmit={handleUpdateClient}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <PageHeader
        title={client.name}
        backLink="/clients"
        action={
          <div className="flex space-x-2">
            <button
              className="btn btn-secondary"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="mr-1 h-4 w-4" />
              Edit
            </button>
            <button
              className="btn btn-danger"
              onClick={handleDeleteClient}
            >
              <Trash2 className="mr-1 h-4 w-4" />
              Delete
            </button>
          </div>
        }
      />
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="card md:col-span-2">
          <h3 className="mb-4 text-lg font-medium text-gray-900">Client Information</h3>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Contact</h4>
              <p className="mt-1">{client.name}</p>
              <p className="mt-1">{client.email}</p>
              <p className="mt-1">{client.phone}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Company</h4>
              {client.company.name ? (
                <>
                  <p className="mt-1">{client.company.name}</p>
                  <p className="mt-1">SIRET: {client.company.siret || 'N/A'}</p>
                  <p className="mt-1">VAT: {client.company.vatNumber || 'N/A'}</p>
                </>
              ) : (
                <p className="mt-1 text-gray-500">No company information</p>
              )}
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Address</h4>
              <p className="mt-1">{client.address.street}</p>
              <p className="mt-1">
                {client.address.postal} {client.address.city}
              </p>
              <p className="mt-1">{client.address.country}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Payment Terms</h4>
              <p className="mt-1">{client.paymentTerms} days</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <h3 className="mb-4 text-lg font-medium text-gray-900">Client Stats</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Invoices</h4>
              <p className="mt-1 text-2xl font-semibold">{clientInvoices.length}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Status</h4>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm">Draft</span>
                  <span className="text-sm font-medium">
                    {clientInvoices.filter((i) => i.status === 'draft').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Sent</span>
                  <span className="text-sm font-medium">
                    {clientInvoices.filter((i) => i.status === 'sent').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Paid</span>
                  <span className="text-sm font-medium">
                    {clientInvoices.filter((i) => i.status === 'paid').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Overdue</span>
                  <span className="text-sm font-medium">
                    {clientInvoices.filter((i) => i.status === 'overdue').length}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <Link
                to={`/invoices/create?client=${id}`}
                className="btn btn-primary w-full"
              >
                Create Invoice
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {clientInvoices.length > 0 && (
        <div className="mt-6">
          <h3 className="mb-4 text-lg font-medium text-gray-900">Client Invoices</h3>
          
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Invoice
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Date
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
                {clientInvoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td className="whitespace-nowrap px-6 py-4">
                      <Link to={`/invoices/${invoice.id}`} className="text-blue-600 hover:text-blue-900">
                        {invoice.number}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {new Date(invoice.dates.created).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <span className={`badge badge-${invoice.status}`}>
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {new Intl.NumberFormat('fr-FR', {
                        style: 'currency',
                        currency: 'EUR',
                      }).format(invoice.totals.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDetail;