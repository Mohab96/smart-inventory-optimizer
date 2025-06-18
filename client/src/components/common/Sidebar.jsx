import { useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  BarChart3, 
  TrendingUp, 
  Activity, 
  Users, 
  Upload, 
  FileText, 
  Package, 
  Info,
  X
} from "lucide-react";

const Sidebar = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" />, path: "/dashboard" },
    { name: "Business Analytics", icon: <BarChart3 className="h-5 w-5" />, path: "/businessAnalytics" },
    { name: "Predictions", icon: <TrendingUp className="h-5 w-5" />, path: "/prediction" },
    { name: "Trends", icon: <Activity className="h-5 w-5" />, path: "/trends" },
    { name: "Staff Management", icon: <Users className="h-5 w-5" />, path: "/staffManagement" },
    { name: "Upload Transactions", icon: <Upload className="h-5 w-5" />, path: "/transactionsFeeding" },
    { name: "Transactions Log", icon: <FileText className="h-5 w-5" />, path: "/transactionsLog" },
    { name: "Add Product", icon: <Package className="h-5 w-5" />, path: "/newproductaddition" },
    { name: "About", icon: <Info className="h-5 w-5" />, path: "*" },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    if (setIsMobileMenuOpen) {
      setIsMobileMenuOpen(false); // Close mobile menu after navigation
    }
  };

  return (
    <>
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:sticky lg:top-0 inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        bg-gray-800 border-r border-gray-700 shadow-xl lg:shadow-none
        h-screen lg:h-auto
      `}>
        <div className="h-full p-4 overflow-y-auto">
          {/* Mobile Close Button */}
          <div className="flex justify-between items-center mb-8 lg:hidden">
            <div>
              <h5 className="text-lg font-bold text-white mb-2">Smart Inventory</h5>
              <p className="text-sm text-gray-400">Management System</p>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:block mb-8">
            <h5 className="text-lg font-bold text-white mb-2">Smart Inventory</h5>
            <p className="text-sm text-gray-400">Management System</p>
          </div>

          <div className="mb-6">
            <h6 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Navigation
            </h6>
          </div>

          <ul className="space-y-1">
            {menuItems.map((item, index) => (
              <li key={index}>
                <button
                  className="flex items-center w-full p-3 text-left rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200 group"
                  onClick={() => handleNavigation(item.path)}
                >
                  <span className="mr-3 text-gray-400 group-hover:text-blue-400 transition-colors duration-200">
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.name}</span>
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-8 pt-6 border-t border-gray-700">
            <div className="text-xs text-gray-500 text-center">
              © 2024 Smart Inventory
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
