import React from "react";
import { Instagram, Facebook, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="py-10 text-gray-700 border-t border-pink-100 bg-gray-50 rounded-b-2xl">
      <div className="container px-6 mx-auto space-y-6 text-center">
        {/* Links */}
        <div className="flex justify-center space-x-8 text-sm font-medium">
          <Link to="/privacy" className="transition-colors hover:text-pink-600">
            Privacy Policy
          </Link>
          <Link to="/terms" className="transition-colors hover:text-pink-600">
            Terms of Service
          </Link>
          <Link to="/contact" className="transition-colors hover:text-pink-600">
            Contact Us
          </Link>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center space-x-6 text-gray-500">
          <a href="#" className="transition-colors hover:text-pink-600">
            <Instagram size={20} />
          </a>
          <a href="#" className="transition-colors hover:text-pink-600">
            <Facebook size={20} />
          </a>
          <a href="#" className="transition-colors hover:text-pink-600">
            <Twitter size={20} />
          </a>
        </div>

        {/* Copyright */}
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} Petal & Bloom. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
