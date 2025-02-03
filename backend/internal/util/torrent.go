package util

import (
	"net/url"
	"strings"
	"sync"
    "log"
	"github.com/anacrolix/torrent"
	"time"
)

// "fmt"



// "github.com/anacrolix/torrent"

func ExtractHashFromMagnet(magnet string) string {
	parsed, err := url.Parse(magnet)
	if err != nil {
		return ""
	}
	query := parsed.Query().Get("xt")
	if strings.HasPrefix(query, "urn:btih:") {
		return strings.TrimPrefix(query, "urn:btih:")
	}
    
	return ""
}
var torrentProgress = sync.Map{} // Global map to track torrent progress

func MonitorTorrent(t *torrent.Torrent) {
    torrentHash := t.InfoHash().HexString()
    if _, exists := torrentProgress.Load(torrentHash); exists {
        return // Already being monitored
    }

    torrentProgress.Store(torrentHash, true) // Mark as monitored

    go func() {
        defer torrentProgress.Delete(torrentHash) // Cleanup after completion
        for {
            downloaded := t.BytesCompleted()
            totalSize := t.Length()

            if downloaded >= totalSize {
                log.Println("Download complete for:", torrentHash)
                return // Stop monitoring
            }

            log.Printf("%s: %d/%d bytes downloaded (%.2f%%)",
                torrentHash, downloaded, totalSize, float64(downloaded)/float64(totalSize)*100)

            time.Sleep(2 * time.Second)
        }
    }()
}
