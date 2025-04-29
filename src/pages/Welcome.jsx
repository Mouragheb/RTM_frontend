import Header from '../components/Header';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { Link, useNavigate } from 'react-router-dom';
import logo from '/logo.png';

const Welcome = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div>
      <Header />
      <Nav />

      <main className="px-6 py-16 text-center max-w-3xl mx-auto">
        <img 
          src={logo} 
          alt="Restaurant Task Manager Logo" 
          className="h-60 w-auto mx-auto"
        />
        <h1 className="text-3xl font-bold mb-4">
          Welcome to <strong>ReTaskMan</strong>
        </h1>
        <h2 className="text-2xl font-bold mb-4">
          The Ultimate Restaurant Task Manager
        </h2>
        <p className="text-gray-600 text-lg">
          Organize, assign, and complete restaurant tasks efficiently — whether you're a manager or an employee.
        </p>

        <div className="mt-8 flex justify-center gap-6">
          {token ? (
            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-red-600 text-white rounded font-semibold hover:bg-red-700 transition"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="px-6 py-3 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-6 py-3 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Welcome;