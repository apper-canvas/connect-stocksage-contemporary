import { createContext, useState, useContext, useEffect } from 'react';
import { format } from 'date-fns';

// Create context
const PurchaseOrderContext = createContext();

// Sample purchase orders data
const initialPurchaseOrders = [
  { 
    id: "PO-2023-001", 
    supplier: "TechHub Distributors", 
    supplierId: "sup-001",
    items: [
      { id: "prod-001", name: "Wireless Headphones", quantity: 5, price: 89.99, unit: 'ea' },
      { id: "prod-002", name: "USB-C Cables", quantity: 20, price: 12.99, unit: 'ea' },
      { id: "prod-003", name: "Power Banks", quantity: 10, price: 45.99, unit: 'ea' }
    ],
    totalAmount: 5240.80, 
    orderDate: "2023-08-15", 
    expectedDelivery: "2023-08-22", 
    status: "delivered",
    statusHistory: [
      { status: "pending", date: "2023-08-15", note: "Order created" },
      { status: "processing", date: "2023-08-16", note: "Order confirmed with supplier" },
      { status: "in-transit", date: "2023-08-19", note: "Shipment dispatched" },
      { status: "delivered", date: "2023-08-22", note: "Order received in warehouse" }
    ],
    contactPerson: "John Smith",
    contactEmail: "john@techhub.com",
    contactPhone: "(555) 123-4567",
    deliveryAddress: "123 Warehouse Blvd, Storage City, SC 12345",
    notes: "Please deliver to loading dock #3"
  },
  { 
    id: "PO-2023-002", 
    supplier: "Office Supplies Co", 
    supplierId: "sup-002",
    items: [
      { id: "prod-004", name: "Printer Paper", quantity: 50, price: 4.99, unit: 'ream' },
      { id: "prod-005", name: "Ink Cartridges", quantity: 15, price: 24.99, unit: 'ea' },
      { id: "prod-006", name: "Staplers", quantity: 10, price: 8.99, unit: 'ea' }
    ],
    totalAmount: 1875.25, 
    orderDate: "2023-08-20", 
    expectedDelivery: "2023-09-02", 
    status: "in-transit",
    statusHistory: [
      { status: "pending", date: "2023-08-20", note: "Order created" },
      { status: "processing", date: "2023-08-22", note: "Order confirmed with supplier" },
      { status: "in-transit", date: "2023-08-30", note: "Shipment dispatched" }
    ],
    contactPerson: "Sarah Johnson",
    contactEmail: "sarah@officesupplies.com",
    contactPhone: "(555) 987-6543",
    deliveryAddress: "456 Office Park, Business District, BD 54321",
    notes: ""
  },
  { 
    id: "PO-2023-003", 
    supplier: "Quality Electronics", 
    supplierId: "sup-003",
    items: [
      { id: "prod-001", name: "Bluetooth Speakers", quantity: 8, price: 69.99, unit: 'ea' },
      { id: "prod-002", name: "HDMI Cables", quantity: 15, price: 14.99, unit: 'ea' },
      { id: "prod-003", name: "Wireless Chargers", quantity: 12, price: 29.99, unit: 'ea' }
    ],
    totalAmount: 4325.50, 
    orderDate: "2023-09-01", 
    expectedDelivery: "2023-09-10", 
    status: "pending",
    statusHistory: [
      { status: "pending", date: "2023-09-01", note: "Order created" }
    ],
    contactPerson: "Michael Chen",
    contactEmail: "michael@qualityelectronics.com",
    contactPhone: "(555) 456-7890",
    deliveryAddress: "789 Tech Street, Innovation City, IC 98765",
    notes: "Please call before delivery"
  }
];

// Provider component
export const PurchaseOrderProvider = ({ children }) => {
  const [purchaseOrders, setPurchaseOrders] = useState(initialPurchaseOrders);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get a purchase order by id
  const getPurchaseOrderById = (id) => {
    return purchaseOrders.find(order => order.id === id) || null;
  };

  // Create a new purchase order
  const createPurchaseOrder = (orderData) => {
    setIsLoading(true);
    try {
      // Generate a unique order ID
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const count = (purchaseOrders.length + 1).toString().padStart(3, '0');
      const orderId = `PO-${year}${month}-${count}`;
      
      // Create the new order with initial status history
      const newOrder = {
        ...orderData,
        id: orderId,
        orderDate: format(now, 'yyyy-MM-dd'),
        status: 'pending',
        statusHistory: [
          { 
            status: 'pending', 
            date: format(now, 'yyyy-MM-dd'),
            note: 'Order created'
          }
        ]
      };
      
      setPurchaseOrders(prev => [...prev, newOrder]);
      setError(null);
      return newOrder;
    } catch (err) {
      setError('Failed to create purchase order');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Update a purchase order's status
  const updateOrderStatus = (orderId, newStatus, note = '') => {
    setIsLoading(true);
    try {
      const updatedOrders = purchaseOrders.map(order => {
        if (order.id === orderId) {
          const statusUpdate = {
            status: newStatus,
            date: format(new Date(), 'yyyy-MM-dd'),
            note: note || `Status updated to ${newStatus}`
          };
          
          return {
            ...order,
            status: newStatus,
            statusHistory: [...order.statusHistory, statusUpdate]
          };
        }
        return order;
      });
      
      setPurchaseOrders(updatedOrders);
      setError(null);
    } catch (err) {
      setError('Failed to update purchase order status');
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