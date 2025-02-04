package handler

import "net/http"

func RegisterUser(w http.ResponseWriter,r *http.Request) {
	w.Write([]byte("user endpoint"))
}