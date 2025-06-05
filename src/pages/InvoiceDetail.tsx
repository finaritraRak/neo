import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Download, 
  Printer, 
  Mail, 
  Copy, 
  Edit, 
  Trash2, 
  CheckCircle,
  ArrowLeft
} from 'lucide-react';
import { useStore } from '../store/useStore';
import PageHeader from '../components/ui/PageHeader';
import StatusBadge from '../components/ui/StatusBadge';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { formatCurrency, formatDate } from '../utils/formatters';
import { generateInvoicePdf } from '../utils/pdfGenerator';

const InvoiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    getInvoice, 
    getClient, 
    updateInvoiceStatus, 
    deleteInvoice,
    businessProfile
  } = useStore();
  
  const [invoice, setInvoice] = useState(null);
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Get invoice and client data
  useEffect(() => {
    if (id) {
      const invoiceData = getInvoice(id);
      if (invoiceData) {
        setInvoice(invoiceData);
        
        const clientData = getClient(invoiceData.clientId);
        if (clientData) {
          setClient(clientData);
        }
      } else {
        navigate('/invoices');
      }
    }
    setLoading(false);
  }, [id, getInvoice, getClient, navigate]);
  
  const handleStatusChange = (status) => {
    if (id) {
      updateInvoiceStatus(id, status);
      // Refresh invoice data
      setInvoice(getInvoice(id));
    }
  };
  
  const handleDeleteInvoice = () => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      deleteInvoice(id);
      navigate('/invoices');
    }
  };
  
  const handleDownloadPdf = () => {
    if (!invoice || !client) return;
    
    const pdf = generateInvoicePdf({
      invoice,
      client,
      business: businessProfile,
      template: invoice.template,
    });
    
    pdf.save(`Invoice_${invoice.number}.pdf`);
  };
  
  const handleDuplicateInvoice = () => {
    // TODO: Implement duplicate functionality
    alert('Duplicate feature will be implemented in the next version.');
  };
  
  const handleSendEmail = () => {
    // TODO: Implement email sending functionality
    alert('Email feature will be implemented in the next version.');
  };
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!invoice || !client) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-medium text-gray-900">Invoice not found</h2>
        <p className="mt-2 text-gray-500">
          The invoice you're looking for doesn't exist or has been deleted.
        </p>
        <Link to="/invoices" className="mt-4 inline-block text-blue-600 hover:text-blue-800">
          <ArrowLeft className="mr-1 h-4 w-4 inline" />
          Back to Invoices
        </Link>
      </div>
    );
  }
  
  return (
    <div>
      <PageHeader
        title={`Invoice ${invoice.number}`}
        backLink="/invoices"
        action={
          <div className="flex space-x-2">
            <button
              className="btn btn-secondary"
              onClick={handleDownloadPdf}
            >
              <Download className="mr-1 h-4 w-4" />
              <span className="hidden sm:inline">Download</span>
            </button>
            
            <div className="relative inline-block text-left">
              <button
                className="btn btn-primary"
                onClick={() => handleStatusChange(
                  invoice.status === 'draft' ? 'sent' : 
                  invoice.status === 'sent' ? 'paid' : 
                  invoice.status
                )}
                disabled={invoice.status === 'paid' || invoice.status === 'overdue'}
              >
                <CheckCircle className="mr-1 h-4 w-4" />
                {invoice.status === 'draft' ? 'Mark as Sent' : 
                 invoice.status === 'sent' ? 'Mark as Paid' : 
                 'Mark as Paid'}
              </button>
            </div>
          </div>
        }
      />
      
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <StatusBadge status={invoice.status} />
          <span className="text-sm text-gray-500">
            {invoice.status === 'draft' ? 'This invoice is a draft and has not been sent yet.' : 
             invoice.status === 'sent' ? `Due on ${formatDate(invoice.dates.due)}` : 
             invoice.status === 'paid' ? `Paid on ${formatDate(invoice.dates.paid)}` : 
             `Overdue since ${formatDate(invoice.dates.due)}`}
          </span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            className="btn btn-secondary"
            onClick={handleSendEmail}
          >
            <Mail className="mr-1 h-4 w-4" />
            <span className="hidden sm:inline">Email</span>
          </button>
          
          <button
            className="btn btn-secondary"
            onClick={handleDuplicateInvoice}
          >
            <Copy className="mr-1 h-4 w-4" />
            <span className="hidden sm:inline">Duplicate</span>
          </button>
          
          <button
            className="btn btn-secondary"
            onClick={() => window.print()}
          >
            <Printer className="mr-1 h-4 w-4" />
            <span className="hidden sm:inline">Print</span>
          </button>
          
          <Link
            to={`/invoices/edit/${id}`}
            className="btn btn-secondary"
          >
            <Edit className="mr-1 h-4 w-4" />
            <span className="hidden sm:inline">Edit</span>
          </Link>
          
          <button
            className="btn btn-danger"
            onClick={handleDeleteInvoice}
          >
            <Trash2 className="mr-1 h-4 w-4" />
            <span className="hidden sm:inline">Delete</span>
          </button>
        </div>
      </div>
      
      <div className="card">
        <div className="mb-8 flex flex-col justify-between sm:flex-row">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Invoice</h2>
            <p className="text-lg text-gray-700">{invoice.number}</p>
          </div>
          
          <div className="mt-4 sm:mt-0 sm:text-right">
            <div className="text-sm text-gray-500">Created</div>
            <div>{formatDate(invoice.dates.created)}</div>
            
            <div className="mt-2 text-sm text-gray-500">Due Date</div>
            <div>{formatDate(invoice.dates.due)}</div>
          </div>
        </div>
        
        <div className="mb-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
          <div>
            <h3 className="mb-2 text-sm font-medium text-gray-500">From</h3>
            <div className="text-gray-900">
              <p className="font-medium">{businessProfile.name}</p>
              <p>{businessProfile.address.street}</p>
              <p>
                {businessProfile.address.postal} {businessProfile.address.city}, {businessProfile.address.country}
              </p>
              <p className="mt-2">
                <span className="text-gray-500">Email: </span>
                {businessProfile.email}
              </p>
              <p>
                <span className="text-gray-500">Phone: </span>
                {businessProfile.phone}
              </p>
              <p>
                <span className="text-gray-500">VAT: </span>
                {businessProfile.legal.vatNumber}
              </p>
            </div>
          </div>
          
          <div>
            <h3 className="mb-2 text-sm font-medium text-gray-500">To</h3>
            <div className="text-gray-900">
              <p className="font-medium">{client.name}</p>
              {client.company.name && (
                <p>{client.company.name}</p>
              )}
              <p>{client.address.street}</p>
              <p>
                {client.address.postal} {client.address.city}, {client.address.country}
              </p>
              <p className="mt-2">
                <span className="text-gray-500">Email: </span>
                {client.email}
              </p>
              {client.phone && (
                <p>
                  <span className="text-gray-500">Phone: </span>
                  {client.phone}
                </p>
              )}
              {client.company.vatNumber && (
                <p>
                  <span className="text-gray-500">VAT: </span>
                  {client.company.vatNumber}
                </p>
              )}
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <h3 className="mb-4 text-lg font-medium text-gray-900">Invoice Items</h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Qty
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Unit Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    VAT (%)
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {invoice.items.map((item) => (
                  <tr key={item.id}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {item.description}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-500">
                      {item.quantity}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-500">
                      {formatCurrency(item.unitPrice)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-500">
                      {item.vatRate}%
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium text-gray-900">
                      {formatCurrency(item.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-8 flex justify-end">
            <div className="w-64 space-y-3">
              <div className="flex items-center justify-between border-t border-gray-200 pt-3">
                <span className="text-sm text-gray-500">Subtotal</span>
                <span>{formatCurrency(invoice.totals.subtotal)}</span>
              </div>
              
              {invoice.totals.discount > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Discount</span>
                  <span>-{formatCurrency(invoice.totals.discount)}</span>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">VAT</span>
                <span>{formatCurrency(invoice.totals.vatAmount)}</span>
              </div>
              
              <div className="flex items-center justify-between border-t border-gray-200 pt-3">
                <span className="text-base font-medium text-gray-900">Total</span>
                <span className="text-base font-bold text-gray-900">
                  {formatCurrency(invoice.totals.total)}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {invoice.notes && (
          <div className="mt-8 border-t pt-6">
            <h3 className="mb-2 text-sm font-medium text-gray-500">Notes</h3>
            <p className="text-sm text-gray-700">{invoice.notes}</p>
          </div>
        )}
        
        <div className="mt-8 border-t pt-6">
          <h3 className="mb-2 text-sm font-medium text-gray-500">Payment Information</h3>
          <p className="text-sm text-gray-700">
            Please transfer the amount to the following account:
          </p>
          <div className="mt-2 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
            <div>
              <span className="font-medium">IBAN: </span>
              {businessProfile.paymentInfo.iban}
            </div>
            <div>
              <span className="font-medium">BIC/SWIFT: </span>
              {businessProfile.paymentInfo.bic}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetail;