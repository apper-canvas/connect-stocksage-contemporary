import { createContext, useState, useContext, useEffect } from 'react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import * as purchaseOrderService from '../services/purchaseOrderService';

// Create context
const PurchaseOrderContext = createContext();

// Provider component
export const PurchaseOrderProvider = ({ children }) => {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get a purchase order by id
  const getPurchaseOrderById = (id) => {
    return purchaseOrders.find(order => order.id === id) || null;
  };

  // Fetch all purchase orders on mount
  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const orders = await purchaseOrderService.fetchPurchaseOrders();
        setPurchaseOrders(orders);
        setError(null);
      } catch (err) {
        console.error("Error fetching purchase orders:", err);
        setError("Failed to fetch purchase orders");
        toast.error("Failed to load purchase orders");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Create a new purchase order
  const createPurchaseOrder = async (orderData) => {
    setIsLoading(true);
    try {
      const newOrder = await purchaseOrderService.createPurchaseOrder(orderData);
      
      // Update state with new order
      setPurchaseOrders(prevOrders => [...prevOrders, newOrder]);
      setError(null);
      toast.success("Purchase order created successfully");
      return newOrder;
    } catch (err) {
      console.error("Error creating purchase order:", err);
      setError('Failed to create purchase order');
      toast.error("Failed to create purchase order");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Update purchase order status
  const updateOrderStatus = async (orderId, newStatus, note = '') => {
    setIsLoading(true);
    try {
      await purchaseOrderService.updateOrderStatus(orderId, newStatus, note);
      
      // Update local state
      setPurchaseOrders(prevOrders => prevOrders.map(order => {
        if (order.id !== orderId) return order;
        
        const statusUpdate = {
          status: newStatus,
          date: format(new Date(), 'yyyy-MM-dd'),
          note: note || `Status updated to ${newStatus}`
        };
        
        return {
          ...order,
          status: newStatus,
          statusHistory: [...(order.statusHistory || []), statusUpdate]
        };
      });
      
      setError(null);
      toast.success(`Order status updated to ${newStatus}`);
    } catch (err) {
      console.error("Error updating order status:", err);
      setError('Failed to update purchase order status');
      toast.error("Failed to update order status");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PurchaseOrderContext.Provider value={{ purchaseOrders, isLoading, error, getPurchaseOrderById, createPurchaseOrder, updateOrderStatus }}>
      {children}
    </PurchaseOrderContext.Provider>
  );
};

// Custom hook for using the purchase order context
export const usePurchaseOrders = () => {
  const context = useContext(PurchaseOrderContext);
  if (!context) {
    throw new Error('usePurchaseOrders must be used within a PurchaseOrderProvider');
  }
  return context;
};

export default PurchaseOrderContext;