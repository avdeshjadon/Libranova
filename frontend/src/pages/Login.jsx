import { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { auth, googleProvider, githubProvider } from '../config/firebase';
import { signInWithPopup } from 'firebase/auth';
import { Loader2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOAuthSubmitting, setIsOAuthSubmitting] = useState(null);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleOAuth = async (providerName) => {
    setIsOAuthSubmitting(providerName);
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
      if (response.data.role === 'ADMIN') navigate('/admin');
      else navigate('/');
    } catch (err) {
      console.error(err);
      setError(`${providerName} login failed.`);
    } finally {
      setIsOAuthSubmitting(null);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.post('/api/users/login', { email, password });
      login(response.data);
      if (response.data.role === 'ADMIN') navigate('/admin');
      else navigate('/');
    } catch (err) {
      setError(err.response?.data || 'Invalid credentials');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '20px' }}>
      
      {/* Rectangular Wide Container */}
      <div style={{ 
        display: 'flex', 
        width: '100%', 
        maxWidth: '450px', 
        background: '#fff', 
        borderRadius: '20px', 
        overflow: 'hidden', 
        boxShadow: '0 20px 40px rgba(52, 78, 65, 0.15)',
        border: '1px solid rgba(163, 177, 138, 0.3)'
      }}>
        
        {/* Form Container */}
        <div style={{ padding: '50px 40px', background: '#f8f9fa', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#344e41' }}>Password</label>
                <Link to="/forgot-password" style={{ fontSize: '13px', color: '#588157', fontWeight: '600', textDecoration: 'none' }}>Forgot Password?</Link>
              </div>
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
              disabled={isSubmitting}
              style={{ width: '100%', padding: '14px', background: '#588157', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: '600', cursor: isSubmitting ? 'not-allowed' : 'pointer', transition: 'background 0.2s', boxShadow: '0 4px 12px rgba(88, 129, 87, 0.3)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
              onMouseOver={(e) => { if (!isSubmitting) e.target.style.background = '#3a5a40'; }}
              onMouseOut={(e) => { if (!isSubmitting) e.target.style.background = '#588157'; }}
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : null}
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0' }}>
            <div style={{ flex: 1, height: '1px', background: '#ced4da' }}></div>
            <span style={{ padding: '0 12px', color: '#6c757d', fontSize: '14px', fontWeight: '500' }}>Or continue with</span>
            <div style={{ flex: 1, height: '1px', background: '#ced4da' }}></div>
          </div>

          <div style={{ display: 'flex', gap: '16px', marginBottom: '10px' }}>
            <button 
              type="button"
              onClick={() => handleOAuth('GOOGLE')}
              disabled={isOAuthSubmitting === 'GOOGLE'}
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', background: '#fff', color: '#333', border: '1px solid #ced4da', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: isOAuthSubmitting === 'GOOGLE' ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}
              onMouseOver={(e) => { if (isOAuthSubmitting !== 'GOOGLE') { e.target.style.background = '#f8f9fa'; e.target.style.borderColor = '#adb5bd'; } }}
              onMouseOut={(e) => { if (isOAuthSubmitting !== 'GOOGLE') { e.target.style.background = '#fff'; e.target.style.borderColor = '#ced4da'; } }}
            >
              {isOAuthSubmitting === 'GOOGLE' ? <Loader2 className="animate-spin" size={20} /> : <FcGoogle size={20} style={{ pointerEvents: 'none' }} />} Google
            </button>
            <button 
              type="button"
              onClick={() => handleOAuth('GITHUB')}
              disabled={isOAuthSubmitting === 'GITHUB'}
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', background: '#fff', color: '#333', border: '1px solid #ced4da', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: isOAuthSubmitting === 'GITHUB' ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}
              onMouseOver={(e) => { if (isOAuthSubmitting !== 'GITHUB') { e.target.style.background = '#f8f9fa'; e.target.style.borderColor = '#adb5bd'; } }}
              onMouseOut={(e) => { if (isOAuthSubmitting !== 'GITHUB') { e.target.style.background = '#fff'; e.target.style.borderColor = '#ced4da'; } }}
            >
              {isOAuthSubmitting === 'GITHUB' ? <Loader2 className="animate-spin" size={18} /> : <FaGithub color="#333" size={18} style={{ pointerEvents: 'none' }} />} GitHub
            </button>
          </div>

          <p style={{ textAlign: 'center', marginTop: '28px', fontSize: '14px', color: '#588157' }}>
            Don't have an account? <Link to="/register" style={{ color: '#3a5a40', fontWeight: '700', textDecoration: 'none' }}>Create one</Link>
          </p>
        </div>

      </div>
    </div>
  );
}
