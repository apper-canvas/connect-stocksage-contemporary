import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getIcon } from '../utils/iconUtils';

const NotFound = () => {
  const ArrowLeftIcon = getIcon('arrow-left');
  const PackageOpenIcon = getIcon('package-open');

  return (
    <motion.div 
      className="min-h-screen flex flex-col items-center justify-center p-4 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-md w-full mx-auto neu-card flex flex-col items-center">
        <div className="h-32 w-32 bg-surface-200 dark:bg-surface-700 rounded-full flex items-center justify-center mb-6">
          <PackageOpenIcon className="h-16 w-16 text-primary" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-surface-800 dark:text-surface-100">
          404
        </h1>
        
        <p className="text-xl md:text-2xl font-medium mb-2 text-surface-700 dark:text-surface-200">
          Page Not Found
        </p>
        
        <p className="text-surface-600 dark:text-surface-300 mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        
        <Link 
          to="/" 
          className="group flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-medium py-2 px-6 rounded-lg transition-all duration-300"
        >
          <ArrowLeftIcon className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Dashboard</span>
        </Link>
      </div>
    </motion.div>
  );
};

export default NotFound;