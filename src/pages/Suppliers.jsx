import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getIcon } from '../utils/iconUtils';
import { useSuppliers } from '../context/SupplierContext';
import SupplierForm from '../components/SupplierForm';

// Icons
const UsersIcon = getIcon('users');
const SearchIcon = getIcon('search');
const PlusIcon = getIcon('plus');
const HomeIcon = getIcon('home');
const ChevronRightIcon = getIcon('chevron-right');
const BuildingIcon = getIcon('building');
const EditIcon = getIcon('edit');
const TrashIcon = getIcon('trash');
const EyeIcon = getIcon('eye');
const ArrowUpIcon = getIcon('arrow-up');
const ArrowDownIcon = getIcon('arrow-down');
const XIcon = getIcon('x');
const PhoneIcon = getIcon('phone');
const MailIcon = getIcon('mail');
const MapPinIcon = getIcon('map-pin');
const TagIcon = getIcon('tag');
const CheckCircleIcon = getIcon('check-circle');
const XCircleIcon = getIcon('x-circle');
const FilterIcon = getIcon('filter');
const ChevronDownIcon = getIcon('chevron-down');

const Suppliers = () => {
  const { suppliers, isLoading, addSupplier } = useSuppliers();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  
  // Filter and sort suppliers
  const filteredSuppliers = suppliers
    .filter(supplier => {
      const matchesSearch = 
        supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        supplier.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
        supplier.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        supplier.categories.some(category => 
          category.toLowerCase().includes(searchQuery.toLowerCase())
        );
        
      const matchesStatus = 
        filterStatus === 'all' || 
        supplier.status === filterStatus;
        
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      // Handle array sorting (for categories)
      if (Array.isArray(aValue) && Array.isArray(bValue)) {
        if (aValue.length === 0) return sortDirection === 'asc' ? -1 : 1;
        if (bValue.length === 0) return sortDirection === 'asc' ? 1 : -1;
        
        const compareResult = aValue[0].localeCompare(bValue[0]);
        return sortDirection === 'asc' ? compareResult : -compareResult;
      }
      
      // Regular value sorting
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const compareResult = aValue.localeCompare(bValue);
        return sortDirection === 'asc' ? compareResult : -compareResult;
      }
      
      // Number sorting
      const compareResult = aValue - bValue;
      return sortDirection === 'asc' ? compareResult : -compareResult;
    });
    
  const handleAddSupplier = (supplierData) => {
    addSupplier(supplierData);
    setShowAddModal(false);
  };
  
  const handleEditSupplier = (updatedSupplier) => {
    // In a real app, this would call an API to update the supplier
    // For this example, we'll just show a success toast
    setShowEditModal(false);
  };
  
  const handleDeleteSupplier = () => {
    // In a real app, this would call an API to delete the supplier
    // For this example, we'll just show a success toast
    setShowDeleteModal(false);
  };
  
  const openViewModal = (supplier) => {
    setSelectedSupplier(supplier);
    setShowViewModal(true);
  };
  
  const openEditModal = (supplier) => {
    setSelectedSupplier(supplier);
    setShowEditModal(true);
  };
  
  const openDeleteModal = (supplier) => {
    setSelectedSupplier(supplier);
    setShowDeleteModal(true);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-800">
      <main className="p-4 md:p-8 max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex mb-4 text-sm" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link to="/" className="inline-flex items-center text-surface-600 hover:text-primary dark:text-surface-400 dark:hover:text-primary-light">
                <HomeIcon className="w-4 h-4 mr-2" />
                Home
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <ChevronRightIcon className="w-5 h-5 text-surface-400" />
                <span className="ml-1 text-surface-900 dark:text-white md:ml-2 font-medium">Suppliers</span>
              </div>
            </li>
          </ol>
        </nav>
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-primary text-white mr-3">
              <UsersIcon className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Supplier Management</h1>
              <p className="text-surface-600 dark:text-surface-400">Manage supplier information and relationships</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add Supplier</span>
          </button>
        </div>
        
        {/* Filters and Search */}
        <div className="glass-card mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <SearchIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
              <input
                type="text"
                placeholder="Search suppliers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
              />
            </div>
            
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="appearance-none pl-10 pr-8 py-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
              <FilterIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
              <ChevronDownIcon className="h-5 w-5 absolute right-2 top-1/2 transform -translate-y-1/2 text-surface-400" />
            </div>
            
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-10 pr-8 py-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
              >
                <option value="name">Sort by Name</option>
                <option value="contactPerson">Sort by Contact Person</option>
                <option value="rating">Sort by Rating</option>
              </select>
              <FilterIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
              <ChevronDownIcon className="h-5 w-5 absolute right-2 top-1/2 transform -translate-y-1/2 text-surface-400" />
            </div>
            
            <button
              onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
              className="p-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 hover:bg-surface-50 dark:hover:bg-surface-700"
            >
              {sortDirection === 'asc' ? <ArrowUpIcon className="h-5 w-5 text-surface-600 dark:text-surface-400" /> : <ArrowDownIcon className="h-5 w-5 text-surface-600 dark:text-surface-400" />}
            </button>
          </div>
        </div>
        
        {/* Suppliers Table */}
        <div className="glass-card overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredSuppliers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64">
              <BuildingIcon className="h-16 w-16 text-surface-400 dark:text-surface-600 mb-4" />
              <h3 className="text-xl font-medium text-surface-900 dark:text-white mb-2">No suppliers found</h3>
              <p className="text-surface-600 dark:text-surface-400 mb-4 text-center max-w-md">
                {searchQuery || filterStatus !== 'all' ? 
                  "No suppliers match your current filters. Try adjusting your search criteria." :
                  "You haven't added any suppliers yet. Click the 'Add Supplier' button to get started."}
              </p>
              {(searchQuery || filterStatus !== 'all') && (
                <button
                  onClick={() => {setSearchQuery(''); setFilterStatus('all');}}
                  className="flex items-center text-primary hover:text-primary-dark dark:text-primary-light"
                >
                  <XIcon className="h-4 w-4 mr-1" />
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-surface-200 dark:divide-surface-700">
                <thead>
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                      Supplier
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                      Contact Information
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                      Categories
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                      Rating
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-surface-800 divide-y divide-surface-200 dark:divide-surface-700">
                  {filteredSuppliers.map(supplier => (
                    <tr key={supplier.id} className="hover:bg-surface-50 dark:hover:bg-surface-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-primary-light text-primary-dark">
                            {supplier.name.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-surface-900 dark:text-white">{supplier.name}</div>
                            <div className="text-sm text-surface-500 dark:text-surface-400">ID: {supplier.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-surface-900 dark:text-white">{supplier.contactPerson}</div>
                        <div className="text-sm text-surface-500 dark:text-surface-400">{supplier.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {supplier.categories.map(category => (
                            <span key={category} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                              {category}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <span key={i}>{i < Math.floor(supplier.rating) ? '★' : '☆'}</span>
                          ))}
                          <span className="ml-1 text-sm text-surface-600 dark:text-surface-400">
                            ({supplier.rating.toFixed(1)})
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          supplier.status === 'active' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {supplier.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => openViewModal(supplier)}
                          className="text-primary hover:text-primary-dark dark:hover:text-primary-light ml-2"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => openEditModal(supplier)}
                          className="text-secondary hover:text-secondary-dark dark:hover:text-secondary-light ml-2"
                        >
                          <EditIcon className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => openDeleteModal(supplier)}
                          className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 ml-2"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      
      {/* Add Supplier Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-surface-900 bg-opacity-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-surface-800 rounded-lg shadow-xl max-w-2xl w-full p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-surface-900 dark:text-white">Add New Supplier</h2>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-surface-400 hover:text-surface-600 dark:hover:text-surface-300"
              >
                <XIcon className="h-6 w-6" />
              </button>
            </div>
            <SupplierForm 
              onSubmit={handleAddSupplier}
              onCancel={() => setShowAddModal(false)}
            />
          </motion.div>
        </div>
      )}
      
      {/* View Supplier Modal */}
      {showViewModal && selectedSupplier && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-surface-900 bg-opacity-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-surface-800 rounded-lg shadow-xl max-w-2xl w-full p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-surface-900 dark:text-white">Supplier Details</h2>
              <button 
                onClick={() => setShowViewModal(false)}
                className="text-surface-400 hover:text-surface-600 dark:hover:text-surface-300"
              >
                <XIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center">
                <div className="h-16 w-16 rounded-full bg-primary-light text-primary-dark flex items-center justify-center text-2xl font-semibold">
                  {selectedSupplier.name.charAt(0)}
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-surface-900 dark:text-white">{selectedSupplier.name}</h3>
                  <div className="flex items-center mt-1">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      selectedSupplier.status === 'active' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {selectedSupplier.status === 'active' ? (
                        <span className="flex items-center"><CheckCircleIcon className="h-3 w-3 mr-1" /> Active</span>
                      ) : (
                        <span className="flex items-center"><XCircleIcon className="h-3 w-3 mr-1" /> Inactive</span>
                      )}
                    </span>
                    <span className="ml-2 text-surface-500 dark:text-surface-400">ID: {selectedSupplier.id}</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div>
                  <h4 className="text-sm font-medium text-surface-500 dark:text-surface-400 mb-3">Contact Information</h4>
                  <ul className="space-y-3">
                    <li className="flex">
                      <span className="text-primary mr-2"><MailIcon className="h-5 w-5" /></span>
                      <span className="text-surface-900 dark:text-white">{selectedSupplier.email}</span>
                    </li>
                    <li className="flex">
                      <span className="text-primary mr-2"><PhoneIcon className="h-5 w-5" /></span>
                      <span className="text-surface-900 dark:text-white">{selectedSupplier.phone}</span>
                    </li>
                    <li className="flex">
                      <span className="text-primary mr-2"><MapPinIcon className="h-5 w-5" /></span>
                      <span className="text-surface-900 dark:text-white">{selectedSupplier.address}</span>
                    </li>
                    <li className="flex">
                      <span className="text-primary mr-2"><UsersIcon className="h-5 w-5" /></span>
                      <span className="text-surface-900 dark:text-white">{selectedSupplier.contactPerson}</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-surface-500 dark:text-surface-400 mb-3">Categories</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedSupplier.categories.map(category => (
                      <span key={category} className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        <TagIcon className="h-4 w-4 mr-1" />
                        {category}
                      </span>
                    ))}
                  </div>
                  
                  <h4 className="text-sm font-medium text-surface-500 dark:text-surface-400 mt-6 mb-3">Supplier Rating</h4>
                  <div className="flex text-yellow-400 text-xl">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>{i < Math.floor(selectedSupplier.rating) ? '★' : '☆'}</span>
                    ))}
                    <span className="ml-2 text-base text-surface-700 dark:text-surface-300">
                      {selectedSupplier.rating.toFixed(1)} out of 5
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end space-x-3">
              <button
                onClick={() => {setShowViewModal(false); openEditModal(selectedSupplier);}}
                className="flex items-center px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary-dark"
              >
                <EditIcon className="h-5 w-5 mr-1" />
                Edit
              </button>
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 bg-surface-200 dark:bg-surface-700 text-surface-800 dark:text-white rounded-md hover:bg-surface-300 dark:hover:bg-surface-600"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Edit Supplier Modal */}
      {showEditModal && selectedSupplier && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-surface-900 bg-opacity-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-surface-800 rounded-lg shadow-xl max-w-2xl w-full p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-surface-900 dark:text-white">Edit Supplier</h2>
              <button 
                onClick={() => setShowEditModal(false)}
                className="text-surface-400 hover:text-surface-600 dark:hover:text-surface-300"
              >
                <XIcon className="h-6 w-6" />
              </button>
            </div>
            <SupplierForm 
              supplier={selectedSupplier}
              onSubmit={handleEditSupplier}
              onCancel={() => setShowEditModal(false)}
            />
          </motion.div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedSupplier && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-surface-900 bg-opacity-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-surface-800 rounded-lg shadow-xl max-w-md w-full p-6"
          >
            <div className="flex items-center justify-center text-red-500 mb-4">
              <TrashIcon className="h-12 w-12" />
            </div>
            <h2 className="text-xl font-semibold text-surface-900 dark:text-white text-center mb-2">Delete Supplier</h2>
            <p className="text-surface-600 dark:text-surface-400 text-center mb-6">
              Are you sure you want to delete <span className="font-semibold">{selectedSupplier.name}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-surface-200 dark:bg-surface-700 text-surface-800 dark:text-white rounded-md hover:bg-surface-300 dark:hover:bg-surface-600"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteSupplier}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Suppliers;