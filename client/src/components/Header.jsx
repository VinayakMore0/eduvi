import React from "react";
import { useRecoilState } from "recoil";
import { Menu, X } from "lucide-react";
import { mobileMenuState } from "../state/atoms";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useRecoilState(mobileMenuState);

  return (
    <header className="bg-white shadow-sm fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <div className="text-2xl font-bold text-blue-600">Eduvi</div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a
              href="#"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Home
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Courses
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              About
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Contact
            </a>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <button className="text-blue-600 hover:text-blue-700">Login</button>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Sign Up
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              <a
                href="#"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Home
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Courses
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                About
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Contact
              </a>
              <div className="pt-4 border-t">
                <button className="text-blue-600 hover:text-blue-700 mb-2 block">
                  Login
                </button>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Sign Up
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
