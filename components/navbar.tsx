'use client';

import Link from 'next/link';
import { useAuth } from '../contexts/auth-context';

const Navbar = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="font-semibold text-gray-800 text-lg">
            SwasthAI
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            <Link
              href="/health-check"
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              Health Check
            </Link>

            {user ? (
              <button
                type="button"
                onClick={handleSignOut}
                className="px-3 py-2 text-sm font-medium text-red-600 hover:text-red-800"
              >
                Sign Out
              </button>
            ) : (
              <Link
                href="/login"
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
