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

	if err:= server.ListenAndServe(); err!=nil{
		log.Fatal("Server Error: ",err)
	}
}

func StopServer(){

	ctx ,cancel := context.WithTimeout(context.Background(),3*time.Second)
	defer cancel()

	if err:=server.Shutdown(ctx);err!=nil{
		log.Fatal("Serevr shutdown failed: ",err)
	}
	
	fmt.Println("Server Stopped.")
}

// func Test(){
// 	print()
// }

// func print(){
// 	fmt.Println("in exported func")
// }