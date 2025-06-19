import { Link } from "react-router-dom";
import { useTheme } from "./ThemeContext";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { theme } = useTheme();

  return (
    <footer className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t mt-auto`}>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Company Info */}
          <div className="md:col-span-2">
            <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'} mb-3`}>
              Business Management System
            </h3>
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-sm leading-relaxed`}>
              A comprehensive solution for managing your business operations, 
              staff, inventory, and financial transactions with powerful analytics 
              and reporting capabilities.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className={`text-md font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'} mb-3`}>
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/dashboard" 
                  className={`${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'} text-sm transition-colors`}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link 
                  to="/staff-management" 
                  className={`${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'} text-sm transition-colors`}
                >
                  Staff Management
                </Link>
              </li>
              <li>
                <Link 
                  to="/new-product" 
                  className={`${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'} text-sm transition-colors`}
                >
                  Add Products
                </Link>
              </li>
              <li>
                <Link 
                  to="/transactions-feeding" 
                  className={`${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'} text-sm transition-colors`}
                >
                  Upload Transactions
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className={`text-md font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'} mb-3`}>
              Support
            </h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/about" 
                  className={`${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'} text-sm transition-colors`}
                >
                  About Us
                </Link>
              </li>
              <li>
                <a 
                  href="#" 
                  className={`${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'} text-sm transition-colors`}
                >
                  Documentation
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className={`${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'} text-sm transition-colors`}
                >
                  Support Center
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className={`${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'} text-sm transition-colors`}
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={`border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} mt-6 pt-6 flex flex-col md:flex-row justify-between items-center`}>
          <div className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
            © {currentYear} Business Management System. All rights reserved.
          </div>
          
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a 
              href="#" 
              className={`${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'} text-sm transition-colors`}
            >
              Privacy Policy
            </a>
            <a 
              href="#" 
              className={`${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'} text-sm transition-colors`}
            >
              Terms of Service
            </a>
            <a 
              href="#" 
              className={`${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'} text-sm transition-colors`}
            >
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;