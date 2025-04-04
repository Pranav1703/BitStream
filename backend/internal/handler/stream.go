package handler

import (
	"BitStream/internal/util"

	"fmt"
	"log"
	"math/rand"
	"net/http"

	"path/filepath"
	"time"

	"github.com/anacrolix/torrent"
	"github.com/gorilla/websocket"
)

type ReqBody struct {
	Magnet string `json:"magnet"`
}
const (
	KB = 1024
	MB = KB * 1024
	GB = MB * 1024
)


var upgrader = websocket.Upgrader{
	ReadBufferSize:  2048,
	WriteBufferSize: 2048,
	CheckOrigin:     func(r *http.Request) bool { return true },
	// CheckOrigin: func(r *http.Request) bool {
	// 	return r.Header.Get("Origin") == "https://yourfrontend.com"
	// }
}

func TorrentProgress(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Printf("failed to upgrade connection")
		return
	}
	var progress int = 0
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

func StreamVideo(w http.ResponseWriter, r *http.Request) {
	params := r.URL.Query()
	// fmt.Println("Params: ",params.Get("magnet"))
	magnet := params.Get("magnet")

	if err := util.InitTorrentClient(); err != nil {
		http.Error(w, "Failed to initialize torrent client.", http.StatusInternalServerError)
		log.Println("Failed to initialize torrent client.")
		return
	}

	var t *torrent.Torrent
	torrentHash := util.ExtractHashFromMagnet(magnet)

	fmt.Println("Current torrent: ", util.TClient.Torrents())
	for _, existingT := range util.TClient.Torrents() {
		if existingT.InfoHash().HexString() == torrentHash {
			t = existingT
			break
		}
	}

	// If the torrent is not already added, add it
	if t == nil {
		var err error
		t, err = util.TClient.AddMagnet(magnet)
		if err != nil {
			http.Error(w, "Failed to add torrent", http.StatusInternalServerError)
			log.Println("Failed to add torret.")
			return
		}
		<-t.GotInfo()
		log.Println("downloading...")
		t.DownloadAll()
	} else {
		log.Println("Reusing existing torrent")
	}

	// Find the largest video file
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

	for {
		downloaded := videoFile.BytesCompleted()
		totalSize := videoFile.Length()
		if downloaded >= (videoFile.Length() / 20) {
			break
		}
		log.Printf(" %d/%d bytes. downloaded (%.2f%%)", downloaded, totalSize, float64(downloaded)/float64(totalSize)*100)
		time.Sleep(2 * time.Second)
	}

	util.MonitorTorrent(videoFile.Torrent())
	
	reader := videoFile.NewReader()
	defer reader.Close()

	w.Header().Set("Content-Length", fmt.Sprintf("%d", videoFile.Length()))
	w.Header().Set("Content-Type", "video/mp4")
	w.Header().Set("Accept-Ranges", "bytes") // Enable seeking

	//http.ServeContent(w, r, videoFile.DisplayPath(), time.Unix(videoFile.Torrent().Metainfo().CreationDate, 0), reader)
	http.ServeContent(w, r, videoFile.DisplayPath(), time.Now(), reader)

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
