package util

import (
	"fmt"
	"log"
	"net/url"
	"strings"
	"sync"
	"time"

	"github.com/anacrolix/torrent"
)

var TClient *torrent.Client

// type TorrentClient struct {
//     Client *torrent.Client
//     CurrentTor sync.Map
// }

func InitTorrentClient() error {
	if TClient != nil {
		return nil // Client is already initialized
	}

	cfg := torrent.NewDefaultClientConfig()
	cfg.DataDir = "./downloads"

	var err error
	TClient, err = torrent.NewClient(cfg)
	if err != nil {
		return fmt.Errorf("failed to initialize torrent client: %w", err)
	}
	return nil
}

func CloseClient() {
	TClient.Close()
}

var torrentProgress = sync.Map{} // Global map to track torrent progress

func MonitorTorrent(t *torrent.Torrent) {
	torrentHash := t.InfoHash().HexString()
	name := t.Name()
	if _, exists := torrentProgress.Load(torrentHash); exists {
		return
	}

	torrentProgress.Store(torrentHash, true) // Mark as monitored

	go func() {
		defer torrentProgress.Delete(torrentHash) // Cleanup after completion
		for {
			downloaded := t.BytesCompleted()
			totalSize := t.Length()

			if downloaded >= totalSize {
				log.Println("Download complete for:", name)
				return
			}

			log.Printf("%d/%d bytes downloaded (%.2f%%)", downloaded, totalSize, float64(downloaded)/float64(totalSize)*100)

			time.Sleep(2 * time.Second)
		}
	}()
}

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

func GetTorrentInfo(magnet string) (*torrent.Torrent,error) {
	c, _ := torrent.NewClient(nil)
	defer c.Close()
	t, err := c.AddMagnet(magnet)
	if err != nil || t == nil {
		return nil,err
	}
	<-t.GotInfo()
	return t,nil
}

//ffmpeg -y -i "input.mkv" -map 0:s:0? "output.vtt" - force overwrites existing subs file 
