package handler

import (
	"net/http"
	"BitStream/internal/scraper"
	"encoding/json"
)


func RecentMovies(w http.ResponseWriter, r *http.Request){
	movies := scraper.ScrapeRecentMovies()

	w.Header().Set("Content-Type", "application/json")
	
	err := json.NewEncoder(w).Encode(movies)
	if err != nil {
		http.Error(w, "Failed to encode movies", http.StatusInternalServerError)
		return
	}
}

func SearchResults(w http.ResponseWriter, r *http.Request) {
	searchQuery := r.URL.Query().Get("search")
}