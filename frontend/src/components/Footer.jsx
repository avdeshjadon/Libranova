import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ background: '#344e41', color: '#dad7cd', padding: '60px 40px 20px', marginTop: '60px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', marginBottom: '40px' }}>
        
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: '#a3b18a' }}>
            <img src="/footer-icon.svg" alt="Libranova Logo" style={{ height: "30px", width: "auto" }} /> Libranova
          </div>
          <p style={{ color: '#dad7cd', lineHeight: '1.6', fontSize: '15px' }}>
            Your ultimate destination for premium e-books. We provide the best collection of programming, fiction, and business books at the best prices.
          </p>
        </div>

        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: '#e0e1dd' }}>Quick Links</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li><Link to="/" style={{ color: '#dad7cd', textDecoration: 'none', transition: 'color 0.2s' }}>Home</Link></li>
            <li><Link to="/cart" style={{ color: '#dad7cd', textDecoration: 'none', transition: 'color 0.2s' }}>My Cart</Link></li>
            <li><Link to="/login" style={{ color: '#dad7cd', textDecoration: 'none', transition: 'color 0.2s' }}>Login</Link></li>
            <li><Link to="/register" style={{ color: '#dad7cd', textDecoration: 'none', transition: 'color 0.2s' }}>Register</Link></li>
          </ul>
        </div>

        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: '#e0e1dd' }}>Categories</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li style={{ color: '#dad7cd' }}>Programming & Tech</li>
            <li style={{ color: '#dad7cd' }}>Business & Economics</li>
            <li style={{ color: '#dad7cd' }}>Fiction & Literature</li>
            <li style={{ color: '#dad7cd' }}>Sci-Fi & Fantasy</li>
          </ul>
        </div>

        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: '#e0e1dd' }}>Contact Us</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li style={{ color: '#dad7cd' }}>📍 123 Library Street, Green City</li>
            <li style={{ color: '#dad7cd' }}>📞 +91 98765 43210</li>
            <li style={{ color: '#dad7cd' }}>✉️ support@libranova.com</li>
          </ul>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', borderTop: '1px solid #588157', paddingTop: '20px', textAlign: 'center', color: '#a3b18a', fontSize: '14px' }}>
        <p>&copy; {new Date().getFullYear()} Libranova. All rights reserved.</p>
      </div>
    </footer>
  );
}
