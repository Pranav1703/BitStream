import { Box } from "@chakra-ui/react";
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
    <Box>
      {streamURL && (
        <Box display={"flex"} justifyContent={"center"} mt={"100px"}>
          <ReactPlayer url={streamURL} 
            controls
            width="80%" 
            height="100%" 
          />
        </Box>
      )}
    </Box>
  );
};

  export default Player;