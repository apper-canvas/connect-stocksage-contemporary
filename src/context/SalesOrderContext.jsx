import { createContext, useState, useContext, useEffect } from 'react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import * as salesOrderService from '../../services/salesOrderService.js';
import { useProducts } from './ProductContext';

// Create context
const SalesOrderContext = createContext();

// Custom hook to use the context
export const useSalesOrderContext = () => {
  return useContext(SalesOrderContext);
};

export const SalesOrderProvider = ({ children }) => {
  const [salesOrders, setSalesOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { products, updateProduct } = useProducts();

  // Fetch sales orders on mount
  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const orders = await salesOrderService.fetchSalesOrders();
        setSalesOrders(orders);
        setError(null);
      } catch (err) {
        console.error("Error fetching sales orders:", err);
        setError("Failed to fetch sales orders");
        toast.error("Failed to load sales orders");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrders();
  }, []);

  // Create a new sales order
  const createSalesOrder = async (orderData) => {
    setIsLoading(true);
    try {
      // Format the data for API
      const apiOrderData = {
        orderNumber: `SO-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        status: 'pending',
        totalAmount: orderData.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0),
        notes: orderData.notes || '',
        customer: orderData.customer,
        items: orderData.items.map(item => ({
          productId: item.product.id,
          productName: item.product.name,
          quantity: item.quantity,
          unitPrice: item.product.sellingPrice || item.product.price
        }))
      };
      
      const newOrder = await salesOrderService.createSalesOrder(apiOrderData);
      
      // Update state with new order
      setSalesOrders(prevOrders => [...prevOrders, newOrder]);
      toast.success("Sales order created successfully");
      return newOrder;
    } catch (error) {
      console.error("Error creating sales order:", error);
      setError("Failed to create sales order");
      toast.error("Failed to create sales order");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Get a sales order by ID
  const getSalesOrderById = async (id) => {
    setIsLoading(true);
    try {
      const order = await salesOrderService.getSalesOrderById(id);
      return order;
    } catch (error) {
      console.error(`Error fetching sales order ${id}:`, error);
      toast.error("Failed to load sales order details");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Update sales order status
  const updateOrderStatus = async (id, newStatus, note = '') => {
    setIsLoading(true);
    try {
      await salesOrderService.updateSalesOrderStatus(id, newStatus, note);
      
      // Update local state
      setSalesOrders(prevOrders => prevOrders.map(order => {
        if (order.id !== id) return order;
        
        // Create status update
        const statusUpdate = {
          status: newStatus,
          date: new Date().toISOString(),
          note: note || `Status changed to ${newStatus}`
        };
        
        // If fulfilling order, update inventory
        if (newStatus === 'fulfilled') {
          order.items?.forEach(item => {
            const product = products.find(p => p.id === item.productId);
            if (product) {
              updateProduct(product.id, { 
                stock: Math.max(0, product.stock - item.quantity) 
              });
            }
          });
        }
        
        return {
          ...order,
          status: newStatus,
          statusHistory: [...(order.statusHistory || []), statusUpdate]
        };
      }));
      
      toast.success(`Order status updated to ${newStatus}`);
      return true;
    } catch (error) {
      console.error(`Error updating status for order ${id}:`, error);
      setError("Failed to update order status");
      toast.error("Failed to update order status");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelSalesOrder = async (id, reason = '') => {
    return updateOrderStatus(id, 'cancelled', reason || 'Order cancelled');
  };

  // Update a sales order
  const updateSalesOrder = async (id, updateData, recalculateTotal = true) => {
    setIsLoading(true);
    try {
      const updatedOrder = await salesOrderService.updateSalesOrder(id, updateData);
      
      // Update state with updated order
      setSalesOrders(prevOrders => prevOrders.map(order => {
        if (order.id !== id) return order;
        
        // Create updated order
        const newOrder = { ...order, ...updatedOrder };
        
        // If we need to recalculate the total (e.g., after item changes)
        if (recalculateTotal && newOrder.items) {
          newOrder.totalAmount = newOrder.items.reduce(
            (sum, item) => sum + (item.unitPrice * item.quantity), 0
          );
        }
        
        return newOrder;
      }));
      
      toast.success('Sales order updated successfully');
      return true;
    } catch (error) {
      console.error(`Error updating sales order ${id}:`, error);
      setError("Failed to update sales order");
      toast.error('Failed to update sales order');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateOrderItems = async (id, items) => {
    // Implement this as needed using the service
    // Currently, this would need to delete existing items and create new ones
    // through the appropriate API calls
    return updateSalesOrder(id, { items }, true);
  };

  const value = {
    salesOrders,
    isLoading,
    error,
    createSalesOrder,
    getSalesOrderById,
    updateOrderItems,
    updateSalesOrder,
    updateOrderStatus,
    cancelSalesOrder
  };

  return (
    <SalesOrderContext.Provider value={value}>
      {children}
    </SalesOrderContext.Provider>
  );
};

export default SalesOrderContext;