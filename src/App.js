import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      // const response = await fetch('http://localhost:8080/youtube/videos', {　 // ← ローカル用
      const response = await fetch('https://video-backend-1gtz.onrender.com/youtube/videos', { // ← 本番用
        credentials: 'include',
      });

      if (response.status === 401) {
        return; // 未ログイン
      }

      const data = await response.json();
      setVideos(data);
    } catch (err) {
      console.error('動画取得失敗:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    // window.location.href = 'http://localhost:8080/oauth2/authorization/google'; // ← ローカル用
    window.location.href = 'https://video-backend-1gtz.onrender.com/oauth2/authorization/google'; // ← 本番用
  };

  return (
    <div className="app-container">
      <h1 className="app-title">My Video Shelf</h1>

      {loading ? (
        <p>読み込み中...</p>
      ) : videos.length > 0 ? (
        <div className="video-gallery">
          {videos.map((video, index) => (
            <div className="video-card" key={index}>
              <div className="video-wrapper">
                <iframe
                  src={`https://www.youtube.com/embed/${video.videoId}`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <p className="video-title">{video.title}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="login-section">
          <p className="login-message">Please log in with Google to access your videos.</p>
          <button className="login-button" onClick={handleLogin}>
            Sign in with Google
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
