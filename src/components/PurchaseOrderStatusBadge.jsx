import { getIcon } from '../utils/iconUtils';

const PurchaseOrderStatusBadge = ({ status }) => {
  const statusConfig = {
    draft: {
      label: 'Draft',
      color: 'bg-surface-100 text-surface-800 dark:bg-surface-700 dark:text-surface-300',
      icon: getIcon('edit')
    },
    pending: {
      label: 'Pending',
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      icon: getIcon('clock')
    },
    approved: {
      label: 'Approved',
      color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      icon: getIcon('check-circle')
    },
    shipped: {
      label: 'Shipped',
      color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      icon: getIcon('truck')
    },
    delivered: {
      label: 'Delivered',
      color: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300',
      icon: getIcon('package')
    },
    cancelled: {
      label: 'Cancelled',
      color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      icon: getIcon('x-circle')
    }
  };
  
  const config = statusConfig[status] || statusConfig.draft;
  const Icon = config.icon;
  
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
};

export default PurchaseOrderStatusBadge;