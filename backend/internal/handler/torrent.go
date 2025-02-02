package handler

import (
	"fmt"
	"log"
	"math/rand"
	"net/http"

	"path/filepath"
	"time"

	"github.com/anacrolix/torrent"
	"github.com/gorilla/websocket"
)


var client *torrent.Client

var upgrader = websocket.Upgrader{
    ReadBufferSize:  2048,
    WriteBufferSize: 2048,
	CheckOrigin: func(r *http.Request) bool { return true },
	// CheckOrigin: func(r *http.Request) bool {
	// 	return r.Header.Get("Origin") == "https://yourfrontend.com"
	// }
}

func initTorrentClient() error {
	if client != nil {
		return nil // Client is already initialized
	}

	cfg := torrent.NewDefaultClientConfig()
	cfg.DataDir = "./downloads"

	var err error
	client, err = torrent.NewClient(cfg)
	if err != nil {
		return fmt.Errorf("failed to initialize torrent client: %w", err)
	}
	return nil
}



func TorrentProgress(w http.ResponseWriter,r *http.Request){
	conn, err := upgrader.Upgrade(w,r,nil)
	if err != nil {
		fmt.Printf("failed to upgrade connection")
		return 
	}
	var progress int = 0;
	for {
		progress += rand.Intn(10)
		err := conn.WriteJSON(map[string]any{"progress": progress})
		if err != nil {
			log.Println("WebSocket Write Error:", err)
			break
		}

		if progress >= 100 {
			break
		}
		time.Sleep(500 * time.Millisecond)
	}

}

func StreamVideo(w http.ResponseWriter,r *http.Request){
	
	if err := initTorrentClient(); err != nil {
		http.Error(w, "Failed to initialize torrent client.", http.StatusInternalServerError)
		return
	}
	defer client.Close()
	
	t,err := client.AddMagnet("magnet:?xt=urn:btih:edf4114173777c0d77eed8fbebba3bdeb7951717&dn=Family.Guy.S08E08.WEB.x264-TORRENTGALAXY&tr=udp%3A%2F%2Fopen.stealth.si%3A80%2Fannounce&tr=udp%3A%2F%2Fexodus.desync.com%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.cyberia.is%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce&tr=udp%3A%2F%2Ftracker.torrent.eu.org%3A451%2Fannounce&tr=udp%3A%2F%2Fexplodie.org%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.birkenwald.de%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.moeking.me%3A6969%2Fannounce&tr=udp%3A%2F%2Fipv4.tracker.harry.lu%3A80%2Fannounce&tr=udp%3A%2F%2Ftracker.tiny-vps.com%3A6969%2Fannounce")
	if err != nil {
		http.Error(w, "Failed to add torrent", http.StatusInternalServerError)
		return
	}
	
	<-t.GotInfo()

	t.DownloadAll()

	var videoFile *torrent.File
	for _, file := range t.Files() {
		if isVideoFile(file.Path()) && (videoFile == nil || file.Length() > videoFile.Length()) {
			videoFile = file
		}
	}

	if videoFile == nil {
		http.Error(w, "No video file found", http.StatusNotFound)
		return
	}

	for videoFile.BytesCompleted() < (videoFile.Length()/25) {
		time.Sleep(2 * time.Second) 
		log.Printf("Waiting for data... %d/%d bytes downloaded", videoFile.BytesCompleted(), videoFile.Length())
	}

	reader := videoFile.NewReader()
	defer reader.Close()

	w.Header().Set("Content-Type", "video/mp4")
	w.Header().Set("Accept-Ranges", "bytes") // Enable seeking

	http.ServeContent(w, r, videoFile.DisplayPath(), time.Unix(videoFile.Torrent().Metainfo().CreationDate, 0), reader)
}

// Check if the file is a video
func isVideoFile(filename string) bool {
	extensions := []string{".mp4", ".mkv", ".avi", ".mov", ".webm"}
	ext := filepath.Ext(filename)
	for _, validExt := range extensions {
		if ext == validExt {
			return true
		}
	}
	return false
}
