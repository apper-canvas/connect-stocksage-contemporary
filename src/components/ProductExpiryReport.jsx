import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';

// Icons
const ArrowLeftIcon = getIcon('arrow-left');
const CalendarIcon = getIcon('calendar');
const ClockIcon = getIcon('clock');
const AlertTriangleIcon = getIcon('alert-triangle');
const AlertCircleIcon = getIcon('alert-circle');
const CheckCircleIcon = getIcon('check-circle');
const FilterIcon = getIcon('filter');
const SearchIcon = getIcon('search');
const PackageIcon = getIcon('package');
const ChevronDownIcon = getIcon('chevron-down');
const RefreshCwIcon = getIcon('refresh-cw');

const ProductExpiryReport = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expiryFilter, setExpiryFilter] = useState('all');
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Sample product data with batch and expiry info
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setProducts([
          {
            id: '1',
            name: 'Wireless Headphones',
            sku: 'WH-101',
            category: 'Electronics',
            batchNumber: 'BT-20230801',
            expiryDate: '2024-02-15',
            currentStock: 45,
            location: 'Warehouse A'
          },
          {
            id: '2',
            name: 'Smartphone Charger',
            sku: 'SC-202',
            category: 'Electronics',
            batchNumber: 'BT-20230715',
            expiryDate: '2025-07-10',
            currentStock: 120,
            location: 'Warehouse A'
          },
          {
            id: '3',
            name: 'Laptop Sleeve',
            sku: 'LS-303',
            category: 'Accessories',
            batchNumber: 'BT-20220512',
            expiryDate: '2023-12-01',
            currentStock: 18,
            location: 'Warehouse B'
          },
          {
            id: '4',
            name: 'Bluetooth Speaker',
            sku: 'BS-404',
            category: 'Electronics',
            batchNumber: 'BT-20230610',
            expiryDate: '2024-01-05',
            currentStock: 32,
            location: 'Warehouse B'
          },
          {
            id: '5',
            name: 'HDMI Cable',
            sku: 'HC-505',
            category: 'Accessories',
            batchNumber: 'BT-20230420',
            expiryDate: '2026-04-20',
            currentStock: 64,
            location: 'Warehouse C'
          },
        ]);
        setIsLoading(false);
      }, 800);
    };
    
    loadProducts();
  }, []);
  
  // Calculate days until expiry for a product
  const getDaysUntilExpiry = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  // Get expiry status for a product
  const getExpiryStatus = (expiryDate) => {
    const daysLeft = getDaysUntilExpiry(expiryDate);
    
    if (daysLeft < 0) return 'expired';
    if (daysLeft <= 30) return 'critical';
    if (daysLeft <= 90) return 'warning';
    return 'safe';
  };
  
  // Filter products based on search term and expiry filter
  const filteredProducts = products.filter(product => {
    // Filter by search term
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.batchNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by expiry status
    const status = getExpiryStatus(product.expiryDate);
    const matchesExpiry = expiryFilter === 'all' || status === expiryFilter;
    
    return matchesSearch && matchesExpiry;
  });
  
  // Sort products by expiry date (soonest first)
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    return new Date(a.expiryDate) - new Date(b.expiryDate);
  });
  
  // Status label and color mapping
  const statusConfig = {
    expired: { label: 'Expired', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', icon: AlertCircleIcon },
    critical: { label: 'Critical (< 30 days)', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200', icon: AlertTriangleIcon },
    warning: { label: 'Warning (< 90 days)', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', icon: ClockIcon },
    safe: { label: 'Safe', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', icon: CheckCircleIcon }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-800 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header with back button */}
        <div className="mb-6">
          <Link 
            to="/" 
            className="inline-flex items-center text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white transition-colors mb-4"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            <span>Back to Dashboard</span>
          </Link>
          
          <h1 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white mb-2">
            Product Expiry Report
          </h1>
          <p className="text-surface-600 dark:text-surface-400">
            Track products approaching expiry and manage inventory effectively
          </p>
        </div>
        
        <div className="glass-card">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <SearchIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
              <input
                type="text"
                placeholder="Search by product name, SKU or batch number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
              />
            </div>
            
            <div className="relative">
              <label className="inline-flex items-center text-sm text-surface-700 dark:text-surface-300 mb-1">
                <FilterIcon className="h-4 w-4 mr-1" />
                Expiry Status:
              </label>
              <select
                value={expiryFilter}
                onChange={(e) => setExpiryFilter(e.target.value)}
                className="block w-full md:w-48 py-2 pl-3 pr-10 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 focus:outline-none focus:ring-2 focus:ring-primary text-surface-900 dark:text-white appearance-none"
              >
                <option value="all">All Products</option>
                <option value="expired">Expired</option>
                <option value="critical">Critical (&lt; 30 days)</option>
                <option value="warning">Warning (&lt; 90 days)</option>
                <option value="safe">Safe</option>
              </select>
              <ChevronDownIcon className="h-5 w-5 absolute right-3 top-9 text-surface-400 pointer-events-none" />
            </div>
            
            <button
              onClick={() => {
                setIsLoading(true);
                setTimeout(() => {
                  setIsLoading(false);
                  toast.success('Report refreshed');
                }, 500);
              }}
              className="h-9 self-end px-3 py-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors flex items-center gap-2"
            >
              <RefreshCwIcon className="h-4 w-4" />
              <span>Refresh</span>
            </button>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <RefreshCwIcon className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-3 text-surface-600 dark:text-surface-400">Loading products...</span>
            </div>
          ) : sortedProducts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-surface-200 dark:divide-surface-700">
                <thead>
                  <tr>
                    <th className="px-4 py-3 bg-surface-50 dark:bg-surface-800 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-4 py-3 bg-surface-50 dark:bg-surface-800 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                      Batch #
                    </th>
                    <th className="px-4 py-3 bg-surface-50 dark:bg-surface-800 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                      Expiry Date
                    </th>
                    <th className="px-4 py-3 bg-surface-50 dark:bg-surface-800 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 bg-surface-50 dark:bg-surface-800 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-4 py-3 bg-surface-50 dark:bg-surface-800 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                      Location
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-surface-800 divide-y divide-surface-200 dark:divide-surface-700">
                  {sortedProducts.map(product => {
                    const status = getExpiryStatus(product.expiryDate);
                    const { color, icon: StatusIcon } = statusConfig[status];
                    const daysLeft = getDaysUntilExpiry(product.expiryDate);
                    
                    return (
                      <motion.tr 
                        key={product.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="hover:bg-surface-50 dark:hover:bg-surface-700"
                      >
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-surface-100 dark:bg-surface-700 rounded-full flex items-center justify-center">
                              <PackageIcon className="h-5 w-5 text-surface-600 dark:text-surface-400" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-surface-900 dark:text-white">{product.name}</div>
                              <div className="text-sm text-surface-500 dark:text-surface-400">{product.sku}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-surface-600 dark:text-surface-300">
                          {product.batchNumber}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-surface-600 dark:text-surface-300">
                          {new Date(product.expiryDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
                            <StatusIcon className="h-3 w-3" />
                            {daysLeft < 0 
                              ? 'Expired' 
                              : daysLeft === 0 
                                ? 'Expires Today' 
                                : `${daysLeft} days left`}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-surface-600 dark:text-surface-300">
                          {product.currentStock} units
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-surface-600 dark:text-surface-300">
                          {product.location}
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <CalendarIcon className="h-12 w-12 mx-auto mb-3 text-surface-400 dark:text-surface-600" />
              <h3 className="text-lg font-medium text-surface-900 dark:text-white mb-1">No matching products found</h3>
              <p className="text-surface-600 dark:text-surface-400">
                Try adjusting your search criteria or filters
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductExpiryReport;