import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Calendar, Clock } from 'lucide-react';

export default function Cart() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      fetchRentals();
    }
  }, [user]);

  const fetchRentals = async () => {
    try {
      const res = await axios.get(`http://localhost:8081/api/borrow`);
      const userRentals = res.data.filter(b => b.member?.id === user.id);
      setRentals(userRentals);
    } catch (err) {
      console.error("Error fetching rentals", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateEndDate = (startDateStr, days) => {
    const start = new Date(startDateStr);
    start.setDate(start.getDate() + days);
    return start.toLocaleDateString();
  };

  if (loading) return <div style={{ padding: '80px', textAlign: 'center', color: '#588157' }}>Loading your rentals...</div>;

  return (
    <div className="container" style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto', minHeight: '80vh' }}>
      <h2 style={{ fontSize: '32px', marginBottom: '30px', color: '#3a5a40', fontWeight: '700' }}>My Rentals</h2>
      
      {rentals.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px', background: 'rgba(218, 215, 205, 0.3)', borderRadius: '16px', border: '1px dashed #a3b18a' }}>
          <BookOpen size={64} color="#588157" style={{ margin: '0 auto 20px' }} />
          <h3 style={{ fontSize: '20px', color: '#3a5a40', marginBottom: '8px' }}>You have no active rentals</h3>
          <p style={{ color: '#588157', marginBottom: '24px' }}>Explore our collection and start reading today!</p>
          <button onClick={() => navigate('/')} style={{ padding: '12px 24px', background: '#3a5a40', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
            Browse Books
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {rentals.map(item => (
            <div key={item.id} style={{ 
              background: '#fff', 
              borderRadius: '16px', 
              border: '1px solid #e9ecef', 
              padding: '24px',
              boxShadow: '0 4px 15px rgba(52, 78, 65, 0.05)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
                <div style={{ width: '60px', height: '80px', background: '#f8f9fa', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                  📔
                </div>
                <div>
                  <h4 style={{ fontSize: '18px', fontWeight: '700', color: '#344e41', marginBottom: '4px' }}>{item.book?.bookName}</h4>
                  <p style={{ color: '#588157', fontSize: '13px' }}>{item.book?.author}</p>
                </div>
              </div>
              
              <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '12px', marginTop: 'auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#3a5a40', fontSize: '14px' }}>
                  <Calendar size={16} color="#588157" />
                  <strong>Rented on:</strong> {new Date(item.borrowDate).toLocaleDateString()}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#3a5a40', fontSize: '14px' }}>
                  <Clock size={16} color="#588157" />
                  <strong>Duration:</strong> {item.rentDays} days
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#3a5a40', fontSize: '14px' }}>
                  <BookOpen size={16} color="#e03e3e" />
                  <strong>Due date:</strong> {calculateEndDate(item.borrowDate, item.rentDays)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
