import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  positive?: boolean;
  icon: ReactNode;
}

const StatCard = ({ title, value, change, positive, icon }: StatCardProps) => {
  return (
    <div className="card transition-all hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
          
          {change && (
            <div className="mt-1 flex items-center">
              <span
                className={`text-sm font-medium ${
                  positive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {change}
              </span>
              <span className="ml-1 text-xs text-gray-500">vs last month</span>
            </div>
          )}
        </div>
        <div className="rounded-full bg-blue-50 p-3 text-blue-600">{icon}</div>
      </div>
    </div>
  );
};

export default StatCard;