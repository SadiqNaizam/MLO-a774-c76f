import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  console.log('Footer component loaded');

  const informationalLinks = [
    { name: 'About Us', path: '/about' },
    { name: 'Contact Support', path: '/contact' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Terms of Service', path: '/terms' },
    { name: 'Privacy Policy', path: '/privacy' },
  ];

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, url: 'https://facebook.com' },
    { name: 'Twitter', icon: Twitter, url: 'https://twitter.com' },
    { name: 'Instagram', icon: Instagram, url: 'https://instagram.com' },
    { name: 'LinkedIn', icon: Linkedin, url: 'https://linkedin.com' },
  ];

  return (
    <footer className="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Branding/Logo (Optional) */}
          <div className="mb-6 md:mb-0">
            <Link to="/" className="text-2xl font-bold text-gray-800 dark:text-white hover:text-primary dark:hover:text-primary-dark transition-colors">
              FoodApp
            </Link>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Delivering happiness, one meal at a time.
            </p>
          </div>

          {/* Informational Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {informationalLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-dark transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media & Contact */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Connect With Us</h3>
            <div className="flex space-x-4 mb-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary-dark transition-colors"
                >
                  <social.icon className="h-6 w-6" />
                </a>
              ))}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              123 Food Street, Flavor Town
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Email: support@foodapp.com
            </p>
          </div>
        </div>

        <hr className="my-8 border-gray-200 dark:border-gray-700" />

        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} FoodApp. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;