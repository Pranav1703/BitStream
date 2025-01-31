package handler

import (
	"net/http"
)

func Root(w http.ResponseWriter, r *http.Request){
	var _ int = 4234234;
	w.Write([]byte("<h1>Current path -> '/'<h1>"))
}