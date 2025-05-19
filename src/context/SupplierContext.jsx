import { createContext, useState, useContext, useEffect } from 'react';

// Create context
const SupplierContext = createContext();

// Sample supplier data
const initialSuppliers = [
  {
    id: 'sup-001',
    name: 'Tech Components Inc.',
    contactPerson: 'John Smith',
    email: 'john@techcomponents.com',
    phone: '(555) 123-4567',
    address: '123 Tech Blvd, San Jose, CA 95123',
    categories: ['Electronics', 'Computer Parts'],
    rating: 4.8,
    status: 'active'
  },
  {
    id: 'sup-002',
    name: 'Global Office Supplies',
    contactPerson: 'Sarah Johnson',
    email: 'sarah@globaloffice.com',
    phone: '(555) 987-6543',
    address: '456 Office Park, Chicago, IL 60601',
    categories: ['Office Supplies', 'Furniture'],
    rating: 4.5,
    status: 'active'
  },
  {
    id: 'sup-003',
    name: 'Rapid Logistics Partners',
    contactPerson: 'Michael Chen',
    email: 'mchen@rapidlogistics.com',
    phone: '(555) 456-7890',
    address: '789 Freight Way, Dallas, TX 75201',
    categories: ['Packaging', 'Shipping Materials'],
    rating: 4.2,
    status: 'active'
  }
];

// Provider component
export const SupplierProvider = ({ children }) => {
  const [suppliers, setSuppliers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate API call to fetch suppliers
    const fetchSuppliers = async () => {
      setIsLoading(true);
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        setSuppliers(initialSuppliers);
        setError(null);
      } catch (err) {
        setError('Failed to fetch suppliers');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  // Add a new supplier
  const addSupplier = (supplier) => {
    const newSupplier = {
      id: `sup-${Date.now()}`,
      ...supplier,
      status: 'active'
    };
    setSuppliers(prev => [...prev, newSupplier]);
    return newSupplier;
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