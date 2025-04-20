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
      className={`fixed w-full z-50 transition-all duration-300 bg-gradient-to-r from-gray-800 to-gray-900 ${
        visible ? "top-0" : "-top-24"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 w-full py-4">
        <nav className="flex items-center justify-between">
          <Link to="/" className="transition-transform hover:scale-105">
            <Logo width="70px" />
          </Link>

          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <input
              type="text"
              placeholder="Search..."
              className="hidden md:block px-3 py-2 rounded-full bg-gray-700/90 border border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
            />

            <ul className="flex items-center space-x-2 md:space-x-4">
              {navItems.map(
                (item) =>
                  item.active && (
                    <li key={item.name}>
                      <button
                        onClick={() => navigate(item.slug)}
                        className="px-3 py-2 rounded-full text-sm font-medium text-white hover:bg-gray-700/10 hover:shadow-lg transition duration-300"
                      >
                        {item.name}
                      </button>
                    </li>
                  )
              )}
              {authStatus ? (
                <>
                  <li>
                    <LogoutBtn />
                  </li>
                  <li>
                    <FaUserCircle className="text-2xl text-purple-400" />
                  </li>
                </>
              ) : null}
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;