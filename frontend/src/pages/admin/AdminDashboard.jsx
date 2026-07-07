import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { BookOpen, Users, UserCheck, Plus, Menu, Trash2, Info, Edit2, RotateCcw, AlertTriangle, Loader2 } from 'lucide-react';
import '../../App.css'; 

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [borrowers, setBorrowers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [borrowerSearch, setBorrowerSearch] = useState('');
  const [bookSearch, setBookSearch] = useState('');
  const [memberSearch, setMemberSearch] = useState('');

  const [editingPriceId, setEditingPriceId] = useState(null);
  const [tempPrice, setTempPrice] = useState("");

  // Add Data modals
  const [showAddBook, setShowAddBook] = useState(false);
  const [newBook, setNewBook] = useState({ bookName: '', author: '', bookCategory: 'Programming', price: '', totalCopies: 1, amountInStock: 1, status: 'Available', photoName: '' });
  const [showAddBorrower, setShowAddBorrower] = useState(false);
  const [borrowRequest, setBorrowRequest] = useState({ userId: '', bookId: '', note: '', date: new Date().toISOString().split('T')[0], rentDays: 7, paymentMode: 'Cash' });
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', email: '', phno: '', address: '', password: '' });

  // Edit Book Modal
  const [editingBook, setEditingBook] = useState(null);

  // Member Info Modal
  const [selectedMemberInfo, setSelectedMemberInfo] = useState(null);

  // Custom Confirmation Modal
  const [confirmModal, setConfirmModal] = useState({ show: false, title: '', message: '', onConfirm: null });
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New Modals State
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [showReportsModal, setShowReportsModal] = useState(false);
  const [showReturnsModal, setShowReturnsModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const uniqueCategories = [...new Set(books.map(b => b.bookCategory))].filter(Boolean);

  const executeWithConfirm = (title, message, action) => {
    setConfirmModal({
      show: true,
      title,
      message,
      onConfirm: async () => {
        setIsConfirming(true);
        try {
          await action();
          setIsConfirming('success');
          setTimeout(() => {
            setIsConfirming(false);
            setConfirmModal({ show: false, title: '', message: '', onConfirm: null });
          }, 1500);
        } catch (e) {
          setIsConfirming(false);
        }
      }
    });
  };

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      navigate('/');
      return;
    }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, booksRes, borrowRes] = await Promise.all([
        axios.get('/api/admin/users'),
        axios.get('/api/books'),
        axios.get('/api/borrow')
      ]);
      setUsers(usersRes.data);
      setBooks(booksRes.data);
      setBorrowers(borrowRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('bookName', newBook.bookName);
    formData.append('author', newBook.author);
    formData.append('bookCategory', newBook.bookCategory);
    formData.append('price', newBook.price);
    formData.append('totalCopies', newBook.totalCopies);
    formData.append('amountInStock', newBook.amountInStock);
    formData.append('status', newBook.status);
    if (newBook.coverImage) {
      formData.append('coverImage', newBook.coverImage);
    }

    try {
      await axios.post('/api/admin/books/with-cover', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchData();
      setIsSubmitting('success');
      setTimeout(() => {
        setShowAddBook(false);
        setNewBook({ bookName: '', author: '', bookCategory: 'Programming', price: '', totalCopies: 1, amountInStock: 1, status: 'Available', coverImage: null });
        setIsSubmitting(false);
      }, 1500);
    } catch(err) {
      alert("Failed to add book: " + (err.response?.data || err.message));
      setIsSubmitting(false);
    }
  };

  const handleAddBorrower = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post(`/api/borrow?userId=${borrowRequest.userId}&bookId=${borrowRequest.bookId}&note=${borrowRequest.note}&date=${borrowRequest.date}&rentDays=${borrowRequest.rentDays}&paymentMode=${borrowRequest.paymentMode}`);
      fetchData();
      setIsSubmitting('success');
      setTimeout(() => {
        setShowAddBorrower(false);
        setIsSubmitting(false);
      }, 1500);
    } catch(err) {
      alert("Failed: " + (err.response?.data || err.message));
      setIsSubmitting(false);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post('/api/users/register', newMember);
      fetchData();
      setIsSubmitting('success');
      setTimeout(() => {
        setShowAddMember(false);
        setNewMember({ name: '', email: '', phno: '', address: '', password: '' });
        setIsSubmitting(false);
      }, 1500);
    } catch(err) {
      alert("Failed to add member: " + (err.response?.data || err.message));
      setIsSubmitting(false);
    }
  };

  const handleUpdatePrice = async (book) => {
    if (!tempPrice || parseFloat(tempPrice) < 0) {
      setEditingPriceId(null);
      return;
    }
    try {
      const updatedBook = { ...book, price: parseFloat(tempPrice) };
      await axios.put(`/api/books/${book.bookId}`, updatedBook);
      setEditingPriceId(null);
      fetchData(); // Refresh all data to sync everywhere instantly
    } catch (err) {
      console.error("Failed to update price", err);
    }
  };

  const handleUpdateFullBook = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('bookName', editingBook.bookName);
    formData.append('author', editingBook.author);
    formData.append('bookCategory', editingBook.bookCategory);
    formData.append('price', editingBook.price);
    formData.append('totalCopies', editingBook.totalCopies);
    formData.append('amountInStock', editingBook.amountInStock);
    formData.append('status', editingBook.status);
    if (editingBook.coverImage) {
      formData.append('coverImage', editingBook.coverImage);
    }

    try {
      await axios.put(`/api/admin/books/${editingBook.bookId}/with-cover`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchData();
      setIsSubmitting('success');
      setTimeout(() => {
        setEditingBook(null);
        setIsSubmitting(false);
      }, 1500);
    } catch (err) {
      alert("Failed to update book: " + (err.response?.data || err.message));
      setIsSubmitting(false);
    }
  };

  const handleDeleteBook = (id) => {
    executeWithConfirm('Delete Book', 'Are you sure you want to permanently delete this book?', async () => {
      try {
        await axios.delete(`/api/books/${id}`);
        fetchData();
      } catch(err) { alert('Failed to delete book'); }
    });
  };

  const handleDeleteMember = (id) => {
    executeWithConfirm('Delete Member', 'Are you sure you want to permanently delete this member?', async () => {
      try {
        await axios.delete(`/api/users/${id}`);
        fetchData();
      } catch(err) { alert('Failed to delete member'); }
    });
  };

  const handleDeleteBorrowRecord = (id) => {
    executeWithConfirm('Delete Record', 'Are you sure you want to permanently delete this borrow record?', async () => {
      try {
        await axios.delete(`/api/borrow/${id}`);
        fetchData();
      } catch(err) { alert('Failed to delete record'); }
    });
  };

  const handleReturnBook = (borrowRecord) => {
    const lateInfo = getLateInfo(borrowRecord.borrowDate, borrowRecord.rentDays);
    const lateFee = lateInfo.isLate ? lateInfo.daysLate * (borrowRecord.book?.price || 0) : 0;
    
    let title = 'Return / Repay Book';
    let message = 'Are you sure you want to mark this book as returned and process repayment?';
    
    if (lateInfo.isLate) {
      title = 'Process Late Return (Payment Required)';
      message = `This book is ${lateInfo.daysLate} days late. An additional late fee of ₹${lateFee.toFixed(2)} must be collected. Please collect the total amount before proceeding.`;
    }

    executeWithConfirm(title, message, async () => {
      try {
        await axios.put(`/api/borrow/${borrowRecord.id}/return`);
        fetchData();
      } catch(err) { alert('Failed to return book: ' + (err.response?.data || err.message)); }
    });
  };

  const borrowCounts = Object.entries(borrowData).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value);
  const totalBorrowed = borrowCounts.reduce((acc, curr) => acc + curr.value, 0);
  const COLORS = ['#2383e2', '#eaaa08', '#10b981', '#6366f1', '#f43f5e'];

  const totalMoney = borrowers.reduce((acc, curr) => acc + (parseFloat(curr.book?.price || 0) * (curr.rentDays || 0)), 0);

  const handleMarkReturned = async (borrowId) => {
    executeWithConfirm('Confirm Return', 'Are you sure you want to mark this book as returned? This will update the stock automatically.', async () => {
      try {
        await axios.put(`/api/borrow/${borrowId}/return`);
        fetchData();
      } catch (err) {
        alert('Failed to return book: ' + (err.response?.data || err.message));
      }
    });
  };

  const getTagColor = (category) => {
    const cats = {
      'Fiction': '#e3e2e0',
      'Non-Fiction': '#fdecc8',
      'Programming': '#ffe2dd',
      'Sci-Fi': '#d3e5ef',
      'Business & Economics': '#f5e0e9'
    };
    return cats[category] || '#e3e2e0';
  };

  const getTagTextColor = (category) => {
    const cats = {
      'Fiction': '#32302c',
      'Non-Fiction': '#402c1b',
      'Programming': '#5d1715',
      'Sci-Fi': '#183347',
      'Business & Economics': '#4c2337'
    };
    return cats[category] || '#32302c';
  };

  // Late fee helper
  const getLateInfo = (borrowDateStr, rentDays, returnDateStr = null) => {
    if (!borrowDateStr || !rentDays) return { isLate: false, daysLate: 0 };
    
    // Parse borrow date (YYYY-MM-DD format usually)
    const borrowDate = new Date(borrowDateStr);
    const dueDate = new Date(borrowDate);
    dueDate.setDate(dueDate.getDate() + rentDays);
    dueDate.setHours(0,0,0,0);
    
    let compareDate = new Date(); // Today
    if (returnDateStr) {
      // returnDate is dd/MM/yyyy
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

  const filteredBorrowers = borrowers.filter(b => 
    b.member?.name?.toLowerCase().includes(borrowerSearch.toLowerCase()) || 
    b.book?.bookName?.toLowerCase().includes(borrowerSearch.toLowerCase())
  );

  const activeBorrowers = filteredBorrowers.filter(b => b.status !== 'Returned');
  const returnedBorrowers = filteredBorrowers.filter(b => b.status === 'Returned');

  const filteredBooks = books.filter(b => 
    b.bookName?.toLowerCase().includes(bookSearch.toLowerCase()) ||
    b.author?.toLowerCase().includes(bookSearch.toLowerCase()) ||
    b.bookCategory?.toLowerCase().includes(bookSearch.toLowerCase())
  );

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(memberSearch.toLowerCase()) ||
    u.email?.toLowerCase().includes(memberSearch.toLowerCase()) ||
    u.phno?.toLowerCase().includes(memberSearch.toLowerCase())
  );

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading Workspace...</div>;

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: '#fff' }}>
      <div className="notion-banner" style={{ display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ position: 'relative', zIndex: 1, width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          
          <div style={{ background: 'rgba(255, 255, 255, 0.65)', backdropFilter: 'blur(12px)', padding: '30px', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.8)', boxShadow: '0 8px 32px 0 rgba(163, 177, 138, 0.15)', display: 'inline-block' }}>
            <h1 style={{ color: '#2b3a2f', fontSize: '42px', fontWeight: '800', margin: 0, letterSpacing: '-1px' }}>
              Libranova <span style={{ color: '#6a8264' }}>Workspace</span>
            </h1>
            <p style={{ color: '#526b5d', fontSize: '16px', margin: '10px 0 0 0', fontWeight: '500' }}>
              Premium Book Rental Management System
            </p>
          </div>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(12px)', padding: '16px 24px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.8)', boxShadow: '0 8px 24px 0 rgba(163, 177, 138, 0.15)', textAlign: 'center', minWidth: '120px' }}>
              <div style={{ fontSize: '12px', color: '#526b5d', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Users</div>
              <div style={{ fontSize: '28px', fontWeight: '800', color: '#2b3a2f', marginTop: '4px' }}>{users.length}</div>
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(12px)', padding: '16px 24px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.8)', boxShadow: '0 8px 24px 0 rgba(163, 177, 138, 0.15)', textAlign: 'center', minWidth: '120px' }}>
              <div style={{ fontSize: '12px', color: '#526b5d', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Books</div>
              <div style={{ fontSize: '28px', fontWeight: '800', color: '#2b3a2f', marginTop: '4px' }}>{books.length}</div>
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(12px)', padding: '16px 24px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.8)', boxShadow: '0 8px 24px 0 rgba(163, 177, 138, 0.15)', textAlign: 'center', minWidth: '120px' }}>
              <div style={{ fontSize: '12px', color: '#526b5d', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Borrowers</div>
              <div style={{ fontSize: '28px', fontWeight: '800', color: '#2b3a2f', marginTop: '4px' }}>{borrowers.length}</div>
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(12px)', padding: '16px 24px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.8)', boxShadow: '0 8px 24px 0 rgba(163, 177, 138, 0.15)', textAlign: 'center', minWidth: '120px' }}>
              <div style={{ fontSize: '12px', color: '#526b5d', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Revenue</div>
              <div style={{ fontSize: '28px', fontWeight: '800', color: '#2b3a2f', marginTop: '4px' }}>₹{totalMoney.toFixed(0)}</div>
            </div>
          </div>

        </div>
      </div>
      
      <div className="container">
        <div className="notion-title-block">
          <h1 className="notion-h1">Library Management System</h1>
        </div>

        {/* Top Grid Area (Chart + Quick Actions) */}
        <div className="grid-dashboard-top">
          
          {/* Chart Section */}
          <div className="chart-container">
            <div className="chart-title"><BookOpen size={16}/> Total Borrowing Book</div>
            <div style={{ width: '100%', height: '180px', position: 'relative' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={borrowCounts.length ? borrowCounts : [{name:'None', value:1}]} innerRadius={50} outerRadius={70} paddingAngle={2} dataKey="value">
                    {borrowCounts.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                <span style={{ fontSize: '32px', fontWeight: '700', color: '#37352f' }}>{totalBorrowed}</span>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Total Borro...</div>
              </div>
            </div>
            {/* Chart Legend Mini */}
            <div style={{ marginTop: '10px', fontSize: '11px', color: '#9a9a97' }}>
               {borrowCounts.slice(0, 4).map((c, i) => (
                 <div key={i} style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'2px' }}>
                   <div style={{ width:'8px', height:'8px', background: COLORS[i % COLORS.length], borderRadius:'1px' }}></div>
                   <span style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.name}</span>
                 </div>
               ))}
               {borrowCounts.length > 4 && <div>▲ 1/2 ▼</div>}
            </div>
          </div>

          {/* Menus */}
          <div>
            <div className="notion-section-title">Menu</div>
            <button className="quick-btn" onClick={() => document.getElementById('books-section')?.scrollIntoView({ behavior: 'smooth' })}><BookOpen size={14}/> Books</button>
            <button className="quick-btn" onClick={() => document.getElementById('members-section')?.scrollIntoView({ behavior: 'smooth' })}><Users size={14}/> Member</button>
            <button className="quick-btn" onClick={() => document.getElementById('borrowers-section')?.scrollIntoView({ behavior: 'smooth' })}><UserCheck size={14}/> Borrower</button>
            <button className="quick-btn" onClick={() => setShowCategoriesModal(true)}><BookOpen size={14}/> Categories</button>
            <button className="quick-btn" onClick={() => setShowStaffModal(true)}><Users size={14}/> Staff</button>
            <button className="quick-btn" onClick={() => setShowReportsModal(true)}><UserCheck size={14}/> Reports</button>
          </div>

          {/* Quick Buttons */}
          <div>
            <div className="notion-section-title">Quick Buttons</div>
            <button className="quick-btn" onClick={() => setShowAddBook(!showAddBook)}><Plus size={14}/> Add Book</button>
            <button className="quick-btn" onClick={() => setShowAddMember(true)}><Plus size={14}/> Add Member</button>
            <button className="quick-btn" onClick={() => setShowAddBorrower(!showAddBorrower)}><Plus size={14}/> Add Borrower</button>
            <button className="quick-btn" onClick={() => setShowCategoriesModal(true)}><Plus size={14}/> Add Category</button>
            <button className="quick-btn" onClick={() => setShowReturnsModal(true)}><Plus size={14}/> Manage Returns</button>
            <button className="quick-btn" onClick={() => navigate('/profile')}><Plus size={14}/> Settings</button>
          </div>
        </div>

        {/* Add Forms as Modals */}

        {showAddBorrower && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, animation: 'fadeIn 0.2s ease-out' }}>
            <div style={{ background: '#fff', padding: '32px', borderRadius: '16px', width: '560px', maxWidth: '95%', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', border: '1px solid rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#1a1a1a' }}>Issue Book</h2>
                <button type="button" onClick={() => setShowAddBorrower(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#999', fontSize: '18px', padding: '4px' }}>✕</button>
              </div>
              <form onSubmit={handleAddBorrower}>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                  <select className="form-control" value={borrowRequest.userId} onChange={e=>setBorrowRequest({...borrowRequest, userId: e.target.value})} required style={{ flex: 1 }}>
                    <option value="">Select Member</option>
                    {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                  </select>
                  <select className="form-control" value={borrowRequest.bookId} onChange={e=>setBorrowRequest({...borrowRequest, bookId: e.target.value})} required style={{ flex: 1 }}>
                    <option value="">Select Book</option>
                    {books.filter(b=>b.amountInStock > 0).map(b => <option key={b.bookId} value={b.bookId}>{b.bookName}</option>)}
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                  <input type="date" className="form-control" value={borrowRequest.date} onChange={e=>setBorrowRequest({...borrowRequest, date: e.target.value})} required style={{ flex: 1 }}/>
                  <input type="number" min="1" className="form-control" placeholder="Rent Days" value={borrowRequest.rentDays} onChange={e=>setBorrowRequest({...borrowRequest, rentDays: e.target.value})} required style={{ width: '100px' }}/>
                  <select className="form-control" value={borrowRequest.paymentMode} onChange={e=>setBorrowRequest({...borrowRequest, paymentMode: e.target.value})} style={{ flex: 1 }}>
                    <option value="Cash">Cash</option>
                    <option value="Online">Online</option>
                  </select>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <input className="form-control" placeholder="Notes (Optional)" value={borrowRequest.note} onChange={e=>setBorrowRequest({...borrowRequest, note: e.target.value})} style={{ width: '100%' }}/>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8f9fa', padding: '12px 16px', borderRadius: '8px', border: '1px dashed #d1d5db' }}>
                  <span style={{ fontSize: '14px', color: '#555' }}>Total Amount</span>
                  <span style={{ fontSize: '16px', color: '#1a1a1a', fontWeight: '700' }}>₹{ ((borrowRequest.bookId ? (books.find(b => b.bookId.toString() === borrowRequest.bookId.toString())?.price || 0) : 0) * (parseInt(borrowRequest.rentDays) || 0)).toFixed(2) }</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                  <button type="button" className="btn" style={{ background: '#f0f0f0', color: '#333', padding: '10px 20px', borderRadius: '8px', fontWeight: '600' }} onClick={() => setShowAddBorrower(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" style={{ padding: '10px 24px', borderRadius: '8px', fontWeight: '600', boxShadow: '0 4px 12px rgba(35, 131, 226, 0.2)' }} disabled={isSubmitting}>
                    {isSubmitting === true ? <><Loader2 className="animate-spin" size={14} style={{ display: 'inline', marginRight: '6px' }}/> Processing...</> : isSubmitting === 'success' ? 'Issued!' : 'Issue Book'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showAddBook && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, animation: 'fadeIn 0.2s ease-out' }}>
            <div style={{ background: '#fff', padding: '32px', borderRadius: '16px', width: '560px', maxWidth: '95%', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', border: '1px solid rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#1a1a1a' }}>Add Book</h2>
                <button type="button" onClick={() => setShowAddBook(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#999', fontSize: '18px', padding: '4px' }}>✕</button>
              </div>
              <form onSubmit={handleAddBook}>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                  <input className="form-control" placeholder="Book Title" value={newBook.bookName} onChange={e=>setNewBook({...newBook, bookName: e.target.value})} required style={{ flex: 1 }}/>
                  <input className="form-control" placeholder="Author" value={newBook.author} onChange={e=>setNewBook({...newBook, author: e.target.value})} required style={{ flex: 1 }}/>
                </div>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                  <select className="form-control" value={newBook.bookCategory} onChange={e=>setNewBook({...newBook, bookCategory: e.target.value})} style={{ flex: 1 }}>
                    <option value="Business & Economics">Business & Economics</option>
                    <option value="Fiction">Fiction</option>
                    <option value="Non-Fiction">Non-Fiction</option>
                    <option value="Anthologies & Collections">Anthologies & Collections</option>
                    <option value="Poetry and Drama">Poetry and Drama</option>
                    <option value="Programming">Programming</option>
                    <option value="Sci-Fi">Sci-Fi</option>
                  </select>
                  <input type="number" className="form-control" placeholder="Price/Day" value={newBook.price} onChange={e=>setNewBook({...newBook, price: e.target.value})} required style={{ flex: 1 }}/>
                </div>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '12px', color: '#666', marginBottom: '4px', display: 'block', fontWeight: '500' }}>Total Copies</label>
                    <input type="number" className="form-control" placeholder="Total Copies" value={newBook.totalCopies} onChange={e=>setNewBook({...newBook, totalCopies: parseInt(e.target.value) || 0})} required style={{ width: '100%' }}/>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '12px', color: '#666', marginBottom: '4px', display: 'block', fontWeight: '500' }}>In Stock</label>
                    <input type="number" className="form-control" placeholder="Amount In Stock" value={newBook.amountInStock} onChange={e=>setNewBook({...newBook, amountInStock: parseInt(e.target.value) || 0})} required style={{ width: '100%' }}/>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                  <select className="form-control" value={newBook.status} onChange={e=>setNewBook({...newBook, status: e.target.value})} style={{ width: '120px' }}>
                    <option value="Available">Available</option>
                    <option value="Unavailable">Unavailable</option>
                  </select>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <div 
                    style={{ border: '2px dashed #ccc', padding: '24px', textAlign: 'center', borderRadius: '8px', cursor: 'pointer', background: '#fafafa', color: '#666' }}
                    onDrop={(e) => { e.preventDefault(); const file = e.dataTransfer.files[0]; if(file) setNewBook({...newBook, coverImage: file}); }}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => document.getElementById('addBookCoverInput').click()}
                  >
                    {newBook.coverImage ? (
                      <span style={{ color: '#166534', fontWeight: '600' }}>Selected: {newBook.coverImage.name}</span>
                    ) : (
                      <span>Drag and drop cover image here, or click to browse</span>
                    )}
                    <input type="file" id="addBookCoverInput" hidden accept="image/*" onChange={(e) => { if(e.target.files[0]) setNewBook({...newBook, coverImage: e.target.files[0]}); }} />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                  <button type="button" className="btn" style={{ background: '#f0f0f0', color: '#333', padding: '10px 20px', borderRadius: '8px', fontWeight: '600' }} onClick={() => setShowAddBook(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" style={{ padding: '10px 24px', borderRadius: '8px', fontWeight: '600', boxShadow: '0 4px 12px rgba(35, 131, 226, 0.2)' }} disabled={isSubmitting}>
                    {isSubmitting === true ? <><Loader2 className="animate-spin" size={14} style={{ display: 'inline', marginRight: '6px' }}/> Saving...</> : isSubmitting === 'success' ? 'Saved!' : 'Add Book'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {editingBook && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, animation: 'fadeIn 0.2s ease-out' }}>
            <div style={{ background: '#fff', padding: '32px', borderRadius: '16px', width: '560px', maxWidth: '95%', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', border: '1px solid rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#1a1a1a' }}>Edit Book</h2>
                <button type="button" onClick={() => setEditingBook(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#999', fontSize: '18px', padding: '4px' }}>✕</button>
              </div>
              <form onSubmit={handleUpdateFullBook}>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                  <input className="form-control" placeholder="Book Title" value={editingBook.bookName} onChange={e=>setEditingBook({...editingBook, bookName: e.target.value})} required style={{ flex: 1 }}/>
                  <input className="form-control" placeholder="Author" value={editingBook.author} onChange={e=>setEditingBook({...editingBook, author: e.target.value})} required style={{ flex: 1 }}/>
                </div>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                  <select className="form-control" value={editingBook.bookCategory} onChange={e=>setEditingBook({...editingBook, bookCategory: e.target.value})} style={{ flex: 1 }}>
                    <option value="Business & Economics">Business & Economics</option>
                    <option value="Fiction">Fiction</option>
                    <option value="Non-Fiction">Non-Fiction</option>
                    <option value="Anthologies & Collections">Anthologies & Collections</option>
                    <option value="Poetry and Drama">Poetry and Drama</option>
                    <option value="Programming">Programming</option>
                    <option value="Sci-Fi">Sci-Fi</option>
                  </select>
                  <input type="number" className="form-control" placeholder="Price/Day" value={editingBook.price} onChange={e=>setEditingBook({...editingBook, price: e.target.value})} required style={{ flex: 1 }}/>
                </div>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '12px', color: '#666', marginBottom: '4px', display: 'block', fontWeight: '500' }}>Total Copies</label>
                    <input type="number" className="form-control" placeholder="Total Copies" value={editingBook.totalCopies} onChange={e=>setEditingBook({...editingBook, totalCopies: parseInt(e.target.value) || 0})} required style={{ width: '100%' }}/>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '12px', color: '#666', marginBottom: '4px', display: 'block', fontWeight: '500' }}>In Stock</label>
                    <input type="number" className="form-control" placeholder="Amount In Stock" value={editingBook.amountInStock} onChange={e=>setEditingBook({...editingBook, amountInStock: parseInt(e.target.value) || 0})} required style={{ width: '100%' }}/>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                  <select className="form-control" value={editingBook.status} onChange={e=>setEditingBook({...editingBook, status: e.target.value})} style={{ width: '120px' }}>
                    <option value="Available">Available</option>
                    <option value="Unavailable">Unavailable</option>
                  </select>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <div 
                    style={{ border: '2px dashed #ccc', padding: '24px', textAlign: 'center', borderRadius: '8px', cursor: 'pointer', background: '#fafafa', color: '#666' }}
                    onDrop={(e) => { e.preventDefault(); const file = e.dataTransfer.files[0]; if(file) setEditingBook({...editingBook, coverImage: file}); }}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => document.getElementById('editBookCoverInput').click()}
                  >
                    {editingBook.coverImage ? (
                      <span style={{ color: '#166534', fontWeight: '600' }}>Selected: {editingBook.coverImage.name}</span>
                    ) : (
                      <span>Drag and drop new cover image here, or click to browse</span>
                    )}
                    <input type="file" id="editBookCoverInput" hidden accept="image/*" onChange={(e) => { if(e.target.files[0]) setEditingBook({...editingBook, coverImage: e.target.files[0]}); }} />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                  <button type="button" className="btn" style={{ background: '#f0f0f0', color: '#333', padding: '10px 20px', borderRadius: '8px', fontWeight: '600' }} onClick={() => setEditingBook(null)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" style={{ padding: '10px 24px', borderRadius: '8px', fontWeight: '600', boxShadow: '0 4px 12px rgba(35, 131, 226, 0.2)' }} disabled={isSubmitting}>
                    {isSubmitting === true ? <><Loader2 className="animate-spin" size={14} style={{ display: 'inline', marginRight: '6px' }}/> Saving...</> : isSubmitting === 'success' ? 'Saved!' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showAddMember && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, animation: 'fadeIn 0.2s ease-out' }}>
            <div style={{ background: '#fff', padding: '32px', borderRadius: '16px', width: '560px', maxWidth: '95%', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', border: '1px solid rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#1a1a1a' }}>Add Member</h2>
                <button type="button" onClick={() => setShowAddMember(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#999', fontSize: '18px', padding: '4px' }}>✕</button>
              </div>
              <form onSubmit={handleAddMember}>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                  <input className="form-control" placeholder="Full Name" value={newMember.name} onChange={e=>setNewMember({...newMember, name: e.target.value})} required style={{ flex: 1 }}/>
                  <input type="email" className="form-control" placeholder="Email" value={newMember.email} onChange={e=>setNewMember({...newMember, email: e.target.value})} required style={{ flex: 1 }}/>
                </div>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                  <input className="form-control" placeholder="Phone Number" value={newMember.phno} onChange={e=>setNewMember({...newMember, phno: e.target.value})} required style={{ flex: 1 }}/>
                  <input type="password" className="form-control" placeholder="Password" value={newMember.password} onChange={e=>setNewMember({...newMember, password: e.target.value})} required style={{ flex: 1 }}/>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <input className="form-control" placeholder="Address (Optional)" value={newMember.address} onChange={e=>setNewMember({...newMember, address: e.target.value})} style={{ width: '100%' }}/>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                  <button type="button" className="btn" style={{ background: '#f0f0f0', color: '#333', padding: '10px 20px', borderRadius: '8px', fontWeight: '600' }} onClick={() => setShowAddMember(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" style={{ padding: '10px 24px', borderRadius: '8px', fontWeight: '600', boxShadow: '0 4px 12px rgba(35, 131, 226, 0.2)' }} disabled={isSubmitting}>
                    {isSubmitting === true ? <><Loader2 className="animate-spin" size={14} style={{ display: 'inline', marginRight: '6px' }}/> Saving...</> : isSubmitting === 'success' ? 'Saved!' : 'Add Member'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}


        {/* Borrower Table View */}
        <div id="borrowers-section" style={{ marginTop: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h1 style={{ fontSize: '28px', fontWeight: '700', margin: 0, color:'#37352f' }}>Borrower List</h1>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <input type="text" placeholder="Search borrowers..." value={borrowerSearch} onChange={e => setBorrowerSearch(e.target.value)} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #e0e1dd', outline: 'none', width: '250px' }} />
                <button className="btn btn-primary" onClick={() => setShowAddBorrower(true)}>+ Add Borrower</button>
              </div>
            </div>
            
            <div style={{ overflowX: 'auto', overflowY: 'auto', maxHeight: '400px' }}>
              <table className="notion-exact-table" style={{ minWidth: '800px' }}>
                <thead>
                  <tr>
                    <th>Member Name</th>
                    <th>Book Title</th>
                    <th>Category</th>
                    <th>Author</th>
                    <th>Price/Day</th>
                    <th>Borrow Date</th>
                    <th>Duration</th>
                    <th>Payment</th>
                    <th>Total Amount</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {activeBorrowers.map((b) => {
                    const lateInfo = getLateInfo(b.borrowDate, b.rentDays);
                    const originalTotal = (b.book?.price || 0) * (b.rentDays || 0);
                    const lateFee = lateInfo.isLate ? lateInfo.daysLate * (b.book?.price || 0) : 0;
                    
                    return (
                    <tr key={b.id}>
                      <td style={{ fontWeight: '600' }}>{b.member?.name}</td>
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
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <button 
                            className="btn btn-primary" 
                            style={{ padding: '4px 10px', fontSize: '12px', borderRadius: '4px', background: '#10b981', border: 'none' }} 
                            onClick={() => handleReturnBook(b)}
                          >
                            Return
                          </button>
                          <button 
                            className="btn" 
                            style={{ padding: '4px 10px', fontSize: '12px', borderRadius: '4px', background: '#e03e3e', color: 'white', border: 'none', cursor: 'pointer' }} 
                            onClick={() => handleDeleteBorrowRecord(b.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  )})}
                  {activeBorrowers.length === 0 && <tr><td colSpan="11" style={{ textAlign:'center', padding: '40px', color: '#999' }}>No active borrow records found.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        
        {/* Return List Table View */}
        <div style={{ marginTop: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h1 style={{ fontSize: '28px', fontWeight: '700', margin: 0, color:'#37352f' }}>Return List</h1>
            </div>
            
            <div style={{ overflowX: 'auto', overflowY: 'auto', maxHeight: '400px' }}>
              <table className="notion-exact-table" style={{ minWidth: '800px' }}>
                <thead>
                  <tr>
                    <th>Member Name</th>
                    <th>Book Title</th>
                    <th>Category</th>
                    <th>Borrow Date</th>
                    <th>Return Date</th>
                    <th>Late Status</th>
                    <th>Total Paid</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {returnedBorrowers.map((b) => {
                    const lateInfo = getLateInfo(b.borrowDate, b.rentDays, b.returnDate);
                    const originalTotal = (b.book?.price || 0) * (b.rentDays || 0);
                    const lateFee = lateInfo.isLate ? lateInfo.daysLate * (b.book?.price || 0) : 0;
                    const totalPaid = originalTotal + lateFee;
                    
                    return (
                    <tr key={b.id}>
                      <td style={{ fontWeight: '600' }}>{b.member?.name}</td>
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
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <button 
                            className="btn" 
                            style={{ padding: '4px 10px', fontSize: '12px', borderRadius: '4px', background: '#e03e3e', color: 'white', border: 'none', cursor: 'pointer' }} 
                            onClick={() => handleDeleteBorrowRecord(b.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  )})}
                  {returnedBorrowers.length === 0 && <tr><td colSpan="8" style={{ textAlign:'center', padding: '40px', color: '#999' }}>No return records found.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        {/* Books Detailed Table View */}
        <div id="books-section" style={{ marginTop: '60px', marginBottom: '60px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: '700', margin: 0, color:'#37352f' }}>Book</h1>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <input type="text" placeholder="Search books..." value={bookSearch} onChange={e => setBookSearch(e.target.value)} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #e0e1dd', outline: 'none', width: '250px' }} />
              <button className="btn btn-primary" onClick={() => setShowAddBook(true)}>+ Add Book</button>
            </div>
          </div>

          
          <div style={{ overflowX: 'auto', overflowY: 'auto', maxHeight: '400px' }}>
            <table className="notion-exact-table" style={{ minWidth: '800px' }}>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Author</th>
                  <th>Cover</th>
                  <th>Total</th>
                  <th>Stock</th>
                  <th>Price/Day</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredBooks.map(b => (
                  <tr key={b.bookId}>
                    <td 
                      style={{ fontWeight:'600', maxWidth: '210px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                      title={b.bookName}
                    >
                      {b.bookName}
                    </td>
                    <td>
                      <span className="notion-tag-pill" style={{ background: getTagColor(b.bookCategory), color: getTagTextColor(b.bookCategory) }}>
                        {b.bookCategory}
                      </span>
                    </td>
                    <td 
                      style={{ maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                      title={b.author}
                    >
                      {b.author}
                    </td>
                    <td>-</td>
                    <td>{b.totalCopies}</td>
                    <td>{b.amountInStock}</td>
                    <td 
                      onDoubleClick={() => { setEditingPriceId(b.bookId); setTempPrice(b.price); }} 
                      style={{ cursor: 'pointer', background: editingPriceId === b.bookId ? '#fff' : 'inherit' }}
                    >
                      {editingPriceId === b.bookId ? (
                        <input 
                          type="number" 
                          value={tempPrice} 
                          onChange={(e) => setTempPrice(e.target.value)} 
                          onBlur={() => handleUpdatePrice(b)}
                          onKeyDown={(e) => e.key === 'Enter' && handleUpdatePrice(b)}
                          autoFocus
                          style={{ width: '70px', padding: '4px', border: '1px solid #2383e2', borderRadius: '4px', outline: 'none' }}
                        />
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          ₹{b.price ? Number(b.price).toFixed(2) : '0.00'} 
                        </div>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <div style={{ width:'10px', height:'10px', borderRadius:'50%', background: b.amountInStock > 0 ? '#0f7b6c' : '#e03e3e' }}></div>
                        {b.amountInStock > 0 ? 'Available' : 'Unavailable'}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <button 
                          className="btn btn-primary" 
                          style={{ padding: '4px 10px', fontSize: '12px', borderRadius: '4px' }} 
                          onClick={() => setEditingBook(b)}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn" 
                          style={{ padding: '4px 10px', fontSize: '12px', borderRadius: '4px', background: '#e03e3e', color: 'white', border: 'none', cursor: 'pointer' }} 
                          onClick={() => handleDeleteBook(b.bookId)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Member Detailed Table View */}
        <div id="members-section" style={{ marginTop: '60px', marginBottom: '60px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: '700', margin: 0, color:'#37352f' }}>Member</h1>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <input type="text" placeholder="Search members..." value={memberSearch} onChange={e => setMemberSearch(e.target.value)} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #e0e1dd', outline: 'none', width: '250px' }} />
              <button className="btn btn-primary" onClick={() => setShowAddMember(true)}>+ Add Member</button>
            </div>
          </div>

          
          <div style={{ overflowX: 'auto', overflowY: 'auto', maxHeight: '400px' }}>
            <table className="notion-exact-table" style={{ minWidth: '800px' }}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>ID</th>
                  <th>Email</th>
                  <th>Password</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Created time</th>
                  <th>Last edited time</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(u => (
                  <tr key={u.id}>
                    <td style={{ fontWeight:'600' }}>{u.name}</td>
                    <td>{u.id}</td>
                    <td>{u.email || '-'}</td>
                    <td>{u.password || '-'}</td>
                    <td>{u.phno || '-'}</td>
                    <td>{u.address || '-'}</td>
                    <td>{new Date(u.createTime).toLocaleString()}</td>
                    <td>{new Date(u.modifyTime).toLocaleString()}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <button 
                          className="btn btn-primary" 
                          style={{ padding: '4px 10px', fontSize: '12px', borderRadius: '4px' }} 
                          onClick={() => setSelectedMemberInfo(u)}
                        >
                          Info
                        </button>
                        <button 
                          className="btn" 
                          style={{ padding: '4px 10px', fontSize: '12px', borderRadius: '4px', background: '#e03e3e', color: 'white', border: 'none', cursor: 'pointer' }} 
                          onClick={() => handleDeleteMember(u.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      {/* Member Info Modal */}
      {selectedMemberInfo && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '32px', borderRadius: '16px', width: '750px', maxWidth: '95%', maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <img 
                  src={(selectedMemberInfo.profilePic?.startsWith('http') || selectedMemberInfo.profilePic?.startsWith('data:image')) ? selectedMemberInfo.profilePic : `/avatars/${selectedMemberInfo.profilePic || 'default-avatar.png'}`} 
                  alt={selectedMemberInfo.name} 
                  style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #e0e1dd' }} 
                  onError={(e) => { e.target.src = "https://api.dicebear.com/10.x/lorelei-neutral/svg?seed=Fallback"; }}
                />
                <div>
                  <h2 style={{ margin: 0, fontSize: '26px', fontWeight: '700', color: '#1a1a1a' }}>{selectedMemberInfo.name}</h2>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                    <span style={{ fontSize: '13px', background: '#f3f4f6', color: '#4b5563', padding: '4px 10px', borderRadius: '20px', fontWeight: '500' }}>ID: #{selectedMemberInfo.id}</span>
                    <span style={{ fontSize: '13px', background: selectedMemberInfo.role === 'ADMIN' ? '#fee2e2' : '#e0e7ff', color: selectedMemberInfo.role === 'ADMIN' ? '#991b1b' : '#3730a3', padding: '4px 10px', borderRadius: '20px', fontWeight: '600' }}>{selectedMemberInfo.role}</span>
                    {selectedMemberInfo.isBlocked && <span style={{ fontSize: '13px', background: '#fecaca', color: '#dc2626', padding: '4px 10px', borderRadius: '20px', fontWeight: '600' }}>BLOCKED</span>}
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedMemberInfo(null)} style={{ background: '#f3f4f6', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#6b7280', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }} onMouseOver={(e)=>e.currentTarget.style.background='#e5e7eb'} onMouseOut={(e)=>e.currentTarget.style.background='#f3f4f6'}>✕</button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', background: '#f8f9fa', padding: '20px', borderRadius: '12px', border: '1px solid #eaeaea', marginBottom: '30px' }}>
              <div><strong style={{color:'#6b7280', fontSize:'12px', display:'block', textTransform:'uppercase', marginBottom: '4px'}}>Email Address</strong><span style={{fontSize:'15px', fontWeight:'500', color: '#111827'}}>{selectedMemberInfo.email || '-'}</span></div>
              <div><strong style={{color:'#6b7280', fontSize:'12px', display:'block', textTransform:'uppercase', marginBottom: '4px'}}>Phone Number</strong><span style={{fontSize:'15px', fontWeight:'500', color: '#111827'}}>{selectedMemberInfo.phno || '-'}</span></div>
              <div><strong style={{color:'#6b7280', fontSize:'12px', display:'block', textTransform:'uppercase', marginBottom: '4px'}}>Password</strong><span style={{fontSize:'15px', fontWeight:'500', color: '#111827', fontFamily: 'monospace'}}>{selectedMemberInfo.password || '-'}</span></div>
              <div><strong style={{color:'#6b7280', fontSize:'12px', display:'block', textTransform:'uppercase', marginBottom: '4px'}}>Subscription</strong><span style={{fontSize:'15px', fontWeight:'600', color: '#059669'}}>{selectedMemberInfo.subscription || 'FREE'}</span></div>
              <div style={{ gridColumn: '1 / -1' }}><strong style={{color:'#6b7280', fontSize:'12px', display:'block', textTransform:'uppercase', marginBottom: '4px'}}>Full Address</strong><span style={{fontSize:'15px', fontWeight:'500', color: '#111827'}}>{[selectedMemberInfo.address, selectedMemberInfo.landmark, selectedMemberInfo.city, selectedMemberInfo.state, selectedMemberInfo.pincode].filter(Boolean).join(', ') || '-'}</span></div>
              <div><strong style={{color:'#6b7280', fontSize:'12px', display:'block', textTransform:'uppercase', marginBottom: '4px'}}>Created At</strong><span style={{fontSize:'14px', fontWeight:'500', color: '#4b5563'}}>{selectedMemberInfo.createTime ? new Date(selectedMemberInfo.createTime).toLocaleString() : '-'}</span></div>
              <div><strong style={{color:'#6b7280', fontSize:'12px', display:'block', textTransform:'uppercase', marginBottom: '4px'}}>Last Modified</strong><span style={{fontSize:'14px', fontWeight:'500', color: '#4b5563'}}>{selectedMemberInfo.modifyTime ? new Date(selectedMemberInfo.modifyTime).toLocaleString() : '-'}</span></div>
              <div><strong style={{color:'#6b7280', fontSize:'12px', display:'block', textTransform:'uppercase', marginBottom: '4px'}}>Total Revenue</strong><span style={{fontSize:'18px', fontWeight:'700', color:'#0f7b6c'}}>₹
                {borrowers
                  .filter(b => b.member?.id === selectedMemberInfo.id)
                  .reduce((sum, b) => sum + ((b.book?.price || 0) * (b.rentDays || 0)), 0)
                  .toFixed(2)}
              </span></div>
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#37352f' }}>Borrow History</h3>
            <table className="notion-exact-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th style={{padding: '12px', textAlign:'left'}}>Book</th>
                  <th style={{padding: '12px', textAlign:'left'}}>Borrow Date</th>
                  <th style={{padding: '12px', textAlign:'left'}}>Return Date</th>
                  <th style={{padding: '12px', textAlign:'left'}}>Status</th>
                </tr>
              </thead>
              <tbody>
                {borrowers.filter(b => b.member?.id === selectedMemberInfo.id).map(b => (
                  <tr key={b.id} style={{borderBottom: '1px solid #eee'}}>
                    <td style={{padding: '12px', fontWeight:'500'}}>{b.book?.bookName}</td>
                    <td style={{padding: '12px'}}>{b.borrowDate || '-'}</td>
                    <td style={{padding: '12px'}}>{b.returnDate || '-'}</td>
                    <td style={{padding: '12px'}}>
                      {b.status === 'Returned' ? 
                        <span style={{ color: '#10b981', fontWeight: '600', fontSize:'13px' }}>Returned</span> : 
                        <span style={{ color: '#eaaa08', fontWeight: '600', fontSize:'13px' }}>Active</span>}
                    </td>
                  </tr>
                ))}
                {borrowers.filter(b => b.member?.id === selectedMemberInfo.id).length === 0 && (
                  <tr><td colSpan="4" style={{ textAlign: 'center', color: '#999', padding: '20px' }}>No borrow history found for this member.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmModal.show && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
          <div style={{ background: '#fff', padding: '32px', borderRadius: '12px', width: '400px', maxWidth: '90%', textAlign: 'center' }}>
            <h2 style={{ margin: '0 0 16px 0', fontSize: '20px', fontWeight: '700', color: '#1a1a1a' }}>{confirmModal.title}</h2>
            <p style={{ margin: '0 0 32px 0', color: '#666', lineHeight: '1.5' }}>{confirmModal.message}</p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <button 
                className="btn" 
                style={{ padding: '8px 24px', borderRadius: '8px', background: '#f0f0f0', color: '#333', border: 'none', cursor: 'pointer', fontWeight: '600' }} 
                onClick={() => setConfirmModal({ show: false, title: '', message: '', onConfirm: null })}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                style={{ padding: '8px 24px', borderRadius: '8px', background: confirmModal.title.includes('Delete') || confirmModal.title.includes('Reset') ? '#e03e3e' : '#10b981', color: 'white', border: 'none', cursor: 'pointer', fontWeight: '600' }} 
                onClick={confirmModal.onConfirm}
                disabled={isConfirming}
              >
                {isConfirming === true ? <><Loader2 className="animate-spin" size={16} style={{ display: 'inline', marginRight: '6px' }}/> Processing...</> : isConfirming === 'success' ? 'Done!' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
      {showCategoriesModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, animation: 'fadeIn 0.2s ease-out' }}>
          <div style={{ background: '#fff', padding: '32px', borderRadius: '16px', width: '400px', maxWidth: '95%', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', border: '1px solid rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#1a1a1a' }}>Categories</h2>
              <button type="button" onClick={() => setShowCategoriesModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#999', fontSize: '18px', padding: '4px' }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto' }}>
              {uniqueCategories.length > 0 ? uniqueCategories.map(cat => (
                <div key={cat} style={{ padding: '12px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #eaeaea', fontWeight: '500' }}>
                  {cat}
                </div>
              )) : <p>No categories found.</p>}
            </div>
          </div>
        </div>
      )}

      {showStaffModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, animation: 'fadeIn 0.2s ease-out' }}>
          <div style={{ background: '#fff', padding: '32px', borderRadius: '16px', width: '600px', maxWidth: '95%', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', border: '1px solid rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#1a1a1a' }}>Staff & Admins</h2>
              <button type="button" onClick={() => setShowStaffModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#999', fontSize: '18px', padding: '4px' }}>✕</button>
            </div>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <table className="notion-exact-table" style={{ width: '100%' }}>
                <thead><tr><th>Name</th><th>Email</th><th>Role</th></tr></thead>
                <tbody>
                  {users.filter(u => u.role === 'ADMIN' || u.role === 'STAFF').map(u => (
                    <tr key={u.id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td><span style={{ fontSize: '12px', background: '#fee2e2', color: '#991b1b', padding: '2px 8px', borderRadius: '12px', fontWeight: '600' }}>{u.role}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {showReportsModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, animation: 'fadeIn 0.2s ease-out' }}>
          <div style={{ background: '#fff', padding: '32px', borderRadius: '16px', width: '500px', maxWidth: '95%', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', border: '1px solid rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#1a1a1a' }}>System Reports</h2>
              <button type="button" onClick={() => setShowReportsModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#999', fontSize: '18px', padding: '4px' }}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ padding: '20px', background: '#f8f9fa', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '13px', color: '#666', fontWeight: '500' }}>Total Books</div>
                <div style={{ fontSize: '28px', fontWeight: '700', color: '#344e41', marginTop: '8px' }}>{books.length}</div>
              </div>
              <div style={{ padding: '20px', background: '#f8f9fa', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '13px', color: '#666', fontWeight: '500' }}>Total Members</div>
                <div style={{ fontSize: '28px', fontWeight: '700', color: '#344e41', marginTop: '8px' }}>{users.length}</div>
              </div>
              <div style={{ padding: '20px', background: '#f8f9fa', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '13px', color: '#666', fontWeight: '500' }}>Active Rentals</div>
                <div style={{ fontSize: '28px', fontWeight: '700', color: '#344e41', marginTop: '8px' }}>{borrowers.filter(b => b.status !== 'Returned').length}</div>
              </div>
              <div style={{ padding: '20px', background: '#f8f9fa', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '13px', color: '#666', fontWeight: '500' }}>Returned Books</div>
                <div style={{ fontSize: '28px', fontWeight: '700', color: '#344e41', marginTop: '8px' }}>{borrowers.filter(b => b.status === 'Returned').length}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showReturnsModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, animation: 'fadeIn 0.2s ease-out' }}>
          <div style={{ background: '#fff', padding: '32px', borderRadius: '16px', width: '800px', maxWidth: '95%', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', border: '1px solid rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#1a1a1a' }}>Manage Returns</h2>
              <button type="button" onClick={() => setShowReturnsModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#999', fontSize: '18px', padding: '4px' }}>✕</button>
            </div>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <table className="notion-exact-table" style={{ width: '100%' }}>
                <thead><tr><th>Member</th><th>Book</th><th>Borrowed On</th><th>Action</th></tr></thead>
                <tbody>
                  {borrowers.filter(b => b.status !== 'Returned').map(b => (
                    <tr key={b.id}>
                      <td style={{ fontWeight: '600' }}>{b.member?.name}</td>
                      <td>{b.book?.bookName}</td>
                      <td>{b.borrowDate}</td>
                      <td>
                        <button 
                          className="btn btn-primary" 
                          style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '6px', background: '#10b981', border: 'none' }}
                          onClick={() => {
                            setShowReturnsModal(false);
                            handleMarkReturned(b.id);
                          }}
                        >
                          Mark Returned
                        </button>
                      </td>
                    </tr>
                  ))}
                  {borrowers.filter(b => b.status !== 'Returned').length === 0 && <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#999' }}>All books have been returned!</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      </div>
    </div>
  );
}
