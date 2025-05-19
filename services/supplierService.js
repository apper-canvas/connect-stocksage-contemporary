// Supplier service file for handling supplier-related operations

const initApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

// Get all suppliers with filtering and pagination
export const fetchSuppliers = async (params = {}) => {
  try {
    const apperClient = initApperClient();
    
    const fetchParams = {
      fields: ["Name", "Tags", "Owner", "contactPerson", "email", "phone", "address", "categories", "rating", "status"],
      ...params
    };
    
    const response = await apperClient.fetchRecords("supplier", fetchParams);
    return response.data;
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    throw error;
  }
};

// Get a single supplier by ID
export const getSupplierById = async (supplierId) => {
  try {
    const apperClient = initApperClient();
    
    const response = await apperClient.getRecordById("supplier", supplierId);
    return response.data;
  } catch (error) {
    console.error(`Error fetching supplier with ID ${supplierId}:`, error);
    throw error;
  }
};

// Create a new supplier
export const createSupplier = async (supplierData) => {
  try {
    const apperClient = initApperClient();
    
    // Filter fields based on visibility (only include Updateable fields)
    const updateableFields = {
      Name: supplierData.name,
      Tags: supplierData.tags || [],
      contactPerson: supplierData.contactPerson,
      email: supplierData.email,
      phone: supplierData.phone,
      address: supplierData.address,
      categories: supplierData.categories,
      rating: supplierData.rating,
      status: supplierData.status || 'active'
    };
    
    const params = {
      records: [updateableFields]
    };
    
    const response = await apperClient.createRecord("supplier", params);
    return response.results[0].data;
  } catch (error) {
    console.error("Error creating supplier:", error);
    throw error;
  }
};

// Update an existing supplier
export const updateSupplier = async (supplierId, supplierData) => {
  try {
    const apperClient = initApperClient();
    
    // Filter fields based on visibility (only include Updateable fields)
    const updateableFields = {
      Id: supplierId
    };
    
    // Only include fields that are provided in the supplierData
    if (supplierData.name !== undefined) updateableFields.Name = supplierData.name;
    if (supplierData.tags !== undefined) updateableFields.Tags = supplierData.tags;
    if (supplierData.contactPerson !== undefined) updateableFields.contactPerson = supplierData.contactPerson;
    if (supplierData.email !== undefined) updateableFields.email = supplierData.email;
    if (supplierData.phone !== undefined) updateableFields.phone = supplierData.phone;
    if (supplierData.address !== undefined) updateableFields.address = supplierData.address;
    if (supplierData.categories !== undefined) updateableFields.categories = supplierData.categories;
    if (supplierData.rating !== undefined) updateableFields.rating = supplierData.rating;
    if (supplierData.status !== undefined) updateableFields.status = supplierData.status;
    
    const params = {
      records: [updateableFields]
    };
    
    const response = await apperClient.updateRecord("supplier", params);
    return response.results[0].data;
  } catch (error) {
    console.error(`Error updating supplier with ID ${supplierId}:`, error);
    throw error;
  }
};

// Delete a supplier
export const deleteSupplier = async (supplierId) => {
  try {
    const apperClient = initApperClient();
    
    const params = {
      RecordIds: [supplierId]
    };
    
    const response = await apperClient.deleteRecord("supplier", params);
    return response.success;
  } catch (error) {
    console.error(`Error deleting supplier with ID ${supplierId}:`, error);
    throw error;
  }
};