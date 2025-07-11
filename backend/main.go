package main

import (
	"BitStream/internal/database"
	"BitStream/internal/util"
	"BitStream/server"
	"fmt"
	"log"
	"os"
	"os/signal"

	"syscall"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
)

func main() {

	closeSignal := make(chan os.Signal, 1)
	signal.Notify(closeSignal, syscall.SIGINT, syscall.SIGTERM)

	r := chi.NewRouter()

	r.Use(middleware.GetHead)
	r.Use(middleware.Logger)

	r.Use(cors.Handler(cors.Options{
		// AllowedOrigins:   []string{"https://foo.com"}, // Use this to allow specific origin hosts
		AllowedOrigins: []string{"https://*", "http://*"},
		// AllowOriginFunc:  func(r *http.Request, origin string) bool { return true },
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300, // Maximum value not ignored by any of major browsers
	}))

	util.CreateDownloadsDir()

	server.RegisterRoutes(r)

	err := database.InitDb()
	if err != nil {
		log.Println(err)
		return
	}

	fmt.Println("connected to DB.")

	go server.StartServer(r)
	
	fmt.Println("server started.")
	log.Println("monitoring 'downloads' dir...")

	go util.MonitorDownloadsDir(closeSignal)

	<-closeSignal
	if util.TClient != nil {
		util.CloseClient()
	}

	fmt.Println("removing downloads dir")
	os.RemoveAll("./downloads")

	database.CloseDb()
	server.StopServer()
}
// in main branch