import { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';
import * as supplierService from '../services/supplierService';

const SupplierContext = createContext();
  const [suppliers, setSuppliers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate API call to fetch suppliers
    const loadSuppliers = async () => {
      setIsLoading(true);
      try {
        const data = await supplierService.fetchSuppliers();
        setSuppliers(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch suppliers');
        toast.error('Failed to load suppliers');
      } finally {
        setIsLoading(false);
      }
    };

    loadSuppliers();
  }, []);

  // Add a new supplier
  const addSupplier = async (supplier) => {
    setIsLoading(true);
    try {
      const createdSupplier = await supplierService.createSupplier(supplier);
      setSuppliers(prev => [...prev, createdSupplier]);
      toast.success('Supplier added successfully');
      return createdSupplier;
    } catch (error) {
      setError('Failed to add supplier');
      toast.error('Failed to add supplier');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Update a supplier
  const updateSupplier = async (id, supplierData) => {
    setIsLoading(true);
    try {
      const updatedSupplier = await supplierService.updateSupplier(id, supplierData);
      setSuppliers(prevSuppliers => prevSuppliers.map(supplier => 
        supplier.id === id ? { ...supplier, ...updatedSupplier } : supplier
      ));
      toast.success('Supplier updated successfully');
      return updatedSupplier;
    } catch (error) {
      setError('Failed to update supplier');
      toast.error('Failed to update supplier');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Value object to be provided
  const value = {
    suppliers,
    isLoading,
    error,
    addSupplier
  };

  return <SupplierContext.Provider value={value}>{children}</SupplierContext.Provider>;
};

// Custom hook for using the context
export const useSuppliers = () => {
  const context = useContext(SupplierContext);
  if (context === undefined) {
    throw new Error('useSuppliers must be used within a SupplierProvider');
  }
  return context;
};