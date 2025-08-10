import React, { useState } from 'react';
import { 
  GitBranch, 
  Home, 
  BarChart3, 
  Database, 
  User, 
  BookOpen, 
  Menu, 
  X,
  Wallet,
  Shield
} from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('/');

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'IPFS Data', href: '/ipfs', icon: Database },
    { name: 'Github', href: '/profile', icon: User },
    { name: 'Docs', href: '/docs', icon: BookOpen },
  ];

  const handleNavClick = (href) => {
    setActiveItem(href);
    setIsOpen(false);
  };

  return (
    <nav className="relative bg-gray-900/80 backdrop-blur-lg border-b border-gray-700/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="flex items-center space-x-2" onClick={() => handleNavClick('/')}>
              <div className="relative">
                <Shield className="h-8 w-8 text-blue-400" />
                <GitBranch className="h-4 w-4 text-green-400 absolute -bottom-1 -right-1" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                ChainGit
              </span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.href;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                    isActive
                      ? 'bg-blue-900/50 text-blue-400 shadow-sm'
                      : 'text-gray-400 hover:text-blue-400 hover:bg-gray-800'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </a>
              );
            })}
            <button className="ml-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-green-500 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-green-600 transition-all duration-200 flex items-center space-x-2 shadow-lg">
              <Wallet className="h-4 w-4" />
              <span>Connect Wallet</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-400 hover:text-gray-200 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.href;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className={`block px-3 py-2 rounded-lg text-base font-medium flex items-center space-x-2 ${
                    isActive
                      ? 'bg-blue-900/50 text-blue-400'
                      : 'text-gray-400 hover:text-blue-400 hover:bg-gray-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </a>
              );
            })}
            <button className="w-full mt-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-green-500 text-white rounded-lg text-sm font-medium flex items-center justify-center space-x-2">
              <Wallet className="h-4 w-4" />
              <span>Connect Wallet</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;