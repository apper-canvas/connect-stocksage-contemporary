import { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const ProductContext = createContext();

// Sample initial product data
const initialProducts = [
  { id: 1, name: 'Wireless Headphones', sku: 'WH-101', category: 'Electronics', stock: 45, batchNumber: 'BT-20230801', expiryDate: '2024-02-15', location: 'Warehouse A' },
  { id: 2, name: 'Smartphone Charger', sku: 'SC-202', category: 'Electronics', stock: 120, batchNumber: 'BT-20230715', expiryDate: '2025-07-10', location: 'Warehouse A' },
  { id: 3, name: 'Laptop Sleeve', sku: 'LS-303', category: 'Accessories', stock: 18, batchNumber: 'BT-20220512', expiryDate: '2023-12-01', location: 'Warehouse B' },
  { id: 4, name: 'Bluetooth Speaker', sku: 'BS-404', category: 'Electronics', stock: 32, batchNumber: 'BT-20230610', expiryDate: '2024-01-05', location: 'Warehouse B' },
  { id: 5, name: 'HDMI Cable', sku: 'HC-505', category: 'Accessories', stock: 64, batchNumber: 'BT-20230420', expiryDate: '2026-04-20', location: 'Warehouse C' },
  { id: 6, name: 'External SSD', sku: 'ES-606', category: 'Storage', stock: 27, batchNumber: 'BT-20230901', expiryDate: '2028-09-01', location: 'Warehouse A' },
  { id: 7, name: 'Wireless Mouse', sku: 'WM-707', category: 'Computer Parts', stock: 83, batchNumber: 'BT-20231015', expiryDate: '2026-10-15', location: 'Warehouse C' },
  { id: 8, name: 'Webcam HD', sku: 'WC-808', category: 'Computer Parts', stock: 15, batchNumber: 'BT-20230630', expiryDate: '2025-06-30', location: 'Warehouse B' },
  { id: 9, name: 'USB-C Hub', sku: 'UH-909', category: 'Accessories', stock: 52, batchNumber: 'BT-20230525', expiryDate: '2026-05-25', location: 'Warehouse A' },
  { id: 10, name: 'Mechanical Keyboard', sku: 'MK-1010', category: 'Computer Parts', stock: 7, batchNumber: 'BT-20231120', expiryDate: '2027-11-20', location: 'Warehouse B' },
];

// Custom hook to use the product context
export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

// Provider component
export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(initialProducts);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [stockLevelFilter, setStockLevelFilter] = useState('');
  const [batchFilter, setBatchFilter] = useState('');
  const [expiryFilter, setExpiryFilter] = useState('');
  
  // Sort states
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  // Get unique categories from products
  const categories = [...new Set(products.map(product => product.category))];
  
  // Get unique locations from products
  const locations = [...new Set(products.map(product => product.location))];

  // Apply filters and sorting when any filter changes
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate server delay
    const timeoutId = setTimeout(() => {
      let result = [...products];
      
      // Apply search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        result = result.filter(product => 
          product.name.toLowerCase().includes(query) || 
          product.sku.toLowerCase().includes(query) ||
          product.batchNumber.toLowerCase().includes(query)
        );
      }
      
      // Apply category filter
      if (categoryFilter) {
        result = result.filter(product => product.category === categoryFilter);
      }
      
      // Apply location filter
      if (locationFilter) {
        result = result.filter(product => product.location === locationFilter);
      }
      
      // Apply stock level filter
      if (stockLevelFilter === 'low') {
        result = result.filter(product => product.stock < 20);
      } else if (stockLevelFilter === 'medium') {
        result = result.filter(product => product.stock >= 20 && product.stock < 50);
      } else if (stockLevelFilter === 'high') {
        result = result.filter(product => product.stock >= 50);
      }
      
      // Apply batch filter
      if (batchFilter) {
        result = result.filter(product => 
          product.batchNumber.toLowerCase().includes(batchFilter.toLowerCase())
        );
      }
      
      // Apply expiry filter
      if (expiryFilter === 'expired') {
        result = result.filter(product => new Date(product.expiryDate) < new Date());
      } else if (expiryFilter === 'soon') {
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
        result = result.filter(product => {
          const expiryDate = new Date(product.expiryDate);
          return expiryDate > new Date() && expiryDate <= thirtyDaysFromNow;
        });
      } else if (expiryFilter === 'good') {
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
        result = result.filter(product => new Date(product.expiryDate) > thirtyDaysFromNow);
      }
      
      // Apply sorting
      result.sort((a, b) => {
        let first = a[sortBy];
        let second = b[sortBy];
        
        // Handle date sorting
        if (sortBy === 'expiryDate') {
          first = new Date(first);
          second = new Date(second);
        }
        
        if (sortDirection === 'asc') {
          return first > second ? 1 : -1;
        } else {
          return first < second ? 1 : -1;
        }
      });
      
      setFilteredProducts(result);
      setIsLoading(false);
    }, 300); // Short delay to simulate server request
    
    return () => clearTimeout(timeoutId);
  }, [products, searchQuery, categoryFilter, locationFilter, stockLevelFilter, batchFilter, expiryFilter, sortBy, sortDirection]);

  const addProduct = (newProduct) => {
    setProducts([...products, { ...newProduct, id: products.length + 1 }]);
  };

  const value = { products, filteredProducts, isLoading, categories, locations, addProduct, searchQuery, setSearchQuery, categoryFilter, setCategoryFilter, locationFilter, setLocationFilter, stockLevelFilter, setStockLevelFilter, batchFilter, setBatchFilter, expiryFilter, setExpiryFilter, sortBy, setSortBy, sortDirection, setSortDirection };
  
  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};

export default ProductContext;