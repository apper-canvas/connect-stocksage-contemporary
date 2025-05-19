import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';

// Define icons using getIcon utility
const PackageIcon = getIcon('package');
const ArrowRightIcon = getIcon('arrow-right');
const PlusIcon = getIcon('plus');
const MinusIcon = getIcon('minus');
const BarChartIcon = getIcon('bar-chart-2');
const ReceiptIcon = getIcon('receipt');
const TrashIcon = getIcon('trash-2');
const RefreshCcwIcon = getIcon('refresh-ccw');
const CheckIcon = getIcon('check-circle');
const WarningIcon = getIcon('alert-triangle');

const MainFeature = () => {
  // State for inventory transactions
  const [transactionType, setTransactionType] = useState('stock-in');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [description, setDescription] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Sample products for demonstration
  const products = [
    { id: '1', name: 'Wireless Headphones', sku: 'WH-101', currentStock: 45, location: 'Warehouse A' },
    { id: '2', name: 'Smartphone Charger', sku: 'SC-202', currentStock: 120, location: 'Warehouse A' },
    { id: '3', name: 'Laptop Sleeve', sku: 'LS-303', currentStock: 18, location: 'Warehouse B' },
    { id: '4', name: 'Bluetooth Speaker', sku: 'BS-404', currentStock: 32, location: 'Warehouse B' },
    { id: '5', name: 'HDMI Cable', sku: 'HC-505', currentStock: 64, location: 'Warehouse C' },
  ];

  // Load sample transactions on component mount
  useEffect(() => {
    setTransactions([
      { 
        id: 'txn-001', 
        date: new Date(2023, 10, 10).toISOString(), 
        type: 'stock-in', 
        productId: '1', 
        quantity: 50, 
        description: 'Initial inventory'
      },
      { 
        id: 'txn-002', 
        date: new Date(2023, 10, 12).toISOString(), 
        type: 'stock-out', 
        productId: '1', 
        quantity: 5, 
        description: 'Order #45892'
      },
      { 
        id: 'txn-003', 
        date: new Date(2023, 10, 15).toISOString(), 
        type: 'adjustment', 
        productId: '2', 
        quantity: 10, 
        description: 'Inventory count correction'
      }
    ]);
  }, []);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedProduct) {
      toast.error('Please select a product');
      return;
    }
    
    if (quantity <= 0) {
      toast.error('Quantity must be greater than 0');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newTransaction = {
        id: `txn-${Math.floor(Math.random() * 1000)}`,
        date: new Date().toISOString(),
        type: transactionType,
        productId: selectedProduct,
        quantity: Number(quantity),
        description: description.trim() || 'No description provided'
      };
      
      setTransactions(prev => [newTransaction, ...prev]);
      
      // Success notification
      toast.success(`Transaction recorded successfully`, {
        icon: () => <CheckIcon className="h-5 w-5 text-green-500" />
      });
      
      // Reset form
      setSelectedProduct('');
      setQuantity(1);
      setDescription('');
      setIsLoading(false);
    }, 800);
  };
  
  // Handle transaction deletion
  const handleDeleteTransaction = (id) => {
    // Show confirmation dialog
    if (window.confirm('Are you sure you want to delete this transaction? This action cannot be undone.')) {
      setTransactions(prev => prev.filter(transaction => transaction.id !== id));
      
      toast.success('Transaction deleted successfully', {
        icon: () => <TrashIcon className="h-5 w-5 text-red-500" />
      });
    }
  };
  
  // Get product name by ID
  const getProductNameById = (id) => {
    const product = products.find(p => p.id === id);
    return product ? product.name : 'Unknown Product';
  };
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Transaction type to display properties
  const transactionTypeInfo = {
    'stock-in': {
      label: 'Stock In',
      color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      icon: PlusIcon
    },
    'stock-out': {
      label: 'Stock Out',
      color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      icon: MinusIcon
    },
    'transfer': {
      label: 'Transfer',
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      icon: ArrowRightIcon
    },
    'adjustment': {
      label: 'Adjustment',
      color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      icon: RefreshCcwIcon
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Transaction Entry Form */}
      <div className="lg:col-span-1 glass-card">
        <div className="flex items-center mb-6">
          <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center mr-4">
            <ReceiptIcon className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-xl font-bold text-surface-900 dark:text-white">
            Record Transaction
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Transaction Type */}
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
              Transaction Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {Object.keys(transactionTypeInfo).map(type => {
                const info = transactionTypeInfo[type];
                const Icon = info.icon;
                
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setTransactionType(type)}
                    className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg border-2 transition-all ${
                      transactionType === type 
                        ? 'border-primary bg-primary/10 text-primary dark:border-primary-light dark:text-primary-light'
                        : 'border-surface-200 hover:border-surface-300 dark:border-surface-700 dark:hover:border-surface-600'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{info.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Product Selection */}
          <div>
            <label htmlFor="product" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
              Select Product
            </label>
            <select
              id="product"
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full p-3 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 focus:outline-none focus:ring-2 focus:ring-primary text-surface-900 dark:text-white"
              required
            >
              <option value="">Choose a product</option>
              {products.map(product => (
                <option key={product.id} value={product.id}>
                  {product.name} ({product.sku}) - {product.currentStock} in stock
                </option>
              ))}
            </select>
          </div>
          
          {/* Quantity */}
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
              Quantity
            </label>
            <div className="flex rounded-lg overflow-hidden border border-surface-200 dark:border-surface-700">
              <button
                type="button"
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                className="flex-none px-3 py-2 bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 text-surface-700 dark:text-surface-300"
              >
                <MinusIcon className="h-5 w-5" />
              </button>
              <input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.valueAsNumber || 1)}
                className="flex-grow p-2 text-center bg-white dark:bg-surface-800 focus:outline-none text-surface-900 dark:text-white"
                required
              />
              <button
                type="button"
                onClick={() => setQuantity(prev => prev + 1)}
                className="flex-none px-3 py-2 bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 text-surface-700 dark:text-surface-300"
              >
                <PlusIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
              Description (Optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Reason for this transaction"
              rows="3"
              className="w-full p-3 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 focus:outline-none focus:ring-2 focus:ring-primary text-surface-900 dark:text-white"
            ></textarea>
          </div>
          
          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <RefreshCcwIcon className="h-5 w-5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <ReceiptIcon className="h-5 w-5" />
                <span>Record Transaction</span>
              </>
            )}
          </button>
        </form>
      </div>
      
      {/* Recent Transactions List */}
      <div className="lg:col-span-2 glass-card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center mr-4">
              <BarChartIcon className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-surface-900 dark:text-white">
              Recent Transactions
            </h2>
          </div>
          
          {transactions.length === 0 && (
            <button 
              onClick={() => {
                toast.info('Data refreshed', {
                  icon: () => <RefreshCcwIcon className="h-5 w-5 text-blue-500" />
                });
              }}
              className="p-2 rounded-lg bg-surface-100 hover:bg-surface-200 dark:bg-surface-700 dark:hover:bg-surface-600 text-surface-600 dark:text-surface-300"
            >
              <RefreshCcwIcon className="h-5 w-5" />
            </button>
          )}
        </div>
        
        {transactions.length === 0 ? (
          <motion.div 
            className="flex flex-col items-center justify-center py-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="h-16 w-16 bg-surface-200 dark:bg-surface-700 rounded-full flex items-center justify-center mb-4">
              <PackageIcon className="h-8 w-8 text-surface-400 dark:text-surface-500" />
            </div>
            <h3 className="text-lg font-medium text-surface-800 dark:text-surface-200 mb-2">
              No Transactions Yet
            </h3>
            <p className="text-surface-600 dark:text-surface-400 max-w-sm mb-6">
              Record your first inventory transaction using the form on the left to get started.
            </p>
            <button
              onClick={() => {
                toast.info('Let\'s add some sample data', {
                  icon: () => <WarningIcon className="h-5 w-5 text-blue-500" />
                });
                
                // Simulate getting sample data
                setTimeout(() => {
                  setTransactions([
                    { 
                      id: 'txn-001', 
                      date: new Date(2023, 10, 10).toISOString(), 
                      type: 'stock-in', 
                      productId: '1', 
                      quantity: 50, 
                      description: 'Initial inventory'
                    },
                    { 
                      id: 'txn-002', 
                      date: new Date(2023, 10, 12).toISOString(), 
                      type: 'stock-out', 
                      productId: '1', 
                      quantity: 5, 
                      description: 'Order #45892'
                    },
                    { 
                      id: 'txn-003', 
                      date: new Date(2023, 10, 15).toISOString(), 
                      type: 'adjustment', 
                      productId: '2', 
                      quantity: 10, 
                      description: 'Inventory count correction'
                    }
                  ]);
                  
                  toast.success('Sample transactions loaded!');
                }, 1000);
              }}
              className="bg-surface-100 hover:bg-surface-200 dark:bg-surface-800 dark:hover:bg-surface-700 text-surface-700 dark:text-surface-300 font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Load Sample Data
            </button>
          </motion.div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-surface-200 dark:divide-surface-700">
              <thead>
                <tr>
                  <th className="px-4 py-3 bg-surface-50 dark:bg-surface-800 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-4 py-3 bg-surface-50 dark:bg-surface-800 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 py-3 bg-surface-50 dark:bg-surface-800 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-4 py-3 bg-surface-50 dark:bg-surface-800 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-4 py-3 bg-surface-50 dark:bg-surface-800 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-4 py-3 bg-surface-50 dark:bg-surface-800 text-right text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-surface-800 divide-y divide-surface-200 dark:divide-surface-700">
                {transactions.map(transaction => {
                  const typeInfo = transactionTypeInfo[transaction.type] || transactionTypeInfo['adjustment'];
                  const TransactionIcon = typeInfo.icon;
                  
                  return (
                    <motion.tr 
                      key={transaction.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="hover:bg-surface-50 dark:hover:bg-surface-700"
                    >
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-surface-600 dark:text-surface-300">
                        {formatDate(transaction.date)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${typeInfo.color}`}>
                          <TransactionIcon className="h-3 w-3" />
                          {typeInfo.label}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-surface-900 dark:text-white">
                        {getProductNameById(transaction.productId)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-surface-600 dark:text-surface-300">
                        {transaction.quantity.toLocaleString()}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-surface-600 dark:text-surface-300 max-w-[200px] truncate">
                        {transaction.description}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleDeleteTransaction(transaction.id)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainFeature;