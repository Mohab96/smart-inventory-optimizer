import Header from "../components/common/Header";
import Sidebar from "../components/common/Sidebar";
import Footer from "../components/common/Footer";
import { useTheme } from "../components/common/ThemeContext";

const Layout = ({ children }) => {
  const { theme } = useTheme();
  
  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
      <header className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900 border-b border-gray-200'} p-4`}>
        <Header />
      </header>
      <div className={`flex flex-1 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        <main className={`flex-1 overflow-auto ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} rounded mt-4 pb-0`}>
          {children}
        </main>
      </div>
      <footer className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900 border-t border-gray-200'}`}>
        <Footer />
      </footer>
    </div>
  );
};

export default Layout;
