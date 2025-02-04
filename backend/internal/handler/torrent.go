package handler

import (
	"BitStream/internal/util"
	"fmt"
	// "io"
	"log"
	"math/rand"
	"net/http"

	"path/filepath"
	"time"

	"github.com/anacrolix/torrent"
	"github.com/gorilla/websocket"
)


var upgrader = websocket.Upgrader{
    ReadBufferSize:  2048,
    WriteBufferSize: 2048,
	CheckOrigin: func(r *http.Request) bool { return true },
	// CheckOrigin: func(r *http.Request) bool {
	// 	return r.Header.Get("Origin") == "https://yourfrontend.com"
	// }
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
	params := r.URL.Query()
	fmt.Println("Params: ",params.Get("magnet"))
	magnet := params.Get("magnet")

	if err := util.InitTorrentClient(); err != nil {
		http.Error(w, "Failed to initialize torrent client.", http.StatusInternalServerError)
		return
	}

	// // random ahh magnet link 
	// var _ string = "magnet:?xt=urn:btih:e9eb2ff4fff3db37e617d331153c75d2bc87c497&dn=The.Rookie.S07E04.HDTV.x264-TORRENTGALAXY&tr=udp%3A%2F%2Fopen.stealth.si%3A80%2Fannounce&tr=udp%3A%2F%2Fexodus.desync.com%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.cyberia.is%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce&tr=udp%3A%2F%2Ftracker.torrent.eu.org%3A451%2Fannounce&tr=udp%3A%2F%2Fexplodie.org%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.birkenwald.de%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.moeking.me%3A6969%2Fannounce&tr=udp%3A%2F%2Fipv4.tracker.harry.lu%3A80%2Fannounce&tr=udp%3A%2F%2Ftracker.tiny-vps.com%3A6969%2Fannounce"

	//solo leveling s02
	// var _ string = "magnet:?xt=urn:btih:1a6273a56e25d7dea3673497c2ffb9221596265b&dn=Solo%20Leveling%20-%20S02E05%20-%20This%20is%20What%20We%27re%20Trained%20to%20Do%20[Web][1080p][HEVC%2010bit%20x26...&tr=udp%3A%2F%2Fopen.stealth.si%3A80%2Fannounce&tr=udp%3A%2F%2Fexodus.desync.com%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.cyberia.is%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce&tr=udp%3A%2F%2Ftracker.torrent.eu.org%3A451%2Fannounce&tr=udp%3A%2F%2Fexplodie.org%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.birkenwald.de%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.moeking.me%3A6969%2Fannounce&tr=udp%3A%2F%2Fipv4.tracker.harry.lu%3A80%2Fannounce&tr=udp%3A%2F%2Ftracker.tiny-vps.com%3A6969%2Fannounce"

	var t *torrent.Torrent
	torrentHash := util.ExtractHashFromMagnet(magnet)

	fmt.Println(util.Client.Torrents())
	for _, existingT := range util.Client.Torrents() {
		if existingT.InfoHash().HexString() == torrentHash {
			t = existingT
			break
		}
	}

	// If the torrent is not already added, add it
	if t == nil {
		var err error
		t, err = util.Client.AddMagnet(magnet)
		if err != nil {
			http.Error(w, "Failed to add torrent", http.StatusInternalServerError)
			return
		}
		<-t.GotInfo()
		fmt.Println("downloading...")
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
