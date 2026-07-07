import { useContext, useState, useEffect, useMemo } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { User as UserIcon, Database, Loader2 } from "lucide-react";

export default function Profile() {
  const { user, login, logout } = useContext(AuthContext);
  
  const [activeSettingsTab, setActiveSettingsTab] = useState('account');
  const [profileForm, setProfileForm] = useState({ name: '', email: '', phno: '', address: '', landmark: '', city: '', state: '', pincode: '', password: '', profileImage: null, profilePicString: '' });
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [toast, setToast] = useState({ msg: '', isError: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Initialize form with user data
  useEffect(() => {
    if(user) {
      setProfileForm({ 
        name: user.name || '', 
        email: user.email || '', 
        phno: user.phno || '', 
        address: user.address || '', 
        landmark: user.landmark || '', 
        city: user.city || '', 
        state: user.state || '', 
        pincode: user.pincode || '', 
        password: '', 
        profileImage: null, 
        profilePicString: '' 
      });
    }
  }, [user]);

  const showToast = (msg, isError = false) => {
    setToast({ msg, isError });
    setTimeout(() => setToast({ msg: '', isError: false }), 3000);
  };

  const defaultAvatars = useMemo(() => {
    return Array.from({ length: 5 }, () => {
      const randomSeed = Math.random().toString(36).substring(2, 10);
      return `https://api.dicebear.com/10.x/lorelei-neutral/svg?seed=${randomSeed}`;
    });
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', profileForm.name);
    formData.append('email', profileForm.email);
    formData.append('phno', profileForm.phno);
    if(profileForm.password) formData.append('password', profileForm.password);
    formData.append('address', profileForm.address);
    formData.append('landmark', profileForm.landmark);
    formData.append('city', profileForm.city);
    formData.append('state', profileForm.state);
    formData.append('pincode', profileForm.pincode);
    if(profileForm.profileImage) {
        formData.append('profileImage', profileForm.profileImage);
    } else if (profileForm.profilePicString) {
        formData.append('profilePicString', profileForm.profilePicString);
    }

    try {
      setIsSubmitting(true);
      const res = await axios.put(`/api/users/${user.id}/profile`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const updatedUser = res.data;
      login(updatedUser);
      showToast("Profile updated successfully!");
    } catch(err) {
      showToast("Failed to update profile: " + (err.response?.data || err.message), true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadAllData = async () => {
    try {
      const [usersRes, booksRes, borrowRes] = await Promise.all([
        axios.get('/api/admin/users'),
        axios.get('/api/books'),
        axios.get('/api/borrow')
      ]);
      const data = { users: usersRes.data, books: booksRes.data, borrowers: borrowRes.data };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `libranova_admin_data_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Failed to download data");
    }
  };

  const handleDeleteAllData = async () => {
    try {
      setIsDeleting(true);
      await axios.delete('/api/admin/data/all');
      setShowConfirmDelete(false);
      alert("All data deleted successfully!");
      logout();
      window.location.href = '/login';
    } catch(err) {
      alert("Failed to delete data: " + (err.response?.data || err.message));
    } finally {
      setIsDeleting(false);
    }
  };

  if(!user) return null;

  return (
    <div style={{ minHeight: 'calc(100vh - 70px)', display: 'flex', background: '#f8f9fa' }}>
      
      {/* Sidebar */}
      <div style={{ width: '280px', background: '#fff', borderRight: '1px solid #e9ecef', padding: '32px 0', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ padding: '0 32px', margin: '0 0 32px 0', fontSize: '22px', color: '#1a1a1a', fontWeight: '700' }}>Settings</h2>
        
        <button 
          onClick={() => setActiveSettingsTab('account')}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', background: activeSettingsTab === 'account' ? 'rgba(88, 129, 87, 0.1)' : 'transparent', border: 'none', borderRight: activeSettingsTab === 'account' ? '3px solid #3a5a40' : '3px solid transparent', color: activeSettingsTab === 'account' ? '#3a5a40' : '#4b5563', padding: '16px 32px', textAlign: 'left', cursor: 'pointer', fontSize: '15px', fontWeight: '600', transition: 'all 0.2s' }}>
          <UserIcon size={18} /> Profile Info
        </button>
        
        {user?.role === 'ADMIN' && (
          <button 
            onClick={() => setActiveSettingsTab('data')}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', background: activeSettingsTab === 'data' ? 'rgba(88, 129, 87, 0.1)' : 'transparent', border: 'none', borderRight: activeSettingsTab === 'data' ? '3px solid #3a5a40' : '3px solid transparent', color: activeSettingsTab === 'data' ? '#3a5a40' : '#4b5563', padding: '16px 32px', textAlign: 'left', cursor: 'pointer', fontSize: '15px', fontWeight: '600', transition: 'all 0.2s' }}>
            <Database size={18} /> Data Management
          </button>
        )}
      </div>

      {/* Content Area */}
      <div style={{ flex: 1, padding: '48px 60px', overflowY: 'auto' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          
          {activeSettingsTab === 'account' && (
            <div>
              <h3 style={{ margin: '0 0 32px 0', fontSize: '24px', color: '#1a1a1a' }}>Update Profile</h3>
              <form onSubmit={handleUpdateProfile}>
                
                <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '14px', color: '#4b5563', marginBottom: '8px', fontWeight: '500' }}>Full Name</label>
                    <input className="form-control" value={profileForm.name} onChange={e=>setProfileForm({...profileForm, name: e.target.value})} required style={{ width: '100%', padding: '14px', border: '1px solid #d1d5db', borderRadius: '10px' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '14px', color: '#4b5563', marginBottom: '8px', fontWeight: '500' }}>Phone Number</label>
                    <input className="form-control" value={profileForm.phno} onChange={e=>setProfileForm({...profileForm, phno: e.target.value})} style={{ width: '100%', padding: '14px', border: '1px solid #d1d5db', borderRadius: '10px' }} />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '14px', color: '#4b5563', marginBottom: '8px', fontWeight: '500' }}>Email Address</label>
                    <input type="email" className="form-control" value={profileForm.email} onChange={e=>setProfileForm({...profileForm, email: e.target.value})} required style={{ width: '100%', padding: '14px', border: '1px solid #d1d5db', borderRadius: '10px' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '14px', color: '#4b5563', marginBottom: '8px', fontWeight: '500' }}>{(user?.authProvider !== 'LOCAL' && user?.authProvider != null && !user?.password) ? "Create Password" : "New Password"}</label>
                    <input type="password" className="form-control" placeholder={(user?.authProvider !== 'LOCAL' && user?.authProvider != null && !user?.password) ? "Enter a password" : "Leave blank to keep current"} value={profileForm.password} onChange={e=>setProfileForm({...profileForm, password: e.target.value})} style={{ width: '100%', padding: '14px', border: '1px solid #d1d5db', borderRadius: '10px' }} />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '14px', color: '#4b5563', marginBottom: '8px', fontWeight: '500' }}>House / PG / Hostel</label>
                    <input className="form-control" placeholder="E.g., Flat 204" value={profileForm.address} onChange={e=>setProfileForm({...profileForm, address: e.target.value})} style={{ width: '100%', padding: '14px', border: '1px solid #d1d5db', borderRadius: '10px' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '14px', color: '#4b5563', marginBottom: '8px', fontWeight: '500' }}>Nearby Area</label>
                    <input className="form-control" placeholder="E.g., Near City Mall" value={profileForm.landmark} onChange={e=>setProfileForm({...profileForm, landmark: e.target.value})} style={{ width: '100%', padding: '14px', border: '1px solid #d1d5db', borderRadius: '10px' }} />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '14px', color: '#4b5563', marginBottom: '8px', fontWeight: '500' }}>City</label>
                    <input className="form-control" value={profileForm.city} onChange={e=>setProfileForm({...profileForm, city: e.target.value})} style={{ width: '100%', padding: '14px', border: '1px solid #d1d5db', borderRadius: '10px' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '14px', color: '#4b5563', marginBottom: '8px', fontWeight: '500' }}>State</label>
                    <input className="form-control" value={profileForm.state} onChange={e=>setProfileForm({...profileForm, state: e.target.value})} style={{ width: '100%', padding: '14px', border: '1px solid #d1d5db', borderRadius: '10px' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '14px', color: '#4b5563', marginBottom: '8px', fontWeight: '500' }}>Pincode</label>
                    <input className="form-control" value={profileForm.pincode} onChange={e=>setProfileForm({...profileForm, pincode: e.target.value})} style={{ width: '100%', padding: '14px', border: '1px solid #d1d5db', borderRadius: '10px' }} />
                  </div>
                </div>

                <div style={{ marginBottom: '32px' }}>
                  <label style={{ display: 'block', fontSize: '14px', color: '#4b5563', marginBottom: '8px', fontWeight: '500' }}>Profile Picture</label>
                  <div 
                    style={{ border: '2px dashed #ccc', padding: '30px', textAlign: 'center', borderRadius: '10px', cursor: 'pointer', background: '#fafafa', color: '#666', marginBottom: '20px' }}
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

                  <label style={{ display: 'block', fontSize: '14px', color: '#4b5563', marginBottom: '12px', fontWeight: '500' }}>Or choose a default avatar:</label>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    {defaultAvatars.map((avatar, idx) => (
                      <img 
                        key={idx} 
                        src={avatar} 
                        alt={`Avatar ${idx}`} 
                        style={{ 
                          width: '56px', height: '56px', borderRadius: '50%', cursor: 'pointer', objectFit: 'cover',
                          border: profileForm.profilePicString === avatar ? '3px solid #588157' : '1px solid #ccc',
                          boxShadow: profileForm.profilePicString === avatar ? '0 0 12px rgba(88,129,87,0.4)' : 'none',
                          transition: 'all 0.2s'
                        }}
                        onClick={() => setProfileForm({...profileForm, profilePicString: avatar, profileImage: null})}
                      />
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <button type="submit" className="btn btn-primary" style={{ padding: '14px 40px', borderRadius: '10px', fontSize: '16px', fontWeight: '600', background: '#344e41', color: '#fff', border: 'none', cursor: 'pointer' }} disabled={isSubmitting}>
                    {isSubmitting ? <><Loader2 className="animate-spin" size={18} style={{ display: 'inline', marginRight: '8px' }}/> Saving...</> : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeSettingsTab === 'data' && user?.role === 'ADMIN' && (
            <div>
              <h3 style={{ margin: '0 0 32px 0', fontSize: '24px', color: '#1a1a1a' }}>Data Management</h3>
              
              <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '18px', color: '#374151' }}>Export System Data</h4>
                <p style={{ margin: '0 0 20px 0', fontSize: '15px', color: '#6b7280' }}>Download a complete JSON backup of all books, members, and borrowing records.</p>
                <button onClick={handleDownloadAllData} style={{ background: '#fff', border: '1px solid #d1d5db', padding: '12px 24px', borderRadius: '10px', color: '#374151', fontWeight: '600', cursor: 'pointer' }}>
                  ⬇ Download Data Backup
                </button>
              </div>

              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '24px' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '18px', color: '#991b1b' }}>Danger Zone</h4>
                <p style={{ margin: '0 0 20px 0', fontSize: '15px', color: '#b91c1c' }}>Permanently erase all system data. Admin accounts will be preserved.</p>
                <button onClick={() => setShowConfirmDelete(true)} style={{ background: '#dc2626', border: 'none', padding: '12px 24px', borderRadius: '10px', color: '#fff', fontWeight: '600', cursor: 'pointer' }}>
                  ⚠ Delete All Data
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

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
              <button type="button" style={{ background: '#dc2626', color: '#fff', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', border: 'none', cursor: 'pointer' }} onClick={handleDeleteAllData} disabled={isDeleting}>
                {isDeleting ? <><Loader2 className="animate-spin" size={16} style={{ display: 'inline', marginRight: '6px' }}/> Erasing...</> : 'Yes, Erase Everything'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.msg && (
        <div style={{
          position: "fixed", bottom: "30px", right: "30px",
          background: toast.isError ? "#ef4444" : "#3a5a40",
          color: "#fff", padding: "16px 24px", borderRadius: "12px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.4)", zIndex: 999999,
          display: "flex", alignItems: "center", gap: "12px",
          fontSize: "15px", fontWeight: "500", animation: "slideUpFade 0.3s ease-out forwards"
        }}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
