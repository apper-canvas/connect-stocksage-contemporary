import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSalesOrderContext } from '../context/SalesOrderContext';
import { useProductContext } from '../context/ProductContext';
import { getIcon } from '../utils/iconUtils';
import toast from 'react-hot-toast';

// Import icons
const ArrowLeftIcon = getIcon('arrow-left');
const PlusIcon = getIcon('plus');
const MinusIcon = getIcon('minus');
const SaveIcon = getIcon('save');
const TrashIcon = getIcon('trash');
const UserIcon = getIcon('user');
const PhoneIcon = getIcon('phone');
const MailIcon = getIcon('mail');
const MapPinIcon = getIcon('map-pin');

const EditSalesOrderForm = ({ order, onCancel, onSuccess }) => {
  const navigate = useNavigate();
  const { products } = useProductContext();
  const { updateSalesOrder, updateOrderItems, getSalesOrderById } = useSalesOrderContext();
  
  // Form state
  const [items, setItems] = useState([]);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);
  
  // Customer information state
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  
  // Initialize form with order data
  useEffect(() => {
    if (order) {
      // Map order items to include product details for editing
      const mappedItems = order.items.map(item => {
        // Find the full product object
        const productDetail = products.find(p => p.id === item.productId) || {};
        
        return {
          ...item,
          product: productDetail,
          originalQuantity: item.quantity // Store original quantity for inventory checks
        };
      });
      
      setItems(mappedItems);
      setNotes(order.notes || '');
      setTotalAmount(order.totalAmount);
      
      // Set customer information
      if (order.customer) {
        setCustomerName(order.customer.name || '');
        setCustomerEmail(order.customer.email || '');
        setCustomerPhone(order.customer.phone || '');
        setCustomerAddress(order.customer.address || '');
      }
    }
  }, [order, products]);

  // Recalculate total when items change
  useEffect(() => {
    const total = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
    setTotalAmount(total);
  }, [items]);

  const handleQuantityChange = (index, newQuantity) => {
    if (newQuantity < 1) newQuantity = 1;
    
    // Check if the product has enough stock
    const item = items[index];
    const product = products.find(p => p.id === item.productId);
    
    if (product) {
      // Calculate how many more items we're requesting compared to original order
      const quantityDifference = newQuantity - item.originalQuantity;
      
      // Only check stock if we're increasing the quantity
      if (quantityDifference > 0 && quantityDifference > product.stock) {
        toast.error(`Not enough stock available. Only ${product.stock} units available to add.`);
        return;
      }
    }
    
    const updatedItems = [...items];
    updatedItems[index] = {
      ...updatedItems[index],
      quantity: newQuantity,
      total: newQuantity * updatedItems[index].unitPrice
    };
    
    setItems(updatedItems);
  };

  const handlePriceChange = (index, newPrice) => {
    if (newPrice < 0) newPrice = 0;
    
    const updatedItems = [...items];
    updatedItems[index] = {
      ...updatedItems[index],
      unitPrice: newPrice,
      total: updatedItems[index].quantity * newPrice
    };
    
    setItems(updatedItems);
  };

  const handleRemoveItem = (index) => {
    if (items.length === 1) {
      toast.error("Orders must have at least one item");
      return;
    }
    
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate items
    if (items.length === 0) {
      newErrors.items = "At least one item is required";
    }
    
    // Validate customer fields
    if (!customerName.trim()) newErrors.customerName = "Customer name is required";
    if (!customerEmail.trim()) newErrors.customerEmail = "Customer email is required";
    if (!customerPhone.trim()) newErrors.customerPhone = "Customer phone is required";
    if (!customerAddress.trim()) newErrors.customerAddress = "Customer address is required";
    
    // Check if any item has zero quantity
    const hasZeroQuantity = items.some(item => item.quantity <= 0);
    if (hasZeroQuantity) {
      newErrors.quantity = "All items must have quantity greater than zero";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare customer data
      const customerData = {
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
        address: customerAddress
      };
      
      // Update the order items
      await updateOrderItems(order.id, items);
      
      // Update other order fields
      await updateSalesOrder(order.id, {
        customer: customerData,
        notes: notes,
        totalAmount: totalAmount
      });
      
      // Get the updated order
      const updatedOrder = getSalesOrderById(order.id);
      
      // Report success
      if (onSuccess) {
        onSuccess(updatedOrder);
      } else {
        toast.success('Order updated successfully');
        navigate(`/sales-orders/${order.id}`);
      }
    } catch (error) {
      console.error('Failed to update order:', error);
      toast.error('Failed to update the order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900 p-6">
      <div className="max-w-4xl mx-auto bg-white dark:bg-surface-800 rounded-lg shadow-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button 
              onClick={onCancel}
              className="mr-4 p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
              aria-label="Back"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Edit Sales Order</h1>
          </div>
        </div>
        
        {/* Order number and reference */}
        <div className="mb-6 bg-surface-50 dark:bg-surface-700 p-4 rounded-md">
          <p className="text-lg font-semibold">{order.orderNumber}</p>
          <p className="text-sm text-surface-500 dark:text-surface-400">Editing order created on {new Date(order.date).toLocaleDateString()}</p>
        </div>
        
        {/* Customer Information */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Customer Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                <span className="flex items-center">
                  <UserIcon className="w-4 h-4 mr-1" />
                  Customer Name
                </span>
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className={`w-full p-2 border rounded-md ${errors.customerName ? 'border-red-500' : 'border-surface-300 dark:border-surface-600'}`}
              />
              {errors.customerName && <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                <span className="flex items-center">
                  <MailIcon className="w-4 h-4 mr-1" />
                  Email
                </span>
              </label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className={`w-full p-2 border rounded-md ${errors.customerEmail ? 'border-red-500' : 'border-surface-300 dark:border-surface-600'}`}
              />
              {errors.customerEmail && <p className="text-red-500 text-sm mt-1">{errors.customerEmail}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                <span className="flex items-center">
                  <PhoneIcon className="w-4 h-4 mr-1" />
                  Phone
                </span>
              </label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className={`w-full p-2 border rounded-md ${errors.customerPhone ? 'border-red-500' : 'border-surface-300 dark:border-surface-600'}`}
              />
              {errors.customerPhone && <p className="text-red-500 text-sm mt-1">{errors.customerPhone}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                <span className="flex items-center">
                  <MapPinIcon className="w-4 h-4 mr-1" />
                  Shipping Address
                </span>
              </label>
              <textarea
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                className={`w-full p-2 border rounded-md ${errors.customerAddress ? 'border-red-500' : 'border-surface-300 dark:border-surface-600'}`}
                rows="3"
              ></textarea>
              {errors.customerAddress && <p className="text-red-500 text-sm mt-1">{errors.customerAddress}</p>}
            </div>
          </div>
        </div>
        
        {/* Order Items */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Order Items</h2>
          <div className="overflow-x-auto border border-surface-300 dark:border-surface-600 rounded-md">
            <table className="min-w-full divide-y divide-surface-200 dark:divide-surface-700">
              <thead className="bg-surface-100 dark:bg-surface-700">
                <tr>
                  <th className="px-4 py-3 text-left">Product</th>
                  <th className="px-4 py-3 text-right">Unit Price</th>
                  <th className="px-4 py-3 text-center">Quantity</th>
                  <th className="px-4 py-3 text-right">Total</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-200 dark:divide-surface-700">
                {items.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3">{item.productName}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end">
                        <span className="mr-1">$</span>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(e) => handlePriceChange(index, parseFloat(e.target.value) || 0)}
                          className="w-20 p-1 border border-surface-300 dark:border-surface-600 rounded-md text-right"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => handleQuantityChange(index, item.quantity - 1)}
                          className="p-1 rounded-md border border-surface-300 dark:border-surface-600"
                        >
                          <MinusIcon className="w-4 h-4" />
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(index, parseInt(e.target.value) || 1)}
                          className="w-16 p-1 mx-2 border border-surface-300 dark:border-surface-600 rounded-md text-center"
                        />
                        <button
                          onClick={() => handleQuantityChange(index, item.quantity + 1)}
                          className="p-1 rounded-md border border-surface-300 dark:border-surface-600"
                        >
                          <PlusIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">${(item.quantity * item.unitPrice).toFixed(2)}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleRemoveItem(index)}
                        className="p-1 text-red-500 rounded-md hover:bg-surface-100 dark:hover:bg-surface-700"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-surface-50 dark:bg-surface-700">
                <tr>
                  <td colSpan="3" className="px-4 py-3 text-right font-medium">Total:</td>
                  <td className="px-4 py-3 text-right font-medium">${totalAmount.toFixed(2)}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
          {errors.items && <p className="text-red-500 text-sm mt-1">{errors.items}</p>}
          {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
        </div>
        
        {/* Notes */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Order Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-2 border border-surface-300 dark:border-surface-600 rounded-md"
            rows="3"
            placeholder="Additional notes about this order..."
          ></textarea>
        </div>
        
        {/* Action buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-surface-300 dark:border-surface-600 rounded-md hover:bg-surface-100 dark:hover:bg-surface-700"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-md flex items-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
            ) : (
              <SaveIcon className="w-4 h-4 mr-2" />
            )}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditSalesOrderForm;