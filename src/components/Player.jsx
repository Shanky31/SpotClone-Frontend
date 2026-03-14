import { useEffect, useRef, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';

export default function Player({ currentSong }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (currentSong && audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [currentSong]);

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
        {currentSong.thumbnailImage ? (
          <img src={currentSong.thumbnailImage} alt="Cover" style={{width: 56, height: 56, borderRadius: 4, objectFit: 'cover'}} />
        ) : (
          <div style={{width: 56, height: 56, backgroundColor: '#27272a', borderRadius: 4}} />
        )}
        <div className="flex-col">
          <span className="font-semibold text-primary">{currentSong.name || currentSong.title}</span>
          <span className="text-sm text-gray">{currentSong.artist?.name || currentSong.artistName || 'Unknown Artist'}</span>
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

      <div className="flex items-center justify-end gap-2 text-gray" style={{width: '30%'}}>
        <Volume2 size={20} />
      </div>
    </div>
  );
}
