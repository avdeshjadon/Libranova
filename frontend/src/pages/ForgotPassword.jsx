import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Mail, KeyRound, Lock } from 'lucide-react';

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      const res = await axios.post('/api/users/forgot-password', { email });
      setStep(2);
      setMessage(res.data.message || 'OTP sent successfully to your email.');
    } catch (err) {
      setError(err.response?.data || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await axios.post('/api/users/verify-otp', { email, otp });
      setMessage('');
      setStep(3);
    } catch (err) {
      setError(err.response?.data || 'Invalid OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await axios.post('/api/users/reset-password', { email, otp, newPassword });
      setMessage("Password reset successfully! Redirecting to login...");
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '20px' }}>
      
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
        
        <div style={{ padding: '50px 40px', background: '#f8f9fa', width: '100%' }}>
          
          <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#588157', textDecoration: 'none', fontWeight: '600', fontSize: '14px', marginBottom: '30px' }}>
            <ArrowLeft size={16} /> Back to Login
          </Link>

          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#3a5a40' }}>Reset Password</h2>
            <p style={{ color: '#588157', fontSize: '15px', marginTop: '8px' }}>
              {step === 1 && "Enter your email to receive an OTP"}
              {step === 2 && "Enter the 6-digit OTP sent to your email"}
              {step === 3 && "Create a new strong password"}
            </p>
          </div>

          {error && <div style={{ background: '#ef4444', color: '#fff', padding: '12px', borderRadius: '8px', marginBottom: '24px', fontSize: '14px', textAlign: 'center', fontWeight: '500' }}>{error}</div>}
          {message && <div style={{ background: '#10b981', color: '#fff', padding: '12px', borderRadius: '8px', marginBottom: '24px', fontSize: '14px', textAlign: 'center', fontWeight: '500' }}>{message}</div>}

          {step === 1 && (
            <form onSubmit={handleSendOtp}>
              <div style={{ marginBottom: '30px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#344e41', marginBottom: '8px' }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} color="#588157" style={{ position: 'absolute', top: '15px', left: '16px' }} />
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    placeholder="john@example.com"
                    style={{ width: '100%', padding: '14px 16px 14px 44px', borderRadius: '10px', border: '1px solid #ced4da', fontSize: '15px', outline: 'none', transition: 'border-color 0.2s', background: '#fff' }}
                    onFocus={(e) => e.target.style.borderColor = '#588157'}
                    onBlur={(e) => e.target.style.borderColor = '#ced4da'}
                  />
                </div>
              </div>
              <button 
                type="submit" 
                disabled={loading}
                style={{ width: '100%', padding: '14px', background: '#588157', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s', boxShadow: '0 4px 12px rgba(88, 129, 87, 0.3)' }}
                onMouseOver={(e) => e.target.style.background = '#3a5a40'}
                onMouseOut={(e) => e.target.style.background = '#588157'}
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOtp}>
              <div style={{ marginBottom: '30px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#344e41', marginBottom: '8px' }}>6-Digit OTP</label>
                <div style={{ position: 'relative' }}>
                  <KeyRound size={18} color="#588157" style={{ position: 'absolute', top: '15px', left: '16px' }} />
                  <input 
                    type="text" 
                    value={otp} 
                    onChange={(e) => setOtp(e.target.value)} 
                    required 
                    maxLength={6}
                    placeholder="Enter OTP here"
                    style={{ width: '100%', padding: '14px 16px 14px 44px', borderRadius: '10px', border: '1px solid #ced4da', fontSize: '15px', outline: 'none', transition: 'border-color 0.2s', background: '#fff', letterSpacing: '2px', fontWeight: '600' }}
                    onFocus={(e) => e.target.style.borderColor = '#588157'}
                    onBlur={(e) => e.target.style.borderColor = '#ced4da'}
                  />
                </div>
              </div>
              <button 
                type="submit" 
                disabled={loading}
                style={{ width: '100%', padding: '14px', background: '#588157', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s', boxShadow: '0 4px 12px rgba(88, 129, 87, 0.3)' }}
                onMouseOver={(e) => e.target.style.background = '#3a5a40'}
                onMouseOut={(e) => e.target.style.background = '#588157'}
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleResetPassword}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#344e41', marginBottom: '8px' }}>New Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} color="#588157" style={{ position: 'absolute', top: '15px', left: '16px' }} />
                  <input 
                    type="password" 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    required 
                    placeholder="Create a strong password"
                    style={{ width: '100%', padding: '14px 16px 14px 44px', borderRadius: '10px', border: '1px solid #ced4da', fontSize: '15px', outline: 'none', transition: 'border-color 0.2s', background: '#fff' }}
                    onFocus={(e) => e.target.style.borderColor = '#588157'}
                    onBlur={(e) => e.target.style.borderColor = '#ced4da'}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '30px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#344e41', marginBottom: '8px' }}>Confirm New Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} color="#588157" style={{ position: 'absolute', top: '15px', left: '16px' }} />
                  <input 
                    type="password" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    required 
                    placeholder="Confirm password"
                    style={{ width: '100%', padding: '14px 16px 14px 44px', borderRadius: '10px', border: '1px solid #ced4da', fontSize: '15px', outline: 'none', transition: 'border-color 0.2s', background: '#fff' }}
                    onFocus={(e) => e.target.style.borderColor = '#588157'}
                    onBlur={(e) => e.target.style.borderColor = '#ced4da'}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                style={{ width: '100%', padding: '14px', background: '#588157', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s', boxShadow: '0 4px 12px rgba(88, 129, 87, 0.3)' }}
                onMouseOver={(e) => e.target.style.background = '#3a5a40'}
                onMouseOut={(e) => e.target.style.background = '#588157'}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
