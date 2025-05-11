import { useEffect, useState } from 'react';
import './App.css';

const PLAYLIST_ID = process.env.REACT_APP_PLAYLIST_ID;
const API_URL = `${process.env.REACT_APP_API_BASE}/youtube/private-videos?playlistId=${PLAYLIST_ID}`;

function App() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      const response = await fetch(API_URL, {
        credentials: 'include',
      });

      if (response.status === 401) {
        window.location.href = 'http://localhost:8080/oauth2/authorization/google';
        return;
      }

      const data = await response.json();
      setVideos(data);
    } catch (error) {
      console.error('動画取得エラー:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <h1 className="app-title">My Videos</h1>
      {loading && <p>Loading...</p>}

      <div className="video-gallery">
        {videos.map((video, index) => (
          <div key={index} className="video-card">
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
    </div>
  );
}

export default App;
