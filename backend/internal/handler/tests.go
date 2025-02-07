package handler

import (
	"BitStream/internal/database"
	"BitStream/internal/database/model"
	"fmt"
	"net/http"
)

func Root(w http.ResponseWriter, r *http.Request){
	var _ int = 4234234;
	w.Write([]byte("<h1>Current path -> '/'<h1>"))
}

func TestDbFunc(w http.ResponseWriter, r *http.Request){
	db := database.GetDb()
	// newUser := &model.User{
	// 	Username: "test_user",
	// 	Password: "123456789",
	// }
	// db.Create(newUser)

	var users []model.User

	result := db.Find(&users)
	if result.Error!=nil{
		http.Error(w, result.Error.Error(), http.StatusInternalServerError)
		return
	}
	w.Write([]byte(fmt.Sprintf("%v",users)))
	
}