import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getIcon } from '../utils/iconUtils';
import MainFeature from '../components/MainFeature';
import { useProducts } from '../context/ProductContext';
import { useSuppliers } from '../context/SupplierContext';
import ProductForm from '../components/ProductForm';
import PurchaseOrderStatusBadge from '../components/PurchaseOrderStatusBadge';
import ProductList from '../components/ProductList';
import ProductBatchModel from '../components/ProductBatchModel';

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
const EyeIcon = getIcon('eye');
const RefreshCwIcon = getIcon('refresh-cw');

const Dashboard = () => {
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { products } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');

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
  };
  
  const { suppliers, isLoading } = useSuppliers();
  
  const toggleProductModal = (product = null) => {
    setSelectedProduct(product);
    setIsProductModalOpen(prev => !prev);
    if (!isProductModalOpen) setSelectedProduct(null);
  };

  const navigateToPurchaseOrderWizard = () => {
    window.location.href = '/purchase-order/create';
  };

  const navigateToExpiryReport = () => {
    window.location.href = '/reports/product-expiry';
  };
  
  const navigateToOrders = () => {
    window.location.href = '/orders';
  };
  
  const viewOrderDetails = (orderId) => {
  };

  const navigateToSuppliers = () => {
    window.location.href = '/suppliers';
  };

  
  // Sample purchase orders data
  const purchaseOrders = [
    { 
      id: "PO-2023-001", 
      supplier: "TechHub Distributors", 
      items: 12, 
      totalAmount: 5240.80, 
      orderDate: "2023-08-15", 
      expectedDelivery: "2023-08-22", 
      status: "delivered"
    },
    { 
      id: "PO-2023-002", 
      supplier: "Office Supplies Co", 
      items: 45, 
      totalAmount: 1875.25, 
      orderDate: "2023-08-20", 
      expectedDelivery: "2023-09-02", 
      status: "in-transit" 
    },
    { 
      id: "PO-2023-003", 
      supplier: "Quality Electronics", 
      items: 8, 
      totalAmount: 4325.50, 
      orderDate: "2023-09-01", 
      expectedDelivery: "2023-09-10", 
      status: "pending"
    }
  ];
  
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
                  {/* Main product list with filters */}
                  <ProductList onEditProduct={toggleProductModal} />
                  
                  <div className="flex justify-end mb-6">
                    <button onClick={toggleProductModal} className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2">
                      <PlusIcon className="h-5 w-5" />
                      <span>Add New Product</span>
                    </button>
                  </div>
                  
                  {/* Product form modal */}
                  {isProductModalOpen && (
                    <ProductForm 
                      isOpen={isProductModalOpen} 
                      onClose={() => toggleProductModal()} 
                      product={selectedProduct}
                    />
                  )}
                </>
              )}
              
              {activeTab === 'orders' && (
                <div className="space-y-6">
                  <div className="glass-card">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold text-surface-900 dark:text-white">
                        Purchase Orders
                      </h2>
                      <div className="flex gap-2">
                        <button
                          onClick={navigateToOrders}
                          className="bg-surface-200 dark:bg-surface-700 hover:bg-surface-300 dark:hover:bg-surface-600 text-surface-900 dark:text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
                        >
                          <ExternalLinkIcon className="h-5 w-5" />
                          <span>View All</span>
                        </button>
                        <button 
                          onClick={navigateToPurchaseOrderWizard}
                          className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
                        >
                          <ClipboardIcon className="h-5 w-5" />
                          <span>Create Order</span>
                        </button>
                      </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-surface-200 dark:divide-surface-700">
                        <thead>
                          <tr>
                            <th className="px-4 py-3 bg-surface-50 dark:bg-surface-800 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                              Order ID
                            </th>
                            <th className="px-4 py-3 bg-surface-50 dark:bg-surface-800 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                              Supplier
                            </th>
                            <th className="px-4 py-3 bg-surface-50 dark:bg-surface-800 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-4 py-3 bg-surface-50 dark:bg-surface-800 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                              Amount
                            </th>
                            <th className="px-4 py-3 bg-surface-50 dark:bg-surface-800 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-4 py-3 bg-surface-50 dark:bg-surface-800 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-surface-800 divide-y divide-surface-200 dark:divide-surface-700">
                          {purchaseOrders.map(order => (
                            <tr key={order.id} className="hover:bg-surface-50 dark:hover:bg-surface-700">
                              <td className="px-4 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-surface-900 dark:text-white">{order.id}</div>
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap">
                                <div className="text-sm text-surface-600 dark:text-surface-300">{order.supplier}</div>
                                <div className="text-xs text-surface-500 dark:text-surface-400">{order.items} items</div>
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap">
                                <div className="text-sm text-surface-600 dark:text-surface-300">
                                  {new Date(order.orderDate).toLocaleDateString()}
                                </div>
                                <div className="text-xs text-surface-500 dark:text-surface-400">
                                  Expected: {new Date(order.expectedDelivery).toLocaleDateString()}
                                </div>
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-surface-900 dark:text-white">
                                  ${order.totalAmount.toFixed(2)}
                                </div>
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap">
                                <PurchaseOrderStatusBadge status={order.status} />
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => viewOrderDetails(order.id)}
                                    className="text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-primary transition-colors"
                                    title="View details"
                                  >
                                    <EyeIcon className="h-5 w-5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="flex justify-center mt-6">
                      <button
                        onClick={navigateToOrders}
                        className="inline-flex items-center gap-2 text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-primary"
                      >
                        <span>View all purchase orders</span>
                        <ExternalLinkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="glass-card">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-semibold text-surface-900 dark:text-white">
                        Recent Activity
                      </h2>
                      <RefreshCwIcon className="h-5 w-5 text-surface-500 dark:text-surface-400" />
                    </div>
                    <p className="text-surface-600 dark:text-surface-300">Track your recent order activities and status changes here.</p>
                  </div>
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