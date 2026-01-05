import { useEffect } from 'react'; // ✅ Added useEffect
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { createSkipLink } from '../../utils/accessibility'; // ✅ Added accessibility utility

const Layout = () => {
  // ✅ Integrated Accessibility Skip Link
  useEffect(() => {
    // This creates an invisible link that appears on the first 'Tab' press
    const skipLink = createSkipLink('main-content', 'Skip to main content');
    
    // Cleanup: removes the link if the layout unmounts
    return () => {
      if (skipLink && typeof skipLink.remove === 'function') {
        skipLink.remove();
      }
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden bg-gray-50 dark:bg-dark-bg transition-colors duration-300">
      <Navbar />
      
      {/* ✅ Added id="main-content" to match the skip link target.
        Kept flex-grow and w-full for layout consistency.
      */}
      <main id="main-content" className="flex-grow w-full p-4 outline-none">
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;