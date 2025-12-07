import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
  return (
    // A React Fragment or a main div to wrap all elements
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Main content area */}
      <main className="flex-grow max-w-7xl mx-auto w-full p-4">
        {/* The Outlet renders the component matched by the current route (e.g., Tasks, Projects) */}
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;