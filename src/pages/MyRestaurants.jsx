import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/api';
import Header from '../components/Header';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { BASE_IMAGE_URL } from '../utils/constants';

const MyRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const res = await API.get('/restaurants/my-restaurants', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setRestaurants(res.data.restaurants);
      } catch (err) {
        console.error('Failed to fetch restaurants:', err);
        setError(err.response?.data?.message || 'Could not load restaurants');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [navigate]);

  const goToDashboard = (restaurantId) => {
    navigate(`/restaurant/${restaurantId}/dashboard`);
  };

  return (
    <div>
      <Header />
      <Nav />

      <main className="p-10 text-center">
        <h2 className="text-2xl font-bold mb-4">My Restaurants</h2>
        <Link
          to="/add-restaurant"
          className="inline-block mb-6 px-5 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700"
        >
          + Add New Restaurant
        </Link>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-600 font-semibold">{error}</p>
        ) : restaurants.length === 0 ? (
          <p>No restaurants found.</p>
        ) : (
          <div className="flex flex-wrap justify-center gap-6">
            {restaurants.map((r) => (
              <div
                key={r._id}
                className="w-[250px] p-5 border border-gray-300 rounded bg-gray-50 hover:shadow-md cursor-pointer transition"
                onClick={() => goToDashboard(r._id)}
              >
                <img
                  src={`${BASE_IMAGE_URL}/${r.logo}`}
                  alt={r.name}
                  className="w-20 h-20 object-contain mx-auto mb-3"
                />
                <h3 className="text-lg font-semibold">{r.name}</h3>
                <p>{r.address}</p>
                <small className="block mt-2 text-gray-500 text-sm">
                  ID: {r._id}
                </small>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default MyRestaurants;