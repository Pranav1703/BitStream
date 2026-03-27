import { Box } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { useSearchParams } from "react-router-dom";

const Player = () => {

  const [streamURL, setStreamURL] = useState("");
  const [searchParams] = useSearchParams();
  const [subFiles, setSubFiles] = useState<Array<string>>([]);

  const magnet = searchParams.get("magnet");

  const fecthSubs = async()=>{
    try {
      const resp = await axios.get(`${import.meta.env.VITE_SERVER}/subtitles`,{ withCredentials: true })
      setSubFiles(resp.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {

    if (magnet) {
      const encodedMagnet = encodeURIComponent(magnet);
      setStreamURL(`${import.meta.env.VITE_SERVER}/stream?magnet=${encodedMagnet}`);
    }
    fecthSubs()
  }, [magnet]);

  return (
    <Box>
      {streamURL && (
        <Box display={"flex"} justifyContent={"center"} mt={"100px"}>
          <ReactPlayer url={streamURL} 
            key={subFiles.length}
            controls
            width="80%" 
            height="100%" 
            config={{
              file: {
                tracks: (subFiles && subFiles.map((file, index) => ({
                  kind: 'subtitles',
                  src: `http://localhost:5000/subs/${file}`, 
                  srcLang: 'en',
                  label: file,
                  default: index === 0 // Automatically enable the first one
                })))
              }
            }}
          />
        </Box>
      )}
    </Box>
  );
};

  export default Player;