package handler

import (
	"encoding/json"
	"net/http"
	"os"
)

func GetSubtitles(w http.ResponseWriter, r *http.Request) {
	// movieName := r.URL.Query().Get("fileName")
	subDir := "./downloads/subs"

	files, _ := os.ReadDir(subDir)
	var availableSubs []string

	for _, f := range files {
		// Find all subs that start with the movie name
		// if strings.HasPrefix(f.Name(), movieName) && strings.HasSuffix(f.Name(), ".srt") {
		//     availableSubs = append(availableSubs, f.Name())
		// }
		availableSubs = append(availableSubs, f.Name())
	}

	json.NewEncoder(w).Encode(availableSubs)
}