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
            <li><Link to="/cart" style={{ color: '#dad7cd', textDecoration: 'none', transition: 'color 0.2s' }}>My Rentals</Link></li>
            <li><Link to="/login" style={{ color: '#dad7cd', textDecoration: 'none', transition: 'color 0.2s' }}>Login</Link></li>
            <li><Link to="/register" style={{ color: '#dad7cd', textDecoration: 'none', transition: 'color 0.2s' }}>Register</Link></li>
          </ul>
        </div>

        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: '#e0e1dd' }}>Categories</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li><Link to="/category/Programming%20%26%20Tech" style={{ color: '#dad7cd', textDecoration: 'none', transition: 'color 0.2s' }}>Programming & Tech</Link></li>
            <li><Link to="/category/Business%20%26%20Economics" style={{ color: '#dad7cd', textDecoration: 'none', transition: 'color 0.2s' }}>Business & Economics</Link></li>
            <li><Link to="/category/Fiction%20%26%20Literature" style={{ color: '#dad7cd', textDecoration: 'none', transition: 'color 0.2s' }}>Fiction & Literature</Link></li>
            <li><Link to="/category/Sci-Fi%20%26%20Fantasy" style={{ color: '#dad7cd', textDecoration: 'none', transition: 'color 0.2s' }}>Sci-Fi & Fantasy</Link></li>
          </ul>
        </div>

        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: '#e0e1dd' }}>Contact Us</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li style={{ color: '#dad7cd' }}>Connaught Place, New Delhi, India</li>
            <li><a href="tel:+916201979695" style={{ color: '#dad7cd', textDecoration: 'none', transition: 'color 0.2s' }}>+91 6201979695</a></li>
            <li><a href="mailto:support@libranova.com" style={{ color: '#dad7cd', textDecoration: 'none', transition: 'color 0.2s' }}>support@libranova.com</a></li>
          </ul>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', borderTop: '1px solid #588157', paddingTop: '20px', textAlign: 'center', color: '#a3b18a', fontSize: '14px' }}>
        <p>&copy; {new Date().getFullYear()} Libranova. All rights reserved.</p>
      </div>
    </footer>
  );
}
