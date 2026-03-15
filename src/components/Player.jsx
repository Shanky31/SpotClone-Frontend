import { useEffect, useRef, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Heart } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function Player({ currentSong }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const { user } = useAuth();

  const prevSongIdRef = useRef(null);

  useEffect(() => {
    if (currentSong && audioRef.current) {
      const songId = currentSong._id || currentSong.id;
      if (prevSongIdRef.current !== songId) {
        audioRef.current.play().catch(e => console.log(e));
        setIsPlaying(true);
        prevSongIdRef.current = songId;
      }
      
      const checkLikeStatus = async () => {
        if (!user) {
           setIsLiked(false);
           return;
        }
        try {
          const userId = user.id || user._id || 'me';
          const res = await api.get(`/music/liked-music/${userId}`);
          const likedList = res.data.list || [];
          setIsLiked(likedList.some(m => (m._id || m.id) === songId));
        } catch (err) {
          console.error('Error checking like status', err);
        }
      };
      checkLikeStatus();
    }
  }, [currentSong?._id, currentSong?.id, user?.id, user?._id]);

  const toggleLike = async () => {
    if (!user) {
       toast.error("Please login to like this song");
       return;
    }
    try {
      const songId = currentSong._id || currentSong.id;
      if (isLiked) {
        await api.post(`/music/unlike/${songId}`);
        toast.success('Song unliked successfully');
        setIsLiked(false);
      } else {
        await api.post(`/music/like/${songId}`);
        toast.success('Song liked successfully');
        setIsLiked(true);
      }
    } catch (err) {
      console.error('Failed to toggle like', err);
    }
  };

  const togglePlay = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  if (!currentSong) return <div className="music-player"><p className="text-gray" style={{margin:'0 auto'}}>Select a song to play</p></div>;

  return (
    <div className="music-player">
      <audio ref={audioRef} src={currentSong.uri || currentSong.audioUrl} onEnded={() => setIsPlaying(false)} />
      
      <div className="flex items-center gap-4" style={{width: '30%'}}>

          <img src={currentSong.thumbnailImage||"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"} alt="Cover" style={{width: 56, height: 56, borderRadius: 4, objectFit: 'cover'}} />
       
        <div className="flex-col">
          <span className="font-semibold text-primary">{currentSong.name || currentSong.title}</span>
          <span className="text-sm text-gray">{currentSong.artist?.userName || currentSong.artistName || 'Unknown Artist'}</span>
        </div>
      </div>

      <div className="flex flex-col items-center" style={{width: '40%'}}>
        <div className="flex items-center gap-6">
          <button className="text-gray hover:text-white transition"><SkipBack size={20} /></button>
          <button onClick={togglePlay} style={{backgroundColor: '#fff', color: '#000', borderRadius: '50%', padding: 8}}>
            {isPlaying ? <Pause size={20} /> : <Play size={20} style={{marginLeft: 2}} />}
          </button>
          <button className="text-gray hover:text-white transition"><SkipForward size={20} /></button>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 text-gray" style={{width: '30%'}}>
        <button onClick={toggleLike} style={{outline: 'none', background: 'transparent', border: 'none', cursor: 'pointer'}}>
          <Heart size={20} className="hover:text-white transition" fill={isLiked ? 'var(--accent)' : 'none'} color={isLiked ? 'var(--accent)' : 'currentColor'} />
        </button>
        <Volume2 size={20} />
      </div>
    </div>
  );
}
