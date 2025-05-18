package tests

import (
	"BitStream/internal/util"
	"log"
	"testing"
)

func TestGetTorrentInfo(t *testing.T) {

	magnet := "magnet:?xt=urn:btih:A32F0E9C3202362D80CBB188E1D8B9BD6BA54678&dn=[1337x.HashHackers.Com]1126+-+One+piece+%5BSub%5D+1080p&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80%2Fannounce&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce&tr=udp%3A%2F%2Fopen.demonii.com%3A1337%2Fannounce&tr=udp%3A%2F%2Ftracker.torrent.eu.org%3A451%2Fannounce&tr=udp%3A%2F%2Fopen.stealth.si%3A80%2Fannounce&tr=udp%3A%2F%2Fopen.free-tracker.ga%3A6969%2Fannounce&tr=udp%3A%2F%2Fns-1.x-fins.com%3A6969%2Fannounce&tr=udp%3A%2F%2Fisk.richardsw.club%3A6969%2Fannounce&tr=udp%3A%2F%2Fexplodie.org%3A6969%2Fannounce&tr=udp%3A%2F%2Fexodus.desync.com%3A6969%2Fannounce&tr=http%3A%2F%2Fwww.torrentsnipe.info%3A2701%2Fannounce&tr=http%3A%2F%2Fwww.genesis-sp.org%3A2710%2Fannounce&tr=http%3A%2F%2Ftracker.vanitycore.co%3A6969%2Fannounce&tr=http%3A%2F%2Ftracker.sbsub.com%3A2710%2Fannounce&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce&tr=http%3A%2F%2Ftracker.openbittorrent.com%3A80%2Fannounce&tr=udp%3A%2F%2Fopentracker.i2p.rocks%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.internetwarriors.net%3A1337%2Fannounce&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969%2Fannounce&tr=udp%3A%2F%2Fcoppersurfer.tk%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.zer0day.to%3A1337%2Fannounce"

	torrent, err := util.GetTorrentInfo(magnet)
	if err != nil {
		t.Fatalf("Failed to get torrent info: %v", err)
	}

	if torrent.Info() == nil {
		t.Fatal("Expected torrent info to be available, got nil")
	}

	log.Printf("Torrent name: %s", torrent.Info().Name)
	log.Printf("Total length: %d bytes", torrent.Info().TotalLength())

	if torrent.Info().Name == "" {
		t.Error("Torrent name should not be empty")
	}
	if torrent.Info().TotalLength() == 0 {
		t.Error("Torrent size should not be zero")
	}
}
