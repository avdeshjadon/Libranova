import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import '../App.css'; 

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
      const res = await axios.get(`/api/borrow`);
      const userRentals = res.data.filter(b => b.member?.id === user.id);
      setRentals(userRentals);
    } catch (err) {
      console.error("Error fetching rentals", err);
    } finally {
      setLoading(false);
    }
  };

  const getTagColor = (category) => {
    const cats = {
      'Programming': '#fceae8',
      'Sci-Fi': '#e5f3fa',
      'Business & Economics': '#f4e9ee'
    };
    return cats[category] || '#f1f1ef';
  };

  const getTagTextColor = (category) => {
    const cats = {
      'Programming': '#5d1715',
      'Sci-Fi': '#183347',
      'Business & Economics': '#4c2337'
    };
    return cats[category] || '#32302c';
  };

  const getLateInfo = (borrowDateStr, rentDays, returnDateStr = null) => {
    if (!borrowDateStr || !rentDays) return { isLate: false, daysLate: 0 };
    
    const borrowDate = new Date(borrowDateStr);
    const dueDate = new Date(borrowDate);
    dueDate.setDate(dueDate.getDate() + rentDays);
    dueDate.setHours(0,0,0,0);
    
    let compareDate = new Date(); 
    if (returnDateStr) {
      const parts = returnDateStr.split('/');
      if (parts.length === 3) {
        compareDate = new Date(parts[2], parts[1] - 1, parts[0]);
      }
    }
    compareDate.setHours(0,0,0,0);
    
    if (compareDate > dueDate) {
      const diffTime = Math.abs(compareDate - dueDate);
      const daysLate = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return { isLate: true, daysLate };
    }
    return { isLate: false, daysLate: 0 };
  };

  const activeRentals = rentals.filter(b => b.status !== 'Returned');
  const returnedRentals = rentals.filter(b => b.status === 'Returned');

  if (loading) return <div style={{ padding: '80px', textAlign: 'center', color: '#588157' }}>Loading your rentals...</div>;

  return (
    <div className="container" style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', minHeight: '80vh' }}>
      
      {rentals.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px', background: 'rgba(218, 215, 205, 0.3)', borderRadius: '16px', border: '1px dashed #a3b18a' }}>
          <BookOpen size={64} color="#588157" style={{ margin: '0 auto 20px' }} />
          <h3 style={{ fontSize: '20px', color: '#3a5a40', marginBottom: '8px' }}>You have no borrow history</h3>
          <p style={{ color: '#588157', marginBottom: '24px' }}>Explore our collection and start reading today!</p>
          <button onClick={() => navigate('/')} style={{ padding: '12px 24px', background: '#3a5a40', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
            Browse Books
          </button>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: '60px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h1 style={{ fontSize: '28px', fontWeight: '700', margin: 0, color:'#37352f' }}>Active Rentals</h1>
            </div>
            <div style={{ overflowX: 'auto', overflowY: 'auto', maxHeight: '400px' }}>
              <table className="notion-exact-table" style={{ minWidth: '800px' }}>
                <thead>
                  <tr>
                    <th>Book Title</th>
                    <th>Category</th>
                    <th>Author</th>
                    <th>Price/Day</th>
                    <th>Borrow Date</th>
                    <th>Duration</th>
                    <th>Payment</th>
                    <th>Total Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {activeRentals.map((b) => {
                    const lateInfo = getLateInfo(b.borrowDate, b.rentDays);
                    const originalTotal = (b.book?.price || 0) * (b.rentDays || 0);
                    const lateFee = lateInfo.isLate ? lateInfo.daysLate * (b.book?.price || 0) : 0;
                    
                    return (
                    <tr key={b.id}>
                      <td 
                        style={{ fontWeight:'600', maxWidth: '180px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                        title={b.book?.bookName}
                      >
                        {b.book?.bookName}
                      </td>
                      <td>
                        <span className="notion-tag-pill" style={{ background: getTagColor(b.book?.bookCategory), color: getTagTextColor(b.book?.bookCategory) }}>
                          {b.book?.bookCategory}
                        </span>
                      </td>
                      <td 
                        style={{ maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                        title={b.book?.author}
                      >
                        {b.book?.author}
                      </td>
                      <td>₹{b.book?.price ? Number(b.book?.price).toFixed(2) : '0.00'}</td>
                      <td>{b.borrowDate || '-'}</td>
                      <td>
                        <span style={{ background: '#eaf2f6', color: '#1d4f47', padding: '4px 10px', borderRadius: '12px', fontSize: '13px', fontWeight: '500' }}>
                          {b.rentDays} days
                        </span>
                      </td>
                      <td>
                        <span style={{ background: b.paymentMode === 'Online' ? '#e0e7ff' : '#dcfce7', color: b.paymentMode === 'Online' ? '#3730a3' : '#166534', padding: '4px 8px', borderRadius: '4px', fontWeight: '500' }}>
                          {b.paymentMode || 'Cash'}
                        </span>
                      </td>
                      <td style={{ fontWeight: '700' }}>
                        ₹{originalTotal.toFixed(2)}
                        {lateInfo.isLate && <span style={{ color: '#e03e3e', marginLeft: '4px', fontSize: '13px' }}>+₹{lateFee.toFixed(2)}</span>}
                      </td>
                      <td>
                        {lateInfo.isLate ? 
                          <span style={{ color: '#e03e3e', fontWeight: '600' }}>Late ({lateInfo.daysLate}d)</span> : 
                          <span style={{ color: '#eaaa08', fontWeight: '600' }}>Active</span>}
                      </td>
                    </tr>
                  )})}
                  {activeRentals.length === 0 && <tr><td colSpan="9" style={{ textAlign:'center', padding: '40px', color: '#999' }}>No active rentals.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ marginTop: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h1 style={{ fontSize: '28px', fontWeight: '700', margin: 0, color:'#37352f' }}>Return History</h1>
            </div>
            
            <div style={{ overflowX: 'auto', overflowY: 'auto', maxHeight: '400px' }}>
              <table className="notion-exact-table" style={{ minWidth: '800px' }}>
                <thead>
                  <tr>
                    <th>Book Title</th>
                    <th>Category</th>
                    <th>Borrow Date</th>
                    <th>Return Date</th>
                    <th>Late Status</th>
                    <th>Total Paid</th>
                  </tr>
                </thead>
                <tbody>
                  {returnedRentals.map((b) => {
                    const lateInfo = getLateInfo(b.borrowDate, b.rentDays, b.returnDate);
                    const originalTotal = (b.book?.price || 0) * (b.rentDays || 0);
                    const lateFee = lateInfo.isLate ? lateInfo.daysLate * (b.book?.price || 0) : 0;
                    const totalPaid = originalTotal + lateFee;
                    
                    return (
                    <tr key={b.id}>
                      <td 
                        style={{ fontWeight:'600', maxWidth: '180px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                        title={b.book?.bookName}
                      >
                        {b.book?.bookName}
                      </td>
                      <td>
                        <span className="notion-tag-pill" style={{ background: getTagColor(b.book?.bookCategory), color: getTagTextColor(b.book?.bookCategory) }}>
                          {b.book?.bookCategory}
                        </span>
                      </td>
                      <td>{b.borrowDate || '-'}</td>
                      <td><span style={{ color: '#10b981', fontWeight: '600' }}>{b.returnDate}</span></td>
                      <td>
                        {lateInfo.isLate ? 
                          <span style={{ color: '#e03e3e', fontWeight: '600' }}>{lateInfo.daysLate} days late</span> : 
                          <span style={{ color: '#10b981', fontWeight: '500' }}>On Time</span>
                        }
                      </td>
                      <td style={{ fontWeight: '700' }}>
                        ₹{totalPaid.toFixed(2)}
                      </td>
                    </tr>
                  )})}
                  {returnedRentals.length === 0 && <tr><td colSpan="6" style={{ textAlign:'center', padding: '40px', color: '#999' }}>No return records found.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
