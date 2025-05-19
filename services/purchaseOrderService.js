// Purchase Order service file for handling purchase order operations

const initApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

// Get all purchase orders with filtering and pagination
export const fetchPurchaseOrders = async (params = {}) => {
  try {
    const apperClient = initApperClient();
    
    const fetchParams = {
      fields: [
        "Name", "Tags", "Owner", "orderNumber", "orderDate", "expectedDelivery", 
        "totalAmount", "status", "contactPerson", "contactEmail", "contactPhone", 
        "deliveryAddress", "notes", "supplier"
      ],
      expands: [
        {
          name: "supplier",
          alias: "supplierDetails"
        }
      ],
      ...params
    };
    
    const response = await apperClient.fetchRecords("purchase_order", fetchParams);
    return response.data;
  } catch (error) {
    console.error("Error fetching purchase orders:", error);
    throw error;
  }
};

// Get purchase order items for a specific purchase order
export const fetchPurchaseOrderItems = async (purchaseOrderId) => {
  try {
    const apperClient = initApperClient();
    
    const fetchParams = {
      fields: ["Name", "Tags", "Owner", "quantity", "price", "unit", "total", "purchaseOrder", "product"],
      where: [
        {
          fieldName: "purchaseOrder",
          operator: "ExactMatch",
          values: [purchaseOrderId]
        }
      ],
      expands: [
        {
          name: "product",
          alias: "productDetails"
        }
      ]
    };
    
    const response = await apperClient.fetchRecords("purchase_order_item", fetchParams);
    return response.data;
  } catch (error) {
    console.error(`Error fetching purchase order items for order ${purchaseOrderId}:`, error);
    throw error;
  }
};

// Get a single purchase order by ID with its items
export const getPurchaseOrderById = async (orderId) => {
  try {
    const apperClient = initApperClient();
    
    // Get the purchase order
    const orderResponse = await apperClient.getRecordById("purchase_order", orderId);
    const purchaseOrder = orderResponse.data;
    
    // Get the items for this purchase order
    const items = await fetchPurchaseOrderItems(orderId);
    
    // Get the status history for this purchase order
    const statusHistory = await fetchOrderStatusHistory(orderId);
    
    // Return combined data
    return {
      ...purchaseOrder,
      items: items || [],
      statusHistory: statusHistory || []
    };
  } catch (error) {
    console.error(`Error fetching purchase order with ID ${orderId}:`, error);
    throw error;
  }
};

// Fetch order status history
export const fetchOrderStatusHistory = async (orderId) => {
  try {
    const apperClient = initApperClient();
    
    const fetchParams = {
      fields: ["Name", "Tags", "Owner", "status", "date", "note", "purchaseOrder"],
      where: [
        {
          fieldName: "purchaseOrder",
          operator: "ExactMatch",
          values: [orderId]
        }
      ],
      orderBy: [
        {
          field: "date",
          direction: "asc"
        }
      ]
    };
    
    const response = await apperClient.fetchRecords("purchase_order_status_history", fetchParams);
    return response.data;
  } catch (error) {
    console.error(`Error fetching status history for order ${orderId}:`, error);
    throw error;
  }
};

// Create a new purchase order with items
export const createPurchaseOrder = async (orderData) => {
  try {
    const apperClient = initApperClient();
    
    // 1. Create the purchase order
    const orderFields = {
      Name: orderData.orderNumber || `PO-${Date.now()}`,
      orderNumber: orderData.orderNumber,
      orderDate: orderData.orderDate,
      expectedDelivery: orderData.expectedDelivery,
      totalAmount: orderData.totalAmount,
      status: orderData.status || 'pending',
      contactPerson: orderData.contactPerson,
      contactEmail: orderData.contactEmail,
      contactPhone: orderData.contactPhone,
      deliveryAddress: orderData.deliveryAddress,
      notes: orderData.notes,
      supplier: orderData.supplierId
    };
    
    const orderParams = {
      records: [orderFields]
    };
    
    const orderResponse = await apperClient.createRecord("purchase_order", orderParams);
    const newOrderId = orderResponse.results[0].data.Id;
    
    // 2. Create initial status history entry
    await createOrderStatusHistory(newOrderId, 'pending', 'Order created');
    
    // 3. Create order items
    if (orderData.items && orderData.items.length > 0) {
      await createPurchaseOrderItems(newOrderId, orderData.items);
    }
    
    // 4. Return the complete order with items
    return getPurchaseOrderById(newOrderId);
  } catch (error) {
    console.error("Error creating purchase order:", error);
    throw error;
  }
};

// Create purchase order items
export const createPurchaseOrderItems = async (orderId, items) => {
  try {
    const apperClient = initApperClient();
    
    const itemRecords = items.map(item => ({
      Name: item.name,
      purchaseOrder: orderId,
      product: item.productId,
      quantity: item.quantity,
      price: item.price,
      unit: item.unit,
      total: item.quantity * item.price
    }));
    
    const itemParams = {
      records: itemRecords
    };
    
    const response = await apperClient.createRecord("purchase_order_item", itemParams);
    return response.results.map(result => result.data);
  } catch (error) {
    console.error(`Error creating items for purchase order ${orderId}:`, error);
    throw error;
  }
};

// Create order status history entry
export const createOrderStatusHistory = async (orderId, status, note) => {
  try {
    const apperClient = initApperClient();
    
    const statusFields = {
      Name: `${orderId}-${status}-${Date.now()}`,
      purchaseOrder: orderId,
      status: status,
      date: new Date().toISOString().split('T')[0],
      note: note
    };
    
    const params = {
      records: [statusFields]
    };
    
    const response = await apperClient.createRecord("purchase_order_status_history", params);
    return response.results[0].data;
  } catch (error) {
    console.error(`Error creating status history for order ${orderId}:`, error);
    throw error;
  }
};

// Update purchase order status
export const updateOrderStatus = async (orderId, newStatus, note) => {
  try {
    const apperClient = initApperClient();
    
    // 1. Update the order status
    const updateFields = {
      Id: orderId,
      status: newStatus
    };
    
    const params = {
      records: [updateFields]
    };
    
    await apperClient.updateRecord("purchase_order", params);
    
    // 2. Create a status history entry
    await createOrderStatusHistory(orderId, newStatus, note);
    
    return true;
  } catch (error) {
    console.error(`Error updating status for order ${orderId}:`, error);
    throw error;
  }
};