package handler

import (
	"BitStream/internal/authMiddleware"
	"BitStream/internal/database/model"
	"log"
	"net/http"
	"BitStream/internal/database"
	"encoding/json"
	"fmt"


	"github.com/anacrolix/torrent"
	"github.com/golang-jwt/jwt/v5"
)


func AddMagnet(w http.ResponseWriter, r *http.Request) {

	var rBody ReqBody

	err := json.NewDecoder(r.Body).Decode(&rBody)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	var user model.User
	db := database.GetDb()
	c, _ := torrent.NewClient(nil)
	defer c.Close()
	t, err := c.AddMagnet(rBody.Magnet)
	if err != nil || t == nil {
		http.Error(w, "Failed to add magnet link", http.StatusBadRequest)
		log.Println("Failed to add magnet link.")
		return
	}
	<-t.GotInfo()

	claims, ok := r.Context().Value(authmiddleware.UserContextKey).(jwt.MapClaims)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		log.Println("Unauthorized request recieved")
		return
	}

	username := claims["username"].(string)
	result := db.Where("username = ?", username).First(&user)
	if result.Error != nil {
		http.Error(w, result.Error.Error(), http.StatusInternalServerError)
	}

	var magnet model.Magnet
	fmt.Printf("info --> %v\n", t.Info().Name)
	fmt.Printf("info --> %v\n", t.Info().TotalLength())

	magnet.Link = rBody.Magnet

	size := int(t.Info().TotalLength())
	if size >= GB {
		magnet.Size = fmt.Sprintf("%.2f GB", float64(size)/float64(GB))
	} else if size >= MB {
		magnet.Size = fmt.Sprintf("%.2f MB", float64(size)/float64(MB))
	} else if size >= KB {
		magnet.Size = fmt.Sprintf("%.2f KB", float64(size)/float64(KB))
	} else {
		magnet.Size = fmt.Sprintf("%d B", size)
	}
	magnet.Name = t.Info().Name
	magnet.UserId = user.ID

	if err := db.Create(&magnet).Error; err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		log.Println(err.Error())
	}
	log.Println("new magent added. magnet ID: ", magnet.ID)

}

func GetList(w http.ResponseWriter, r *http.Request) {
	var user model.User
	db := database.GetDb()

	claims, ok := r.Context().Value(authmiddleware.UserContextKey).(jwt.MapClaims)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		log.Println("Unauthorized")
		return
	}
	username := claims["username"].(string)
	fmt.Println("username: ",username)
	result := db.Preload("MagnetList").Where("username = ?", username).First(&user)
	if result.Error != nil {
		http.Error(w, result.Error.Error(), http.StatusInternalServerError)
		log.Println(result.Error.Error())
	}
	err := json.NewEncoder(w).Encode(user.MagnetList)
	if err != nil {
		http.Error(w, "Failed to encode magnet list.", http.StatusInternalServerError)
		log.Println("Failed to encode magnet list.")
		return
	}
}

func DeleteEntry(w http.ResponseWriter, r *http.Request){
	var magnet model.Magnet
	var rBody ReqBody

	err:= json.NewDecoder(r.Body).Decode(&rBody)
	if err != nil {
		http.Error(w,"couldnt decode request body",http.StatusInternalServerError)
		log.Println("couldnt decode request body")
		return 
	}
	db := database.GetDb()

	// claims, ok := r.Context().Value(authmiddleware.UserContextKey).(jwt.MapClaims)
	// if !ok {
	// 	http.Error(w, "Unauthorized", http.StatusUnauthorized)
	// 	log.Println("Unauthorized")
	// 	return
	// }
	// username := claims["username"].(string)
	// result := db.Where("username = ?", username).First(&user)
	// if result.Error != nil {
	// 	http.Error(w, result.Error.Error(), http.StatusInternalServerError)
	// }
	result := db.Where("link = ?", rBody.Magnet).Delete(&magnet)
	if result.Error != nil {
		http.Error(w, result.Error.Error(), http.StatusInternalServerError)
		log.Println("Error deleting entry:", result.Error)
		return
	}

	if result.RowsAffected == 0 {
		http.Error(w, "No magnet link found to delete", http.StatusNotFound)
		return
	}
	log.Println("deleted entry successfully.")

}