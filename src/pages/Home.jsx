import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify'; 
import { getIcon } from '../utils/iconUtils';
import MainFeature from '../components/MainFeature';

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

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
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
                <div className="glass-card">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-surface-900 dark:text-white">
                      Product Inventory
                    </h2>
                    <button className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-lg transition-colors">
                      Add Product
                    </button>
                  </div>
                  
                  <p className="text-surface-600 dark:text-surface-300 pb-4 border-b border-surface-200 dark:border-surface-700">
                    This feature will be available in the full version. You can manage your product catalog, track inventory levels, and adjust stock here.
                  </p>
                </div>
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
                <div className="glass-card">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-surface-900 dark:text-white">
                      Supplier Management
                    </h2>
                    <button className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-lg transition-colors">
                      Add Supplier
                    </button>
                  </div>
                  
                  <p className="text-surface-600 dark:text-surface-300 pb-4 border-b border-surface-200 dark:border-surface-700">
                    This feature will be available in the full version. You can manage supplier information, track performance, and maintain contact details here.
                  </p>
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