import React, { useState } from "react";
import ReactPlayer from "react-player";

const Player = () => {
  const [magnet, setMagnet] = useState("");
  const [streamURL, setStreamURL] = useState("");

  const handleStream = () => {
    setStreamURL(`http://localhost:3000/stream`);
  };

  return (
    <div>
      <h2>BitStream - Torrent Video Streaming</h2>
      <input
        type="text"
        placeholder="Enter Magnet Link"
        value={magnet}
        onChange={(e) => setMagnet(e.target.value)}
        style={{ width: "300px", marginRight: "10px" }}
      />
      <button onClick={handleStream}>Stream Video</button>

      {streamURL && (
        <div style={{ marginTop: "20px" }}>
          <ReactPlayer url={streamURL} controls width="100%" height="500px" />
        </div>
      )}
    </div>
  );
};

export default Player;
