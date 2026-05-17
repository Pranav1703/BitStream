package handler

import (
	"BitStream/internal/util"
	"os"
	"regexp"
	"strings"
	"sync"

	"fmt"
	"log"
	"net/http"

	"path/filepath"
	"time"

	"github.com/anacrolix/torrent"
	ffmpeg "github.com/u2takey/ffmpeg-go"
)


type ReqBody struct {
	Magnet string `json:"magnet"`
}

var subExtractionStatus sync.Map

const (
	KB = 1024
	MB = KB * 1024
	GB = MB * 1024
)

// ffmpeg -i input.mkv -map 0:s:0 subs.srt
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
	hash := t.InfoHash().HexString()
	if _, started := subExtractionStatus.LoadOrStore(hash, true); !started {
	    go func() {
	        // Pass 1: partial extraction (immediately, concurrent with streaming)
	        extractSubs(videoFile.Path())
	        // Wait for full download
	        for videoFile.BytesCompleted() < videoFile.Length() {
	            time.Sleep(5 * time.Second)
	        }
	        // Pass 2: full extraction (overwrites partial .vtt)
	        extractSubs(videoFile.Path())
	    }()
	}
	util.MonitorTorrent(videoFile.Torrent())
	
	reader := videoFile.NewReader()
	defer reader.Close()

	w.Header().Set("Content-Length", fmt.Sprintf("%d", videoFile.Length()))
	w.Header().Set("Content-Type", "video/mp4")
	w.Header().Set("Accept-Ranges", "bytes") // Enable seeking

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

func extractSubs(fileName string) {
	cwd, _ := os.Getwd()
    inputPath := filepath.Join(cwd, "downloads", "video", fileName)
    if _, err := os.Stat(inputPath); os.IsNotExist(err) {
        if _, err := os.Stat(inputPath + ".part"); err == nil {
            inputPath += ".part"
        } else {
            log.Printf("Neither .mkv nor .mkv.part found for: %s", fileName)
            return
        }
    }

	reg, _ := regexp.Compile("[^a-zA-Z0-9]+")
    safeName := reg.ReplaceAllString(strings.TrimSuffix(fileName, filepath.Ext(fileName)), "_")

	subDir := filepath.Join(cwd, "downloads", "subs")
    outputPath := filepath.Join(subDir, safeName+".vtt")

    err := ffmpeg.Input(inputPath, ffmpeg.KwArgs{"loglevel": "quiet"}).
        Output(outputPath, ffmpeg.KwArgs{
            "c:s": "webvtt",
            "map": "0:s:0",
        }).
        OverWriteOutput().
		ErrorToStdOut().
        Run()

    if err != nil {
        log.Println("FFMPEG err: ", err)
    }
}