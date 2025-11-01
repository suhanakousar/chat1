import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logo } from "../assets";
import { sections } from "../constants/index.js";
import { useAuth } from "../context/authContext.jsx";
import { Button } from "./ui";
import { FaBars, FaTimes, FaUser, FaSignOutAlt } from "react-icons/fa";

const NavBar = () => {
  const pathname = window.location.pathname;
  const [active, setActive] = useState(
    pathname === "/" || pathname === "/Home"
      ? "Home"
      : pathname === "/Chat"
      ? "Chat"
      : pathname === "/Help"
      ? "Help"
      : ""
  );

  const { user, logout } = useAuth();
  const [toggle, setToggle] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-frosted border-b border-neutral-200/50 backdrop-blur-3xl shadow-soft">
      <div className="section-container">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            onClick={() => {
              setActive("Home");
              window.scrollTo(0, 0);
            }}
          >
            <img src={logo} alt="Chatlas" className="h-10 w-10" />
            <span className="text-2xl font-bold text-neutral-900">Chatlas</span>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center space-x-1">
            {sections.map((link) => (
              <li key={link.id}>
                <Link
                  to={`/${link.id}`}
                  onClick={() => setActive(link.title)}
                  className={`
                    px-4 py-2 rounded-2xl font-semibold transition-all duration-300
                    ${
                      active === link.title
                        ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-glow"
                        : "text-neutral-700 hover:bg-neutral-100 hover:scale-105"
                    }
                  `}
                >
                  {link.title}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div
                className="relative"
                onMouseEnter={() => setIsDropdownVisible(true)}
                onMouseLeave={() => setIsDropdownVisible(false)}
              >
                <button className="flex items-center space-x-2 px-4 py-2 rounded-xl hover:bg-neutral-100 transition-colors">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <FaUser className="text-primary-600" />
                  </div>
                  <span className="font-medium text-neutral-900">
                    {user?.username || "User"}
                  </span>
                </button>

                {isDropdownVisible && (
                  <div className="absolute right-0 top-full mt-2 w-48 glass rounded-xl shadow-large p-2 animate-scale-in">
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-left rounded-lg hover:bg-neutral-100 transition-colors text-neutral-700"
                    >
                      <FaSignOutAlt />
                      <span>Log out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => navigate("/signin")}
                  className="px-5 py-2.5 text-neutral-700 hover:bg-neutral-100 font-semibold rounded-2xl transition-all duration-300 hover:scale-105"
                >
                  Sign in
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-2xl shadow-glow hover:shadow-neon-cyan transition-all duration-300 hover:scale-105"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-xl hover:bg-neutral-100 transition-colors"
            onClick={() => setToggle(!toggle)}
          >
            {toggle ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {toggle && (
        <div className="md:hidden glass border-t border-white/10 animate-slide-down">
          <div className="section-container py-6 space-y-4">
            <ul className="space-y-2">
              {sections.map((link) => (
                <li key={link.id}>
                  <Link
                    to={`/${link.id}`}
                    onClick={() => {
                      setActive(link.title);
                      setToggle(false);
                    }}
                    className={`
                      block px-4 py-3 rounded-xl font-medium transition-all
                      ${
                        active === link.title
                          ? "bg-primary-600 text-white"
                          : "text-neutral-700 hover:bg-neutral-100"
                      }
                    `}
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>

            {user ? (
              <div className="space-y-2 pt-4 border-t border-neutral-200">
                <div className="px-4 py-2 text-sm text-neutral-600">
                  Signed in as <span className="font-medium text-neutral-900">{user?.username}</span>
                </div>
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => {
                    handleLogout();
                    setToggle(false);
                  }}
                  icon={<FaSignOutAlt />}
                >
                  Log out
                </Button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2 pt-4 border-t border-neutral-200">
                <Button
                  variant="ghost"
                  fullWidth
                  onClick={() => {
                    navigate("/signin");
                    setToggle(false);
                  }}
                >
                  Sign in
                </Button>
                <Button
                  variant="gradient"
                  fullWidth
                  onClick={() => {
                    navigate("/signup");
                    setToggle(false);
                  }}
                >
                  Get Started
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
