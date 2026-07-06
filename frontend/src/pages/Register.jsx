import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { auth, googleProvider, githubProvider } from '../config/firebase';
import { signInWithPopup } from 'firebase/auth';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phno: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleOAuth = async (providerName) => {
    try {
      const provider = providerName === 'GOOGLE' ? googleProvider : githubProvider;
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      const oauthData = {
        email: user.email,
        name: user.displayName || user.email.split('@')[0],
        profilePic: user.photoURL || 'default-avatar.png',
        authProvider: providerName,
        password: ''
      };
      
      const response = await axios.post('/api/users/oauth', oauthData);
      login(response.data);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(`${providerName} signup failed.`);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/users/register', formData);
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
        maxWidth: '550px', 
        background: '#fff', 
        borderRadius: '20px', 
        overflow: 'hidden', 
        boxShadow: '0 20px 40px rgba(52, 78, 65, 0.15)',
        border: '1px solid rgba(163, 177, 138, 0.3)'
      }}>
        
        {/* Form Container */}
        <div style={{ padding: '40px', background: '#f8f9fa', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
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

          <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0' }}>
            <div style={{ flex: 1, height: '1px', background: '#ced4da' }}></div>
            <span style={{ padding: '0 12px', color: '#6c757d', fontSize: '14px', fontWeight: '500' }}>Or sign up with</span>
            <div style={{ flex: 1, height: '1px', background: '#ced4da' }}></div>
          </div>

          <div style={{ display: 'flex', gap: '16px', marginBottom: '10px' }}>
            <button 
              type="button"
              onClick={() => handleOAuth('GOOGLE')}
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', background: '#fff', color: '#333', border: '1px solid #ced4da', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseOver={(e) => { e.target.style.background = '#f8f9fa'; e.target.style.borderColor = '#adb5bd'; }}
              onMouseOut={(e) => { e.target.style.background = '#fff'; e.target.style.borderColor = '#ced4da'; }}
            >
              <FcGoogle size={20} style={{ pointerEvents: 'none' }} /> Google
            </button>
            <button 
              type="button"
              onClick={() => handleOAuth('GITHUB')}
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', background: '#fff', color: '#333', border: '1px solid #ced4da', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseOver={(e) => { e.target.style.background = '#f8f9fa'; e.target.style.borderColor = '#adb5bd'; }}
              onMouseOut={(e) => { e.target.style.background = '#fff'; e.target.style.borderColor = '#ced4da'; }}
            >
              <FaGithub color="#333" size={18} style={{ pointerEvents: 'none' }} /> GitHub
            </button>
          </div>

          <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#588157' }}>
            Already have an account? <Link to="/login" style={{ color: '#3a5a40', fontWeight: '700', textDecoration: 'none' }}>Log in</Link>
          </p>
        </div>

      </div>
    </div>
  );
}
