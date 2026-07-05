import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phno: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8081/api/users/register', formData);
      navigate('/login');
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '20px' }}>
      
      {/* Rectangular Wide Container */}
      <div style={{ 
        display: 'flex', 
        width: '100%', 
        maxWidth: '900px', 
        background: '#fff', 
        borderRadius: '20px', 
        overflow: 'hidden', 
        boxShadow: '0 20px 40px rgba(52, 78, 65, 0.15)',
        border: '1px solid rgba(163, 177, 138, 0.3)'
      }}>
        
        {/* Left Side: Image Banner */}
        <div style={{ flex: 1, position: 'relative', display: 'none' }}>
          <img 
            src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=80" 
            alt="Library" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to bottom, rgba(52, 78, 65, 0.3), rgba(52, 78, 65, 0.8))' }}></div>
          <div style={{ position: 'absolute', bottom: '40px', left: '40px', right: '40px', color: '#fff' }}>
            <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '12px' }}>Join the Community</h2>
            <p style={{ color: '#dad7cd', fontSize: '16px', lineHeight: '1.5' }}>Create an account to track your reading progress and borrow books instantly.</p>
          </div>
        </div>

        {/* CSS to handle the responsive display of the left image */}
        <style>{`
          @media (min-width: 768px) {
            div[style*="flex: 1"] { display: block !important; }
          }
        `}</style>

        {/* Right Side: Form */}
        <div style={{ flex: 1, padding: '40px', background: '#f8f9fa' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', background: 'rgba(88, 129, 87, 0.1)', borderRadius: '16px', marginBottom: '12px' }}>
              <UserPlus size={28} color="#588157" />
            </div>
            <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#3a5a40' }}>Sign Up</h2>
            <p style={{ color: '#588157', fontSize: '14px', marginTop: '4px' }}>Join the library platform</p>
          </div>

          {error && <div style={{ background: '#ef4444', color: '#fff', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', textAlign: 'center', fontWeight: '500' }}>{error}</div>}

          <form onSubmit={handleRegister}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#344e41', marginBottom: '6px' }}>Full Name</label>
              <input 
                type="text" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                required 
                style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #ced4da', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s', background: '#fff' }}
                onFocus={(e) => e.target.style.borderColor = '#588157'}
                onBlur={(e) => e.target.style.borderColor = '#ced4da'}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#344e41', marginBottom: '6px' }}>Email Address</label>
              <input 
                type="email" 
                value={formData.email} 
                onChange={(e) => setFormData({...formData, email: e.target.value})} 
                required 
                style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #ced4da', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s', background: '#fff' }}
                onFocus={(e) => e.target.style.borderColor = '#588157'}
                onBlur={(e) => e.target.style.borderColor = '#ced4da'}
              />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#344e41', marginBottom: '6px' }}>Phone Number</label>
                <input 
                  type="tel" 
                  value={formData.phno} 
                  onChange={(e) => setFormData({...formData, phno: e.target.value})} 
                  required 
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #ced4da', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s', background: '#fff' }}
                  onFocus={(e) => e.target.style.borderColor = '#588157'}
                  onBlur={(e) => e.target.style.borderColor = '#ced4da'}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#344e41', marginBottom: '6px' }}>Password</label>
                <input 
                  type="password" 
                  value={formData.password} 
                  onChange={(e) => setFormData({...formData, password: e.target.value})} 
                  required 
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #ced4da', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s', background: '#fff' }}
                  onFocus={(e) => e.target.style.borderColor = '#588157'}
                  onBlur={(e) => e.target.style.borderColor = '#ced4da'}
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              style={{ width: '100%', padding: '14px', background: '#588157', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s', boxShadow: '0 4px 12px rgba(88, 129, 87, 0.3)' }}
              onMouseOver={(e) => e.target.style.background = '#3a5a40'}
              onMouseOut={(e) => e.target.style.background = '#588157'}
            >
              Create Account
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#588157' }}>
            Already have an account? <Link to="/login" style={{ color: '#3a5a40', fontWeight: '700', textDecoration: 'none' }}>Log in</Link>
          </p>
        </div>

      </div>
    </div>
  );
}
