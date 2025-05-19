import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getIcon } from '../utils/iconUtils';
import { useProducts } from '../context/ProductContext';

// Import icons
const ArrowLeftIcon = getIcon('arrow-left');
const BoxIcon = getIcon('box');
const AlertCircleIcon = getIcon('alert-circle');
const CheckCircleIcon = getIcon('check-circle');
const ClockIcon = getIcon('clock');
const MapPinIcon = getIcon('map-pin');
const PackageIcon = getIcon('package');
const TagIcon = getIcon('tag');
const HashIcon = getIcon('hash');
const CalendarIcon = getIcon('calendar');
const BarChart2Icon = getIcon('bar-chart-2');
const PencilIcon = getIcon('pencil');
const InfoIcon = getIcon('info');

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products } = useProducts();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      const foundProduct = products.find(p => p.id === parseInt(id));
      setProduct(foundProduct || null);
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [id, products]);

  const getExpiryStatus = () => {
    if (!product) return { color: '', status: '', icon: null };

    const now = new Date();
    const expiryDate = new Date(product.expiryDate);
    const daysUntilExpiry = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));

    if (expiryDate < now) {
      return {
        color: 'text-red-600 dark:text-red-400',
        bgColor: 'bg-red-100 dark:bg-red-900/30',
        status: 'Expired',
        icon: AlertCircleIcon
      };
    }
    
    if (daysUntilExpiry <= 30) {
      return {
        color: 'text-yellow-600 dark:text-yellow-400',
        bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
        status: `Expiring soon (${daysUntilExpiry} days)`,
        icon: ClockIcon
      };
    }
    
    return {
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      status: 'Good',
      icon: CheckCircleIcon
    };
  };

  const getStockStatus = () => {
    if (!product) return { color: '', status: '' };

    if (product.stock < 20) {
      return {
        color: 'text-red-600 dark:text-red-400',
        bgColor: 'bg-red-100 dark:bg-red-900/30',
        status: 'Low'
      };
    }
    
    if (product.stock >= 20 && product.stock < 50) {
      return {
        color: 'text-yellow-600 dark:text-yellow-400',
        bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
        status: 'Medium'
      };
    }
    
    return {
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      status: 'High'
    };
  };

  const toggleProductModal = () => {
    setIsProductModalOpen(!isProductModalOpen);
  };

  const expiryStatus = getExpiryStatus();
  const stockStatus = getStockStatus();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-800 p-4 md:p-8">
        <div className="max-w-4xl mx-auto glass-card">
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <span className="ml-3 text-lg text-surface-700 dark:text-surface-300">Loading product details...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-800 p-4 md:p-8">
        <div className="max-w-4xl mx-auto glass-card">
          <div className="flex flex-col items-center justify-center h-96">
            <InfoIcon className="h-16 w-16 text-surface-400 mb-4" />
            <h2 className="text-2xl font-semibold text-surface-800 dark:text-surface-200 mb-2">Product Not Found</h2>
            <p className="text-surface-600 dark:text-surface-400 mb-6">The product you're looking for doesn't exist or has been removed.</p>
            <Link 
              to="/" 
              className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-800 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <nav className="mb-6">
          <Link to="/" className="flex items-center text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-primary transition-colors">
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            <span>Back to Products</span>
          </Link>
        </nav>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="glass-card"
        >
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center">
              <div className="bg-primary p-3 rounded-lg mr-4">
                <BoxIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-surface-900 dark:text-white">{product.name}</h1>
                <div className="flex items-center text-surface-600 dark:text-surface-400 mt-1">
                  <TagIcon className="h-4 w-4 mr-1" />
                  <span>{product.sku}</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => navigate(`/?edit=${product.id}`)}
              className="flex items-center bg-surface-200 hover:bg-surface-300 dark:bg-surface-700 dark:hover:bg-surface-600 text-surface-700 dark:text-surface-300 px-3 py-2 rounded-lg transition-colors"
            >
              <PencilIcon className="h-5 w-5 mr-2" />
              <span>Edit Product</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-surface-800 dark:text-white mb-3 flex items-center">
                  <BoxIcon className="h-5 w-5 mr-2 text-primary" />
                  Product Information
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between pb-2 border-b border-surface-200 dark:border-surface-700">
                    <span className="text-surface-600 dark:text-surface-400">Category:</span>
                    <span className="font-medium text-surface-900 dark:text-white">{product.category}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-surface-200 dark:border-surface-700">
                    <span className="text-surface-600 dark:text-surface-400">Batch Number:</span>
                    <div className="flex items-center font-medium text-surface-900 dark:text-white">
                      <HashIcon className="h-4 w-4 mr-1 text-surface-500 dark:text-surface-400" />
                      {product.batchNumber}
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-lg font-semibold text-surface-800 dark:text-white mb-3 flex items-center">
                  <BarChart2Icon className="h-5 w-5 mr-2 text-primary" />
                  Inventory Status
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between pb-2 border-b border-surface-200 dark:border-surface-700">
                    <span className="text-surface-600 dark:text-surface-400">Current Stock:</span>
                    <div className="flex items-center">
                      <span className="font-medium text-surface-900 dark:text-white mr-2">{product.stock} units</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${stockStatus.bgColor} ${stockStatus.color}`}>
                        {stockStatus.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-surface-200 dark:border-surface-700">
                    <span className="text-surface-600 dark:text-surface-400">Storage Location:</span>
                    <div className="flex items-center font-medium text-surface-900 dark:text-white">
                      <MapPinIcon className="h-4 w-4 mr-1 text-surface-500 dark:text-surface-400" />
                      {product.location}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-surface-800 dark:text-white mb-3 flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-2 text-primary" />
                  Expiry Information
                </h2>
                <div className="bg-surface-50 dark:bg-surface-800 rounded-lg p-4 border border-surface-200 dark:border-surface-700">
                  <div className="flex items-center mb-4">
                    <div className={`p-2 rounded-full ${expiryStatus.bgColor} mr-3`}>
                      {expiryStatus.icon && <expiryStatus.icon className={`h-6 w-6 ${expiryStatus.color}`} />}
                    </div>
                    <div>
                      <h3 className={`font-semibold ${expiryStatus.color}`}>{expiryStatus.status}</h3>
                      <p className="text-sm text-surface-600 dark:text-surface-400">
                        Expiration Date: {new Date(product.expiryDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-surface-600 dark:text-surface-400 bg-surface-100 dark:bg-surface-700/50 p-3 rounded-lg border border-surface-200 dark:border-surface-600">
                    {expiryStatus.status === 'Expired' ? (
                      "This product has expired and should be removed from inventory as soon as possible."
                    ) : expiryStatus.status.includes('Expiring soon') ? (
                      "This product will expire soon. Consider planning for replacement or discounting to move inventory."
                    ) : (
                      "This product has a good expiration date and can be kept in regular inventory."
                    )}
                  </p>
                </div>
              </div>
              
              <div>
                <h2 className="text-lg font-semibold text-surface-800 dark:text-white mb-3 flex items-center">
                  <PackageIcon className="h-5 w-5 mr-2 text-primary" />
                  Additional Details
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between pb-2 border-b border-surface-200 dark:border-surface-700">
                    <span className="text-surface-600 dark:text-surface-400">Last Updated:</span>
                    <span className="font-medium text-surface-900 dark:text-white">
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-surface-200 dark:border-surface-700">
                    <span className="text-surface-600 dark:text-surface-400">Shelf Life:</span>
                    <span className="font-medium text-surface-900 dark:text-white">
                      {Math.ceil((new Date(product.expiryDate) - new Date(2023, 0, 1)) / (1000 * 60 * 60 * 24))} days
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center pt-4 border-t border-surface-200 dark:border-surface-700">
            <Link 
              to="/" 
              className="px-4 py-2 bg-surface-200 hover:bg-surface-300 dark:bg-surface-700 dark:hover:bg-surface-600 text-surface-700 dark:text-surface-300 rounded-lg transition-colors"
            >
              <span>Back to Inventory</span>
            </Link>
            <button
              onClick={() => navigate(`/?edit=${product.id}`)}
              className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
            >
              <span>Edit Product</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetail;