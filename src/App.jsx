import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { SupplierProvider } from './context/SupplierContext';
import { ProductProvider } from './context/ProductContext';
import { PurchaseOrderProvider } from './context/PurchaseOrderContext';
import { getIcon } from './utils/iconUtils';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

import PurchaseOrderWizard from './components/PurchaseOrderWizard';
import ProductExpiryReport from './components/ProductExpiryReport';
import Suppliers from './pages/Suppliers';
import ProductDetail from './pages/ProductDetail';
import PurchaseOrderDetail from './pages/PurchaseOrderDetail';
import Orders from './pages/Orders';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || 
      (localStorage.getItem('theme') !== 'light' && 
      window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <SupplierProvider>
      <ProductProvider>
        <PurchaseOrderProvider>
          <div className="fixed bottom-4 right-4 z-50">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-surface-100 dark:bg-surface-700 shadow-lg"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? (
                <SunIcon className="w-5 h-5 text-yellow-400" />
              ) : (
                <MoonIcon className="w-5 h-5 text-surface-800" />
              )}
            </button>
          </div>
  
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/purchase-order/create" element={<PurchaseOrderWizard />} />
            <Route path="/purchase-order/:id" element={<PurchaseOrderDetail />} />
            <Route path="/reports/product-expiry" element={<ProductExpiryReport />} />
            <Route path="/suppliers" element={<Suppliers />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PurchaseOrderProvider>
      </ProductProvider>
    </SupplierProvider>
  );
}

// Using icon utilities correctly
const SunIcon = getIcon('sun');
const MoonIcon = getIcon('moon');

export default App;