package handler

import (
	"BitStream/internal/scraper"
	"encoding/json"
	"net/http"
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

func SearchMovies(w http.ResponseWriter, r *http.Request) {
	searchQuery := r.URL.Query().Get("s")
	result := scraper.MovieSearchResults(searchQuery)

	err := json.NewEncoder(w).Encode(result)
	if err != nil {
		http.Error(w, "Failed to encode movie search results", http.StatusInternalServerError)
		return
	}

}

func SearchAnime(w http.ResponseWriter, r *http.Request) {
	searchQuery := r.URL.Query().Get("s")
	result := scraper.SearchAnime(searchQuery)

	err := json.NewEncoder(w).Encode(result)
	if err != nil {
		http.Error(w, "Failed to encode anime search results", http.StatusInternalServerError)
		return
	}

}