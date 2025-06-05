import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center">
      <h1 className="text-9xl font-bold text-gray-200">404</h1>
      <h2 className="mt-4 text-2xl font-bold text-gray-900">Page not found</h2>
      <p className="mt-2 text-gray-500">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="mt-6 btn btn-primary">
        <Home className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;