import { useState, useEffect } from 'react';
import { getIcon } from '../utils/iconUtils';
import { useProducts } from '../context/ProductContext';
import toast from 'react-hot-toast';
import ProductBatchModel from './ProductBatchModel';

// Define icons
const XIcon = getIcon('x');
const BoxIcon = getIcon('box');
const BarChartIcon = getIcon('bar-chart');
const MapPinIcon = getIcon('map-pin');
const TagIcon = getIcon('tag');
const AlertCircleIcon = getIcon('alert-circle');
const PencilIcon = getIcon('pencil');
const CheckIcon = getIcon('check');

const ProductForm = ({ isOpen, onClose, product = null }) => {
  const { addProduct, updateProduct } = useProducts();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    id: product?.id || null,
    name: product?.name || '',
    sku: product?.sku || '',
    category: product?.category || '',
    stock: product?.stock || '',
    location: product?.location || '',
    batchNumber: product?.batchNumber || '',
    expiryDate: product?.expiryDate || '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const isEditMode = !!product;

  // Reset the form when opening/closing or switching between add/edit
  // Reset the form when opening/closing or switching between add/edit
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setErrors({});
      setSuccessMessage('');
      
      if (product) {
        // Edit mode: populate form with product data
        setFormData({
          id: product.id,
          name: product.name || '',
          sku: product.sku || '',
          category: product.category || '',
          stock: product.stock || '',
          location: product.location || '',
          batchNumber: product.batchNumber || '',
          expiryDate: product.expiryDate || '',
        });
      } else {
        // Add mode: reset form
        setFormData({
          id: null,
          name: '',
          sku: '',
          category: '',
          stock: '',
          location: '',
          batchNumber: '',
          expiryDate: '',
        });
      }
    }
  }, [isOpen, product]);

  const validateStep1 = () => {
    const stepErrors = {};
    
    if (!formData.name.trim()) {
      stepErrors.name = 'Product name is required';
    }
    
    if (!formData.sku.trim()) {
      stepErrors.sku = 'SKU is required';
    }
    
    if (!formData.category.trim()) {
      stepErrors.category = 'Please select a category';
    }
    
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const validateStep2 = () => {
    const stepErrors = {};
    
    if (!formData.stock || isNaN(formData.stock) || Number(formData.stock) < 0) {
      stepErrors.stock = 'Stock must be a positive number';
    }
    
    if (!formData.location.trim()) {
      stepErrors.location = 'Location is required';
    }
    
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleBatchSave = (batchData) => {
  const handleBatchSave = async (batchData) => {
      ...formData,
      batchNumber: batchData.batchNumber,
      expiryDate: batchData.expiryDate
    });
    
    setIsSubmitting(true);
    
    try {
      // Prepare final product data
      const productData = {
        ...formData,
        batchNumber: batchData.batchNumber,
        expiryDate: batchData.expiryDate,
        stock: parseInt(formData.stock, 10)
      };
      
      // Save or update the product
      if (isEditMode) {
        await updateProduct(productData.id, productData);
        setSuccessMessage('Product updated successfully!');
        toast.success('Product updated successfully!');
      } else {
        await addProduct(productData);
        setSuccessMessage('New product added successfully!');
        toast.success('New product added successfully!');
      }
      
      // Close the form after a short delay to show success message
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Error saving product:", error);
      setErrors({
        submit: "Failed to save product. Please try again."
      });
      toast.error('Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  // List of available categories
  const categories = [
    'Electronics', 
    'Accessories', 
    'Storage', 
    'Cables', 
    'Audio', 
    'Video', 
    'Computer Parts',
    'Networking',
    'Office Supplies',
    'Software'
  ];
  
  // List of available locations
  const locations = [
    'Warehouse A',
    'Warehouse B',
    'Warehouse C',
    'Storage Room 1',
    'Storage Room 2',
    'Main Store',
    'Back Office'
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity">
          <div className="absolute inset-0 bg-surface-900 opacity-75 dark:opacity-90"></div>
        </div>
        
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;
        
        <div 
          className="inline-block align-bottom bg-white dark:bg-surface-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          role="dialog" 
          aria-modal="true" 
          aria-labelledby="modal-headline"
        >
          <div className="absolute right-0 top-0 pt-4 pr-4">
            <button
              onClick={onClose}
              className="text-surface-400 hover:text-surface-500 focus:outline-none"
            >
              <XIcon className="h-6 w-6" />
            </button>
          </div>
          
          {successMessage && (
            <div className="p-4 bg-green-100 dark:bg-green-900 border-l-4 border-green-500 text-green-700 dark:text-green-200">
              <div className="flex items-center">
                <CheckIcon className="h-5 w-5 mr-2" />
                <p>{successMessage}</p>
              </div>
            </div>
          )}
          
          {errors.submit && (
            <div className="p-4 bg-red-100 dark:bg-red-900 border-l-4 border-red-500 text-red-700 dark:text-red-200 mb-4">
              <div className="flex items-center">
                <AlertCircleIcon className="h-5 w-5 mr-2" />
                <p>{errors.submit}</p>
              </div>
            </div>
          )}
          {step === 1 && (
            <div className="px-4 pt-5 pb-4 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-surface-900 dark:text-white mb-4 flex items-center">
                {isEditMode ? <PencilIcon className="h-5 w-5 mr-2" /> : <BoxIcon className="h-5 w-5 mr-2" />}
                {isEditMode ? 'Edit Product' : 'Add New Product'} - Basic Info
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    Product Name*
                  </label>
                  <div className="relative">
                    <BoxIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                        errors.name ? 'border-red-500 dark:border-red-700' : 'border-surface-200 dark:border-surface-700'
                      } bg-white dark:bg-surface-800 focus:outline-none focus:ring-2 focus:ring-primary dark:text-white`}
                      placeholder="Enter product name"
                    />
                    {errors.name && (
                      <div className="text-red-500 text-sm mt-1 flex items-center">
                        <AlertCircleIcon className="h-4 w-4 mr-1" />
                        {errors.name}
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="sku" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    SKU*
                  </label>
                  <div className="relative">
                    <TagIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
                    <input
                      id="sku"
                      name="sku"
                      type="text"
                      value={formData.sku}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                        errors.sku ? 'border-red-500 dark:border-red-700' : 'border-surface-200 dark:border-surface-700'
                      } bg-white dark:bg-surface-800 focus:outline-none focus:ring-2 focus:ring-primary dark:text-white`}
                      placeholder="Enter product SKU"
                    />
                    {errors.sku && (
                      <div className="text-red-500 text-sm mt-1 flex items-center">
                        <AlertCircleIcon className="h-4 w-4 mr-1" />
                        {errors.sku}
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    Category*
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={`w-full pl-4 pr-4 py-2 rounded-lg border ${
                      errors.category ? 'border-red-500 dark:border-red-700' : 'border-surface-200 dark:border-surface-700'
                    } bg-white dark:bg-surface-800 focus:outline-none focus:ring-2 focus:ring-primary dark:text-white`}
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  {errors.category && (
                    <div className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircleIcon className="h-4 w-4 mr-1" />
                      {errors.category}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div className="px-4 pt-5 pb-4 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-surface-900 dark:text-white mb-4">
                {isEditMode ? 'Edit Product' : 'Add New Product'} - Stock & Location
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="stock" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    Stock Quantity*
                  </label>
                  <div className="relative">
                    <BarChartIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
                    <input
                      id="stock"
                      name="stock"
                      type="number"
                      min="0"
                      value={formData.stock}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                        errors.stock ? 'border-red-500 dark:border-red-700' : 'border-surface-200 dark:border-surface-700'
                      } bg-white dark:bg-surface-800 focus:outline-none focus:ring-2 focus:ring-primary dark:text-white`}
                      placeholder="Enter quantity"
                    />
                    {errors.stock && (
                      <div className="text-red-500 text-sm mt-1 flex items-center">
                        <AlertCircleIcon className="h-4 w-4 mr-1" />
                        {errors.stock}
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    Storage Location*
                  </label>
                  <div className="relative">
                    <MapPinIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
                    <select
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                        errors.location ? 'border-red-500 dark:border-red-700' : 'border-surface-200 dark:border-surface-700'
                      } bg-white dark:bg-surface-800 focus:outline-none focus:ring-2 focus:ring-primary dark:text-white`}
                    >
                      <option value="">Select a location</option>
                      {locations.map((location) => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                    </select>
                    {errors.location && (
                      <div className="text-red-500 text-sm mt-1 flex items-center">
                        <AlertCircleIcon className="h-4 w-4 mr-1" />
                        {errors.location}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {step === 3 && (
            <ProductBatchModel 
              onSave={handleBatchSave}
              onCancel={handlePrevious}
              initialData={{
                batchNumber: formData.batchNumber,
                expiryDate: formData.expiryDate
              }}
            />
          )}
          
          {step < 3 && (
            <div className="bg-surface-50 dark:bg-surface-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                onClick={handleNext}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm"
                disabled={isSubmitting}
              >
                Next
              </button>
              {step > 1 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-surface-300 dark:border-surface-600 shadow-sm px-4 py-2 bg-white dark:bg-surface-800 text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Back
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-surface-300 dark:border-surface-600 shadow-sm px-4 py-2 bg-white dark:bg-surface-800 text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:w-auto sm:text-sm"
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductForm;