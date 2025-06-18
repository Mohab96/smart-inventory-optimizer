import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="dark:bg-gray-800 border-t dark:border-gray-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Company Info */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold dark:text-gray-200 mb-3">
              Business Management System
            </h3>
            <p className="dark:text-gray-400 text-sm leading-relaxed">
              A comprehensive solution for managing your business operations, 
              staff, inventory, and financial transactions with powerful analytics 
              and reporting capabilities.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-md font-medium dark:text-gray-200 mb-3">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/dashboard" 
                  className="dark:text-gray-400 hover:dark:text-gray-200 text-sm transition-colors"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link 
                  to="/staff-management" 
                  className="dark:text-gray-400 hover:dark:text-gray-200 text-sm transition-colors"
                >
                  Staff Management
                </Link>
              </li>
              <li>
                <Link 
                  to="/new-product" 
                  className="dark:text-gray-400 hover:dark:text-gray-200 text-sm transition-colors"
                >
                  Add Products
                </Link>
              </li>
              <li>
                <Link 
                  to="/transactions-feeding" 
                  className="dark:text-gray-400 hover:dark:text-gray-200 text-sm transition-colors"
                >
                  Upload Transactions
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-md font-medium dark:text-gray-200 mb-3">
              Support
            </h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/about" 
                  className="dark:text-gray-400 hover:dark:text-gray-200 text-sm transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <a 
                  href="#" 
                  className="dark:text-gray-400 hover:dark:text-gray-200 text-sm transition-colors"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="dark:text-gray-400 hover:dark:text-gray-200 text-sm transition-colors"
                >
                  Support Center
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="dark:text-gray-400 hover:dark:text-gray-200 text-sm transition-colors"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t dark:border-gray-700 mt-6 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="dark:text-gray-400 text-sm">
            © {currentYear} Business Management System. All rights reserved.
          </div>
          
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a 
              href="#" 
              className="dark:text-gray-400 hover:dark:text-gray-200 text-sm transition-colors"
            >
              Privacy Policy
            </a>
            <a 
              href="#" 
              className="dark:text-gray-400 hover:dark:text-gray-200 text-sm transition-colors"
            >
              Terms of Service
            </a>
            <a 
              href="#" 
              className="dark:text-gray-400 hover:dark:text-gray-200 text-sm transition-colors"
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