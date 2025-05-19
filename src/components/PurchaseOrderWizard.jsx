import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getIcon } from '../utils/iconUtils';
import { usePurchaseOrders } from '../context/PurchaseOrderContext';
import PurchaseOrderStatusBadge from './PurchaseOrderStatusBadge';

// Icons
const ArrowLeftIcon = getIcon('arrow-left');
const ArrowRightIcon = getIcon('arrow-right');
const CheckIcon = getIcon('check');
const TruckIcon = getIcon('truck');
const BoxIcon = getIcon('package');
const CalendarIcon = getIcon('calendar');
const ClipboardIcon = getIcon('clipboard');
const SearchIcon = getIcon('search');
const UserIcon = getIcon('user');
const BuildingIcon = getIcon('building');
const PhoneIcon = getIcon('phone');
const MailIcon = getIcon('mail');
const MapPinIcon = getIcon('map-pin');
const PlusIcon = getIcon('plus');
const MinusIcon = getIcon('minus');
const LoaderIcon = getIcon('loader');
const DollarSignIcon = getIcon('dollar-sign');
const ChevronLeftIcon = getIcon('chevron-left');
const ChevronRightIcon = getIcon('chevron-right');

const PurchaseOrderWizard = () => {
  // Wizard state management
  const navigate = useNavigate();
  const { createPurchaseOrder } = usePurchaseOrders();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [notification, setNotification] = useState({ visible: false, message: '', type: '' });
  
  
  // Form state
  const [formData, setFormData] = useState({
    supplierId: '',
    supplierName: '',
    items: [],
    expectedDeliveryDate: '',
    notes: '',
    status: 'draft',
    contactInformation: {}
  });
  
  // Search and filter state
  const [supplierSearchQuery, setSupplierSearchQuery] = useState('');
  const [productSearchQuery, setProductSearchQuery] = useState('');
  
  // Sample supplier data
  const [suppliers, setSuppliers] = useState([
    {
      id: 'sup-001',
      name: 'Tech Components Inc.',
      contactPerson: 'John Smith',
      email: 'john@techcomponents.com',
      phone: '(555) 123-4567',
      address: '123 Tech Blvd, San Jose, CA 95123',
      categories: ['Electronics', 'Computer Parts'],
      rating: 4.8
    },
    {
      id: 'sup-002',
      name: 'Global Office Supplies',
      contactPerson: 'Sarah Johnson',
      email: 'sarah@globaloffice.com',
      phone: '(555) 987-6543',
      address: '456 Office Park, Chicago, IL 60601',
      categories: ['Office Supplies', 'Furniture'],
      rating: 4.5
    },
    {
      id: 'sup-003',
      name: 'Rapid Logistics Partners',
      contactPerson: 'Michael Chen',
      email: 'mchen@rapidlogistics.com',
      phone: '(555) 456-7890',
      address: '789 Freight Way, Dallas, TX 75201',
      categories: ['Packaging', 'Shipping Materials'],
      rating: 4.2
    }
  ]);
  
  // Sample product data
  const [products, setProducts] = useState([
    {
      id: 'prod-001',
      name: 'LCD Monitor 24"',
      sku: 'MON-LCD-24',
      category: 'Electronics',
      price: 149.99,
      unit: 'ea',
      supplierId: 'sup-001'
    },
    {
      id: 'prod-002',
      name: 'Mechanical Keyboard',
      sku: 'KB-MECH-01',
      category: 'Computer Parts',
      price: 89.99,
      unit: 'ea',
      supplierId: 'sup-001'
    },
    {
      id: 'prod-003',
      name: 'Wireless Mouse',
      sku: 'MOUSE-WL-01',
      category: 'Computer Parts',
      price: 29.99,
      unit: 'ea',
      supplierId: 'sup-001'
    },
    {
      id: 'prod-004',
      name: 'Office Paper (500 sheets)',
      sku: 'PAP-A4-500',
      category: 'Office Supplies',
      price: 5.99,
      unit: 'ream',
      supplierId: 'sup-002'
    },
    {
      id: 'prod-005',
      name: 'Sticky Notes Pack',
      sku: 'NOTE-STK-100',
      category: 'Office Supplies',
      price: 3.49,
      unit: 'pack',
      supplierId: 'sup-002'
    },
    {
      id: 'prod-006',
      name: 'Shipping Boxes (Small)',
      sku: 'BOX-SML-10',
      category: 'Packaging',
      price: 12.99,
      unit: 'pack',
      supplierId: 'sup-003'
    }
  ]);
  
  // Filter suppliers based on search query
  const filteredSuppliers = suppliers.filter(supplier => 
    supplier.name.toLowerCase().includes(supplierSearchQuery.toLowerCase()) ||
    supplier.contactPerson.toLowerCase().includes(supplierSearchQuery.toLowerCase()) ||
    supplier.categories.some(cat => cat.toLowerCase().includes(supplierSearchQuery.toLowerCase()))
  );
  
  // Get supplier-specific products
  const supplierProducts = products.filter(product => 
    product.supplierId === formData.supplierId &&
    (product.name.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
     product.sku.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
     product.category.toLowerCase().includes(productSearchQuery.toLowerCase()))
  );
  
  // Calculate order totals
  const orderSubtotal = formData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ visible: true, message, type });
    
    setTimeout(() => {
      setNotification({ visible: false, message: '', type: '' });
    }, 3000);
  };
  
  // Handle supplier selection
  const handleSupplierSelect = (supplier) => {
    setFormData(prev => ({
      ...prev,
      supplierId: supplier.id,
      supplierName: supplier.name
    }));
  };
  
  // Handle adding product to order
  const handleAddProduct = (product) => {
    const existingItem = formData.items.find(item => item.id === product.id);
    
    if (existingItem) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        )
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        items: [...prev.items, { 
          id: product.id, 
          name: product.name, 
          sku: product.sku, 
          price: product.price, 
          unit: product.unit,
          quantity: 1 
        }]
      }));
    }
  };
  
  // Handle removing product from order
  const handleRemoveProduct = (productId) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== productId)
    }));
  };
  
  // Handle quantity change for a product
  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveProduct(productId);
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === productId 
          ? { ...item, quantity: newQuantity } 
          : item
      )
    }));
  };
  
  // Handle delivery date change
  const handleDeliveryDateChange = (e) => {
    setFormData(prev => ({
      ...prev,
      expectedDeliveryDate: e.target.value
    }));
  };
  
  // Handle notes change
  const handleNotesChange = (e) => {
    setFormData(prev => ({
      ...prev,
      notes: e.target.value
    }));
  };

  // Validate formData for the current step
  const validateCurrentStep = () => {
    setErrorMessage('');
    
    if (currentStep === 0 && !formData.supplierId) {
      setErrorMessage('Please select a supplier first');
      return false;
    }
    
    if (currentStep === 1 && formData.items.length === 0) {
      setErrorMessage('Please add at least one product to your order');
      return false;
    }
    
    return true;
  };
  
  // Navigation between steps
  const goToNextStep = () => {
    // Validate current step
    if (currentStep === 0 && !formData.supplierId) {
      alert('Please select a supplier first');
      return;
    }
    
    if (currentStep === 1 && formData.items.length === 0) {
      alert('Please add at least one product to your order');
      return;
    }
    
    if (currentStep === 2 && !formData.expectedDeliveryDate) {
      alert('Please specify an expected delivery date');
      return;
    }
    
    setCurrentStep(prev => prev + 1);
  };
  
  const goToPreviousStep = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };
  
  // Handle form submission
  const handleSubmit = () => {
    if (!validateCurrentStep()) {
      return;
    }
    
    setIsSubmitting(true);
    setErrorMessage('');
    
    try {
      // Get supplier information
      const selectedSupplier = suppliers.find(s => s.id === formData.supplierId);
      
      // Create order data
      const orderData = {
        supplier: formData.supplierName,
        supplierId: formData.supplierId,
        items: formData.items,
        totalAmount: orderSubtotal,
        expectedDelivery: formData.expectedDeliveryDate,
        notes: formData.notes,
        contactPerson: selectedSupplier.contactPerson,
        contactEmail: selectedSupplier.email,
        contactPhone: selectedSupplier.phone,
        deliveryAddress: selectedSupplier.address
      };
      
      // Submit to context
      const newOrder = createPurchaseOrder(orderData);
      setOrderNumber(newOrder.id);
      setIsSubmitting(false);
      setIsCompleted(true);
      showNotification('Purchase order created successfully!');
    } catch (error) {
      setIsSubmitting(false);
      setErrorMessage('Failed to create purchase order. Please try again.');
    }
  };
  
  // Step titles
  const steps = [
    { title: 'Select Supplier', icon: BuildingIcon },
    { title: 'Add Products', icon: BoxIcon },
    { title: 'Delivery Details', icon: TruckIcon },
    { title: 'Review & Submit', icon: ClipboardIcon }
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-800 py-8 px-4">
      {/* Toast Notification */}
      {notification.visible && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg text-white ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`}>
          <div className="flex items-center">
            {notification.type === 'success' ? <CheckIcon className="h-5 w-5 mr-2" /> : <AlertCircleIcon className="h-5 w-5 mr-2" />}
            <p>{notification.message}</p>
          </div>
        </div>
      )}
      <div className="max-w-5xl mx-auto">
        {/* Header with back button */}
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white transition-colors mb-4"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            <span>Back to Dashboard</span>
          </Link>
          
          <h1 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white mb-2">
            Create Purchase Order
          </h1>
          <p className="text-surface-600 dark:text-surface-400">
            {isCompleted 
              ? `Order ${orderNumber} has been created successfully.` 
              : 'Follow the steps below to create a new purchase order.'}
          </p>
        </div>
        
        {!isCompleted ? (
          <div className="glass-card mb-8">
            {/* Error message */}
            {errorMessage && (
              <div className="bg-red-100 dark:bg-red-900 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-4 mb-6">
                <p>{errorMessage}</p>
              </div>
            )}
            
            {/* Step indicator */}
            <div className="flex items-center justify-between mb-8">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;
                
                return (
                  <div 
                    key={index} 
                    className="flex flex-col items-center"
                  >
                    <div 
                      className={`
                        w-10 h-10 rounded-full flex items-center justify-center mb-2
                        ${isActive ? 'bg-primary text-white' : 
                          isCompleted ? 'bg-green-500 text-white' : 
                          'bg-surface-200 dark:bg-surface-700 text-surface-600 dark:text-surface-400'}
                      `}
                    >
                      {isCompleted ? (
                        <CheckIcon className="h-5 w-5" />
                      ) : (
                        <StepIcon className="h-5 w-5" />
                      )}
                    </div>
                    <span 
                      className={`
                        text-xs font-medium hidden md:inline-block
                        ${isActive ? 'text-primary dark:text-primary-light' : 
                          isCompleted ? 'text-green-500 dark:text-green-400' : 
                          'text-surface-500 dark:text-surface-400'}
                      `}
                    >
                      {step.title}
                    </span>
                  </div>
                );
              })}
              
              {/* Connecting lines */}
              <div className="absolute left-0 right-0 flex justify-center">
                <div className="w-full max-w-md h-px bg-surface-200 dark:bg-surface-700 -z-10"></div>
              </div>
            </div>
            
            {/* Step content */}
            <div className="py-4">
              {/* Step 1: Supplier Selection */}
              {currentStep === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-xl font-semibold text-surface-900 dark:text-white mb-4">
                    Select a Supplier
                  </h2>
                  
                  {/* Search input */}
                  <div className="relative mb-6">
                    <SearchIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
                    <input
                      type="text"
                      placeholder="Search suppliers by name, contact or category..."
                      value={supplierSearchQuery}
                      onChange={(e) => setSupplierSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
                    />
                  </div>
                  
                  {/* Suppliers list */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredSuppliers.map(supplier => (
                      <div 
                        key={supplier.id}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                          formData.supplierId === supplier.id
                            ? 'border-primary bg-primary/10 dark:bg-primary/20'
                            : 'border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600'
                        }`}
                        onClick={() => handleSupplierSelect(supplier)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-lg font-medium text-surface-900 dark:text-white">{supplier.name}</h3>
                          {formData.supplierId === supplier.id && (
                            <div className="bg-primary text-white rounded-full p-1">
                              <CheckIcon className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center text-sm text-surface-600 dark:text-surface-300 mb-2">
                          <UserIcon className="h-4 w-4 mr-2" />
                          <span>{supplier.contactPerson}</span>
                        </div>
                        
                        <div className="flex items-center text-sm text-surface-600 dark:text-surface-300 mb-2">
                          <MailIcon className="h-4 w-4 mr-2" />
                          <span>{supplier.email}</span>
                        </div>
                        
                        <div className="flex items-center text-sm text-surface-600 dark:text-surface-300 mb-2">
                          <PhoneIcon className="h-4 w-4 mr-2" />
                          <span>{supplier.phone}</span>
                        </div>
                        
                        <div className="flex items-start text-sm text-surface-600 dark:text-surface-300 mb-3">
                          <MapPinIcon className="h-4 w-4 mr-2 mt-0.5" />
                          <span>{supplier.address}</span>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {supplier.categories.map(category => (
                            <span
                              key={category}
                              className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300"
                            >
                              {category}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
              
              {/* Step 2: Product Selection */}
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-xl font-semibold text-surface-900 dark:text-white mb-4">
                    Add Products to Your Order
                  </h2>
                  
                  {/* Selected supplier info */}
                  <div className="bg-surface-100 dark:bg-surface-700 rounded-lg p-4 mb-6">
                    <p className="text-sm text-surface-600 dark:text-surface-300 mb-1">Selected Supplier:</p>
                    <p className="font-semibold text-surface-900 dark:text-white">{formData.supplierName}</p>
                  </div>
                  
                  {/* Search input */}
                  <div className="relative mb-6">
                    <SearchIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
                    <input
                      type="text"
                      placeholder="Search products by name, SKU or category..."
                      value={productSearchQuery}
                      onChange={(e) => setProductSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
                    />
                  </div>
                  
                  {/* Products grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {supplierProducts.map(product => {
                      const isInOrder = formData.items.some(item => item.id === product.id);
                      
                      return (
                        <div 
                          key={product.id}
                          className={`p-4 rounded-lg border ${
                            isInOrder
                              ? 'border-primary bg-primary/10 dark:bg-primary/20'
                              : 'border-surface-200 dark:border-surface-700'
                          }`}
                        >
                          <div className="flex justify-between mb-2">
                            <h3 className="font-medium text-surface-900 dark:text-white">{product.name}</h3>
                            <span className="text-xs bg-surface-200 dark:bg-surface-600 px-2 py-1 rounded text-surface-700 dark:text-surface-300">
                              {product.category}
                            </span>
                          </div>
                          
                          <p className="text-sm text-surface-600 dark:text-surface-400 mb-2">SKU: {product.sku}</p>
                          
                          <div className="flex items-center justify-between mt-3">
                            <span className="font-semibold text-surface-900 dark:text-white">
                              ${product.price.toFixed(2)} / {product.unit}
                            </span>
                            
                            {isInOrder ? (
                              <div className="flex items-center">
                                <button
                                  onClick={() => {
                                    const item = formData.items.find(item => item.id === product.id);
                                    handleQuantityChange(product.id, (item?.quantity || 0) - 1);
                                  }}
                                  className="p-1 rounded-l-lg bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300"
                                >
                                  <MinusIcon className="h-5 w-5" />
                                </button>
                                <span className="inline-block px-3 py-1 bg-white dark:bg-surface-800 text-surface-900 dark:text-white border-y border-surface-200 dark:border-surface-700">
                                  {formData.items.find(item => item.id === product.id)?.quantity || 0}
                                </span>
                                <button
                                  onClick={() => handleAddProduct(product)}
                                  className="p-1 rounded-r-lg bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300"
                                >
                                  <PlusIcon className="h-5 w-5" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleAddProduct(product)}
                                className="py-1 px-3 rounded-lg bg-primary hover:bg-primary-dark text-white flex items-center gap-1 text-sm"
                              >
                                <PlusIcon className="h-4 w-4" />
                                <span>Add</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Order summary */}
                  <div className="border border-surface-200 dark:border-surface-700 rounded-lg overflow-hidden">
                    <div className="bg-surface-100 dark:bg-surface-800 px-4 py-3 border-b border-surface-200 dark:border-surface-700">
                      <h3 className="font-medium text-surface-900 dark:text-white">Order Summary ({formData.items.length} items)</h3>
                    </div>
                    
                    {formData.items.length > 0 ? (
                      <div className="p-4">
                        <ul className="divide-y divide-surface-200 dark:divide-surface-700">
                          {formData.items.map(item => (
                            <li key={item.id} className="py-3 flex items-center justify-between">
                              <div>
                                <p className="font-medium text-surface-900 dark:text-white">{item.name}</p>
                                <p className="text-sm text-surface-600 dark:text-surface-400">
                                  ${item.price.toFixed(2)} × {item.quantity} {item.unit}
                                </p>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="font-semibold text-surface-900 dark:text-white">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </span>
                                <button
                                  onClick={() => handleRemoveProduct(item.id)}
                                  className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                >
                                  <MinusIcon className="h-5 w-5" />
                                </button>
                              </div>
                            </li>
                          ))}
                        </ul>
                        
                        <div className="mt-4 pt-4 border-t border-surface-200 dark:border-surface-700">
                          <div className="flex justify-between font-semibold text-lg text-surface-900 dark:text-white">
                            <span>Subtotal:</span>
                            <span>${orderSubtotal.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-8 text-center">
                        <BoxIcon className="h-12 w-12 mx-auto mb-3 text-surface-400 dark:text-surface-600" />
                        <p className="text-surface-600 dark:text-surface-400">No items added yet</p>
                        <p className="text-sm text-surface-500 dark:text-surface-500 mt-1">
                          Search and add products from the catalog above
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
              
              {/* Step 3: Delivery Details */}
              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-xl font-semibold text-surface-900 dark:text-white mb-4">
                    Specify Delivery Details
                  </h2>
                  
                  <div className="space-y-6">
                    {/* Expected delivery date */}
                    <div>
                      <label htmlFor="deliveryDate" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                        Expected Delivery Date*
                      </label>
                      <div className="relative">
                        <CalendarIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
                        <input
                          id="deliveryDate"
                          type="date"
                          value={formData.expectedDeliveryDate}
                          onChange={handleDeliveryDateChange}
                          className="w-full pl-10 pr-4 py-3 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
                          required
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                    </div>
                    
                    {/* Notes */}
                    <div>
                      <label htmlFor="notes" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                        Additional Notes (Optional)
                      </label>
                      <textarea
                        id="notes"
                        value={formData.notes}
                        onChange={handleNotesChange}
                        rows="4"
                        placeholder="Shipping instructions, special requirements, etc."
                        className="w-full p-3 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 focus:outline-none focus:ring-2 focus:ring-primary text-surface-900 dark:text-white"
                      ></textarea>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {/* Step 4: Review & Submit */}
              {currentStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-xl font-semibold text-surface-900 dark:text-white mb-4">
                    Review Your Purchase Order
                  </h2>
                  
                  <div className="space-y-6">
                    {/* Supplier information */}
                    <div>
                      <h3 className="text-md font-medium text-surface-900 dark:text-white mb-2 flex items-center">
                        <BuildingIcon className="h-4 w-4 mr-2" />
                        Supplier Information
                      </h3>
                      <div className="bg-surface-100 dark:bg-surface-700 rounded-lg p-4">
                        <p className="font-semibold text-surface-900 dark:text-white mb-1">
                          {formData.supplierName}
                        </p>
                        <p className="text-sm text-surface-600 dark:text-surface-300">
                          {suppliers.find(s => s.id === formData.supplierId)?.contactPerson}
                        </p>
                        <p className="text-sm text-surface-600 dark:text-surface-300">
                          {suppliers.find(s => s.id === formData.supplierId)?.email}
                        </p>
                        <p className="text-sm text-surface-600 dark:text-surface-300">
                          {suppliers.find(s => s.id === formData.supplierId)?.phone}
                        </p>
                      </div>
                    </div>
                    
                    {/* Order items */}
                    <div>
                      <h3 className="text-md font-medium text-surface-900 dark:text-white mb-2 flex items-center">
                        <BoxIcon className="h-4 w-4 mr-2" />
                        Order Items ({formData.items.length})
                      </h3>
                      <div className="bg-surface-100 dark:bg-surface-700 rounded-lg p-4">
                        <ul className="divide-y divide-surface-200 dark:divide-surface-600">
                          {formData.items.map(item => (
                            <li key={item.id} className="py-3 flex items-center justify-between">
                              <div>
                                <p className="font-medium text-surface-900 dark:text-white">{item.name}</p>
                                <p className="text-sm text-surface-600 dark:text-surface-300">
                                  ${item.price.toFixed(2)} × {item.quantity} {item.unit}
                                </p>
                              </div>
                              <span className="font-semibold text-surface-900 dark:text-white">
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                            </li>
                          ))}
                        </ul>
                        
                        <div className="mt-4 pt-4 border-t border-surface-200 dark:border-surface-600">
                          <div className="flex justify-between font-semibold text-lg text-surface-900 dark:text-white">
                            <span>Subtotal:</span>
                            <span>${orderSubtotal.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Delivery details */}
                    <div>
                      <h3 className="text-md font-medium text-surface-900 dark:text-white mb-2 flex items-center">
                        <TruckIcon className="h-4 w-4 mr-2" />
                        Delivery Details
                      </h3>
                      <div className="bg-surface-100 dark:bg-surface-700 rounded-lg p-4">
                        <div className="mb-3">
                          <p className="text-sm text-surface-600 dark:text-surface-300 mb-1">Expected Delivery Date:</p>
                          <p className="font-medium text-surface-900 dark:text-white">
                            {new Date(formData.expectedDeliveryDate).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        
                        {formData.notes && (
                          <div>
                            <p className="text-sm text-surface-600 dark:text-surface-300 mb-1">Additional Notes:</p>
                            <p className="text-surface-900 dark:text-white">
                              {formData.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
            
            {/* Navigation buttons */}
            <div className="flex justify-between mt-8">
              {currentStep > 0 ? (
                <button
                  onClick={goToPreviousStep}
                  className="py-2 px-4 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors flex items-center gap-2"
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                  <span>Back</span>
                </button>
              ) : (
                <div></div>
              )}
              
              {currentStep < steps.length - 1 ? (
                <button
                  onClick={goToNextStep}
                  className="py-2 px-4 rounded-lg bg-primary hover:bg-primary-dark text-white transition-colors flex items-center gap-2"
                >
                  <span>Continue</span>
                  <ChevronRightIcon className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="py-2 px-4 rounded-lg bg-primary hover:bg-primary-dark text-white transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <LoaderIcon className="h-4 w-4 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <CheckIcon className="h-4 w-4" />
                      <span>Submit Order</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Order confirmed screen */
          <div className="glass-card">
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="h-16 w-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4 text-green-600 dark:text-green-400">
                <CheckIcon className="h-8 w-8" />
              </div>
              
              <h2 className="text-2xl font-bold text-surface-900 dark:text-white mb-2">
                Purchase Order Created!
              </h2>
              
              <p className="text-surface-600 dark:text-surface-300 mb-6 max-w-md">
                Your purchase order has been created successfully and sent to the supplier.
              </p>
              
              <div className="bg-surface-100 dark:bg-surface-700 rounded-lg p-6 w-full max-w-md mb-8">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-surface-600 dark:text-surface-300">Order Number:</span>
                  <span className="font-bold text-surface-900 dark:text-white">{orderNumber}</span>
                </div>
                
                <div className="flex justify-between items-center mb-4">
                  <span className="text-surface-600 dark:text-surface-300">Date Created:</span>
                  <span className="text-surface-900 dark:text-white">
                    {new Date().toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                
                <div className="flex justify-between items-center mb-4">
                  <span className="text-surface-600 dark:text-surface-300">Supplier:</span>
                  <span className="text-surface-900 dark:text-white">{formData.supplierName}</span>
                </div>
                
                <div className="flex justify-between items-center mb-4">
                  <span className="text-surface-600 dark:text-surface-300">Expected Delivery:</span>
                  <span className="text-surface-900 dark:text-white">
                    {new Date(formData.expectedDeliveryDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                
                <div className="flex justify-between items-center mb-4">
                  <span className="text-surface-600 dark:text-surface-300">Total Items:</span>
                  <span className="text-surface-900 dark:text-white">{formData.items.length}</span>
                </div>
                
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <span className="text-surface-600 dark:text-surface-300">Order Total:</span>
                  <span className="font-bold text-lg text-surface-900 dark:text-white">${orderSubtotal.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                <Link to={`/purchase-order/${orderNumber}`} className="py-2 px-4 rounded-lg bg-primary hover:bg-primary-dark text-white transition-colors flex items-center justify-center gap-2">
                  <EyeIcon className="h-4 w-4" />
                  <span>View Order Details</span>
                </Link>
                
                <button
                  onClick={() => alert("Purchase order details sent to your email!")} className="py-2 px-4 rounded-lg bg-primary hover:bg-primary-dark text-white transition-colors flex items-center justify-center gap-2">
                  <MailIcon className="h-4 w-4" />
                  <span>Email Order Details</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchaseOrderWizard;