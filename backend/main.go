package main

import (
	"BitStream/server"
	"os"
	"os/signal"
	"syscall"

	"github.com/go-chi/chi/v5"
)

func main(){

	
	closeSignal := make(chan os.Signal,1)
	signal.Notify(closeSignal,syscall.SIGINT,syscall.SIGTERM)
	
	r := chi.NewRouter()

	server.RegisterRoutes(r)
	go server.StartServer(r)

	<-closeSignal
	server.StopServer()
	

}