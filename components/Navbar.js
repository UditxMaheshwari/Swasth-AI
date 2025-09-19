import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-white shadow p-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/" className="font-bold text-xl text-gray-800 hover:text-blue-600 transition-colors">
          SwasthAI
        </Link>
        <div className="space-x-6">
          <Link 
            href="/diabetes" 
            className="text-gray-700 hover:text-blue-600 transition-colors"
          >
            Diabetes Prediction
          </Link>
          <Link 
            href="/heart" 
            className="text-gray-700 hover:text-blue-600 transition-colors"
          >
            Heart Disease Prediction
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;