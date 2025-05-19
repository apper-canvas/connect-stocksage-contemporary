import { createContext, useState, useContext, useEffect } from 'react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { useProductContext } from './ProductContext';

// Create context
const SalesOrderContext = createContext();

// Custom hook to use the context
export const useSalesOrderContext = () => {
  return useContext(SalesOrderContext);
};

export const SalesOrderProvider = ({ children }) => {
  const [salesOrders, setSalesOrders] = useState(() => {
    const savedOrders = localStorage.getItem('salesOrders');
    return savedOrders ? JSON.parse(savedOrders) : [];
  });
  
  const { products, updateProduct } = useProductContext();

  // Save orders to local storage when they change
  useEffect(() => {
    localStorage.setItem('salesOrders', JSON.stringify(salesOrders));
  }, [salesOrders]);

  const generateOrderNumber = () => {
    const prefix = 'SO';
    const timestamp = format(new Date(), 'yyyyMMddHHmmss');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}-${timestamp}-${random}`;
  };

  const createSalesOrder = (orderData) => {
    try {
      const newOrder = {
        id: crypto.randomUUID(),
        orderNumber: generateOrderNumber(),
        date: new Date().toISOString(),
        status: 'pending',
        customer: orderData.customer,
        items: orderData.items.map(item => ({
          ...item,
          productId: item.product.id,
          productName: item.product.name,
          unitPrice: item.product.sellingPrice || item.product.price,
          total: (item.product.sellingPrice || item.product.price) * item.quantity
        })),
        totalAmount: orderData.items.reduce(
          (sum, item) => sum + ((item.product.sellingPrice || item.product.price) * item.quantity), 
          0
        ),
        notes: orderData.notes || '',
        statusHistory: [
          {
            status: 'pending',
            date: new Date().toISOString(),
            note: 'Order created'
          }
        ]
      };
      
      setSalesOrders(prevOrders => [...prevOrders, newOrder]);
      toast.success('Sales order created successfully');
      return newOrder;
    } catch (error) {
      toast.error('Failed to create sales order');
      console.error('Error creating sales order:', error);
      return null;
    }
  };

  const getSalesOrderById = (id) => {
    return salesOrders.find(order => order.id === id);
  };

  const updateSalesOrder = (id, updateData, recalculateTotal = true) => {
    try {
      setSalesOrders(prevOrders => {
        return prevOrders.map(order => {
          if (order.id !== id) return order;
          
          // Create updated order
          const updatedOrder = { ...order, ...updateData };
          
          // If we need to recalculate the total (e.g., after item changes)
          if (recalculateTotal && updatedOrder.items) {
            updatedOrder.totalAmount = updatedOrder.items.reduce(
              (sum, item) => sum + (item.unitPrice * item.quantity), 0
            );
          }
          
          return updatedOrder;
        });
      });
      
      toast.success('Sales order updated successfully');
      return true;
    } catch (error) {
      toast.error('Failed to update sales order');
      console.error('Error updating sales order:', error);
      return false;
    }
  };
  
  const updateOrderItems = (id, items) => {
    try {
      // First update the items
      const success = updateSalesOrder(id, { items }, true);
      
      if (!success) {
        throw new Error("Failed to update order items");
      }
      
      return true;
    } catch (error) {
      toast.error('Failed to update sales order');
      console.error('Error updating sales order:', error);
      return false;
    }
  };

  const updateOrderStatus = (id, newStatus, note = '') => {
    try {
      setSalesOrders(prevOrders => 
        prevOrders.map(order => {
          if (order.id === id) {
            const statusUpdate = {
              status: newStatus,
              date: new Date().toISOString(),
              note: note || `Status changed to ${newStatus}`
            };
            
            // If fulfilling order, update inventory
            if (newStatus === 'fulfilled') {
              order.items.forEach(item => {
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
              statusHistory: [...order.statusHistory, statusUpdate]
            };
          }
          return order;
        })
      );
      
      toast.success(`Order status updated to ${newStatus}`);
      return true;
    } catch (error) {
      toast.error('Failed to update order status');
      console.error('Error updating order status:', error);
      return false;
    }
  };

  const cancelSalesOrder = (id, reason = '') => {
    return updateOrderStatus(id, 'cancelled', reason || 'Order cancelled');
  };

  const deleteSalesOrder = (id) => {
    try {
      setSalesOrders(prevOrders => prevOrders.filter(order => order.id !== id));
      toast.success('Sales order deleted successfully');
      return true;
    } catch (error) {
      toast.error('Failed to delete sales order');
      console.error('Error deleting sales order:', error);
      return false;
    }
  };

  const value = {
    salesOrders,
    createSalesOrder,
    getSalesOrderById,
    updateOrderItems,
    updateSalesOrder,
    updateOrderStatus,
    cancelSalesOrder,
    deleteSalesOrder
  };

  return (
    <SalesOrderContext.Provider value={value}>
      {children}
    </SalesOrderContext.Provider>
  );
};

export default SalesOrderContext;