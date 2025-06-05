import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description?: string;
  backLink?: string;
  action?: React.ReactNode;
}

const PageHeader = ({ title, description, backLink, action }: PageHeaderProps) => {
  return (
    <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div className="mb-4 sm:mb-0">
        {backLink && (
          <Link
            to={backLink}
            className="mb-2 inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back
          </Link>
        )}
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};

export default PageHeader;