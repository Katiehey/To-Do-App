import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-10 p-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left">
        {/* Copyright Section */}
        <p className="text-sm">
          &copy; {new Date().getFullYear()} **To-Do-App**. All rights reserved.
        </p>

        {/* Links Section */}
        <div className="flex space-x-4 mt-4 md:mt-0">
          <Link to="/privacy" className="text-sm hover:text-blue-400 transition duration-150">
            Privacy Policy
          </Link>
          <Link to="/terms" className="text-sm hover:text-blue-400 transition duration-150">
            Terms of Service
          </Link>
          <Link to="/contact" className="text-sm hover:text-blue-400 transition duration-150">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;