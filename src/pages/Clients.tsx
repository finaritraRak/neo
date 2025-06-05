import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import ClientList from '../components/client/ClientList';

const Clients = () => {
  return (
    <div>
      <PageHeader
        title="Clients"
        description="Manage your clients and their information."
        action={
          <Link to="/clients/new" className="btn btn-primary">
            <Plus className="mr-1 h-4 w-4" />
            New Client
          </Link>
        }
      />
      
      <ClientList />
    </div>
  );
};

export default Clients;