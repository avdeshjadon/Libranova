import { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { BookOpen } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8081/api/users/login', { email, password });
      login(response.data);
      if (response.data.role === 'ADMIN') navigate('/admin');
      else navigate('/');
    } catch (err) {
      setError(err.response?.data || 'Invalid credentials');
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
            src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80" 
            alt="Library" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to bottom, rgba(52, 78, 65, 0.4), rgba(52, 78, 65, 0.8))' }}></div>
          <div style={{ position: 'absolute', bottom: '40px', left: '40px', right: '40px', color: '#fff' }}>
            <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '12px' }}>Welcome Back!</h2>
            <p style={{ color: '#dad7cd', fontSize: '16px', lineHeight: '1.5' }}>Log in to access your curated collection of premium e-books.</p>
          </div>
        </div>

        {/* CSS to handle the responsive display of the left image */}
        <style>{`
          @media (min-width: 768px) {
            div[style*="flex: 1"] { display: block !important; }
          }
        `}</style>

        {/* Right Side: Form */}
        <div style={{ flex: 1, padding: '50px 40px', background: '#f8f9fa' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', background: 'rgba(88, 129, 87, 0.1)', borderRadius: '16px', marginBottom: '16px' }}>
              <BookOpen size={28} color="#588157" />
            </div>
            <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#3a5a40' }}>Log In</h2>
            <p style={{ color: '#588157', fontSize: '15px', marginTop: '8px' }}>Enter your details to continue</p>
          </div>

          {error && <div style={{ background: '#ef4444', color: '#fff', padding: '12px', borderRadius: '8px', marginBottom: '24px', fontSize: '14px', textAlign: 'center', fontWeight: '500' }}>{error}</div>}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#344e41', marginBottom: '8px' }}>Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                style={{ width: '100%', padding: '14px 16px', borderRadius: '10px', border: '1px solid #ced4da', fontSize: '15px', outline: 'none', transition: 'border-color 0.2s', background: '#fff' }}
                onFocus={(e) => e.target.style.borderColor = '#588157'}
                onBlur={(e) => e.target.style.borderColor = '#ced4da'}
              />
            </div>
            
            <div style={{ marginBottom: '30px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#344e41', marginBottom: '8px' }}>Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                style={{ width: '100%', padding: '14px 16px', borderRadius: '10px', border: '1px solid #ced4da', fontSize: '15px', outline: 'none', transition: 'border-color 0.2s', background: '#fff' }}
                onFocus={(e) => e.target.style.borderColor = '#588157'}
                onBlur={(e) => e.target.style.borderColor = '#ced4da'}
              />
            </div>
            
            <button 
              type="submit" 
              style={{ width: '100%', padding: '14px', background: '#588157', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s', boxShadow: '0 4px 12px rgba(88, 129, 87, 0.3)' }}
              onMouseOver={(e) => e.target.style.background = '#3a5a40'}
              onMouseOut={(e) => e.target.style.background = '#588157'}
            >
              Sign In
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '28px', fontSize: '14px', color: '#588157' }}>
            Don't have an account? <Link to="/register" style={{ color: '#3a5a40', fontWeight: '700', textDecoration: 'none' }}>Create one</Link>
          </p>
        </div>

      </div>
    </div>
  );
}
