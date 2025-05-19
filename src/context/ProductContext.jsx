import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import * as productService from '../services/productService.js';

const ProductContext = createContext();

// Custom hook to use the product context
export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

// Alias for backward compatibility
export const useProductContext = useProducts;

// Provider component
export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
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
    if (products.length > 0) {
      setIsLoading(true);
      
      // Build filter parameters for the API
      const filterParams = {};
      
      // Search query filter
      if (searchQuery) {
        filterParams.where = [
          {
            fieldName: "Name",
            operator: "Contains",
            values: [searchQuery]
          }
        ];
      }
      
      // Category filter
      if (categoryFilter) {
        if (filterParams.where) {
          filterParams.where.push({
            fieldName: "category",
            operator: "ExactMatch",
            values: [categoryFilter]
          });
        } else {
          filterParams.where = [{
            fieldName: "category",
            operator: "ExactMatch",
            values: [categoryFilter]
          }];
        }
      }
      
      // Location filter
      if (locationFilter) {
        if (filterParams.where) {
          filterParams.where.push({
            fieldName: "location",
            operator: "ExactMatch",
            values: [locationFilter]
          });
        } else {
          filterParams.where = [{
            fieldName: "location",
            operator: "ExactMatch",
            values: [locationFilter]
          }];
        }
      }
      
      // Stock level filter
      if (stockLevelFilter) {
        const stockCondition = {};
        
        if (stockLevelFilter === 'low') {
          stockCondition.fieldName = "stock";
          stockCondition.operator = "LessThan";
          stockCondition.values = [20];
        } else if (stockLevelFilter === 'medium') {
          stockCondition.fieldName = "stock";
          stockCondition.operator = "Between";
          stockCondition.values = [20, 50];
        } else if (stockLevelFilter === 'high') {
          stockCondition.fieldName = "stock";
          stockCondition.operator = "GreaterThan";
          stockCondition.values = [50];
        }
        
        if (Object.keys(stockCondition).length > 0) {
          if (filterParams.where) {
            filterParams.where.push(stockCondition);
          } else {
            filterParams.where = [stockCondition];
          }
        }
      }
      
      // Batch filter
      if (batchFilter) {
        if (filterParams.where) {
          filterParams.where.push({
            fieldName: "batchNumber",
            operator: "Contains",
            values: [batchFilter]
          });
        } else {
          filterParams.where = [{
            fieldName: "batchNumber",
            operator: "Contains",
            values: [batchFilter]
          }];
        }
      }
      
      // Sorting
      filterParams.orderBy = [{
        field: sortBy === 'name' ? 'Name' : sortBy,
        direction: sortDirection
      }];
      
      // Apply filters using service
      const applyFilters = async () => {
        try {
          const filteredData = await productService.fetchProducts(filterParams);
          setFilteredProducts(filteredData);
        } catch (error) {
          console.error("Error applying filters:", error);
          toast.error("Failed to filter products");
        } finally {
          setIsLoading(false);
        }
      };
      
      applyFilters();
    }
  }, [searchQuery, categoryFilter, locationFilter, stockLevelFilter, batchFilter, expiryFilter, sortBy, sortDirection]);

  // Fetch products on initial load
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const data = await productService.fetchProducts();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error("Error loading products:", error);
        toast.error("Failed to load products");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProducts();
  }, []);

  const addProduct = async (newProduct) => {
    setIsLoading(true);
    try {
      const createdProduct = await productService.createProduct(newProduct);
      setProducts(prevProducts => [...prevProducts, createdProduct]);
      toast.success("Product added successfully");
      return createdProduct;
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to add product");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateProduct = async (id, updatedFields) => {
    setIsLoading(true);
    try {
      const updatedProduct = await productService.updateProduct(id, updatedFields);
      setProducts(prevProducts => prevProducts.map(product => 
        product.id === id ? { ...product, ...updatedProduct } : product
      ));
      toast.success("Product updated successfully");
      return updatedProduct;
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = { products, filteredProducts, isLoading, categories, locations, addProduct, updateProduct,
    searchQuery, setSearchQuery, categoryFilter, setCategoryFilter, locationFilter, setLocationFilter, stockLevelFilter, setStockLevelFilter, batchFilter, setBatchFilter, expiryFilter, setExpiryFilter, sortBy, setSortBy, sortDirection, setSortDirection };
  
  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};

export default ProductContext;