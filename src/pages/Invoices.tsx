import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import InvoiceList from '../components/invoice/InvoiceList';

const Invoices = () => {
  return (
    <div>
      <PageHeader
        title="Invoices"
        description="Manage your invoices and track payments."
        action={
          <Link to="/invoices/create" className="btn btn-primary">
            <Plus className="mr-1 h-4 w-4" />
            New Invoice
          </Link>
        }
      />
      
      <InvoiceList />
    </div>
  );
};

export default Invoices;