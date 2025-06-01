package server

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
)

var (
	server *http.Server
)

func StartServer(r *chi.Mux) {
	server = &http.Server{
		Addr: ":3000",
		Handler: r,
	}

	if err:= server.ListenAndServe(); err!=nil && err != http.ErrServerClosed{
		log.Fatal("Server Error: ",err)
	}
}

func StopServer(){

	ctx ,cancel := context.WithTimeout(context.Background(),500*time.Millisecond)
	defer cancel()

	err := server.Shutdown(ctx)
	if err != nil {
		log.Println("Server shutdown failed:", err)
	} else {
		fmt.Println("Server Stopped.")
	}
}
