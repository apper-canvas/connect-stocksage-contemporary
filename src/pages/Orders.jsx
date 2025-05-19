import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePurchaseOrders } from '../context/PurchaseOrderContext';
import { useSalesOrderContext } from '../context/SalesOrderContext';
import { motion } from 'framer-motion';
import { getIcon } from '../utils/iconUtils';
import PurchaseOrderStatusBadge from '../components/PurchaseOrderStatusBadge';

// Import all icons used in the component
const PlusIcon = getIcon('plus');
const ArrowRightIcon = getIcon('arrow-right');
const UsersIcon = getIcon('users');
const ArrowLeftIcon = getIcon('arrow-left');
const SearchIcon = getIcon('search');
const FilterIcon = getIcon('filter');
const SortAscIcon = getIcon('arrow-up');
const SortDescIcon = getIcon('arrow-down');
const ClipboardIcon = getIcon('clipboard-list');
const ChevronDownIcon = getIcon('chevron-down');
const EyeIcon = getIcon('eye');
const TruckIcon = getIcon('truck');
const UserIcon = getIcon('user');
const DollarSignIcon = getIcon('dollar-sign');
const SaveIcon = getIcon('save');
const EditIcon = getIcon('edit');
const XIcon = getIcon('x');
const BoxIcon = getIcon('box');
const CalendarIcon = getIcon('calendar');
const ExternalLinkIcon = getIcon('external-link');

const Orders = () => {
  const navigate = useNavigate();
  const { purchaseOrders, updateOrderStatus } = usePurchaseOrders();
  const { salesOrders } = useSalesOrderContext();
  
  const [activeTab, setActiveTab] = useState('purchase');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('orderDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [purchaseOrdersData, setPurchaseOrders] = useState([]);
  const [notification, setNotification] = useState({ visible: false, message: '', type: '' });
  
  // Update filtered orders when tab, search term, or orders change
  useEffect(() => {
    const orders = activeTab === 'purchase' ? purchaseOrders : salesOrders;
    if (!searchTerm || searchTerm.trim() === '') {
      setFilteredOrders(orders);
    } else {
      const lowercasedSearch = searchTerm.toLowerCase();
      setFilteredOrders(orders.filter(order => 
        (order.orderNumber && order.orderNumber.toLowerCase().includes(lowercasedSearch)) ||
        (activeTab === 'purchase' && order.supplier && order.supplier.name && order.supplier.name.toLowerCase().includes(lowercasedSearch)) ||
        (activeTab === 'sales' && order.customer && order.customer.name && order.customer.name.toLowerCase().includes(lowercasedSearch)) ||
        (order.status && order.status.toLowerCase().includes(lowercasedSearch))
      ));
    }
  }, [searchTerm, purchaseOrders, salesOrders, activeTab]);
  
  // Update purchase orders data when context changes
  useEffect(() => {
    setPurchaseOrders(purchaseOrders);
  }, [purchaseOrders]);
  
  // Get status badge styling
  const getStatusClass = (status) => {
    const statusClasses = {
      'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'in-progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'processing': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'in-transit': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'delivered': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'cancelled': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    return statusClasses[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  };
            
  /* Removed sample data that was mixed in the component */

      items: [
        { name: "Bluetooth Speakers", quantity: 8, price: 69.99 },
        { name: "HDMI Cables", quantity: 15, price: 14.99 },
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">{activeTab === 'purchase' ? 'Supplier' : 'Customer'}</th>
      ],
      totalAmount: 4325.50, 
      orderDate: "2023-09-01", 
      expectedDelivery: "2023-09-10", 
      status: "pending",
      contactPerson: "Michael Chen",
      contactEmail: "michael@qualityelectronics.com",
      contactPhone: "(555) 456-7890",
                {filteredOrders.length > 0 ? filteredOrders.map(order => (
                    <tr 
                      key={order.id} 
                      className="hover:bg-surface-50 dark:hover:bg-surface-900 cursor-pointer"
                      onClick={() => navigate(activeTab === 'purchase' ? `/purchase-order/${order.id}` : `/sales-order/${order.id}`)}
      id: "PO-2023-004", 
                      <td className="px-6 py-4 whitespace-nowrap">
                        {activeTab === 'purchase' ? order.supplier.name : order.customer.name}
                      </td>
      items: [
        { name: "Office Chairs", quantity: 5, price: 129.99 },
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(order.status)}`}
>
        { name: "Filing Cabinets", quantity: 2, price: 89.99 }
      ],
      totalAmount: 1879.90, 
                      <td className="px-6 py-4 whitespace-nowrap">
                        ${typeof order.totalAmount === 'number' ? order.totalAmount.toFixed(2) : order.totalAmount}
                      </td>
      expectedDelivery: "2023-09-25", 
                        <button className="text-primary hover:text-primary-dark inline-flex items-center">
                          View 
                          <ArrowRightIcon className="w-4 h-4 ml-1" />
                        </button>
      contactPerson: "Lisa Rodriguez",
      contactEmail: "lisa@furnitureplus.com",
                )) : (
    },
    { 
                      {searchTerm 
                        ? 'No matching orders found.' 
                        : activeTab === 'purchase' 
                          ? 'No purchase orders found. Create your first purchase order!' 
                          : 'No sales orders found. Create your first sales order!'}
      supplier: "Digital Solutions", 
      items: [
        { name: "USB Flash Drives", quantity: 25, price: 12.99 },
        { name: "External Hard Drives", quantity: 10, price: 89.99 },
        { name: "Wireless Mice", quantity: 15, price: 24.99 }
      ],
      totalAmount: 3149.50, 
      orderDate: "2023-09-10", 
      expectedDelivery: "2023-09-17", 
      status: "pending",
      contactPerson: "David Wilson",
      contactEmail: "david@digitalsolutions.com",
      contactPhone: "(555) 234-5678",
      deliveryAddress: "654 Digital Avenue, Tech Park, TP 56789"
    }
  ]);
  
  // Update orders when context changes
  useEffect(() => {
    // Use purchaseOrders from context
    setPurchaseOrders(purchaseOrders);
    });

  const handleOpenOrderDetails = (order, event) => {
    setSelectedOrder(order);
    setIsOrderDetailsOpen(true);
    setNewStatus(order.status);
  };
  
  const handleCloseOrderDetails = () => {
    setIsOrderDetailsOpen(false);
    setSelectedOrder(null);
    setIsEditingStatus(false);
  };

  // Show notification toast
  const showNotification = (message, type = 'success') => {
    setNotification({ visible: true, message, type });
    setTimeout(() => {
      setNotification({ visible: false, message: '', type: '' });
    }, 3000);
  };
  
  const handleStatusChange = (e) => {
    setNewStatus(e.target.value);
  };
  
  const handleStatusNoteChange = (e) => {
    setStatusNote(e.target.value);
  };
  
  const handleUpdateStatus = () => {
    if (newStatus && selectedOrder) {
      try {
        // Update using context
        updateOrderStatus(selectedOrder.id, newStatus, statusNote);
        
        // Also update local state
        setSelectedOrder({ ...selectedOrder, status: newStatus });
        setIsEditingStatus(false);
        setStatusNote('');
        showNotification('Order status updated successfully');
      } catch (error) {
        showNotification('Failed to update order status', 'error');
      }
      setSelectedOrder({ ...selectedOrder, status: newStatus });
      setIsEditingStatus(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Notification toast */}
        {notification.visible && (
          <div 
            className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-white ${
              notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            }`}
          >
            {notification.message}
          </div>
        )}
        
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center mb-4">
            <Link 
              to="/"
              className="mr-4 p-2 rounded-full hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 text-surface-600 dark:text-surface-300" />
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white">
              Purchase Orders
            </h1>
          </div>
          <p className="text-surface-600 dark:text-surface-400">
            Create and manage purchase orders with your suppliers. Track order status and delivery details.
          </p>
    </header>

        {/* Main content */}
        <main className="glass-card">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <SearchIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
              <input
                type="text"
                placeholder="Search by order ID or supplier..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
              />
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 focus:outline-none focus:ring-2 focus:ring-primary text-surface-900 dark:text-white"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="in-transit">In Transit</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <ChevronDownIcon className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-surface-500 pointer-events-none" />
              </div>
              
              <button
                onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                className="p-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 hover:bg-surface-100 dark:hover:bg-surface-700"
                title={sortDirection === 'asc' ? 'Sort Descending' : 'Sort Ascending'}
              >
                {sortDirection === 'asc' ? (
                  <SortAscIcon className="h-5 w-5 text-surface-600 dark:text-surface-300" />
                ) : (
                  <SortDescIcon className="h-5 w-5 text-surface-600 dark:text-surface-300" />
                )}
              </button>
              
              <Link 
                to="/purchase-order/create"
                className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
              >
                <PlusIcon className="h-5 w-5" />
                <span>New Order</span>
              </Link>
            </div>
          </div>
          
          {/* Order Type Tabs */}
          <div className="border-b border-surface-200 dark:border-surface-700 mb-6">
            <div className="flex space-x-8">
              <button 
                onClick={() => setActiveTab('purchase')}
                className={`py-3 font-medium flex items-center ${activeTab === 'purchase' 
                  ? 'border-b-2 border-primary text-primary' 
                  : 'text-surface-600 dark:text-surface-400'}`}
              >
                <ClipboardIcon className="w-4 h-4 mr-2" />
                Purchase Orders
              </button>
              <button 
                onClick={() => setActiveTab('sales')}
                className={`py-3 font-medium flex items-center ${activeTab === 'sales' 
                  ? 'border-b-2 border-primary text-primary' 
                  : 'text-surface-600 dark:text-surface-400'}`}
              >
                <UsersIcon className="w-4 h-4 mr-2" />
                Sales Orders
              </button>
            </div>
          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-surface-200 dark:divide-surface-700">
              <thead>
                <tr>
                  <th 
                    onClick={() => setSortBy('id')}
                    className="group px-4 py-3 bg-surface-50 dark:bg-surface-800 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider cursor-pointer"
                  >
                    <div className="flex items-center">
                      Order ID
                      {sortBy === 'id' && (
                        sortDirection === 'asc' 
                          ? <SortAscIcon className="h-4 w-4 ml-1 text-primary" />
                          : <SortDescIcon className="h-4 w-4 ml-1 text-primary" />
                      )}
                    </div>
                  </th>
                  <th 
                    onClick={() => setSortBy('supplier')}
                    className="group px-4 py-3 bg-surface-50 dark:bg-surface-800 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider cursor-pointer"
                  >
                    <div className="flex items-center">
                      Supplier
                      {sortBy === 'supplier' && (
                        sortDirection === 'asc' 
                          ? <SortAscIcon className="h-4 w-4 ml-1 text-primary" />
                          : <SortDescIcon className="h-4 w-4 ml-1 text-primary" />
                      )}
                    </div>
                  </th>
                  <th 
                    onClick={() => setSortBy('orderDate')}
                    className="group px-4 py-3 bg-surface-50 dark:bg-surface-800 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider cursor-pointer"
                  >
                    <div className="flex items-center">
                      Order Date
                      {sortBy === 'orderDate' && (
                        sortDirection === 'asc' 
                          ? <SortAscIcon className="h-4 w-4 ml-1 text-primary" />
                          : <SortDescIcon className="h-4 w-4 ml-1 text-primary" />
                      )}
                    </div>
                  </th>
                  <th 
                    onClick={() => setSortBy('expectedDelivery')}
                    className="group px-4 py-3 bg-surface-50 dark:bg-surface-800 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider cursor-pointer"
                  >
                    <div className="flex items-center">
                      Expected Delivery
                      {sortBy === 'expectedDelivery' && (
                        sortDirection === 'asc' 
                          ? <SortAscIcon className="h-4 w-4 ml-1 text-primary" />
                          : <SortDescIcon className="h-4 w-4 ml-1 text-primary" />
                      )}
                    </div>
                  </th>
                  <th 
                    onClick={() => setSortBy('totalAmount')}
                    className="group px-4 py-3 bg-surface-50 dark:bg-surface-800 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider cursor-pointer"
                  >
                    <div className="flex items-center">
                      Amount
                      {sortBy === 'totalAmount' && (
                        sortDirection === 'asc' 
                          ? <SortAscIcon className="h-4 w-4 ml-1 text-primary" />
                          : <SortDescIcon className="h-4 w-4 ml-1 text-primary" />
                      )}
                    </div>
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
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-4 py-8 text-center text-surface-600 dark:text-surface-400">
                      <ClipboardIcon className="mx-auto h-12 w-12 text-surface-400 dark:text-surface-600 mb-2" />
                      <p className="text-lg font-medium text-surface-900 dark:text-white mb-1">No {activeTab === 'purchase' ? 'purchase' : 'sales'} orders found</p>
                      <p className="mb-4">No orders match your current filters</p>
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setStatusFilter('all');
                        }}
                        className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg"
                      >
                        <FilterIcon className="mr-2 h-4 w-4" />
                        Clear Filters
                      </button>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map(order => (
                    <tr key={order.id} className="hover:bg-surface-50 dark:hover:bg-surface-700">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-surface-900 dark:text-white">{order.id}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-surface-700 dark:text-surface-300">{order.supplier}</div>
                        <div className="text-xs text-surface-500 dark:text-surface-400">{order.items.length} items</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-surface-600 dark:text-surface-300">
                        {new Date(order.orderDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-surface-600 dark:text-surface-300">
                        {new Date(order.expectedDelivery).toLocaleDateString()}
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
                            onClick={(e) => { e.stopPropagation(); handleOpenOrderDetails(order, e); }}
                            className="text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-primary transition-colors flex items-center gap-1"
                            title="View details"
                          >
                            <EyeIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => {
                              handleOpenOrderDetails(order);
                              setIsEditingStatus(true);
                              setNewStatus(order.status);
                              setStatusNote('');
                            }}
                            className="text-amber-500 hover:text-amber-600 dark:text-amber-400 dark:hover:text-amber-300 transition-colors flex items-center gap-1"
                            title="Update status"
                          >
                            <EditIcon className="h-5 w-5" />
                          </button>
                          <Link to={`/purchase-order/${order.id}`} className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors flex items-center gap-1">
                            <ExternalLinkIcon className="h-5 w-5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* Order Details Modal */}
      {isOrderDetailsOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-surface-800 rounded-xl shadow-xl max-w-3xl w-full max-h-[80vh] overflow-y-auto"
          >
            <div className="flex justify-between items-start p-6 border-b border-surface-200 dark:border-surface-700">
              <div>
                <h2 className="text-xl font-bold text-surface-900 dark:text-white">
                  Order Details: {selectedOrder.id}
                </h2>
                <div className="mt-1 flex items-center">
                  <span className="text-surface-600 dark:text-surface-400 text-sm mr-2">Status:</span>
                  {isEditingStatus ? (
                    <div className="flex items-center">
                      <select
                        value={newStatus || ''}
                        onChange={handleStatusChange}
                          className="w-full mb-2 text-sm rounded border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:ring-primary focus:border-primary py-1 pl-2 pr-8"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="in-transit">In Transit</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                        
                        <div className="mb-2">
                          <label className="block text-xs text-surface-600 dark:text-surface-400 mb-1">Status Note:</label>
                          <textarea
                            value={statusNote}
                            onChange={handleStatusNoteChange}
                            placeholder="Optional note about status change"
                            className="w-full text-sm rounded border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:ring-primary focus:border-primary py-1 px-2"
                            rows="2"
                          ></textarea>
                        </div>
                        
                        <div className="flex justify-end gap-2">
                          <button onClick={() => setIsEditingStatus(false)} className="text-surface-600 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-300">Cancel</button>
                          <button onClick={handleUpdateStatus}
                        className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                        title="Save status"
                      >
                        <SaveIcon className="h-5 w-5" />
                           </button>
                    </div>
                  ) : (
                      <><PurchaseOrderStatusBadge status={selectedOrder.status} /></>
                  )}
                  {!isEditingStatus && (
                    <button 
                      onClick={() => {
                        setIsEditingStatus(true);
                        setNewStatus(selectedOrder.status);
                      }}
                      className="ml-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-xs"
                    >
                      Edit
                    </button>
                  )}
                </div>
              </div>
                
                <Link to={`/purchase-order/${selectedOrder.id}`} className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-xs ml-4">
                  View Full Details
                </Link>
              <button
                onClick={handleCloseOrderDetails}
                className="text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200 transition-colors"
              >
                <XIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-medium text-surface-900 dark:text-white flex items-center text-lg mb-3">
                    <TruckIcon className="h-5 w-5 mr-2 text-primary" />
                    Supplier Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-surface-600 dark:text-surface-400">Company:</span>
                      <span className="text-surface-900 dark:text-white font-medium">{selectedOrder.supplier}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-surface-600 dark:text-surface-400">Contact Person:</span>
                      <span className="text-surface-900 dark:text-white">{selectedOrder.contactPerson}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-surface-600 dark:text-surface-400">Email:</span>
                      <span className="text-surface-900 dark:text-white">{selectedOrder.contactEmail}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-surface-600 dark:text-surface-400">Phone:</span>
                      <span className="text-surface-900 dark:text-white">{selectedOrder.contactPhone}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-surface-900 dark:text-white flex items-center text-lg mb-3">
                    <CalendarIcon className="h-5 w-5 mr-2 text-primary" />
                    Order Timeline
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-surface-600 dark:text-surface-400">Order Date:</span>
                      <span className="text-surface-900 dark:text-white">{new Date(selectedOrder.orderDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-surface-600 dark:text-surface-400">Expected Delivery:</span>
                      <span className="text-surface-900 dark:text-white">{new Date(selectedOrder.expectedDelivery).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-surface-600 dark:text-surface-400">Delivery Address:</span>
                      <span className="text-surface-900 dark:text-white">{selectedOrder.deliveryAddress}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <h3 className="font-medium text-surface-900 dark:text-white flex items-center text-lg mb-3">
                <BoxIcon className="h-5 w-5 mr-2 text-primary" />
                Order Items
              </h3>
              <div className="overflow-x-auto mb-4">
                <table className="min-w-full divide-y divide-surface-200 dark:divide-surface-700">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 bg-surface-50 dark:bg-surface-700 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-4 py-2 bg-surface-50 dark:bg-surface-700 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-4 py-2 bg-surface-50 dark:bg-surface-700 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                        Unit Price
                      </th>
                      <th className="px-4 py-2 bg-surface-50 dark:bg-surface-700 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-surface-800 divide-y divide-surface-200 dark:divide-surface-700">
                    {selectedOrder.items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-surface-900 dark:text-white">
                          {item.name}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-surface-600 dark:text-surface-300">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-surface-600 dark:text-surface-300">
                          ${item.price.toFixed(2)}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-surface-900 dark:text-white">
                          ${(item.quantity * item.price).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="3" className="px-4 py-2 text-sm font-medium text-right text-surface-900 dark:text-white">
                        Total Amount:
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-bold text-surface-900 dark:text-white">
                        ${selectedOrder.totalAmount.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Orders;