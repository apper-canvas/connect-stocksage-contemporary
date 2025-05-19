// Product service file for handling product-related operations

const initApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

// Get all products with filtering and pagination
export const fetchProducts = async (params = {}) => {
  try {
    const apperClient = initApperClient();
    
    const fetchParams = {
      fields: ["Name", "Tags", "Owner", "sku", "category", "stock", "location", "batchNumber", "expiryDate"],
      ...params
    };
    
    const response = await apperClient.fetchRecords("product2", fetchParams);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// Get a single product by ID
export const getProductById = async (productId) => {
  try {
    const apperClient = initApperClient();
    
    const response = await apperClient.getRecordById("product2", productId);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with ID ${productId}:`, error);
    throw error;
  }
};

// Create a new product
export const createProduct = async (productData) => {
  try {
    const apperClient = initApperClient();
    
    // Filter fields based on visibility (only include Updateable fields)
    const updateableFields = {
      Name: productData.name,
      Tags: productData.tags || [],
      sku: productData.sku,
      category: productData.category,
      stock: productData.stock,
      location: productData.location,
      batchNumber: productData.batchNumber,
      expiryDate: productData.expiryDate
    };
    
    const params = {
      records: [updateableFields]
    };
    
    const response = await apperClient.createRecord("product2", params);
    return response.results[0].data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

// Update an existing product
export const updateProduct = async (productId, productData) => {
  try {
    const apperClient = initApperClient();
    
    // Filter fields based on visibility (only include Updateable fields)
    const updateableFields = {
      Id: productId
    };
    
    // Only include fields that are provided in the productData
    if (productData.name !== undefined) updateableFields.Name = productData.name;
    if (productData.tags !== undefined) updateableFields.Tags = productData.tags;
    if (productData.sku !== undefined) updateableFields.sku = productData.sku;
    if (productData.category !== undefined) updateableFields.category = productData.category;
    if (productData.stock !== undefined) updateableFields.stock = productData.stock;
    if (productData.location !== undefined) updateableFields.location = productData.location;
    if (productData.batchNumber !== undefined) updateableFields.batchNumber = productData.batchNumber;
    if (productData.expiryDate !== undefined) updateableFields.expiryDate = productData.expiryDate;
    
    const params = {
      records: [updateableFields]
    };
    
    const response = await apperClient.updateRecord("product2", params);
    return response.results[0].data;
  } catch (error) {
    console.error(`Error updating product with ID ${productId}:`, error);
    throw error;
  }
};

// Delete a product
export const deleteProduct = async (productId) => {
  try {
    const apperClient = initApperClient();
    
    const params = {
      RecordIds: [productId]
    };
    
    const response = await apperClient.deleteRecord("product2", params);
    return response.success;
  } catch (error) {
    console.error(`Error deleting product with ID ${productId}:`, error);
    throw error;
  }
};