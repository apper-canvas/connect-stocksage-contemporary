import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';

// Icons
const CalendarIcon = getIcon('calendar');
const HashIcon = getIcon('hash');
const AlertCircleIcon = getIcon('alert-circle');

const ProductBatchModel = ({ onSave, onCancel, initialData = {} }) => {
  const [batchNumber, setBatchNumber] = useState(initialData.batchNumber || '');
  const [expiryDate, setExpiryDate] = useState(initialData.expiryDate || '');
  const [errors, setErrors] = useState({});

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];
  
  // Validate form before submission
  const validateForm = () => {
    const newErrors = {};
    
    if (!batchNumber.trim()) {
      newErrors.batchNumber = 'Batch number is required';
    }
    
    if (!expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (new Date(expiryDate) <= new Date()) {
      newErrors.expiryDate = 'Expiry date must be in the future';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave({
        batchNumber: batchNumber.trim(),
        expiryDate
      });
      
      toast.success('Batch information saved successfully');
    } else {
      toast.error('Please correct the errors before saving');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold text-surface-900 dark:text-white mb-4">
        Batch & Expiry Information
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Batch Number */}
        <div>
          <label htmlFor="batchNumber" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
            Batch Number*
          </label>
          <div className="relative">
            <HashIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
            <input
              id="batchNumber"
              type="text"
              value={batchNumber}
              onChange={(e) => setBatchNumber(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                errors.batchNumber ? 'border-red-500 dark:border-red-700' : 'border-surface-200 dark:border-surface-700'
              } bg-white dark:bg-surface-800 focus:outline-none focus:ring-2 focus:ring-primary dark:text-white`}
              placeholder="Enter batch number"
            />
            {errors.batchNumber && (
              <div className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircleIcon className="h-4 w-4 mr-1" />
                {errors.batchNumber}
              </div>
            )}
          </div>
        </div>
        
        {/* Expiry Date */}
        <div>
          <label htmlFor="expiryDate" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
            Expiry Date*
          </label>
          <div className="relative">
            <CalendarIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
            <input
              id="expiryDate"
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                errors.expiryDate ? 'border-red-500 dark:border-red-700' : 'border-surface-200 dark:border-surface-700'
              } bg-white dark:bg-surface-800 focus:outline-none focus:ring-2 focus:ring-primary dark:text-white`}
              min={today}
            />
            {errors.expiryDate && (
              <div className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircleIcon className="h-4 w-4 mr-1" />
                {errors.expiryDate}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-surface-200 dark:border-surface-700 rounded-lg text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductBatchModel;