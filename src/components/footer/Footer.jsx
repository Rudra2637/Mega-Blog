"use client"

import { Link } from "react-router-dom"
import Logo from "../Logo"
import { FaTwitter, FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa"

function Footer() {
  return (
    <section className="relative overflow-hidden py-16 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-950 text-white border-t border-gray-700">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 background-animate"></div>

      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle absolute rounded-full bg-white/10"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 10}s`,
            }}
          ></div>
        ))}
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="transform transition-all duration-300 hover:translate-y-[-5px]">
            <Logo width="120px" />
            <p className="mt-4 max-w-sm text-sm text-gray-300">
              Share your thoughts, stories, and ideas with the world through our beautiful blogging platform.
            </p>
            <div className="flex mt-4 space-x-4 text-xl">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-sky-400 transition-colors duration-300 transform hover:scale-110"
              >
                <FaTwitter />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-gray-300 transition-colors duration-300 transform hover:scale-110"
              >
                <FaGithub />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-blue-400 transition-colors duration-300 transform hover:scale-110"
              >
                <FaLinkedin />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-pink-400 transition-colors duration-300 transform hover:scale-110"
              >
                <FaInstagram />
              </a>
            </div>
            <p className="mt-6 text-xs text-gray-500">
              &copy; {new Date().getFullYear()} YourBrand. All rights reserved.
            </p>
          </div>

          <FooterColumn title="Company" links={["Features", "Pricing", "Affiliate Program", "Press Kit"]} />
          <FooterColumn title="Support" links={["Account", "Help", "Contact Us", "Customer Support"]} />
          <FooterColumn title="Legals" links={["Terms & Conditions", "Privacy Policy", "Licensing"]} />
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-center">
          <div className="inline-flex items-center">
            <span className="text-sm text-gray-400">Subscribe to our newsletter</span>
            <div className="ml-4 relative">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-gray-800/50 border border-gray-700 rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 w-64"
              />
              <button className="absolute right-1 top-1 bg-purple-600 hover:bg-purple-700 text-white rounded-full p-1 transition-colors duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="text-gray-950 opacity-20">
          <path
            fill="currentColor"
            d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,224C1248,203,1344,181,1392,170.7L1440,160L1440,320H0Z"
          ></path>
        </svg>
      </div>

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
        
        .particle {
          opacity: 0.3;
          animation: float linear infinite;
        }
        
        @keyframes float {
          0% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(-40px) translateX(-10px);
          }
          75% {
            transform: translateY(-60px) translateX(10px);
          }
          100% {
            transform: translateY(-80px) translateX(0);
            opacity: 0;
          }
        }
      `}</style>
    </section>
  )
}

function FooterColumn({ title, links }) {
  return (
    <div className="transform transition-all duration-300 hover:translate-y-[-5px]">
      <h3 className="mb-4 text-xs font-semibold uppercase text-purple-300 tracking-widest">{title}</h3>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link}>
            <Link
              to="/"
              className="text-sm text-gray-300 hover:text-white transition-colors duration-200 relative group"
            >
              <span className="relative">
                {link}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all duration-300"></span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Footer
