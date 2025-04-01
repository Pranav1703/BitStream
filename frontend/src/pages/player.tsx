import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { useSearchParams } from "react-router-dom";
import shaka from "shaka-player";

const Player = () => {

  const [streamURL, setStreamURL] = useState("");
  const [searchParams] = useSearchParams();
  const magnet = searchParams.get("magnet");
  const videoRef = useRef(null);

  useEffect(() => {
    if (magnet) {
      const encodedMagnet = encodeURIComponent(magnet);
      setStreamURL(`${import.meta.env.VITE_SERVER}/stream?magnet=${encodedMagnet}`);
      const player = new shaka.Player(videoRef.current)
    }
    console.log("magnet link -> ",magnet)
  }, [magnet]);
  
  return (
    <div>
    
      {streamURL && (
        <div style={{ marginTop: "20px" }}>
          <ReactPlayer url={streamURL} controls width="100%" height="500px" />
        </div>
      )}
    </div>
  );
};

  export default Player;
