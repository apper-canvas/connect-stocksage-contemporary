import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify'; 
import { getIcon } from '../utils/iconUtils';
import MainFeature from '../components/MainFeature';
import { useSuppliers } from '../context/SupplierContext';

// Define icons using getIcon utility
const BarChart3Icon = getIcon('bar-chart-3');
const BoxIcon = getIcon('box');
const TruckIcon = getIcon('truck');
const UsersIcon = getIcon('users');
const AlertCircleIcon = getIcon('alert-circle');
const ArrowUpIcon = getIcon('arrow-up');
const ArrowDownIcon = getIcon('arrow-down');
const GaugeIcon = getIcon('gauge');
const SearchIcon = getIcon('search');
const ClipboardIcon = getIcon('clipboard-list');
const CalendarIcon = getIcon('calendar');
const FilterIcon = getIcon('filter');
const ChevronDownIcon = getIcon('chevron-down');
const SortAscIcon = getIcon('arrow-up');
const SortDescIcon = getIcon('arrow-down');
const HashIcon = getIcon('hash');
const ClockIcon = getIcon('clock');
const PlusIcon = getIcon('plus');
const FileTextIcon = getIcon('file-text');
const ExternalLinkIcon = getIcon('external-link');
const BuildingIcon = getIcon('building');

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const { suppliers, isLoading } = useSuppliers();

  // Sample data for the dashboard overview
  const overview = [
    { 
      id: 1, 
      title: 'Total Products', 
      value: 1248, 
      change: 12.5, 
      status: 'increase', 
      icon: BoxIcon,
      color: 'bg-blue-500 dark:bg-blue-600' 
    },
    { 
      id: 2, 
      title: 'Low Stock Items', 
      value: 42, 
      change: 8.3, 
      status: 'increase', 
      icon: AlertCircleIcon,
      color: 'bg-orange-500 dark:bg-orange-600' 
    },
    { 
      id: 3, 
      title: 'Pending Orders', 
      value: 37, 
      change: 3.2, 
      status: 'decrease', 
      icon: TruckIcon,
      color: 'bg-purple-500 dark:bg-purple-600' 
    },
    { 
      id: 4, 
      title: 'Active Suppliers', 
      value: 86, 
      change: 0, 
      status: 'neutral', 
      icon: UsersIcon,
      color: 'bg-green-500 dark:bg-green-600' 
    }
  ];

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    toast.info(`Navigated to ${tab.charAt(0).toUpperCase() + tab.slice(1)}`, {
      icon: () => {
        const TabIcon = getIcon(tab === 'dashboard' ? 'layout-dashboard' : 
                            tab === 'inventory' ? 'package' : 
                            tab === 'orders' ? 'clipboard-list' : 'users');
        return <TabIcon className="h-5 w-5" />;
      }
    });
  };
  
  const navigateToPurchaseOrderWizard = () => {
    window.location.href = '/purchase-order/create';
  };

  const navigateToExpiryReport = () => {
    window.location.href = '/reports/product-expiry';
  };

  const navigateToSuppliers = () => {
    window.location.href = '/suppliers';
  };

  // Sample product data with batch and expiry for the inventory tab
  const products = [
    { id: 1, name: 'Wireless Headphones', sku: 'WH-101', category: 'Electronics', stock: 45, batchNumber: 'BT-20230801', expiryDate: '2024-02-15', location: 'Warehouse A' },
    { id: 2, name: 'Smartphone Charger', sku: 'SC-202', category: 'Electronics', stock: 120, batchNumber: 'BT-20230715', expiryDate: '2025-07-10', location: 'Warehouse A' },
    { id: 3, name: 'Laptop Sleeve', sku: 'LS-303', category: 'Accessories', stock: 18, batchNumber: 'BT-20220512', expiryDate: '2023-12-01', location: 'Warehouse B' },
    { id: 4, name: 'Bluetooth Speaker', sku: 'BS-404', category: 'Electronics', stock: 32, batchNumber: 'BT-20230610', expiryDate: '2024-01-05', location: 'Warehouse B' },
    { id: 5, name: 'HDMI Cable', sku: 'HC-505', category: 'Accessories', stock: 64, batchNumber: 'BT-20230420', expiryDate: '2026-04-20', location: 'Warehouse C' },
  ];

  // State for inventory filtering and sorting
  const [batchFilter, setBatchFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-800">
      {/* Side Navigation */}
      <aside className="fixed inset-y-0 left-0 z-10 transform -translate-x-full md:translate-x-0 transition-transform duration-300 ease-in-out bg-white dark:bg-surface-800 shadow-soft w-64 overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center">
              <GaugeIcon className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-surface-900 dark:text-white">StockSage</h1>
          </div>
          
          <nav className="space-y-1">
            {['dashboard', 'inventory', 'orders', 'suppliers'].map((tab) => {
              const NavIcon = getIcon(
                tab === 'dashboard' ? 'layout-dashboard' : 
                tab === 'inventory' ? 'package' : 
                tab === 'orders' ? 'clipboard-list' : 'users'
              );
              
              return (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={`flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200 ${
                    activeTab === tab
                      ? 'bg-primary text-white shadow-md'
                      : 'hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-700 dark:text-surface-300'
                  }`}
                >
                  <NavIcon className="h-5 w-5 mr-3" />
                  <span className="capitalize">{tab}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="md:ml-64 p-4 md:p-8 w-full">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white">
                  {activeTab === 'dashboard' ? 'Dashboard Overview' :
                   activeTab === 'inventory' ? 'Inventory Management' :
                   activeTab === 'orders' ? 'Purchase Orders' : 'Supplier Management'}
                </h1>
                <p className="text-surface-600 dark:text-surface-400 mt-1">
                  {activeTab === 'dashboard' ? 'Monitor your stock status and key metrics' :
                   activeTab === 'inventory' ? 'Track and manage your product inventory' :
                   activeTab === 'orders' ? 'Create and manage purchase orders' : 'Manage your supplier information'}
                </p>
              </div>
              
              <div className="relative">
                <SearchIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full md:w-64 pl-10 pr-4 py-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
                />
              </div>
            </div>
          </header>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'dashboard' && (
                <>
                  {/* Dashboard Stats Overview */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {overview.map((stat) => (
                      <div 
                        key={stat.id}
                        className="glass-card flex flex-col"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className={`p-3 rounded-full ${stat.color}`}>
                            <stat.icon className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex items-center px-2 py-1 rounded-full text-xs font-medium">
                            {stat.status !== 'neutral' && (
                              <>
                                {stat.status === 'increase' ? (
                                  <ArrowUpIcon className="h-3 w-3 mr-1 text-green-500" />
                                ) : (
                                  <ArrowDownIcon className="h-3 w-3 mr-1 text-red-500" />
                                )}
                                <span className={stat.status === 'increase' ? 'text-green-500' : 'text-red-500'}>
                                  {stat.change}%
                                </span>
                              </>
                            )}
                            {stat.status === 'neutral' && (
                              <span className="text-surface-500">No change</span>
                            )}
                          </div>
                        </div>
                        <h3 className="text-3xl font-bold mb-1 text-surface-900 dark:text-white">
                          {stat.value.toLocaleString()}
                        </h3>
                        <p className="text-surface-600 dark:text-surface-300">
                          {stat.title}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Main Feature */}
                  <MainFeature />
                </>
              )}

              {activeTab === 'inventory' && (
                <>
                  <div className="glass-card mb-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold text-surface-900 dark:text-white">
                        Product Inventory
                      </h2>
                      <div className="flex gap-2">
                        <button className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2">
                          <PlusIcon className="h-5 w-5" />
                          <span>Add Product</span>
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                      <div className="relative flex-1">
                        <SearchIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
                        <input
                          type="text"
                          placeholder="Search products by name, SKU, or batch number..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
                        />
                      </div>
                      
                      <div className="relative">
                        <HashIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
                        <input
                          type="text"
                          placeholder="Filter by batch #"
                          value={batchFilter}
                          onChange={(e) => setBatchFilter(e.target.value)}
                          className="w-full md:w-48 pl-10 pr-4 py-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
                        />
                      </div>
                      
                      <div className="relative">
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="appearance-none w-full md:w-48 pl-10 pr-4 py-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
                        >
                          <option value="name">Sort by Name</option>
                          <option value="sku">Sort by SKU</option>
                          <option value="stock">Sort by Stock</option>
                          <option value="expiryDate">Sort by Expiry Date</option>
                        </select>
                        <FilterIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
                        <ChevronDownIcon className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
                      </div>
                      
                      <button
                        onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                        className="px-3 py-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-600 dark:text-surface-300"
                      >
                        {sortDirection === 'asc' ? (
                          <SortAscIcon className="h-5 w-5" />
                        ) : (
                          <SortDescIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    
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
                              Stock
                            </th>
                            <th className="px-4 py-3 bg-surface-50 dark:bg-surface-800 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                              Location
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-surface-800 divide-y divide-surface-200 dark:divide-surface-700">
                          {products
                            .filter(product => 
                              (product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              product.batchNumber.toLowerCase().includes(searchQuery.toLowerCase())) &&
                              product.batchNumber.toLowerCase().includes(batchFilter.toLowerCase())
                            )
                            .sort((a, b) => {
                              let first = a[sortBy];
                              let second = b[sortBy];
                              
                              if (sortBy === 'expiryDate') {
                                first = new Date(first);
                                second = new Date(second);
                              }
                              
                              if (sortDirection === 'asc') {
                                return first > second ? 1 : -1;
                              } else {
                                return first < second ? 1 : -1;
                              }
                            })
                            .map(product => {
                              const isExpired = new Date(product.expiryDate) < new Date();
                              const isNearExpiry = !isExpired && (new Date(product.expiryDate) - new Date()) / (1000 * 60 * 60 * 24) < 30;
                              
                              return (
                                <tr key={product.id} className="hover:bg-surface-50 dark:hover:bg-surface-700">
                                  <td className="px-4 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-surface-900 dark:text-white">{product.name}</div>
                                    <div className="text-sm text-surface-500 dark:text-surface-400">{product.sku}</div>
                                  </td>
                                  <td className="px-4 py-4 whitespace-nowrap text-sm text-surface-600 dark:text-surface-300">{product.batchNumber}</td>
                                  <td className="px-4 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      isExpired 
                                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
                                        : isNearExpiry
                                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                    }`}>
                                      {isExpired ? (
                                        <>
                                          <AlertCircleIcon className="h-3 w-3" />
                                          Expired
                                        </>
                                      ) : isNearExpiry ? (
                                        <>
                                          <ClockIcon className="h-3 w-3" />
                                          {new Date(product.expiryDate).toLocaleDateString()}
                                        </>
                                      ) : (
                                        new Date(product.expiryDate).toLocaleDateString()
                                      )}
                                    </span>
                                  </td>
                                  <td className="px-4 py-4 whitespace-nowrap text-sm text-surface-600 dark:text-surface-300">{product.stock} units</td>
                                  <td className="px-4 py-4 whitespace-nowrap text-sm text-surface-600 dark:text-surface-300">{product.location}</td>
                                </tr>
                              );
                            })
                          }
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div className="glass-card">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center">
                        <CalendarIcon className="h-6 w-6 text-orange-500 mr-2" />
                        <h2 className="text-xl font-semibold text-surface-900 dark:text-white">
                          Products Approaching Expiry
                        </h2>
                      </div>
                      <button
                        onClick={navigateToExpiryReport}
                        className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
                      >
                        <FileTextIcon className="h-5 w-5" />
                        <span>View Full Report</span>
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {products
                        .filter(product => {
                          const expiryDate = new Date(product.expiryDate);
                          const today = new Date();
                          const daysUntilExpiry = Math.floor((expiryDate - today) / (1000 * 60 * 60 * 24));
                          return daysUntilExpiry <= 90 && daysUntilExpiry > -30; // Show recently expired and soon to expire
                        })
                        .sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate))
                        .slice(0, 3)
                        .map(product => {
                          const expiryDate = new Date(product.expiryDate);
                          const today = new Date();
                          const daysUntilExpiry = Math.floor((expiryDate - today) / (1000 * 60 * 60 * 24));
                          const isExpired = daysUntilExpiry < 0;
                          
                          return (
                            <div key={product.id} className="border border-surface-200 dark:border-surface-700 rounded-lg p-4 bg-white dark:bg-surface-800">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <h3 className="font-semibold text-surface-900 dark:text-white">{product.name}</h3>
                                  <p className="text-sm text-surface-500 dark:text-surface-400">{product.sku}</p>
                                </div>
                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  isExpired 
                                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
                                    : daysUntilExpiry <= 30
                                      ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                }`}>
                                  {isExpired 
                                    ? 'Expired' 
                                    : daysUntilExpiry === 0
                                      ? 'Expires Today'
                                      : `${daysUntilExpiry} days left`}
                                </span>
                              </div>
                              
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-surface-600 dark:text-surface-400">Batch:</span>
                                  <span className="text-surface-900 dark:text-white">{product.batchNumber}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-surface-600 dark:text-surface-400">Expiry Date:</span>
                                  <span className="text-surface-900 dark:text-white">{expiryDate.toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-surface-600 dark:text-surface-400">Stock Remaining:</span>
                                  <span className="text-surface-900 dark:text-white">{product.stock} units</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-surface-600 dark:text-surface-400">Location:</span>
                                  <span className="text-surface-900 dark:text-white">{product.location}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      }
                    </div>
                  </div>
                </>
              )}
              
              {activeTab === 'orders' && (
                <div className="glass-card">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-surface-900 dark:text-white">
                      Purchase Orders
                    </h2>
                    <button 
                      onClick={navigateToPurchaseOrderWizard}
                      className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <ClipboardIcon className="h-5 w-5" />
                      <span>Create Order</span>
                    </button>
                  </div>
                  
                  <p className="text-surface-600 dark:text-surface-300 pb-4 border-b border-surface-200 dark:border-surface-700">
                    This feature will be available in the full version. You can create purchase orders, track delivery status, and manage supplier orders here.
                  </p>
                </div>
              )}
              
              {activeTab === 'suppliers' && (
                <div className="space-y-6">
                  <div className="glass-card">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-surface-900 dark:text-white">
                      Supplier Management
                    </h2>
                    <div className="flex gap-2">
                      <button
                        onClick={navigateToSuppliers}
                        className="bg-surface-200 dark:bg-surface-700 hover:bg-surface-300 dark:hover:bg-surface-600 text-surface-900 dark:text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
                      >
                        <ExternalLinkIcon className="h-5 w-5" />
                        <span>View All</span>
                      </button>
                      <Link
                        to="/suppliers"
                        className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
                      >
                        <PlusIcon className="h-5 w-5" />
                        <span>Add Supplier</span>
                      </Link>
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    {isLoading ? (
                      <div className="flex justify-center items-center h-40">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
                      </div>
                    ) : suppliers.length === 0 ? (
                      <div className="text-center py-10 border border-dashed border-surface-300 dark:border-surface-600 rounded-lg">
                        <BuildingIcon className="h-12 w-12 mx-auto text-surface-400 dark:text-surface-500 mb-3" />
                        <h3 className="text-lg font-medium text-surface-900 dark:text-white mb-1">No suppliers found</h3>
                        <p className="text-surface-600 dark:text-surface-400 mb-4">
                          You haven't added any suppliers yet
                        </p>
                        <Link
                          to="/suppliers"
                          className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg"
                        >
                          <PlusIcon className="h-5 w-5" />
                          <span>Add Your First Supplier</span>
                        </Link>
                      </div>
                    ) : (
                      <table className="min-w-full divide-y divide-surface-200 dark:divide-surface-700">
                        <thead>
                          <tr>
                            <th className="px-4 py-3 bg-surface-50 dark:bg-surface-800 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                              Supplier Name
                            </th>
                            <th className="px-4 py-3 bg-surface-50 dark:bg-surface-800 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                              Contact Person
                            </th>
                            <th className="px-4 py-3 bg-surface-50 dark:bg-surface-800 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                              Categories
                            </th>
                            <th className="px-4 py-3 bg-surface-50 dark:bg-surface-800 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-surface-800 divide-y divide-surface-200 dark:divide-surface-700">
                          {suppliers.slice(0, 3).map(supplier => (
                            <tr key={supplier.id} className="hover:bg-surface-50 dark:hover:bg-surface-700">
                              <td className="px-4 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-surface-900 dark:text-white">{supplier.name}</div>
                                <div className="text-sm text-surface-500 dark:text-surface-400">{supplier.email}</div>
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-surface-600 dark:text-surface-300">{supplier.contactPerson}</td>
                              <td className="px-4 py-4 whitespace-nowrap">
                                {supplier.categories.map(category => (
                                  <span key={category} className="inline-block px-2 py-1 text-xs font-medium bg-surface-100 dark:bg-surface-700 text-surface-800 dark:text-surface-200 rounded-full mr-1">{category}</span>
                                ))}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm"><span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${supplier.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>{supplier.status}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;