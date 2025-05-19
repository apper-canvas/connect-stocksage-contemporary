import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getIcon } from './utils/iconUtils';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

import PurchaseOrderWizard from './components/PurchaseOrderWizard';
import ProductExpiryReport from './components/ProductExpiryReport';

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
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={isDarkMode ? "dark" : "light"}
        className="mt-16"
      />
      
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full bg-surface-200 dark:bg-surface-700 hover:bg-surface-300 dark:hover:bg-surface-600 transition-colors"
          aria-label="Toggle dark mode"
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
        <Route path="/reports/product-expiry" element={<ProductExpiryReport />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

// Using icon utilities correctly
const SunIcon = getIcon('sun');
const MoonIcon = getIcon('moon');

export default App;