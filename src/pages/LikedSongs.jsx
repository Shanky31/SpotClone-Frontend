import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Play } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CardSkeleton = () => (
  <div className="card">
    <div className="skeleton" style={{ width: '100%', aspectRatio: '1/1' }}></div>
    <div className="skeleton" style={{ width: '70%', height: '20px', marginTop: '12px' }}></div>
    <div className="skeleton" style={{ width: '40%', height: '14px', marginTop: '8px' }}></div>
  </div>
);

export default function LikedSongs({ setCurrentSong }) {
  const [musics, setMusics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchLikedMusic = async () => {
      try {
        const userId = user?.id || user?._id || 'me';
        const res = await api.get(`/music/liked-music/${userId}`);
        setMusics(res.data.list || []);
      } catch (err) {
        setError('Failed to fetch liked music');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchLikedMusic();
    }
  }, [user]);

  if (error) return <div className="text-danger flex justify-center mt-12">{error}</div>;

  return (
    <div className="animate-fade-in">
      <h1 className="h1">Liked Songs</h1>
      <p className="text-secondary mb-8">All your favorite tracks in one place.</p>

      <div className="grid grid-cols-auto gap-4">
        {loading ? (
          Array(4).fill(0).map((_, i) => <CardSkeleton key={i} />)
        ) : musics.length === 0 ? (
          <div className="glass-panel" style={{ padding: 48, marginTop: 20, textAlign: 'center', gridColumn: '1 / -1' }}>
            <p className="text-secondary">You haven't liked any music yet.</p>
          </div>
        ) : (
          musics.map((music) => (
            <div 
              key={music._id || music.id} 
              className="card group"
              onClick={() => setCurrentSong(music)}
            >
              <div style={{ position: 'relative' }}>
                <img 
                  src={music.thumbnailImage || music.coverUrl || music.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"} 
                  alt={music.name || music.title} 
                  style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', borderRadius: 4 }} 
                />
                
                {/* Play Button Overlay */}
                <div style={{
                  position: 'absolute', bottom: 8, right: 8, 
                  backgroundColor: 'var(--accent)', color: '#000', 
                  borderRadius: '50%', padding: 12, 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: 0, transform: 'translateY(10px)', transition: 'all 0.3s ease',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.5)'
                }}
                className="group-hover:opacity-100 group-hover:translate-y-0"
                >
                  <Play size={20} style={{ marginLeft: 2, pointerEvents: 'none' }} />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-primary truncate" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {music.name || music.title}
                </h3>
                <p className="text-sm text-secondary truncate">
                  {music.artist?.userName || music.artistName || 'Unknown Artist'}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
