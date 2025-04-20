import { Link } from "react-router-dom";
import Logo from "../Logo";
import { FaTwitter, FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";

function Footer() {
  return (
    <section className="relative overflow-hidden py-16 bg-gradient-to-br from-gray-800 to-gray-900 text-white border-t border-gray-700">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500"></div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <Logo width="120px" />
            <p className="mt-4 max-w-sm text-sm text-gray-300">
              Share your thoughts, stories, and ideas with the world through our beautiful blogging platform.
            </p>
            <div className="flex mt-4 space-x-4 text-xl">
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-sky-400">
                <FaTwitter />
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-gray-300">
                <FaGithub />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-blue-400">
                <FaLinkedin />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-pink-400">
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
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="text-gray-950 opacity-20">
          <path
            fill="currentColor"
            d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,224C1248,203,1344,181,1392,170.7L1440,160L1440,320H0Z"
          ></path>
        </svg>
      </div>
    </section>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <h3 className="mb-4 text-xs font-semibold uppercase text-purple-300 tracking-widest">{title}</h3>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link}>
            <Link
              to="/"
              className="text-sm text-gray-300 hover:text-white transition-colors duration-200"
            >
              {link}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Footer;