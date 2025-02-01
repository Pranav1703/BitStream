package server

import (

	"github.com/go-chi/chi/v5"
	"BitStream/internal/handler"
)

func RegisterRoutes(r *chi.Mux)  {
	r.Get("/",handler.Root)
	r.Get("/progress",handler.TorrentProgress)
}