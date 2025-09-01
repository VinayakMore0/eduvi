import React from "react";
import { useRecoilState } from "recoil";
import { Menu, X } from "lucide-react";
import { mobileMenuState, routerState } from "../../state/atoms";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useRecoilState(mobileMenuState);
  const [currentPage, setCurrentPage] = useRecoilState(routerState);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "courses", label: "Courses" },
    { id: "creators", label: "Instructors" },
    { id: "about", label: "About" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <header className="bg-white shadow-sm fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => setCurrentPage("home")}
          >
            <div className="text-2xl font-bold text-blue-600">Eduvi</div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`transition-colors ${
                  currentPage === item.id
                    ? "text-blue-600 font-semibold"
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => setCurrentPage("login")}
              className="text-blue-600 hover:text-blue-700"
            >
              Login
            </button>
            <button
              onClick={() => setCurrentPage("register")}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
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
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentPage(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left transition-colors ${
                    currentPage === item.id
                      ? "text-blue-600 font-semibold"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <div className="pt-4 border-t">
                <button
                  onClick={() => {
                    setCurrentPage("login");
                    setMobileMenuOpen(false);
                  }}
                  className="text-blue-600 hover:text-blue-700 mb-2 block"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setCurrentPage("register");
                    setMobileMenuOpen(false);
                  }}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
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
