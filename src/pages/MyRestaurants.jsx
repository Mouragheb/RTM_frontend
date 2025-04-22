import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/api'; // Adjust the path as neededimport Header from '../components/Header';
import Nav from '../components/Nav';
import Footer from '../components/Footer';

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

      <main style={styles.container}>
        <h2>My Restaurants</h2>
        <Link to="/add-restaurant" style={styles.addButton}>+ Add New Restaurant</Link>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p style={styles.error}>{error}</p>
        ) : restaurants.length === 0 ? (
          <p>No restaurants found.</p>
        ) : (
          <div style={styles.grid}>
            {restaurants.map((r) => (
              <div
                key={r._id}
                style={styles.card}
                onClick={() => goToDashboard(r._id)}
              >
                <img
                  src={`http://localhost:8080/${r.logo}`}
                  alt={r.name}
                  style={styles.logo}
                />
                <h3>{r.name}</h3>
                <p>{r.address}</p>
                <small style={styles.restaurantId}>ID: {r._id}</small>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

const styles = {
  container: {
    padding: '40px',
    textAlign: 'center',
  },
  addButton: {
    display: 'inline-block',
    marginBottom: '20px',
    padding: '10px 15px',
    backgroundColor: '#28a745',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '5px',
    fontWeight: 'bold',
  },
  grid: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '20px',
  },
  card: {
    width: '250px',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    cursor: 'pointer',
    transition: 'transform 0.2s',
  },
  logo: {
    width: '80px',
    height: '80px',
    objectFit: 'contain',
    marginBottom: '10px',
  },
  restaurantId: {
    marginTop: '10px',
    fontSize: '12px',
    color: '#666',
  },
  error: {
    color: 'red',
    fontWeight: 'bold',
  },
};

export default MyRestaurants;