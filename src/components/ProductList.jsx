import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; 
import { getIcon } from '../utils/iconUtils';
import { useProducts } from '../context/ProductContext';

// Define icons
const SearchIcon = getIcon('search');
const FilterIcon = getIcon('filter');
const ChevronDownIcon = getIcon('chevron-down');
const SortAscIcon = getIcon('arrow-up');
const SortDescIcon = getIcon('arrow-down');
const AlertCircleIcon = getIcon('alert-circle');
const ClockIcon = getIcon('clock');
const HashIcon = getIcon('hash');
const XIcon = getIcon('x');
const BoxIcon = getIcon('box');
const PackageIcon = getIcon('package');
const MapPinIcon = getIcon('map-pin');
const CalendarIcon = getIcon('calendar');
const BarChartIcon = getIcon('bar-chart');
const PencilIcon = getIcon('pencil');
const EyeIcon = getIcon('eye');
const TrashIcon = getIcon('trash');

import { useNavigate, useLocation } from 'react-router-dom';
const ProductList = ({ onEditProduct }) => {
  const { 
    filteredProducts, 
    isLoading, 
    categories,
    locations,
    searchQuery, 
    setSearchQuery,
    categoryFilter, 
    setCategoryFilter,
    locationFilter, 
    setLocationFilter,
    stockLevelFilter, 
    setStockLevelFilter,
    batchFilter, 
    setBatchFilter,
    expiryFilter, 
    setExpiryFilter,
    sortBy, 
    setSortBy,
    sortDirection, 
    setSortDirection
  } = useProducts();

  const navigate = useNavigate();
  const location = useLocation();
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Check if edit mode is requested via URL
  const urlParams = new URLSearchParams(location.search);
  const editProductId = urlParams.get('edit');

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const resetFilters = () => {
    // Reset all filters
    setSearchQuery('');
    setCategoryFilter('');
    setLocationFilter('');
    setStockLevelFilter('');
    setBatchFilter('');
    setExpiryFilter('');
  };

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  const viewProductDetails = (productId) => {
    navigate(`/products/${productId}`);
  };

  // Check if we need to edit a product based on URL parameter
  if (editProductId && !selectedProduct) {
    const productToEdit = filteredProducts.find(p => p.id === parseInt(editProductId));
    if (productToEdit) onEditProduct(productToEdit);
  };

  const activeFiltersCount = [
    categoryFilter, 
    locationFilter, 
    stockLevelFilter, 
    batchFilter, 
    expiryFilter
  ].filter(Boolean).length;

  return (
    <div className="glass-card mb-6">
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-semibold text-surface-900 dark:text-white flex items-center gap-2">
            <PackageIcon className="h-6 w-6 text-primary" />
            Product Inventory
          </h2>
          <div className="flex gap-2">
            <button 
              onClick={toggleFilters}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border border-surface-200 dark:border-surface-700 transition-colors ${
                showFilters ? 'bg-primary text-white' : 'bg-white dark:bg-surface-800 text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700'
              }`}
            >
              <FilterIcon className="h-5 w-5" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 ml-1 text-xs font-bold text-white bg-red-500 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </button>
            
            {activeFiltersCount > 0 && (
              <button
                onClick={resetFilters}
                className="px-3 py-2 rounded-lg border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors flex items-center gap-1"
              >
                <XIcon className="h-4 w-4" />
                Clear
              </button>
            )}
          </div>
        </div>
        
        <div className="relative flex-1 mb-4">
          <SearchIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
          <input
            type="text"
            placeholder="Search products by name, SKU, or batch number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
          />
        </div>
        
        <AnimatePresence>
          {showFilters && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden mb-4"
            >
              <div className="bg-surface-50 dark:bg-surface-800/50 rounded-lg p-4 border border-surface-200 dark:border-surface-700">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Category
                    </label>
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="appearance-none w-full pl-3 pr-10 py-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
                    >
                      <option value="">All Categories</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Location Filter */}
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Location
                    </label>
                    <select
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                      className="appearance-none w-full pl-3 pr-10 py-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
                    >
                      <option value="">All Locations</option>
                      {locations.map(location => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Stock Level Filter */}
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Stock Level
                    </label>
                    <select
                      value={stockLevelFilter}
                      onChange={(e) => setStockLevelFilter(e.target.value)}
                      className="appearance-none w-full pl-3 pr-10 py-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
                    >
                      <option value="">All Stock Levels</option>
                      <option value="low">Low Stock (&lt; 20)</option>
                      <option value="medium">Medium Stock (20-50)</option>
                      <option value="high">High Stock (&gt; 50)</option>
                    </select>
                  </div>
                  
                  {/* Batch Filter */}
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Batch Number
                    </label>
                    <div className="relative">
                      <HashIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
                      <input
                        type="text"
                        placeholder="Filter by batch #"
                        value={batchFilter}
                        onChange={(e) => setBatchFilter(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
                      />
                    </div>
                  </div>
                  
                  {/* Expiry Filter */}
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Expiry Status
                    </label>
                    <select
                      value={expiryFilter}
                      onChange={(e) => setExpiryFilter(e.target.value)}
                      className="appearance-none w-full pl-3 pr-10 py-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
                    >
                      <option value="">All Products</option>
                      <option value="expired">Expired</option>
                      <option value="soon">Expiring Soon (30 days)</option>
                      <option value="good">Good Expiry Date</option>
                    </select>
                  </div>
                  
                  {/* Sort By */}
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Sort By
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="appearance-none flex-1 pl-3 pr-10 py-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
                      >
                        <option value="name">Name</option>
                        <option value="sku">SKU</option>
                        <option value="stock">Stock</option>
                        <option value="expiryDate">Expiry Date</option>
                      </select>
                      <button
                        onClick={toggleSortDirection}
                        className="px-3 py-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-600 dark:text-surface-300"
                        aria-label={`Sort ${sortDirection === 'asc' ? 'ascending' : 'descending'}`}
                      >
                        {sortDirection === 'asc' ? (
                          <SortAscIcon className="h-5 w-5" />
                        ) : (
                          <SortDescIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Applied Filters */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {categoryFilter && (
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary/10 text-primary dark:bg-primary/20">
                <BoxIcon className="h-4 w-4 mr-1" />
                {categoryFilter}
                <button onClick={() => setCategoryFilter('')} className="ml-1 hover:text-primary-dark">
                  <XIcon className="h-4 w-4" />
                </button>
              </div>
            )}
            {locationFilter && (
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                <MapPinIcon className="h-4 w-4 mr-1" />
                {locationFilter}
                <button onClick={() => setLocationFilter('')} className="ml-1 hover:text-green-900 dark:hover:text-green-300">
                  <XIcon className="h-4 w-4" />
                </button>
              </div>
            )}
            {stockLevelFilter && (
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                <BarChartIcon className="h-4 w-4 mr-1" />
                {stockLevelFilter === 'low' ? 'Low Stock' : stockLevelFilter === 'medium' ? 'Medium Stock' : 'High Stock'}
                <button onClick={() => setStockLevelFilter('')} className="ml-1 hover:text-blue-900 dark:hover:text-blue-300">
                  <XIcon className="h-4 w-4" />
                </button>
              </div>
            )}
            {batchFilter && (
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                <HashIcon className="h-4 w-4 mr-1" />
                Batch: {batchFilter}
                <button onClick={() => setBatchFilter('')} className="ml-1 hover:text-purple-900 dark:hover:text-purple-300">
                  <XIcon className="h-4 w-4" />
                </button>
              </div>
            )}
            {expiryFilter && (
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
                <CalendarIcon className="h-4 w-4 mr-1" />
                {expiryFilter === 'expired' ? 'Expired' : expiryFilter === 'soon' ? 'Expiring Soon' : 'Good Expiry'}
                <button onClick={() => setExpiryFilter('')} className="ml-1 hover:text-orange-900 dark:hover:text-orange-300">
                  <XIcon className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Product Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-surface-200 dark:divide-surface-700">
          <thead>
            <tr>
              <th className="px-4 py-3 bg-surface-50 dark:bg-surface-800 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                Product
              </th>
              <th className="px-4 py-3 bg-surface-50 dark:bg-surface-800 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                Batch #
              </th>
              <th className="px-4 py-3 bg-surface-50 dark:bg-surface-800 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                Expiry Date
              </th>
              <th className="px-4 py-3 bg-surface-50 dark:bg-surface-800 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-4 py-3 bg-surface-50 dark:bg-surface-800 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                Location
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-surface-800 divide-y divide-surface-200 dark:divide-surface-700">
            {isLoading ? (
              <tr>
                <td colSpan="5" className="px-4 py-8 text-center">
                  <div className="inline-flex items-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary mr-2"></div>
                    <span>Loading products...</span>
                  </div>
                </td>
              </tr>
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-4 py-8 text-center">
                  <div className="flex flex-col items-center">
                    <BoxIcon className="h-12 w-12 text-surface-400 mb-2" />
                    <p className="text-lg font-medium text-surface-900 dark:text-white mb-1">No products found</p>
                    <p className="text-surface-500 dark:text-surface-400">Try adjusting your filters or search query</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredProducts.map(product => {
                const isExpired = new Date(product.expiryDate) < new Date();
                const isNearExpiry = !isExpired && (new Date(product.expiryDate) - new Date()) / (1000 * 60 * 60 * 24) < 30;
                
                return (
                  <tr 
                    key={product.id} 
                    className="hover:bg-surface-50 dark:hover:bg-surface-700 cursor-pointer transition-colors"
                    onClick={() => viewProductDetails(product.id)}
                  >
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-surface-900 dark:text-white">{product.name}</div>
                      <div className="text-sm text-surface-500 dark:text-surface-400">{product.sku}</div>
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap text-right">
                      <div className="flex items-center space-x-2 justify-end">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditProduct(product);
                          }}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          title="Edit product"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            viewProductDetails(product.id);
                          }}
                          className="text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-primary ml-2"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-surface-600 dark:text-surface-300">{product.batchNumber}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        isExpired 
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
                          : isNearExpiry
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {isExpired ? (
                          <>
                            <AlertCircleIcon className="h-3 w-3" />
                            Expired
                          </>
                        ) : isNearExpiry ? (
                          <>
                            <ClockIcon className="h-3 w-3" />
                            {new Date(product.expiryDate).toLocaleDateString()}
                          </>
                        ) : (
                          new Date(product.expiryDate).toLocaleDateString()
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-surface-600 dark:text-surface-300">{product.stock} units</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-surface-600 dark:text-surface-300">{product.location}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      
    </div>
  );
};
    </div>
  );
};

export default ProductList;