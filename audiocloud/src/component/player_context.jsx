
import React, { createContext, useContext, useState } from 'react';

const APlayerContext = createContext();

export function useAPlayer() {
  return useContext(APlayerContext);
}

export function APlayerProvider({ children }) {
  const [aplayer, setAPlayer] = useState(null);
  const [audioData, setAudioData] = useState([]);

  const initializeAPlayer = (data) => {
    const ap = new APlayer({
      container: document.getElementById('aplayer'),
      mutex: true,
      autoplay: true,
      audio: data.map((item) => ({
        name: item.AudioName,
        url: item.AudioURL,
        cover: item.PhotoURL,
        artist: item.UserDisplayname,
      })),
    });
    setAPlayer(ap);
    setAudioData(data);
  };

  const destroyAPlayer = () => {
    if (aplayer) {
      aplayer.destroy();
      setAPlayer(null);
    }
  };

  return (
    <APlayerContext.Provider value={{ aplayer, audioData, initializeAPlayer, destroyAPlayer}}>
      {children}
    </APlayerContext.Provider>
  );
}
