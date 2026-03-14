import { Link, useLocation } from 'react-router-dom';
import { Home, Music, LogOut, UploadCloud } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  return (
    <aside className="sidebar">
      <div className="flex items-center gap-4">
        {/* Spotify-like logo placeholder */}
        <div style={{width: 36, height: 36, borderRadius: '50%', backgroundColor: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <Music size={20} color="#000" />
        </div>
        <h2 className="font-semibold text-primary" style={{fontSize: '1.2rem', color: '#fff'}}>SpotClone</h2>
      </div>

      <nav className="flex-col gap-2 mt-6" style={{flex: 1}}>
        <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
          <Home size={20} />
          <span>Home</span>
        </Link>
        {user?.role === 'artist' && (
          <Link to="/artist" className={`nav-link ${location.pathname === '/artist' ? 'active' : ''}`}>
            <UploadCloud size={20} />
            <span>Studio / Upload</span>
          </Link>
        )}
      </nav>

      <div style={{marginTop: 'auto'}}>
        {user && (
          <button className="nav-link" onClick={handleLogout} style={{width: '100%', outline: 'none'}}>
            <LogOut size={20} />
            <span>Log out</span>
          </button>
        )}
      </div>
    </aside>
  );
}
