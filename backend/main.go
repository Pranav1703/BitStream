package main

import (
	"BitStream/internal/util"
	"BitStream/server"
	"os"
	"os/signal"
	"syscall"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
)

func main(){
	
	closeSignal := make(chan os.Signal,1)
	signal.Notify(closeSignal,syscall.SIGINT,syscall.SIGTERM)
		
	r := chi.NewRouter()
	
	r.Use(cors.Handler(cors.Options{
		// AllowedOrigins:   []string{"https://foo.com"}, // Use this to allow specific origin hosts
		AllowedOrigins:   []string{"https://*", "http://*"},
		// AllowOriginFunc:  func(r *http.Request, origin string) bool { return true },
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300, // Maximum value not ignored by any of major browsers
	  }))

	server.RegisterRoutes(r)
	go server.StartServer(r)
	
	<-closeSignal
	if util.Client!=nil {
		util.CloseClient()
	}
	server.StopServer()
	

}