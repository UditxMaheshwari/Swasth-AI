'use client';

import Link from 'next/link';
import { useAuth } from '../contexts/auth-context';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navLinks = [
    {
      href: '/hero',
      label: 'Home',
      icon: '🏠'
    },
    {
      href: '/health-check',
      label: 'Health Check',
      icon: '🩺',
      isActive: pathname === '/health-check'
    },
    {
      href: '/3d-lab',
      label: '3D Lab',
      icon: '🧬',
      isActive: pathname === '/3d-lab'
    },
    {
      href: '/find-doctor',
      label: 'Find Doctor',
      icon: '👨‍⚕️',
      isActive: pathname === '/find-doctor'
    },
    {
      href: '/test-ai',
      label: 'AI Assistant',
      icon: '🤖',
      isActive: pathname === '/test-ai'
    }
  ];

  const LinkComponent = ({ href, children, className, isActive }) => (
    <Link
      href={href}
      className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
        isActive
          ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25'
          : 'text-slate-300 hover:text-blue-400 hover:bg-slate-800/50'
      } ${className}`}
    >
      {children}
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg animate-pulse opacity-20" />
      )}
    </Link>
  );

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-slate-900/95 backdrop-blur-md shadow-lg border-b border-slate-700/50'
          : 'bg-slate-900/90 shadow-lg border-b border-slate-800/50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-blue-500/25">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg opacity-0 group-hover:opacity-30 blur transition-opacity duration-300" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                SwasthAI
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-2">
              {navLinks.map((link) => (
                <LinkComponent
                  key={link.href}
                  href={link.href}
                  isActive={link.isActive}
                  className="flex items-center space-x-2"
                >
                  <span className="text-base">{link.icon}</span>
                  <span>{link.label}</span>
                </LinkComponent>
              ))}
            </div>

            {/* User Menu */}
            <div className="hidden lg:flex items-center space-x-3">
              {user ? (
                <div className="flex items-center space-x-3">
                  <LinkComponent
                    href="/dashboard"
                    isActive={pathname === '/dashboard'}
                    className="flex items-center space-x-2"
                  >
                    <span>📊</span>
                    <span>Dashboard</span>
                  </LinkComponent>
                  <div className="flex items-center space-x-2 px-3 py-2 bg-slate-800/60 rounded-lg border border-slate-700/50">
                    <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {user.email?.[0]?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-slate-300">
                      {user.email?.split('@')[0] || 'User'}
                    </span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg font-medium hover:bg-red-500/30 hover:text-red-300 transition-colors duration-200 flex items-center space-x-2 border border-red-500/30"
                  >
                    <span>👋</span>
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <LinkComponent href="/auth/login" className="flex items-center space-x-2">
                    <span>🔑</span>
                    <span>Login</span>
                  </LinkComponent>
                  <Link
                    href="/auth/signup"
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg shadow-blue-500/25 flex items-center space-x-2"
                  >
                    <span>✨</span>
                    <span>Sign Up</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 transition-colors duration-200 border border-slate-700/50"
              aria-label="Toggle menu"
            >
              <div className="w-5 h-5 relative">
                <div className={`absolute w-full h-0.5 bg-slate-300 transition-all duration-300 ${
                  isMenuOpen ? 'top-2 rotate-45' : 'top-1'
                }`} />
                <div className={`absolute top-2 w-full h-0.5 bg-slate-300 transition-all duration-300 ${
                  isMenuOpen ? 'opacity-0' : 'opacity-100'
                }`} />
                <div className={`absolute w-full h-0.5 bg-slate-300 transition-all duration-300 ${
                  isMenuOpen ? 'top-2 -rotate-45' : 'top-3'
                }`} />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden transition-all duration-300 overflow-hidden ${
          isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="px-4 py-4 bg-slate-900/95 backdrop-blur-md border-t border-slate-700/50 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  link.isActive
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                    : 'text-slate-300 hover:bg-slate-800/50 hover:text-blue-400'
                }`}
              >
                <span className="text-xl">{link.icon}</span>
                <span className="font-medium">{link.label}</span>
              </Link>
            ))}
            
            <div className="border-t border-slate-700/50 pt-4 mt-4">
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 px-4 py-2 bg-slate-800/60 rounded-lg border border-slate-700/50">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {user.email?.[0]?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-slate-200">
                        {user.email?.split('@')[0] || 'User'}
                      </p>
                      <p className="text-sm text-slate-400">{user.email}</p>
                    </div>
                  </div>
                  <Link
                    href="/dashboard"
                    className="flex items-center space-x-3 px-4 py-3 text-slate-300 hover:bg-slate-800/50 hover:text-blue-400 rounded-lg transition-colors"
                  >
                    <span className="text-xl">📊</span>
                    <span className="font-medium">Dashboard</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                  >
                    <span className="text-xl">👋</span>
                    <span className="font-medium">Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    href="/auth/login"
                    className="flex items-center space-x-3 px-4 py-3 text-slate-300 hover:bg-slate-800/50 hover:text-blue-400 rounded-lg transition-colors"
                  >
                    <span className="text-xl">🔑</span>
                    <span className="font-medium">Login</span>
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-medium shadow-lg"
                  >
                    <span className="text-xl">✨</span>
                    <span>Sign Up</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      {/* Spacer for fixed navbar */}
      <div className="h-16" />
    </>
  );
};

export default Navbar;
