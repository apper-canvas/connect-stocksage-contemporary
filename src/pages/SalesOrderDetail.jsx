import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSalesOrderContext } from '../context/SalesOrderContext';
import { format, parseISO } from 'date-fns';
import { getIcon } from '../utils/iconUtils';
import toast from 'react-hot-toast';

// Import icons
const ArrowLeftIcon = getIcon('arrow-left');
const CalendarIcon = getIcon('calendar');
const UserIcon = getIcon('user');
const PhoneIcon = getIcon('phone');
const MailIcon = getIcon('mail');
const MapPinIcon = getIcon('map-pin');
const TruckIcon = getIcon('truck');
const XCircleIcon = getIcon('x-circle');
const CheckCircleIcon = getIcon('check-circle');
const ClockIcon = getIcon('clock');
const AlertTriangleIcon = getIcon('alert-triangle');
const EditIcon = getIcon('edit');
const PrinterIcon = getIcon('printer');

const SalesOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getSalesOrderById, updateOrderStatus, cancelSalesOrder } = useSalesOrderContext();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  
  useEffect(() => {
    const loadOrder = () => {
      try {
        const orderData = getSalesOrderById(id);
        if (orderData) {
          setOrder(orderData);
        } else {
          toast.error('Order not found');
          navigate('/orders');
        }
      } catch (error) {
        console.error('Error loading order:', error);
        toast.error('Error loading order details');
      } finally {
        setLoading(false);
      }
    };
    
    loadOrder();
  }, [id, getSalesOrderById, navigate]);
  
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'fulfilled':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <ClockIcon className="w-4 h-4 mr-1" />;
      case 'processing': return <TruckIcon className="w-4 h-4 mr-1" />;
      case 'shipped': return <TruckIcon className="w-4 h-4 mr-1" />;
      case 'fulfilled': return <CheckCircleIcon className="w-4 h-4 mr-1" />;
      case 'cancelled': return <XCircleIcon className="w-4 h-4 mr-1" />;
      default: return <AlertTriangleIcon className="w-4 h-4 mr-1" />;
    }
  };
  
  const handleStatusChange = () => {
    if (!newStatus) {
      toast.error('Please select a status');
      return;
    }
    
    try {
      updateOrderStatus(id, newStatus, statusNote);
      setShowStatusModal(false);
      
      // Refresh order data
      const updatedOrder = getSalesOrderById(id);
      setOrder(updatedOrder);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update order status');
    }
  };
  
  const handleCancelOrder = () => {
    try {
      cancelSalesOrder(id, cancelReason);
      setShowCancelModal(false);
      
      // Refresh order data
      const updatedOrder = getSalesOrderById(id);
      setOrder(updatedOrder);
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error('Failed to cancel order');
    }
  };
  
  const printOrder = () => {
    window.print();
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-900 p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!order) {
    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-900 p-6">
        <div className="max-w-4xl mx-auto bg-white dark:bg-surface-800 rounded-lg shadow-card p-6">
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-4">Order Not Found</h1>
          <p className="mb-4">The order you're looking for doesn't exist or may have been deleted.</p>
          <button
            onClick={() => navigate('/orders')}
            className="px-4 py-2 bg-primary text-white rounded-md flex items-center"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-1" />
            Back to Orders
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900 p-6">
      <div className="max-w-4xl mx-auto bg-white dark:bg-surface-800 rounded-lg shadow-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/orders')}
              className="mr-4 p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
              aria-label="Back to orders"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Sales Order Details</h1>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={printOrder}
              className="p-2 rounded-md hover:bg-surface-100 dark:hover:bg-surface-700"
              aria-label="Print order"
            >
              <PrinterIcon className="w-5 h-5" />
            </button>
            
            {order.status !== 'cancelled' && order.status !== 'fulfilled' && (
              <button
                onClick={() => setShowStatusModal(true)}
                className="p-2 rounded-md text-primary hover:bg-surface-100 dark:hover:bg-surface-700"
                aria-label="Update status"
              >
                <EditIcon className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
        
        {/* Order header section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold mb-1">{order.orderNumber}</h2>
                <div className="flex items-center text-surface-500 dark:text-surface-400">
                  <CalendarIcon className="w-4 h-4 mr-1" />
                  <span>{format(parseISO(order.date), 'PPP')}</span>
                </div>
              </div>
              <div className={`px-3 py-1.5 rounded-full flex items-center ${getStatusBadgeClass(order.status)}`}>
                {getStatusIcon(order.status)}
                <span className="capitalize">{order.status}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-surface-50 dark:bg-surface-700 p-4 rounded-md">
            <h3 className="font-medium mb-2">Customer Information</h3>
            <div className="space-y-2">
              <div className="flex items-start">
                <UserIcon className="w-4 h-4 mr-2 mt-0.5 text-surface-500 dark:text-surface-400" />
                <span>{order.customer.name}</span>
              </div>
              <div className="flex items-start">
                <MailIcon className="w-4 h-4 mr-2 mt-0.5 text-surface-500 dark:text-surface-400" />
                <span>{order.customer.email}</span>
              </div>
              <div className="flex items-start">
                <PhoneIcon className="w-4 h-4 mr-2 mt-0.5 text-surface-500 dark:text-surface-400" />
                <span>{order.customer.phone}</span>
              </div>
              <div className="flex items-start">
                <MapPinIcon className="w-4 h-4 mr-2 mt-0.5 text-surface-500 dark:text-surface-400" />
                <span>{order.customer.address}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Order items section */}
        <div className="mb-6">
          <h3 className="font-medium mb-3">Order Items</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-surface-200 dark:divide-surface-700">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Product</th>
                  <th className="px-4 py-2 text-right">Price</th>
                  <th className="px-4 py-2 text-center">Quantity</th>
                  <th className="px-4 py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-200 dark:divide-surface-700">
                {order.items.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2">{item.productName}</td>
                    <td className="px-4 py-2 text-right">${item.unitPrice.toFixed(2)}</td>
                    <td className="px-4 py-2 text-center">{item.quantity}</td>
                    <td className="px-4 py-2 text-right">${item.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3" className="px-4 py-2 text-right font-medium">Total:</td>
                  <td className="px-4 py-2 text-right font-medium">${order.totalAmount.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        
        {/* Order notes and additional info */}
        {order.notes && (
          <div className="mb-6">
            <h3 className="font-medium mb-2">Notes</h3>
            <div className="bg-surface-50 dark:bg-surface-700 p-3 rounded-md">
              {order.notes}
            </div>
          </div>
        )}
        
        {/* Status history */}
        <div className="mb-6">
          <h3 className="font-medium mb-3">Status History</h3>
          <div className="space-y-3">
            {order.statusHistory.map((status, index) => (
              <div 
                key={index}
                className="bg-surface-50 dark:bg-surface-700 p-3 rounded-md flex justify-between items-center"
              >
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${getStatusBadgeClass(status.status)}`}>
                    {getStatusIcon(status.status)}
                  </div>
                  <div>
                    <div className="font-medium capitalize">{status.status}</div>
                    <div className="text-sm text-surface-500 dark:text-surface-400">{status.note}</div>
                  </div>
                </div>
                <div className="text-sm text-surface-500 dark:text-surface-400">
                  {format(parseISO(status.date), 'PPp')}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => navigate('/orders')}
            className="px-4 py-2 border border-surface-300 dark:border-surface-600 rounded-md hover:bg-surface-100 dark:hover:bg-surface-700"
          >
            Back to Orders
          </button>
          
          {order.status !== 'cancelled' && order.status !== 'fulfilled' && (
            <button
              onClick={() => setShowCancelModal(true)}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md flex items-center"
            >
              <XCircleIcon className="w-4 h-4 mr-1" />
              Cancel Order
            </button>
          )}
        </div>
      </div>
      
      {/* Cancel Order Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-surface-800 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Cancel Order</h2>
            <p className="mb-4">Are you sure you want to cancel this order? This action cannot be undone.</p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Reason for Cancellation</label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full p-2 border border-surface-300 dark:border-surface-600 rounded-md"
                rows="3"
                placeholder="Please provide a reason"
              ></textarea>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 border border-surface-300 dark:border-surface-600 rounded-md"
              >
                No, Go Back
              </button>
              <button
                onClick={handleCancelOrder}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
              >
                Yes, Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Update Status Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-surface-800 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Update Order Status</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">New Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full p-2 border border-surface-300 dark:border-surface-600 rounded-md"
              >
                <option value="">Select Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="fulfilled">Fulfilled</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Notes</label>
              <textarea
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                className="w-full p-2 border border-surface-300 dark:border-surface-600 rounded-md"
                rows="3"
                placeholder="Add any notes about this status change"
              ></textarea>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowStatusModal(false)}
                className="px-4 py-2 border border-surface-300 dark:border-surface-600 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusChange}
                className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-md"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesOrderDetail;