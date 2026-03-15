import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Player from './components/Player';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import LikedSongs from './pages/LikedSongs';
import ArtistDashboard from './pages/ArtistDashboard';
import { useAuth } from './context/AuthContext';
import { useState, useEffect } from 'react';
import api from './api/axios';

function ProtectedRoute({ children, reqRole }) {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  
  if (reqRole && user.role !== reqRole) {
    return <Navigate to="/" />; // Redirect if not artist
  }
  return children;
}

// Fixed Layout: Moved OUTSIDE of App component and uses Outlet for persistent rendering
const Layout = ({ currentSong, user }) => {
  const { logout } = useAuth();
  
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <div className="topbar">
          {user ? (
            <>
              <div className="font-semibold text-gray">
                Welcome, {user.name || user.userName || user.email || 'User'}
              </div>
              <button 
                onClick={() => logout()} 
                className="btn-secondary" 
                style={{padding: '8px 16px', fontSize: '0.875rem'}}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <div className="font-semibold text-gray">
                Welcome, Guest
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => window.location.href = '/register'} 
                  className="btn-secondary" 
                  style={{padding: '8px 16px', fontSize: '0.875rem', border: 'none'}}
                >
                  Sign up
                </button>
                <button 
                  onClick={() => window.location.href = '/login'} 
                  className="btn-primary" 
                  style={{padding: '8px 24px', fontSize: '0.875rem'}}
                >
                  Log in
                </button>
              </div>
            </>
          )}
        </div>
        <div className="content-pad">
          <Outlet />
        </div>
      </main>
      <Player currentSong={currentSong} />
    </div>
  );
};

export default function App() {
  const { user } = useAuth();
  const [currentSong, setCurrentSong] = useState(null);
  const [musics, setMusics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMusic = async () => {
      try {
        const res = await api.get('/music');
        setMusics(res.data.list || res.data.musics || []);
      } catch (err) {
        console.error('Failed to fetch music', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMusic();
  }, []);


  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Main Layout Wrap */}
      <Route element={<Layout currentSong={currentSong} user={user} />}>
        <Route path="/" element={
            <Home setCurrentSong={setCurrentSong} musics={musics} loading={loading} />
        } />
        
        <Route path="/liked-songs" element={
          <ProtectedRoute >
              <LikedSongs setCurrentSong={setCurrentSong} />
          </ProtectedRoute>
        } />
        
        <Route path="/artist" element={
          <ProtectedRoute reqRole="artist">
              <ArtistDashboard />
          </ProtectedRoute>
        } />
      </Route>
    </Routes>
  );
}
