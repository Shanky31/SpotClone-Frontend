import { useState } from 'react';
import api from '../api/axios';
import { UploadCloud, CheckCircle, AlertCircle, ImageIcon } from 'lucide-react';

export default function ArtistDashboard() {
  const [file, setFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleThumbnailChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setThumbnail(selectedFile);
      setThumbnailPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !name) {
      setError('Please provide a name and select an audio file.');
      return;
    }
    
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      const formData = new FormData();
      formData.append('music', file);
      formData.append('title', name);
      if (thumbnail) {
        formData.append('thumbnailImage', thumbnail);
      }
      
      const res = await api.post('/music/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setMessage('Music uploaded successfully!');
      setFile(null);
      setThumbnail(null);
      setThumbnailPreview(null);
      setName('');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to upload music');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <h1 className="h1">Artist Studio</h1>
      <p className="text-secondary mb-8">Upload and manage your tracks here.</p>

      <div className="glass-panel" style={{maxWidth: 600, padding: 32}}>
        <h2 className="h2 mb-4">Upload New Track</h2>
        
        {message && (
          <div className="flex items-center gap-2 mb-4" style={{color: 'var(--accent)'}}>
            <CheckCircle size={20} />
            <span>{message}</span>
          </div>
        )}
        
        {error && (
          <div className="flex items-center gap-2 mb-4 text-danger">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleUpload} className="flex-col gap-6">
          <div>
            <label className="text-gray block mb-2">Track Name *</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="e.g. Midnight City" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-gray block mb-2">Thumbnail/Cover Image (Optional)</label>
            <div style={{
              border: thumbnailPreview ? 'none' : '2px dashed var(--border)', 
              borderRadius: 8, 
              padding: thumbnailPreview ? 0 : 24, 
              textAlign: 'center',
              backgroundColor: 'var(--bg-elevated)',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              height: 200,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleThumbnailChange} 
                style={{display: 'none'}} 
                id="thumbnail-upload" 
              />
              <label htmlFor="thumbnail-upload" style={{cursor: 'pointer', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12}}>
                {thumbnailPreview ? (
                  <>
                    <img src={thumbnailPreview} alt="Thumbnail preview" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                    <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.6)', padding: '8px', color: '#fff', fontSize: '0.8rem'}}>Change Image</div>
                  </>
                ) : (
                  <>
                    <ImageIcon size={32} className="text-gray" />
                    <span className="font-semibold text-primary">
                      Click to select cover image
                    </span>
                  </>
                )}
              </label>
            </div>
          </div>
          
          <div>
            <label className="text-gray block mb-2">Audio File (MP3, WAV) *</label>
            <div style={{
              border: '2px dashed var(--border)', 
              borderRadius: 8, 
              padding: 24, 
              textAlign: 'center',
              backgroundColor: 'var(--bg-elevated)',
              cursor: 'pointer'
            }}>
              <input 
                type="file" 
                accept="audio/*" 
                onChange={handleFileChange} 
                style={{display: 'none'}} 
                id="file-upload" 
                required
              />
              <label htmlFor="file-upload" style={{cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12}}>
                <UploadCloud size={32} className="text-gray" />
                <span className="font-semibold text-primary">
                  {file ? file.name : 'Click to select audio file'}
                </span>
                <span className="text-sm text-secondary">Make sure you have the rights to this track</span>
              </label>
            </div>
          </div>
          
          <button type="submit" className="btn-primary mt-2" disabled={loading} style={{opacity: loading ? 0.7 : 1}}>
            {loading ? 'Uploading...' : 'Upload Track'}
          </button>
        </form>
      </div>
    </div>
  );
}
