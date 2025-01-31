package server

import (
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
)

func StartServer(r *chi.Mux){
	server := &http.Server{
		Addr: ":3000",
		Handler: r,
	}

	if err:= server.ListenAndServe(); err!=nil{
		log.Fatal("Server Error: ",err)
	}
}


