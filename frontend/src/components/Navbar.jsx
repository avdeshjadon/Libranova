import { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogOut, BookOpen, ChevronDown, Settings, User as UserIcon } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState('account');
  const [profileForm, setProfileForm] = useState({ name: '', email: '', phno: '', password: '', profileImage: null, profilePicString: '' });
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const defaultAvatars = [
    'https://api.dicebear.com/9.x/avataaars/svg?seed=Felix',
    'https://api.dicebear.com/9.x/avataaars/svg?seed=Aneka',
    'https://api.dicebear.com/9.x/avataaars/svg?seed=Tinkerbell',
    'https://api.dicebear.com/9.x/avataaars/svg?seed=Oliver',
    'https://api.dicebear.com/9.x/avataaars/svg?seed=Bella'
  ];

  const openSettings = () => {
    if(user) setProfileForm({ name: user.name || '', email: user.email || '', phno: user.phno || '', password: '', profileImage: null, profilePicString: '' });
    setShowSettingsModal(true);
    setShowUserDropdown(false);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', profileForm.name);
    formData.append('email', profileForm.email);
    formData.append('phno', profileForm.phno);
    if(profileForm.password) formData.append('password', profileForm.password);
    if(profileForm.profileImage) {
        formData.append('profileImage', profileForm.profileImage);
    } else if (profileForm.profilePicString) {
        formData.append('profilePicString', profileForm.profilePicString);
    }

    try {
      await axios.put(`http://localhost:8081/api/users/${user.id}/profile`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert("Profile updated successfully! Please re-login if you changed your email or password.");
      if (profileForm.password || profileForm.email !== user.email) {
         window.location.href = '/login';
      } else {
         setShowSettingsModal(false);
         // Ideally refresh user context here, but reloading is simpler for now
         window.location.reload(); 
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
          <Link to="/" className={`nav-link ${path === '/' && !showCategories ? 'active' : ''}`} onClick={() => setShowCategories(false)}>
            Home
          </Link>

          <div
            className={`nav-link ${showCategories ? 'active' : ''}`}
            style={{ display: "flex", alignItems: "center", gap: "4px" }}
            onClick={() => setShowCategories(!showCategories)}
          >
            Categories <ChevronDown size={16} style={{ transform: showCategories ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }} />
          </div>

          <Link to="/about" className={`nav-link ${path === '/about' ? 'active' : ''}`} onClick={() => setShowCategories(false)}>
            About
          </Link>
        </div>

        {/* Right: Actions */}
        <div className="nav-actions">
          {user ? (
            <div style={{ position: 'relative' }}>
              <button onClick={() => setShowUserDropdown(!showUserDropdown)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img src={user.profilePic && user.profilePic !== 'default-avatar.png' ? (user.profilePic.startsWith('http') ? user.profilePic : `/avatars/${user.profilePic}`) : `https://ui-avatars.com/api/?name=${user.name}&background=random`} style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #a3b18a' }} />
                <span style={{ fontWeight: '600', color: '#344e41' }}>{user.name}</span>
                <ChevronDown size={16} color="#344e41" />
              </button>

              {showUserDropdown && (
                <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '12px', background: '#fff', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', width: '240px', zIndex: 1000, overflow: 'hidden', border: '1px solid #eaeaea' }}>
                  
                  <div style={{ padding: '16px', borderBottom: '1px solid #eaeaea', display: 'flex', alignItems: 'center', gap: '12px', background: '#f8f9fa' }}>
                    <img src={user.profilePic && user.profilePic !== 'default-avatar.png' ? (user.profilePic.startsWith('http') ? user.profilePic : `/avatars/${user.profilePic}`) : `https://ui-avatars.com/api/?name=${user.name}&background=random`} style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }} />
                    <div>
                      <div style={{ fontWeight: '700', color: '#333', fontSize: '15px' }}>{user.name}</div>
                      <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>{user.role}</div>
                    </div>
                  </div>
                  
                  <div style={{ padding: '8px 0' }}>
                    <button onClick={openSettings} style={{ width: '100%', textAlign: 'left', padding: '12px 16px', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', color: '#444' }}>
                      <UserIcon size={18} color="#588157" /> Manage Profile
                    </button>
                    
                    {user.role === 'USER' && (
                      <Link to="/cart" onClick={() => setShowUserDropdown(false)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', color: '#444', textDecoration: 'none', fontSize: '15px' }}>
                        <BookOpen size={18} color="#588157" /> My Rentals
                      </Link>
                    )}

                    {user.role === 'ADMIN' && (
                      <Link to="/admin" onClick={() => setShowUserDropdown(false)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', color: '#444', textDecoration: 'none', fontSize: '15px' }}>
                        <BookOpen size={18} color="#588157" /> Admin Panel
                      </Link>
                    )}

                    <div style={{ borderTop: '1px solid #eaeaea', margin: '8px 0' }}></div>

                    <button onClick={handleLogout} style={{ width: '100%', textAlign: 'left', padding: '12px 16px', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', color: '#dc2626' }}>
                      <LogOut size={18} /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
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
      
      {/* Mega Menu sliding from navbar */}
      <div className={`mega-menu ${showCategories ? 'show' : ''}`}>
        <div className="mega-menu-content">
          <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '15px 40px', padding: '20px 40px', alignItems: 'center', height: '100%' }}>
              <Link to="/category/Programming%20%26%20Tech" onClick={() => setShowCategories(false)}>Programming & Tech</Link>
              <Link to="/category/Business%20%26%20Economics" onClick={() => setShowCategories(false)}>Business & Economics</Link>
              <Link to="/category/Fiction%20%26%20Literature" onClick={() => setShowCategories(false)}>Fiction & Literature</Link>
              <Link to="/category/Sci-Fi%20%26%20Fantasy" onClick={() => setShowCategories(false)}>Sci-Fi & Fantasy</Link>
              <Link to="/category/Self-Help" onClick={() => setShowCategories(false)}>Self-Help</Link>
              <Link to="/category/Biographies%20%26%20Memoirs" onClick={() => setShowCategories(false)}>Biographies & Memoirs</Link>
              <Link to="/category/History%20%26%20Politics" onClick={() => setShowCategories(false)}>History & Politics</Link>
              <Link to="/category/Health%20%26%20Wellness" onClick={() => setShowCategories(false)}>Health & Wellness</Link>
              <Link to="/category/Mystery%20%26%20Thriller" onClick={() => setShowCategories(false)}>Mystery & Thriller</Link>
              <Link to="/category/Science%20%26%20Nature" onClick={() => setShowCategories(false)}>Science & Nature</Link>
          </div>
        </div>
      </div>
    </nav>

      {/* Profile Settings Modal */}
      {showSettingsModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, animation: 'fadeIn 0.2s ease-out' }}>
          <div style={{ background: '#fff', borderRadius: '16px', width: '800px', maxWidth: '95%', height: '550px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', border: '1px solid rgba(0,0,0,0.05)', display: 'flex', overflow: 'hidden' }}>
            
            {/* Sidebar */}
            <div style={{ width: '250px', background: '#f8f9fa', borderRight: '1px solid #e9ecef', padding: '24px 0', display: 'flex', flexDirection: 'column' }}>
              <h2 style={{ padding: '0 24px', margin: '0 0 24px 0', fontSize: '18px', color: '#1a1a1a', fontWeight: '700' }}>Settings</h2>
              
              <button 
                onClick={() => setActiveSettingsTab('account')}
                style={{ background: activeSettingsTab === 'account' ? '#eef2ff' : 'transparent', border: 'none', color: activeSettingsTab === 'account' ? '#4f46e5' : '#4b5563', padding: '12px 24px', textAlign: 'left', cursor: 'pointer', fontSize: '15px', fontWeight: '500', borderRight: activeSettingsTab === 'account' ? '3px solid #4f46e5' : '3px solid transparent', transition: 'all 0.2s' }}>
                Profile Info
              </button>
              {user?.role === 'ADMIN' && (
                <button 
                  onClick={() => setActiveSettingsTab('data')}
                  style={{ background: activeSettingsTab === 'data' ? '#eef2ff' : 'transparent', border: 'none', color: activeSettingsTab === 'data' ? '#4f46e5' : '#4b5563', padding: '12px 24px', textAlign: 'left', cursor: 'pointer', fontSize: '15px', fontWeight: '500', borderRight: activeSettingsTab === 'data' ? '3px solid #4f46e5' : '3px solid transparent', transition: 'all 0.2s' }}>
                  Data Management
                </button>
              )}
            </div>

            {/* Content Area */}
            <div style={{ flex: 1, padding: '32px', overflowY: 'auto', position: 'relative' }}>
              <button type="button" onClick={() => setShowSettingsModal(false)} style={{ position: 'absolute', top: '24px', right: '24px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#999', fontSize: '18px', padding: '4px' }}>✕</button>
              
              {activeSettingsTab === 'account' && (
                <div>
                  <h3 style={{ margin: '0 0 24px 0', fontSize: '20px', color: '#1a1a1a' }}>Update Profile</h3>
                  <form onSubmit={handleUpdateProfile}>
                    
                    <div style={{ display: 'flex', gap: '24px', marginBottom: '20px' }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '14px', color: '#4b5563', marginBottom: '8px', fontWeight: '500' }}>Full Name</label>
                        <input className="form-control" value={profileForm.name} onChange={e=>setProfileForm({...profileForm, name: e.target.value})} required style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '14px', color: '#4b5563', marginBottom: '8px', fontWeight: '500' }}>Phone Number</label>
                        <input className="form-control" value={profileForm.phno} onChange={e=>setProfileForm({...profileForm, phno: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }} />
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '24px', marginBottom: '20px' }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '14px', color: '#4b5563', marginBottom: '8px', fontWeight: '500' }}>Email Address</label>
                        <input type="email" className="form-control" value={profileForm.email} onChange={e=>setProfileForm({...profileForm, email: e.target.value})} required style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '14px', color: '#4b5563', marginBottom: '8px', fontWeight: '500' }}>New Password</label>
                        <input type="password" className="form-control" placeholder="Leave blank to keep current" value={profileForm.password} onChange={e=>setProfileForm({...profileForm, password: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }} />
                      </div>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                      <label style={{ display: 'block', fontSize: '14px', color: '#4b5563', marginBottom: '8px', fontWeight: '500' }}>Profile Picture</label>
                      <div 
                        style={{ border: '2px dashed #ccc', padding: '20px', textAlign: 'center', borderRadius: '8px', cursor: 'pointer', background: '#fafafa', color: '#666', marginBottom: '16px' }}
                        onDrop={(e) => { e.preventDefault(); const file = e.dataTransfer.files[0]; if(file) setProfileForm({...profileForm, profileImage: file, profilePicString: ''}); }}
                        onDragOver={(e) => e.preventDefault()}
                        onClick={() => document.getElementById('profilePicInput').click()}
                      >
                        {profileForm.profileImage ? (
                          <span style={{ color: '#166534', fontWeight: '600' }}>Selected: {profileForm.profileImage.name}</span>
                        ) : (
                          <span>Drag and drop profile picture here, or click to browse</span>
                        )}
                        <input type="file" id="profilePicInput" hidden accept="image/*" onChange={(e) => { if(e.target.files[0]) setProfileForm({...profileForm, profileImage: e.target.files[0], profilePicString: ''}); }} />
                      </div>

                      <label style={{ display: 'block', fontSize: '14px', color: '#4b5563', marginBottom: '8px', fontWeight: '500' }}>Or choose a default avatar:</label>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        {defaultAvatars.map((avatar, idx) => (
                          <img 
                            key={idx} 
                            src={avatar} 
                            alt={`Avatar ${idx}`} 
                            style={{ 
                              width: '48px', height: '48px', borderRadius: '50%', cursor: 'pointer', objectFit: 'cover',
                              border: profileForm.profilePicString === avatar ? '3px solid #588157' : '1px solid #ccc',
                              boxShadow: profileForm.profilePicString === avatar ? '0 0 10px rgba(88,129,87,0.3)' : 'none'
                            }}
                            onClick={() => setProfileForm({...profileForm, profilePicString: avatar, profileImage: null})}
                          />
                        ))}
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                      <button type="submit" className="btn btn-primary" style={{ padding: '12px 32px', borderRadius: '8px', fontWeight: '600', background: '#344e41', color: '#fff', border: 'none', cursor: 'pointer' }}>Save Changes</button>
                    </div>
                  </form>
                </div>
              )}

              {activeSettingsTab === 'data' && user?.role === 'ADMIN' && (
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
