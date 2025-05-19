import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { usePurchaseOrders } from '../context/PurchaseOrderContext';
import { useSuppliers } from '../context/SupplierContext';
import { motion } from 'framer-motion';
import { getIcon } from '../utils/iconUtils';
import PurchaseOrderStatusBadge from '../components/PurchaseOrderStatusBadge';

// Icons
const ArrowLeftIcon = getIcon('arrow-left');
const TruckIcon = getIcon('truck');
const BoxIcon = getIcon('package');
const CalendarIcon = getIcon('calendar');
const ClipboardIcon = getIcon('clipboard-list');
const UserIcon = getIcon('user');
const MailIcon = getIcon('mail');
const PhoneIcon = getIcon('phone');
const MapPinIcon = getIcon('map-pin');
const EditIcon = getIcon('edit');
const SaveIcon = getIcon('save');
const XIcon = getIcon('x');
const FileTextIcon = getIcon('file-text');
const PrinterIcon = getIcon('printer');
const HistoryIcon = getIcon('history');
const AlertCircleIcon = getIcon('alert-circle');

const PurchaseOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPurchaseOrderById, updateOrderStatus, isLoading, error } = usePurchaseOrders();
  const { suppliers } = useSuppliers();
  
  const [order, setOrder] = useState(null);
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [showStatusHistory, setShowStatusHistory] = useState(false);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [notification, setNotification] = useState({ type: '', message: '' });

  useEffect(() => {
    const orderData = getPurchaseOrderById(id);
    if (orderData) {
      setOrder(orderData);
      setNewStatus(orderData.status);
    }
  }, [id, getPurchaseOrderById]);

  const handleStatusChange = (e) => {
    setNewStatus(e.target.value);
  };

  const handleStatusNoteChange = (e) => {
    setStatusNote(e.target.value);
  };

  const handleStatusUpdate = () => {
    try {
      updateOrderStatus(id, newStatus, statusNote);
      
      // Update local state
      setOrder(prevOrder => ({
        ...prevOrder,
        status: newStatus,
        statusHistory: [
          ...prevOrder.statusHistory,
          {
            status: newStatus,
            date: new Date().toISOString().split('T')[0],
            note: statusNote || `Status updated to ${newStatus}`
          }
        ]
      }));
      
      setIsEditingStatus(false);
      setStatusNote('');
      
      // Show success notification
      showNotification('success', 'Order status updated successfully');
    } catch (err) {
      showNotification('error', 'Failed to update order status');
    }
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setNotificationVisible(true);
    setTimeout(() => {
      setNotificationVisible(false);
    }, 3000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-800 p-4 md:p-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-800 p-4 md:p-8 flex flex-col items-center justify-center">
        <AlertCircleIcon className="h-16 w-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-2">Purchase Order Not Found</h1>
        <p className="text-surface-600 dark:text-surface-400 mb-6">The purchase order you're looking for doesn't exist or has been removed.</p>
        <Link 
          to="/orders"
          className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Return to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-800 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Notification */}
        {notificationVisible && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
              notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            } text-white`}
          >
            {notification.message}
          </motion.div>
        )}

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center mb-4">
            <Link 
              to="/orders"
              className="mr-4 p-2 rounded-full hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 text-surface-600 dark:text-surface-300" />
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white">
                Purchase Order: {order.id}
              </h1>
              <div className="flex items-center mt-2">
                <PurchaseOrderStatusBadge status={order.status} />
                <button
                  onClick={() => setShowStatusHistory(!showStatusHistory)}
                  className="ml-4 flex items-center text-sm text-primary hover:text-primary-dark dark:hover:text-primary-light"
                >
                  <HistoryIcon className="h-4 w-4 mr-1" />
                  {showStatusHistory ? 'Hide' : 'View'} Status History
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Order info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status history (conditionally rendered) */}
            {showStatusHistory && (
              <div className="glass-card">
                <h2 className="text-xl font-semibold text-surface-900 dark:text-white mb-4 flex items-center">
                  <HistoryIcon className="h-5 w-5 mr-2 text-primary" />
                  Status History
                </h2>
                
                <div className="relative pl-6 border-l-2 border-primary">
                  {order.statusHistory.map((statusItem, index) => (
                    <div key={index} className="mb-6 relative">
                      <div className="absolute -left-[19px] w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">{index + 1}</span>
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <PurchaseOrderStatusBadge status={statusItem.status} />
                          <span className="ml-2 text-sm text-surface-600 dark:text-surface-400">
                            {new Date(statusItem.date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="mt-1 text-surface-700 dark:text-surface-300">{statusItem.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Order details */}
            <div className="glass-card">
              <div className="flex justify-between">
                <h2 className="text-xl font-semibold text-surface-900 dark:text-white mb-6 flex items-center">
                  <BoxIcon className="h-5 w-5 mr-2 text-primary" />
                  Order Items
                </h2>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => window.print()}
                    className="p-2 rounded-lg text-surface-600 hover:text-surface-900 dark:text-surface-400 dark:hover:text-white hover:bg-surface-200 dark:hover:bg-surface-700"
                    title="Print order"
                  >
                    <PrinterIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <table className="min-w-full divide-y divide-surface-200 dark:divide-surface-700">
                <thead>
                  <tr>
                    <th className="px-4 py-3 bg-surface-50 dark:bg-surface-800 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Item</th>
                    <th className="px-4 py-3 bg-surface-50 dark:bg-surface-800 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Quantity</th>
                    <th className="px-4 py-3 bg-surface-50 dark:bg-surface-800 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Unit Price</th>
                    <th className="px-4 py-3 bg-surface-50 dark:bg-surface-800 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Total</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-surface-800 divide-y divide-surface-200 dark:divide-surface-700">
                  {order.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-surface-900 dark:text-white">{item.name}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-surface-600 dark:text-surface-300">{item.quantity} {item.unit}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-surface-600 dark:text-surface-300">${item.price.toFixed(2)}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-surface-900 dark:text-white">${(item.quantity * item.price).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="3" className="px-4 py-3 text-sm font-medium text-right text-surface-900 dark:text-white">Total Amount:</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-surface-900 dark:text-white">${order.totalAmount.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Notes section */}
            {order.notes && (
              <div className="glass-card">
                <h2 className="text-xl font-semibold text-surface-900 dark:text-white mb-4 flex items-center">
                  <FileTextIcon className="h-5 w-5 mr-2 text-primary" />
                  Order Notes
                </h2>
                <p className="text-surface-700 dark:text-surface-300">{order.notes}</p>
              </div>
            )}
          </div>
          
          {/* Right column - Supplier info and status update */}
          <div className="space-y-6">
            {/* Supplier information */}
            <div className="glass-card">
              <h2 className="text-xl font-semibold text-surface-900 dark:text-white mb-4 flex items-center">
                <TruckIcon className="h-5 w-5 mr-2 text-primary" />
                Supplier Information
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center text-surface-700 dark:text-surface-300">
                  <UserIcon className="h-5 w-5 mr-3 text-surface-500 dark:text-surface-400" />
                  <div>
                    <p className="font-medium text-surface-900 dark:text-white">{order.supplier}</p>
                    <p className="text-sm">{order.contactPerson}</p>
                  </div>
                </div>
                
                <div className="flex items-center text-surface-700 dark:text-surface-300">
                  <MailIcon className="h-5 w-5 mr-3 text-surface-500 dark:text-surface-400" />
                  <span>{order.contactEmail}</span>
                </div>
                
                <div className="flex items-center text-surface-700 dark:text-surface-300">
                  <PhoneIcon className="h-5 w-5 mr-3 text-surface-500 dark:text-surface-400" />
                  <span>{order.contactPhone}</span>
                </div>
                
                <div className="flex items-start text-surface-700 dark:text-surface-300">
                  <MapPinIcon className="h-5 w-5 mr-3 mt-0.5 text-surface-500 dark:text-surface-400" />
                  <span>{order.deliveryAddress}</span>
                </div>
              </div>
            </div>
            
            {/* Delivery timeline */}
            <div className="glass-card">
              <h2 className="text-xl font-semibold text-surface-900 dark:text-white mb-4 flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2 text-primary" />
                Delivery Timeline
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-surface-600 dark:text-surface-400">Order Date:</span>
                  <span className="font-medium text-surface-900 dark:text-white">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-surface-600 dark:text-surface-400">Expected Delivery:</span>
                  <span className="font-medium text-surface-900 dark:text-white">
                    {new Date(order.expectedDelivery).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Status update form */}
            <div className="glass-card">
              <h2 className="text-xl font-semibold text-surface-900 dark:text-white mb-4 flex items-center">
                <EditIcon className="h-5 w-5 mr-2 text-primary" />
                Update Status
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Order Status
                  </label>
                  <select
                    id="status"
                    value={newStatus}
                    onChange={handleStatusChange}
                    className="w-full rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:ring-primary focus:border-primary py-2 px-3"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="in-transit">In Transit</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="statusNote" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Status Note (Optional)
                  </label>
                  <textarea
                    id="statusNote"
                    value={statusNote}
                    onChange={handleStatusNoteChange}
                    rows="3"
                    placeholder="Add a note about this status change..."
                    className="w-full rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:ring-primary focus:border-primary py-2 px-3"
                  ></textarea>
                </div>
                
                <button
                  onClick={handleStatusUpdate}
                  className="w-full py-2 px-4 rounded-lg bg-primary hover:bg-primary-dark text-white transition-colors flex items-center justify-center gap-2"
                >
                  <SaveIcon className="h-4 w-4" />
                  <span>Update Status</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrderDetail;