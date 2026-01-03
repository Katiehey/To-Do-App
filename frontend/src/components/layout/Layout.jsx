import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
  return (
    // Added dark:bg-dark-bg and transition-colors
    <div className="flex flex-col min-h-screen overflow-x-hidden bg-gray-50 dark:bg-dark-bg transition-colors duration-300">
      <Navbar />
      
      {/* Removed mx-auto to allow full-width dark background, p-4 kept for spacing */}
      <main className="flex-grow w-full p-4">
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;