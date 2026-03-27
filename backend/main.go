package main

import (
	"BitStream/internal/database"
	"BitStream/internal/util"
	"BitStream/server"
	"fmt"
	"log"
	"net/http"
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
		AllowedOrigins:   []string{"http://localhost:5173"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300, // Maximum value not ignored by any of major browsers
	}))

	util.CreateDownloadsDir()

	subDir := http.Dir("./downloads/subs")
    subHandler := http.FileServer(subDir)

    // 3. Mount it to the /subs/ path
    // StripPrefix ensures Go looks for "file.vtt" instead of "subs/file.vtt"
	r.Handle("/subs/*", http.StripPrefix("/subs/", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	    w.Header().Set("Content-Type", "text/vtt")
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
        w.Header().Set("Access-Control-Allow-Credentials", "true")
	    subHandler.ServeHTTP(w, r)
	})))
	
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

	go util.MonitorVideoDir(closeSignal)

	<-closeSignal
	if util.TClient != nil {
		util.CloseClient()
	}

	fmt.Println("removing downloads dir")
	// os.RemoveAll("./downloads")

	database.CloseDb()
	server.StopServer()
}

// in main branch
