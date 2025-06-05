import { Link } from 'react-router-dom';
import { FileText, Plus } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  actionLink?: string;
  icon?: React.ReactNode;
}

const EmptyState = ({
  title,
  description,
  actionText,
  actionLink,
  icon = <FileText className="h-12 w-12 text-gray-400" />,
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="mb-4">{icon}</div>
      <h3 className="mb-2 text-lg font-medium text-gray-900">{title}</h3>
      <p className="mb-6 text-sm text-gray-500 max-w-md">{description}</p>
      
      {actionText && actionLink && (
        <Link to={actionLink} className="btn btn-primary">
          <Plus className="mr-2 h-4 w-4" />
          {actionText}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;