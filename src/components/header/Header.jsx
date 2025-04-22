"use client";

import { useState, useEffect } from "react";
import { Container, Logo, LogoutBtn } from "../index";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and past 100px
        setVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up
        setVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const navItems = [
    { name: "Home", slug: "/", active: true },
    { name: "Login", slug: "/login", active: !authStatus },
    { name: "Signup", slug: "/signup", active: !authStatus },
    { name: "All Posts", slug: "/all-posts", active: authStatus },
    { name: "Add Post", slug: "/add-post", active: authStatus },
  ];

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-500 ${
        visible ? "top-0" : "-top-24"
      } ${visible ? "bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800" : "bg-gradient-to-r from-gray-800 to-gray-900"}`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 w-full py-4">
        <nav className="flex items-center justify-between">
          <Link to="/" className="transition-all duration-300 transform hover:scale-105 hover:brightness-110">
            <Logo width="70px" />
          </Link>

          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className={`relative transition-all duration-300 ${searchFocused ? 'w-64' : 'w-48'}`}>
              <input
                type="text"
                placeholder="Search..."
                className="hidden md:block w-full px-4 py-2 rounded-full bg-gray-700/90 border border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-white transition-all duration-300 focus:bg-gray-800"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <ul className="flex items-center space-x-1 md:space-x-3">
              {navItems.map(
                (item) =>
                  item.active && (
                    <li key={item.name}>
                      <button
                        onClick={() => navigate(item.slug)}
                        className="relative px-3 py-2 rounded-full text-sm font-medium text-white hover:bg-gray-700/30 hover:shadow-lg transition-all duration-300 group overflow-hidden"
                      >
                        <span className="relative z-10">{item.name}</span>
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                      </button>
                    </li>
                  )
              )}
              {authStatus ? (
                <>
                  <li>
                    <LogoutBtn />
                  </li>
                  <li className="relative group">
                    <div className="cursor-pointer transform transition-all duration-300 hover:scale-110">
                      <FaUserCircle className="text-2xl text-purple-400 hover:text-purple-300" />
                    </div>
                    <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right scale-95 group-hover:scale-100">
                      <a href="/profile" className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700">Your Profile</a>
                      <a href="/settings" className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700">Settings</a>
                    </div>
                  </li>
                </>
              ) : null}
            </ul>
          </div>
        </nav>
      </div>
      
      {/* Animated gradient border */}
      <div className="h-0.5 w-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 background-animate"></div>
      
      <style jsx="true">{`
        .background-animate {
          background-size: 200%;
          animation: gradient 3s ease infinite;
        }
        
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </header>
  );
}

export default Header;
