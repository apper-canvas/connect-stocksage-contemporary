import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSalesOrderContext } from '../context/SalesOrderContext';
import { useProducts } from '../context/ProductContext';
import { getIcon } from '../utils/iconUtils';
import toast from 'react-hot-toast';

// Import icons
const ArrowLeftIcon = getIcon('arrow-left');
const ArrowRightIcon = getIcon('arrow-right');
const PlusIcon = getIcon('plus');
const MinusIcon = getIcon('minus');
const TrashIcon = getIcon('trash');
const CheckIcon = getIcon('check');

const SalesOrderWizard = () => {
  const navigate = useNavigate();
  const { createSalesOrder } = useSalesOrderContext();
  const { products } = useProducts();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    customer: {
      name: '',
      email: '',
      phone: '',
      address: ''
    },
    items: [],
    notes: '',
    shippingAddress: '',
    paymentMethod: 'credit'
  });
  
  const [availableProducts, setAvailableProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    // Filter products with stock > 0
    setAvailableProducts(products.filter(product => product.stock > 0));
  }, [products]);
  
  const calculateTotal = () => {
    return formData.items.reduce((total, item) => {
      return total + (item.quantity * (item.product.sellingPrice || item.product.price));
    }, 0).toFixed(2);
  };
  
  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      customer: {
        ...prev.customer,
        [name]: value
      }
    }));
    
    // Clear error when field is filled
    if (errors[name] && value.trim()) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleGeneralChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const validateStep = (currentStep) => {
    const newErrors = {};
    
    if (currentStep === 1) {
      if (!formData.customer.name.trim()) newErrors.name = 'Customer name is required';
      if (!formData.customer.email.trim()) newErrors.email = 'Email is required';
      if (!formData.customer.phone.trim()) newErrors.phone = 'Phone number is required';
      if (!formData.customer.address.trim()) newErrors.address = 'Address is required';
    }
    
    if (currentStep === 2) {
      if (formData.items.length === 0) newErrors.items = 'At least one product must be added';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const goToNextStep = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
    }
  };
  
  const goToPreviousStep = () => {
    setStep(prev => prev - 1);
  };
  
  const addProductToOrder = () => {
    if (!selectedProduct) {
      setErrors(prev => ({ ...prev, selectedProduct: 'Please select a product' }));
      return;
    }
    
    if (quantity <= 0) {
      setErrors(prev => ({ ...prev, quantity: 'Quantity must be greater than 0' }));
      return;
    }
    
    const product = availableProducts.find(p => p.id === selectedProduct);
    if (!product) return;
    
    if (quantity > product.stock) {
      setErrors(prev => ({ ...prev, quantity: `Max available: ${product.stock}` }));
      return;
    }
    
    // Check if product already exists in order
    const existingItemIndex = formData.items.findIndex(item => item.product.id === product.id);
    
    if (existingItemIndex >= 0) {
      // Update existing product quantity
      const updatedItems = [...formData.items];
      const newQuantity = updatedItems[existingItemIndex].quantity + quantity;
      
      if (newQuantity > product.stock) {
        setErrors(prev => ({ ...prev, quantity: `Max available: ${product.stock}` }));
        return;
      }
      
      updatedItems[existingItemIndex].quantity = newQuantity;
      
      setFormData(prev => ({
        ...prev,
        items: updatedItems
      }));
    } else {
      // Add new product
      setFormData(prev => ({
        ...prev,
        items: [...prev.items, {
          product,
          quantity
        }]
      }));
    }
    
    // Reset selection
    setSelectedProduct('');
    setQuantity(1);
    setErrors(prev => ({ ...prev, selectedProduct: '', quantity: '', items: '' }));
  };
  
  const removeItem = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };
  
  const updateItemQuantity = (index, newQuantity) => {
    const product = formData.items[index].product;
    
    if (newQuantity <= 0) {
      removeItem(index);
      return;
    }
    
    if (newQuantity > product.stock) {
      toast.error(`Maximum available: ${product.stock}`);
      return;
    }
    
    const updatedItems = [...formData.items];
    updatedItems[index].quantity = newQuantity;
    
    setFormData(prev => ({
      ...prev,
      items: updatedItems
    }));
  };
  
  const handleSubmit = () => {
    try {
      const result = createSalesOrder(formData);
      if (result) {
        toast.success('Sales order created successfully!');
        navigate('/orders');
      }
    } catch (error) {
      toast.error('Failed to create sales order');
      console.error('Error creating sales order:', error);
    }
  };
  
  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900 p-6">
      <div className="max-w-4xl mx-auto bg-white dark:bg-surface-800 rounded-lg shadow-card p-6">
        <div className="flex items-center mb-6">
          <button 
            onClick={() => navigate('/orders')}
            className="mr-4 p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Create Sales Order</h1>
        </div>
        
        {/* Step indicator */}
        <div className="flex mb-8">
          <div className={`flex-1 text-center py-2 border-b-2 ${step === 1 ? 'border-primary font-medium' : 'border-surface-200 dark:border-surface-700'}`}>
            1. Customer Details
          </div>
          <div className={`flex-1 text-center py-2 border-b-2 ${step === 2 ? 'border-primary font-medium' : 'border-surface-200 dark:border-surface-700'}`}>
            2. Order Items
          </div>
          <div className={`flex-1 text-center py-2 border-b-2 ${step === 3 ? 'border-primary font-medium' : 'border-surface-200 dark:border-surface-700'}`}>
            3. Review & Submit
          </div>
        </div>
        
        {/* Step 1: Customer Information */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Customer Name*</label>
                <input
                  type="text"
                  name="name"
                  value={formData.customer.name}
                  onChange={handleCustomerChange}
                  className={`w-full p-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-surface-300 dark:border-surface-600'}`}
                  placeholder="Enter customer name"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Email*</label>
                <input
                  type="email"
                  name="email"
                  value={formData.customer.email}
                  onChange={handleCustomerChange}
                  className={`w-full p-2 border rounded-md ${errors.email ? 'border-red-500' : 'border-surface-300 dark:border-surface-600'}`}
                  placeholder="Enter email address"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Phone Number*</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.customer.phone}
                  onChange={handleCustomerChange}
                  className={`w-full p-2 border rounded-md ${errors.phone ? 'border-red-500' : 'border-surface-300 dark:border-surface-600'}`}
                  placeholder="Enter phone number"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Address*</label>
                <input
                  type="text"
                  name="address"
                  value={formData.customer.address}
                  onChange={handleCustomerChange}
                  className={`w-full p-2 border rounded-md ${errors.address ? 'border-red-500' : 'border-surface-300 dark:border-surface-600'}`}
                  placeholder="Enter address"
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </div>
            </div>
          </div>
        )}
        
        {/* Step 2: Product Selection */}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Order Items</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Product</label>
                <select
                  value={selectedProduct}
                  onChange={(e) => {
                    setSelectedProduct(e.target.value);
                    setErrors(prev => ({ ...prev, selectedProduct: '' }));
                  }}
                  className={`w-full p-2 border rounded-md ${errors.selectedProduct ? 'border-red-500' : 'border-surface-300 dark:border-surface-600'}`}
                >
                  <option value="">Select Product</option>
                  {availableProducts.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name} - ${product.sellingPrice || product.price} (Stock: {product.stock})
                    </option>
                  ))}
                </select>
                {errors.selectedProduct && <p className="text-red-500 text-sm mt-1">{errors.selectedProduct}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Quantity</label>
                <div className="flex items-center">
                  <button 
                    type="button"
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    className="p-2 bg-surface-100 dark:bg-surface-700 rounded-l-md"
                  >
                    <MinusIcon className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => {
                      setQuantity(parseInt(e.target.value) || 1);
                      setErrors(prev => ({ ...prev, quantity: '' }));
                    }}
                    className={`w-full p-2 border-y text-center ${errors.quantity ? 'border-red-500' : 'border-surface-300 dark:border-surface-600'}`}
                  />
                  <button 
                    type="button"
                    onClick={() => setQuantity(prev => prev + 1)}
                    className="p-2 bg-surface-100 dark:bg-surface-700 rounded-r-md"
                  >
                    <PlusIcon className="w-4 h-4" />
                  </button>
                </div>
                {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
              </div>
              
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={addProductToOrder}
                  className="w-full p-2 bg-primary hover:bg-primary-dark text-white rounded-md flex items-center justify-center"
                >
                  <PlusIcon className="w-4 h-4 mr-1" />
                  Add Item
                </button>
              </div>
            </div>
            
            {errors.items && <p className="text-red-500 text-sm mt-1 mb-4">{errors.items}</p>}
            
            {/* Order items table */}
            {formData.items.length > 0 ? (
              <div className="overflow-x-auto mt-4">
                <table className="min-w-full divide-y divide-surface-200 dark:divide-surface-700">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left">Product</th>
                      <th className="px-4 py-2 text-right">Price</th>
                      <th className="px-4 py-2 text-center">Quantity</th>
                      <th className="px-4 py-2 text-right">Total</th>
                      <th className="px-4 py-2 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-200 dark:divide-surface-700">
                    {formData.items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2">{item.product.name}</td>
                        <td className="px-4 py-2 text-right">${item.product.sellingPrice || item.product.price}</td>
                        <td className="px-4 py-2">
                          <div className="flex items-center justify-center">
                            <button 
                              type="button"
                              onClick={() => updateItemQuantity(index, item.quantity - 1)}
                              className="p-1 bg-surface-100 dark:bg-surface-700 rounded-l-md"
                            >
                              <MinusIcon className="w-3 h-3" />
                            </button>
                            <span className="px-2">{item.quantity}</span>
                            <button 
                              type="button"
                              onClick={() => updateItemQuantity(index, item.quantity + 1)}
                              className="p-1 bg-surface-100 dark:bg-surface-700 rounded-r-md"
                            >
                              <PlusIcon className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-2 text-right">
                          ${((item.product.sellingPrice || item.product.price) * item.quantity).toFixed(2)}
                        </td>
                        <td className="px-4 py-2 text-center">
                          <button 
                            type="button"
                            onClick={() => removeItem(index)}
                            className="p-1 text-red-500 hover:bg-surface-100 dark:hover:bg-surface-700 rounded"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="3" className="px-4 py-2 text-right font-medium">Total:</td>
                      <td className="px-4 py-2 text-right font-medium">${calculateTotal()}</td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 bg-surface-50 dark:bg-surface-800 rounded-md">
                No items added to order yet
              </div>
            )}
            
            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleGeneralChange}
                className="w-full p-2 border border-surface-300 dark:border-surface-600 rounded-md"
                placeholder="Add any special instructions or notes"
                rows="3"
              ></textarea>
            </div>
          </div>
        )}
        
        {/* Step 3: Review & Submit */}
        {step === 3 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Review Order</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-surface-50 dark:bg-surface-800 p-4 rounded-md">
                <h3 className="font-medium mb-2">Customer Information</h3>
                <div className="space-y-1">
                  <p><span className="font-medium">Name:</span> {formData.customer.name}</p>
                  <p><span className="font-medium">Email:</span> {formData.customer.email}</p>
                  <p><span className="font-medium">Phone:</span> {formData.customer.phone}</p>
                  <p><span className="font-medium">Address:</span> {formData.customer.address}</p>
                </div>
              </div>
              
              <div className="bg-surface-50 dark:bg-surface-800 p-4 rounded-md">
                <h3 className="font-medium mb-2">Order Summary</h3>
                <div className="space-y-1">
                  <p><span className="font-medium">Total Items:</span> {formData.items.length}</p>
                  <p><span className="font-medium">Total Quantity:</span> {formData.items.reduce((sum, item) => sum + item.quantity, 0)}</p>
                  <p><span className="font-medium">Total Amount:</span> ${calculateTotal()}</p>
                  {formData.notes && (
                    <p><span className="font-medium">Notes:</span> {formData.notes}</p>
                  )}
                </div>
              </div>
            </div>
            
            <h3 className="font-medium mb-2">Order Items</h3>
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full divide-y divide-surface-200 dark:divide-surface-700">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left">Product</th>
                    <th className="px-4 py-2 text-right">Price</th>
                    <th className="px-4 py-2 text-center">Quantity</th>
                    <th className="px-4 py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-200 dark:divide-surface-700">
                  {formData.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2">{item.product.name}</td>
                      <td className="px-4 py-2 text-right">${item.product.sellingPrice || item.product.price}</td>
                      <td className="px-4 py-2 text-center">{item.quantity}</td>
                      <td className="px-4 py-2 text-right">
                        ${((item.product.sellingPrice || item.product.price) * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="3" className="px-4 py-2 text-right font-medium">Total:</td>
                    <td className="px-4 py-2 text-right font-medium">${calculateTotal()}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            
            <div className="bg-surface-50 dark:bg-surface-800 p-4 rounded-md mb-6">
              <h3 className="font-medium mb-2">Payment & Shipping</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Payment Method</label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleGeneralChange}
                    className="w-full p-2 border border-surface-300 dark:border-surface-600 rounded-md"
                  >
                    <option value="credit">Credit (Pay later)</option>
                    <option value="cash">Cash on Delivery</option>
                    <option value="bank">Bank Transfer</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Shipping Address</label>
                  <textarea
                    name="shippingAddress"
                    value={formData.shippingAddress || formData.customer.address}
                    onChange={handleGeneralChange}
                    className="w-full p-2 border border-surface-300 dark:border-surface-600 rounded-md"
                    placeholder="Use same as customer address"
                    rows="2"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Navigation buttons */}
        <div className="flex justify-between mt-8">
          {step > 1 ? (
            <button
              type="button"
              onClick={goToPreviousStep}
              className="px-4 py-2 flex items-center border border-surface-300 dark:border-surface-600 rounded-md hover:bg-surface-100 dark:hover:bg-surface-700"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-1" />
              Previous
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate('/orders')}
              className="px-4 py-2 flex items-center border border-surface-300 dark:border-surface-600 rounded-md hover:bg-surface-100 dark:hover:bg-surface-700"
            >
              Cancel
            </button>
          )}
          
          {step < 3 ? (
            <button
              type="button"
              onClick={goToNextStep}
              className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-md flex items-center"
            >
              Next
              <ArrowRightIcon className="w-4 h-4 ml-1" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-md flex items-center"
            >
              <CheckIcon className="w-4 h-4 mr-1" />
              Submit Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesOrderWizard;