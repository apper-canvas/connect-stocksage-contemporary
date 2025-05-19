import { useState, useEffect } from 'react';
import { getIcon } from '../utils/iconUtils';

const xIcon = getIcon('x');
const plusIcon = getIcon('plus');
const minusIcon = getIcon('minus');

const SupplierForm = ({ supplier = null, onSubmit, onCancel }) => {
  const isEditing = !!supplier;
  
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    categories: [],
    rating: 0,
    status: 'active'
  });
  
  const [errors, setErrors] = useState({});
  const [newCategory, setNewCategory] = useState('');
  
  // If editing, populate form with supplier data
  useEffect(() => {
    if (supplier) {
      setFormData({
        name: supplier.name || '',
        contactPerson: supplier.contactPerson || '',
        email: supplier.email || '',
        phone: supplier.phone || '',
        address: supplier.address || '',
        categories: supplier.categories || [],
        rating: supplier.rating || 0,
        status: supplier.status || 'active'
      });
    }
  }, [supplier]);
  
  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Supplier name is required';
    }
    
    if (!formData.contactPerson.trim()) {
      newErrors.contactPerson = 'Contact person is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (formData.categories.length === 0) {
      newErrors.categories = 'At least one category is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit(formData);
    }
  };
  
  const handleAddCategory = () => {
    if (newCategory.trim()) {
      if (!formData.categories.includes(newCategory.trim())) {
        setFormData(prev => ({
          ...prev,
          categories: [...prev.categories, newCategory.trim()]
        }));
        
        // Clear category error if it exists
        if (errors.categories) {
          setErrors(prev => ({
            ...prev,
            categories: undefined
          }));
        }
      }
      setNewCategory('');
    }
  };
  
  const handleRemoveCategory = (category) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c !== category)
    }));
  };
  
  const handleRatingChange = (newRating) => {
    setFormData(prev => ({
      ...prev,
      rating: newRating
    }));
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
            Supplier Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500 dark:border-red-700' : 'border-surface-300 dark:border-surface-600'} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-surface-800 dark:text-white`}
          />
          {errors.name && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>}
        </div>
        
        <div>
          <label htmlFor="contactPerson" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
            Contact Person *
          </label>
          <input
            type="text"
            id="contactPerson"
            name="contactPerson"
            value={formData.contactPerson}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${errors.contactPerson ? 'border-red-500 dark:border-red-700' : 'border-surface-300 dark:border-surface-600'} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-surface-800 dark:text-white`}
          />
          {errors.contactPerson && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.contactPerson}</p>}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500 dark:border-red-700' : 'border-surface-300 dark:border-surface-600'} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-surface-800 dark:text-white`}
            />
            {errors.email && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>}
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
              Phone Number *
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${errors.phone ? 'border-red-500 dark:border-red-700' : 'border-surface-300 dark:border-surface-600'} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-surface-800 dark:text-white`}
            />
            {errors.phone && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phone}</p>}
          </div>
        </div>
        
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
            Address *
          </label>
          <textarea
            id="address"
            name="address"
            rows="2"
            value={formData.address}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${errors.address ? 'border-red-500 dark:border-red-700' : 'border-surface-300 dark:border-surface-600'} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-surface-800 dark:text-white`}
          ></textarea>
          {errors.address && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.address}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
            Categories *
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.categories.map(category => (
              <span key={category} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-primary-light text-primary-dark">
                {category}
                <button
                  type="button"
                  onClick={() => handleRemoveCategory(category)}
                  className="ml-1 text-primary-dark hover:text-primary-dark focus:outline-none"
                >
                  <xIcon className="h-4 w-4" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Add a category"
              className="flex-grow px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-l-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-surface-800 dark:text-white"
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCategory())}
            />
            <button
              type="button"
              onClick={handleAddCategory}
              className="px-3 py-2 bg-primary text-white rounded-r-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <plusIcon className="h-5 w-5" />
            </button>
          </div>
          {errors.categories && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.categories}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
            Rating
          </label>
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingChange(star)}
                className={`h-8 w-8 ${star <= formData.rating ? 'text-yellow-400' : 'text-surface-300 dark:text-surface-600'}`}
              >
                ★
              </button>
            ))}
            <span className="ml-2 text-sm text-surface-500 dark:text-surface-400">
              {formData.rating} out of 5
            </span>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
            Status
          </label>
          <div className="flex items-center space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="status"
                value="active"
                checked={formData.status === 'active'}
                onChange={handleChange}
                className="h-4 w-4 text-primary focus:ring-primary border-surface-300 dark:border-surface-600"
              />
              <span className="ml-2 text-surface-700 dark:text-surface-300">Active</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="status"
                value="inactive"
                checked={formData.status === 'inactive'}
                onChange={handleChange}
                className="h-4 w-4 text-primary focus:ring-primary border-surface-300 dark:border-surface-600"
              />
              <span className="ml-2 text-surface-700 dark:text-surface-300">Inactive</span>
            </label>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-surface-300 dark:border-surface-600 rounded-md shadow-sm text-surface-700 dark:text-surface-300 bg-white dark:bg-surface-800 hover:bg-surface-50 dark:hover:bg-surface-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          {isEditing ? 'Update Supplier' : 'Add Supplier'}
        </button>
      </div>
    </form>
  );
};

export default SupplierForm;