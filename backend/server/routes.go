package server

import (

	"github.com/go-chi/chi/v5"
	"BitStream/internal/handler"
	"BitStream/internal/authMiddleware"
)

func RegisterRoutes(r *chi.Mux)  {
	

	r.Get("/",handler.Root)
	r.Get("/test",handler.TestDbFunc)
	
	r.Post("/login",handler.Login)
	r.Post("/signup",handler.RegisterUser)	
	r.Get("/auth",handler.CheckAuth)
	r.Get("/logout",handler.Logout)

	r.With(authmiddleware.AuthenticateToken).Get("/progress",handler.TorrentProgress)
	r.With(authmiddleware.AuthenticateToken).Get("/stream",handler.StreamVideo)
	
	r.Get("/recent",handler.RecentMovies)
	r.get("/")
}

// chi routing docs
// "/user/{name}" matches "/user/jsmith" but not "/user/jsmith/info" or "/user/jsmith/"
// "/user/{name}/info" matches "/user/jsmith/info"
// "/page/*" matches "/page/intro/latest"
// "/page/*/index" also matches "/page/intro/latest"
// "/date/{yyyy:\\d\\d\\d\\d}/{mm:\\d\\d}/{dd:\\d\\d}" matches "/date/2017/04/01"