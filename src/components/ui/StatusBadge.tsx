import { Status } from '../../types';

interface StatusBadgeProps {
  status: Status;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const statusConfig = {
    draft: {
      label: 'Draft',
      className: 'badge-draft',
    },
    sent: {
      label: 'Sent',
      className: 'badge-sent',
    },
    paid: {
      label: 'Paid',
      className: 'badge-paid',
    },
    overdue: {
      label: 'Overdue',
      className: 'badge-overdue',
    },
  };

  const { label, className } = statusConfig[status];

  return (
    <span className={`badge ${className}`}>
      {label}
    </span>
  );
};

export default StatusBadge;