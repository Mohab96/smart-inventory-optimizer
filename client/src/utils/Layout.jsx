import Header from "../components/common/Header";
import Sidebar from "../components/common/Sidebar";
import Footer from "../components/common/Footer";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-800">
      <header className="bg-gray-800 text-white p-4">
        <Header />
      </header>
      <div className="flex flex-1 bg-gray-800">
        <div className="hidden lg:block ">
          <Sidebar />
        </div>
        <main className="flex-1 overflow-auto bg-gray-800 rounded mt-4 pb-0">
          {children}
        </main>
      </div>
      <footer className="bg-gray-800 text-white">
        <Footer />
      </footer>
    </div>
  );
};

export default Layout;
