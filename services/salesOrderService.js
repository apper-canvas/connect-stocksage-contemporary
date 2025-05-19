// Sales Order service file for handling sales order operations

const initApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

// Get all sales orders with filtering and pagination
export const fetchSalesOrders = async (params = {}) => {
  try {
    const apperClient = initApperClient();
    
    const fetchParams = {
      fields: [
        "Name", "Tags", "Owner", "orderNumber", "date", "status", 
        "totalAmount", "notes"
      ],
      ...params
    };
    
    const response = await apperClient.fetchRecords("sales_order", fetchParams);
    return response.data;
  } catch (error) {
    console.error("Error fetching sales orders:", error);
    throw error;
  }
};

// Get sales order items for a specific sales order
export const fetchSalesOrderItems = async (salesOrderId) => {
  try {
    const apperClient = initApperClient();
    
    const fetchParams = {
      fields: ["Name", "Tags", "Owner", "productName", "quantity", "unitPrice", "total", "salesOrder", "product"],
      where: [
        {
          fieldName: "salesOrder",
          operator: "ExactMatch",
          values: [salesOrderId]
        }
      ],
      expands: [
        {
          name: "product",
          alias: "productDetails"
        }
      ]
    };
    
    const response = await apperClient.fetchRecords("sales_order_item", fetchParams);
    return response.data;
  } catch (error) {
    console.error(`Error fetching sales order items for order ${salesOrderId}:`, error);
    throw error;
  }
};

// Get customer info for a sales order
export const fetchSalesOrderCustomer = async (salesOrderId) => {
  try {
    const apperClient = initApperClient();
    
    const fetchParams = {
      fields: ["Name", "Tags", "Owner", "salesOrder", "customer"],
      where: [
        {
          fieldName: "salesOrder",
          operator: "ExactMatch",
          values: [salesOrderId]
        }
      ],
      expands: [
        {
          name: "customer",
          alias: "customerDetails"
        }
      ]
    };
    
    const response = await apperClient.fetchRecords("sales_order_customer", fetchParams);
    
    if (response.data && response.data.length > 0) {
      // Get full customer details
      const customerId = response.data[0].customer;
      const customerResponse = await apperClient.getRecordById("Customer1", customerId);
      return customerResponse.data;
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching customer for sales order ${salesOrderId}:`, error);
    throw error;
  }
};

// Get a single sales order by ID with its items and customer
export const getSalesOrderById = async (orderId) => {
  try {
    const apperClient = initApperClient();
    
    // Get the sales order
    const orderResponse = await apperClient.getRecordById("sales_order", orderId);
    const salesOrder = orderResponse.data;
    
    // Get the items for this sales order
    const items = await fetchSalesOrderItems(orderId);
    
    // Get the customer for this sales order
    const customer = await fetchSalesOrderCustomer(orderId);
    
    // Get the status history for this sales order
    const statusHistory = await fetchSalesOrderStatusHistory(orderId);
    
    // Return combined data
    return {
      ...salesOrder,
      items: items || [],
      customer: customer || {},
      statusHistory: statusHistory || []
    };
  } catch (error) {
    console.error(`Error fetching sales order with ID ${orderId}:`, error);
    throw error;
  }
};

// Fetch sales order status history
export const fetchSalesOrderStatusHistory = async (orderId) => {
  try {
    const apperClient = initApperClient();
    
    const fetchParams = {
      fields: ["Name", "Tags", "Owner", "status", "date", "note", "salesOrder"],
      where: [
        {
          fieldName: "salesOrder",
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
    
    const response = await apperClient.fetchRecords("sales_order_status_history", fetchParams);
    return response.data;
  } catch (error) {
    console.error(`Error fetching status history for sales order ${orderId}:`, error);
    throw error;
  }
};

// Create a new sales order with items and customer
export const createSalesOrder = async (orderData) => {
  try {
    const apperClient = initApperClient();
    
    // 1. Create the sales order
    const orderFields = {
      Name: orderData.orderNumber || `SO-${Date.now()}`,
      orderNumber: orderData.orderNumber,
      date: orderData.date || new Date().toISOString().split('T')[0],
      status: orderData.status || 'pending',
      totalAmount: orderData.totalAmount,
      notes: orderData.notes
    };
    
    const orderParams = {
      records: [orderFields]
    };
    
    const orderResponse = await apperClient.createRecord("sales_order", orderParams);
    const newOrderId = orderResponse.results[0].data.Id;
    
    // 2. Create order items
    if (orderData.items && orderData.items.length > 0) {
      await createSalesOrderItems(newOrderId, orderData.items);
    }
    
    // 3. Link customer to the order
    if (orderData.customer) {
      // First create customer if needed
      let customerId = orderData.customer.id;
      if (!customerId) {
        const customerResponse = await createCustomer(orderData.customer);
        customerId = customerResponse.Id;
      }
      
      await linkCustomerToOrder(newOrderId, customerId);
    }
    
    // 4. Create initial status history entry
    await createSalesOrderStatusHistory(newOrderId, 'pending', 'Order created');
    
    // 5. Return the complete order with items and customer
    return getSalesOrderById(newOrderId);
  } catch (error) {
    console.error("Error creating sales order:", error);
    throw error;
  }
};

// Create sales order items
export const createSalesOrderItems = async (orderId, items) => {
  try {
    const apperClient = initApperClient();
    
    const itemRecords = items.map(item => ({
      Name: item.productName,
      salesOrder: orderId,
      product: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      total: item.quantity * item.unitPrice
    }));
    
    const itemParams = {
      records: itemRecords
    };
    
    const response = await apperClient.createRecord("sales_order_item", itemParams);
    return response.results.map(result => result.data);
  } catch (error) {
    console.error(`Error creating items for sales order ${orderId}:`, error);
    throw error;
  }
};

// Create a customer
export const createCustomer = async (customerData) => {
  try {
    const apperClient = initApperClient();
    
    const customerFields = {
      Name: customerData.name,
      email: customerData.email,
      phone: customerData.phone,
      address: customerData.address
    };
    
    const params = {
      records: [customerFields]
    };
    
    const response = await apperClient.createRecord("Customer1", params);
    return response.results[0].data;
  } catch (error) {
    console.error(`Error creating customer:`, error);
    throw error;
  }
};

// Link customer to sales order
export const linkCustomerToOrder = async (orderId, customerId) => {
  try {
    const apperClient = initApperClient();
    
    const linkFields = {
      Name: `${orderId}-${customerId}`,
      salesOrder: orderId,
      customer: customerId
    };
    
    const params = {
      records: [linkFields]
    };
    
    const response = await apperClient.createRecord("sales_order_customer", params);
    return response.results[0].data;
  } catch (error) {
    console.error(`Error linking customer to sales order:`, error);
    throw error;
  }
};

// Create sales order status history entry
export const createSalesOrderStatusHistory = async (orderId, status, note) => {
  try {
    const apperClient = initApperClient();
    
    const statusFields = {
      Name: `${orderId}-${status}-${Date.now()}`,
      salesOrder: orderId,
      status: status,
      date: new Date().toISOString(),
      note: note
    };
    
    const params = {
      records: [statusFields]
    };
    
    const response = await apperClient.createRecord("sales_order_status_history", params);
    return response.results[0].data;
  } catch (error) {
    console.error(`Error creating status history for sales order ${orderId}:`, error);
    throw error;
  }
};

// Update sales order status
export const updateSalesOrderStatus = async (orderId, newStatus, note) => {
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
    
    await apperClient.updateRecord("sales_order", params);
    
    // 2. Create a status history entry
    await createSalesOrderStatusHistory(orderId, newStatus, note);
    
    return true;
  } catch (error) {
    console.error(`Error updating status for sales order ${orderId}:`, error);
    throw error;
  }
};

// Update a sales order
export const updateSalesOrder = async (orderId, updateData) => {
  try {
    const apperClient = initApperClient();
    
    const updateFields = {
      Id: orderId
    };
    
    // Add fields to update
    if (updateData.orderNumber) updateFields.orderNumber = updateData.orderNumber;
    if (updateData.date) updateFields.date = updateData.date;
    if (updateData.status) updateFields.status = updateData.status;
    if (updateData.totalAmount !== undefined) updateFields.totalAmount = updateData.totalAmount;
    if (updateData.notes !== undefined) updateFields.notes = updateData.notes;
    
    const params = {
      records: [updateFields]
    };
    
    const response = await apperClient.updateRecord("sales_order", params);
    
    // If updating customer info
    if (updateData.customer) {
      // Get current customer link
      const customerLink = await fetchSalesOrderCustomer(orderId);
      if (customerLink) {
        // Update customer info
        await updateCustomer(customerLink.Id, updateData.customer);
      }
    }
    
    return response.results[0].data;
  } catch (error) {
    console.error(`Error updating sales order ${orderId}:`, error);
    throw error;
  }
};

// Update customer information
export const updateCustomer = async (customerId, customerData) => {
  try {
    const apperClient = initApperClient();
    
    const updateFields = {
      Id: customerId
    };
    
    // Add fields to update
    if (customerData.name) updateFields.Name = customerData.name;
    if (customerData.email) updateFields.email = customerData.email;
    if (customerData.phone) updateFields.phone = customerData.phone;
    if (customerData.address !== undefined) updateFields.address = customerData.address;
    
    const params = {
      records: [updateFields]
    };
    
    const response = await apperClient.updateRecord("Customer1", params);
    return response.results[0].data;
  } catch (error) {
    console.error(`Error updating customer ${customerId}:`, error);
    throw error;
  }
};