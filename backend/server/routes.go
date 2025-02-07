package server

import (

	"github.com/go-chi/chi/v5"
	"BitStream/internal/handler"
)

func RegisterRoutes(r *chi.Mux)  {
	
	r.Get("/",handler.Root)
	r.Get("/test",handler.TestDbFunc)
	
	r.Get("/progress",handler.TorrentProgress)
	r.Get("/stream",handler.StreamVideo)
	
	r.Post("/user",handler.RegisterUser)
}

// chi routing docs
// "/user/{name}" matches "/user/jsmith" but not "/user/jsmith/info" or "/user/jsmith/"
// "/user/{name}/info" matches "/user/jsmith/info"
// "/page/*" matches "/page/intro/latest"
// "/page/*/index" also matches "/page/intro/latest"
// "/date/{yyyy:\\d\\d\\d\\d}/{mm:\\d\\d}/{dd:\\d\\d}" matches "/date/2017/04/01"