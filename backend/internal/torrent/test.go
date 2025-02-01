package torrent

import (
	"fmt"
	"log"
	"time"

	"github.com/anacrolix/torrent"
)

func TryOut() {
	c, _ := torrent.NewClient(nil)
	defer c.Close()
	t, _ := c.AddMagnet("magnet:?xt=urn:btih:4b6ca375d29645b071f2065d97cc653fd7c3f996&dn=Solo%20Leveling%20-%20S02E04%20-%20I%20Need%20to%20Stop%20Faking%20[Web][1080p][HEVC%2010bit%20x265][Tenrai-Sensei...&tr=udp%3A%2F%2Fopen.stealth.si%3A80%2Fannounce&tr=udp%3A%2F%2Fexodus.desync.com%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.cyberia.is%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce&tr=udp%3A%2F%2Ftracker.torrent.eu.org%3A451%2Fannounce&tr=udp%3A%2F%2Fexplodie.org%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.birkenwald.de%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.moeking.me%3A6969%2Fannounce&tr=udp%3A%2F%2Fipv4.tracker.harry.lu%3A80%2Fannounce&tr=udp%3A%2F%2Ftracker.tiny-vps.com%3A6969%2Fannounce")
	<-t.GotInfo()
	t.DownloadAll()
	for {
		progress := t.BytesCompleted() * 100 / t.Length()

		fmt.Println("Progres: ",progress,"%")
		if progress >= 100 {
			break
		}
		time.Sleep(2 * time.Second)
	}
	c.WaitAll()
	log.Print("torrent downloaded")
}