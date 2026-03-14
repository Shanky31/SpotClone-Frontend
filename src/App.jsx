import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Player from './components/Player';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import ArtistDashboard from './pages/ArtistDashboard';
import { useAuth } from './context/AuthContext';
import { useState } from 'react';

function ProtectedRoute({ children, reqRole }) {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  
  if (reqRole && user.role !== reqRole) {
    return <Navigate to="/" />; // Redirect if not artist
  }
  return children;
}

export default function App() {
  const { user } = useAuth();
  const [currentSong, setCurrentSong] = useState(null);

  // Layout with sidebar and player wrapper
  const Layout = ({ children }) => (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <div className="topbar">
          <div className="font-semibold text-gray">
            Welcome, {user?.name || user?.email || 'User'}
          </div>
        </div>
        <div className="content-pad">
          {children}
        </div>
      </main>
      <Player currentSong={currentSong} />
    </div>
  );

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route path="/" element={
        <ProtectedRoute>
          <Layout>
            <Home setCurrentSong={setCurrentSong} />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/artist" element={
        <ProtectedRoute reqRole="artist">
          <Layout>
            <ArtistDashboard />
          </Layout>
        </ProtectedRoute>
      } />
    </Routes>
  );
}
