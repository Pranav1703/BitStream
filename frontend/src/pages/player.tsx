import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { useSearchParams } from "react-router-dom";

const Player = () => {

  const [streamURL, setStreamURL] = useState("");
  const [searchParams] = useSearchParams();
  const magnet = searchParams.get("magnet");

  useEffect(() => {
    if (magnet) {
      const encodedMagnet = encodeURIComponent(magnet);
      setStreamURL(`${import.meta.env.VITE_SERVER}/stream?magnet=${encodedMagnet}`);
    }
    console.log("magnet link -> ",magnet)
  }, [magnet]);

  return (
    <div>
    
      {streamURL && (
        <div style={{ marginTop: "20px" }}>
          <ReactPlayer url={streamURL} 
            controls
            
            width="80%" 
            height="600px" 
          />
        </div>
      )}
    </div>
  );
};

  export default Player;