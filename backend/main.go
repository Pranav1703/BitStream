package main

import (
	"BitStream/server"

	"github.com/go-chi/chi/v5"
)

func main(){
	
	r := chi.NewRouter()

	server.RegisterRoutes(r)
	server.StartServer(r)

}