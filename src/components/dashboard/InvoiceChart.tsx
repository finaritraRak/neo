import { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useStore } from '../../store/useStore';
import { formatCurrency } from '../../utils/formatters';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const InvoiceChart = () => {
  const { invoices } = useStore();
  
  const chartData = useMemo(() => {
    // Get the last 6 months
    const today = new Date();
    const months = [];
    
    for (let i = 5; i >= 0; i--) {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
      months.push(month);
    }
    
    // Get month names and format them
    const labels = months.map((month) => {
      return month.toLocaleDateString('en-US', { month: 'short' });
    });
    
    // Calculate totals for each month
    const data = months.map((month) => {
      const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
      const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);
      
      return invoices
        .filter((invoice) => {
          const createdDate = new Date(invoice.dates.created);
          return createdDate >= monthStart && createdDate <= monthEnd;
        })
        .reduce((sum, invoice) => sum + invoice.totals.total, 0);
    });
    
    return {
      labels,
      datasets: [
        {
          label: 'Invoice Total',
          data,
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 1,
          borderRadius: 4,
        },
      ],
    };
  }, [invoices]);
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `Total: ${formatCurrency(context.raw)}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: number) => formatCurrency(value, false),
        },
      },
    },
  };
  
  return (
    <div className="card">
      <h3 className="mb-4 text-lg font-medium text-gray-900">Monthly Revenue</h3>
      <div className="h-64">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default InvoiceChart;