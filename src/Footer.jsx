import React from 'react';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        {/* Social Media Icons */}
        <div className="flex justify-center space-x-6 mb-8">
          <Facebook className="w-6 h-6 hover:text-yellow-400 cursor-pointer" />
          <Instagram className="w-6 h-6 hover:text-yellow-400 cursor-pointer" />
          <Twitter className="w-6 h-6 hover:text-yellow-400 cursor-pointer" />
          <Youtube className="w-6 h-6 hover:text-yellow-400 cursor-pointer" />
        </div>

        {/* Navigation Links */}
        <div className="flex justify-center space-x-6 mb-8">
          <a href="#" className="hover:text-yellow-400">Home</a>
          <a href="#" className="hover:text-yellow-400">News</a>
          <a href="#" className="hover:text-yellow-400">About</a>
          <a href="#" className="hover:text-yellow-400">Contact Us</a>
          <a href="#" className="hover:text-yellow-400">Our Team</a>
        </div>

        {/* Copyright Notice */}
        <div className="text-center text-gray-400">
          © {new Date().getFullYear()} TAXIWHEEL. Designed by FAHEEM
        </div>
      </div>
    </footer>
  );
}

export default Footer;
