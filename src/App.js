// App.js
import React, { useEffect, useState } from 'react';
import './App.css';
import { gapi } from 'gapi-script';

const CLIENT_ID = '989799516667-8325atau4t6013d0qf14l66rb1usoptn.apps.googleusercontent.com';
const PLAYLIST_ID = 'PLINGkNFSbpzdcuKVrHr2t7fgYm4FjGvbk';

function App() {
  const [videos, setVideos] = useState([]);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: CLIENT_ID,
        scope: 'https://www.googleapis.com/auth/youtube.readonly',
      }).then(() => {
        const auth = gapi.auth2.getAuthInstance();
        if (!auth.isSignedIn.get()) {
          auth.signIn();
        } else {
          setSignedIn(true);
          loadVideos();
        }
      });
    }

    gapi.load('client:auth2', () => {
      gapi.client.load('youtube', 'v3').then(start);
    });
  }, []);

  const loadVideos = () => {
    gapi.client.youtube.playlistItems.list({
      part: 'snippet',
      maxResults: 50,
      playlistId: PLAYLIST_ID,
    }).then(response => {
      const fetchedVideos = response.result.items.map((item, index) => ({
        id: index,
        youtubeId: item.snippet.resourceId.videoId,
        title: item.snippet.title,
      }));
      setVideos(fetchedVideos);
    }).catch(error => {
      console.error('🎯 YouTube API 呼び出しエラー:', error);
    });
  };
  

  return (
    <div className="app-container">
      <h1 className="app-title">My Videos</h1>
      {!signedIn && <p>Googleにサインイン中...</p>}
      <div className="video-gallery">
        {videos.map((video) => (
          <div key={video.id} className="video-card">
            <div className="video-wrapper">
              <iframe
                src={`https://www.youtube.com/embed/${video.youtubeId}`}
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
