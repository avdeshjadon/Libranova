import { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogOut, BookOpen, ChevronDown, User as UserIcon } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const handleLogout = () => {
    logout();
    setShowUserDropdown(false);
    navigate("/login");
  };

  useEffect(() => {
    setShowUserDropdown(false);
    setShowCategories(false);
  }, [path]);

  const [showCategories, setShowCategories] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

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
                <img src={user.profilePic && user.profilePic !== 'default-avatar.png' ? ((user.profilePic.startsWith('http') || user.profilePic.startsWith('data:image')) ? user.profilePic : `/avatars/${user.profilePic}`) : `https://ui-avatars.com/api/?name=${user.name}&background=random`} style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #a3b18a' }} />
                <span style={{ fontWeight: '600', color: '#344e41' }}>{user.name}</span>
                <ChevronDown size={16} color="#344e41" />
              </button>

              {showUserDropdown && (
                <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '12px', background: '#fff', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', width: '240px', zIndex: 1000, overflow: 'hidden', border: '1px solid #eaeaea' }}>
                  
                  <div style={{ padding: '16px', borderBottom: '1px solid #eaeaea', display: 'flex', alignItems: 'center', gap: '12px', background: '#f8f9fa' }}>
                    <img src={user.profilePic && user.profilePic !== 'default-avatar.png' ? ((user.profilePic.startsWith('http') || user.profilePic.startsWith('data:image')) ? user.profilePic : `/avatars/${user.profilePic}`) : `https://ui-avatars.com/api/?name=${user.name}&background=random`} style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }} />
                    <div>
                      <div style={{ fontWeight: '700', color: '#333', fontSize: '15px' }}>{user.name}</div>
                      <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>{user.role}</div>
                    </div>
                  </div>
                  
                  <div style={{ padding: '8px 0' }}>
                    <Link to="/profile" onClick={() => setShowUserDropdown(false)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', color: '#444', textDecoration: 'none', fontSize: '15px' }}>
                      <UserIcon size={18} color="#588157" /> Manage Profile
                    </Link>
                    
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


    </>
  );
}
