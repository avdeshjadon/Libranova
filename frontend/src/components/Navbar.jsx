import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, LogOut, BookOpen, ChevronDown, Settings } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState('account');
  const [adminSettingsForm, setAdminSettingsForm] = useState({ name: '', email: '', password: '' });
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const openSettings = () => {
    if(user) setAdminSettingsForm({ name: user.name || '', email: user.email || '', password: '' });
    setShowSettingsModal(true);
  };

  const handleUpdateAdminProfile = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8081/api/users/${user.id}`, adminSettingsForm);
      alert("Admin profile updated successfully! Please re-login if you changed your email or password.");
      if (adminSettingsForm.password || adminSettingsForm.email !== user.email) {
         window.location.href = '/login';
      } else {
         setShowSettingsModal(false);
      }
    } catch(err) {
      alert("Failed to update profile: " + (err.response?.data || err.message));
    }
  };

  const handleDownloadAllData = async () => {
    try {
      const [usersRes, booksRes, borrowRes] = await Promise.all([
        axios.get('http://localhost:8081/api/admin/users'),
        axios.get('http://localhost:8081/api/books'),
        axios.get('http://localhost:8081/api/borrow')
      ]);
      const data = { users: usersRes.data, books: booksRes.data, borrowers: borrowRes.data };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `libranova_admin_data_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("Failed to download data");
    }
  };

  const handleDeleteAllData = async () => {
    try {
      await axios.delete('http://localhost:8081/api/admin/data/all');
      setShowConfirmDelete(false);
      alert("All data deleted successfully!");
      window.location.reload();
    } catch(err) {
      alert("Failed to delete data: " + (err.response?.data || err.message));
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="container nav-content" style={{ padding: "0 40px" }}>
        <Link to="/" className="nav-brand">
          <img src="/icon.svg" alt="Libranova Logo" style={{ height: "28px", width: "auto" }} />
          <span>Libranova</span>
        </Link>

        {/* Center: Links & Dropdown */}
        <div className="nav-links-center">
          <Link to="/" className="nav-link">
            Home
          </Link>

          <div className="dropdown">
            <div
              className="nav-link"
              style={{ display: "flex", alignItems: "center", gap: "4px" }}
            >
              Categories <ChevronDown size={16} />
            </div>
            <div className="dropdown-content">
              <Link to="/">Programming & Tech</Link>
              <Link to="/">Business & Economics</Link>
              <Link to="/">Fiction & Literature</Link>
              <Link to="/">Sci-Fi & Fantasy</Link>
              <Link to="/">Self-Help</Link>
            </div>
          </div>

          <Link to="/" className="nav-link">
            About
          </Link>
        </div>

        {/* Right: Actions */}
        <div className="nav-actions">
          {user ? (
            <>


              {user.role === "ADMIN" ? (
                <>
                  <button onClick={openSettings} style={{ background: 'transparent', border: 'none', color: '#344e41', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '8px', borderRadius: '50%' }} title="Admin Settings">
                    <Settings size={22} />
                  </button>
                  <Link
                    to="/admin"
                    className="nav-btn"
                    style={{ background: "#a3b18a", color: "#344e41" }}
                  >
                    <span>Admin Panel</span>
                  </Link>
                </>
              ) : (
                <Link to="/cart" className="nav-btn">
                  <BookOpen size={18} />
                  <span>My Rentals</span>
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="nav-btn"
                style={{ color: "#ef4444" }}
              >
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="nav-btn"
                style={{ border: "1px solid #588157" }}
              >
                Log in
              </Link>
              <Link to="/register" className="nav-btn nav-btn-primary">
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>

      {/* Settings Modal (Sidebar Layout) */}
      {showSettingsModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, animation: 'fadeIn 0.2s ease-out' }}>
          <div style={{ background: '#fff', borderRadius: '16px', width: '800px', maxWidth: '95%', height: '500px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', border: '1px solid rgba(0,0,0,0.05)', display: 'flex', overflow: 'hidden' }}>
            
            {/* Sidebar */}
            <div style={{ width: '250px', background: '#f8f9fa', borderRight: '1px solid #e9ecef', padding: '24px 0', display: 'flex', flexDirection: 'column' }}>
              <h2 style={{ padding: '0 24px', margin: '0 0 24px 0', fontSize: '18px', color: '#1a1a1a', fontWeight: '700' }}>Settings</h2>
              
              <button 
                onClick={() => setActiveSettingsTab('account')}
                style={{ background: activeSettingsTab === 'account' ? '#eef2ff' : 'transparent', border: 'none', color: activeSettingsTab === 'account' ? '#4f46e5' : '#4b5563', padding: '12px 24px', textAlign: 'left', cursor: 'pointer', fontSize: '15px', fontWeight: '500', borderRight: activeSettingsTab === 'account' ? '3px solid #4f46e5' : '3px solid transparent', transition: 'all 0.2s' }}>
                Account Settings
              </button>
              <button 
                onClick={() => setActiveSettingsTab('data')}
                style={{ background: activeSettingsTab === 'data' ? '#eef2ff' : 'transparent', border: 'none', color: activeSettingsTab === 'data' ? '#4f46e5' : '#4b5563', padding: '12px 24px', textAlign: 'left', cursor: 'pointer', fontSize: '15px', fontWeight: '500', borderRight: activeSettingsTab === 'data' ? '3px solid #4f46e5' : '3px solid transparent', transition: 'all 0.2s' }}>
                Data Management
              </button>
            </div>

            {/* Content Area */}
            <div style={{ flex: 1, padding: '32px', overflowY: 'auto', position: 'relative' }}>
              <button type="button" onClick={() => setShowSettingsModal(false)} style={{ position: 'absolute', top: '24px', right: '24px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#999', fontSize: '18px', padding: '4px' }}>✕</button>
              
              {activeSettingsTab === 'account' && (
                <div>
                  <h3 style={{ margin: '0 0 24px 0', fontSize: '20px', color: '#1a1a1a' }}>Account Settings</h3>
                  <form onSubmit={handleUpdateAdminProfile}>
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '14px', color: '#4b5563', marginBottom: '8px', fontWeight: '500' }}>Admin Name</label>
                      <input className="form-control" value={adminSettingsForm.name} onChange={e=>setAdminSettingsForm({...adminSettingsForm, name: e.target.value})} required style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }} />
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '14px', color: '#4b5563', marginBottom: '8px', fontWeight: '500' }}>Admin Email (Username)</label>
                      <input type="email" className="form-control" value={adminSettingsForm.email} onChange={e=>setAdminSettingsForm({...adminSettingsForm, email: e.target.value})} required style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }} />
                    </div>
                    <div style={{ marginBottom: '24px' }}>
                      <label style={{ display: 'block', fontSize: '14px', color: '#4b5563', marginBottom: '8px', fontWeight: '500' }}>New Password (leave blank to keep current)</label>
                      <input type="password" className="form-control" placeholder="Enter new password" value={adminSettingsForm.password} onChange={e=>setAdminSettingsForm({...adminSettingsForm, password: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                      <button type="submit" className="btn btn-primary" style={{ padding: '12px 24px', borderRadius: '8px', fontWeight: '600', background: '#344e41', color: '#fff', border: 'none', cursor: 'pointer' }}>Update Profile</button>
                    </div>
                  </form>
                </div>
              )}

              {activeSettingsTab === 'data' && (
                <div>
                  <h3 style={{ margin: '0 0 24px 0', fontSize: '20px', color: '#1a1a1a' }}>Data Management</h3>
                  
                  <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#374151' }}>Export System Data</h4>
                    <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#6b7280' }}>Download a complete JSON backup of all books, members, and borrowing records.</p>
                    <button onClick={handleDownloadAllData} style={{ background: '#fff', border: '1px solid #d1d5db', padding: '10px 20px', borderRadius: '8px', color: '#374151', fontWeight: '600', cursor: 'pointer' }}>
                      ⬇ Download Data
                    </button>
                  </div>

                  <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '20px' }}>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#991b1b' }}>Danger Zone</h4>
                    <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#b91c1c' }}>Permanently erase all system data. Admin accounts will be preserved.</p>
                    <button onClick={() => setShowConfirmDelete(true)} style={{ background: '#dc2626', border: 'none', padding: '10px 20px', borderRadius: '8px', color: '#fff', fontWeight: '600', cursor: 'pointer' }}>
                      ⚠ Delete All Data
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {showConfirmDelete && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000 }}>
          <div style={{ background: '#fff', padding: '32px', borderRadius: '16px', width: '90%', maxWidth: '400px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ margin: '0 0 16px 0', fontSize: '24px', color: '#dc2626', display: 'flex', alignItems: 'center', gap: '8px' }}>
              ⚠ Confirm Deletion
            </h2>
            <p style={{ color: '#4b5563', fontSize: '15px', lineHeight: '1.5', marginBottom: '24px' }}>
              Are you absolutely sure you want to delete all system data? This action <strong>cannot be undone</strong>.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button type="button" style={{ background: '#f0f0f0', color: '#333', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', border: 'none', cursor: 'pointer' }} onClick={() => setShowConfirmDelete(false)}>Cancel</button>
              <button type="button" style={{ background: '#dc2626', color: '#fff', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', border: 'none', cursor: 'pointer' }} onClick={handleDeleteAllData}>Yes, Erase Everything</button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}
