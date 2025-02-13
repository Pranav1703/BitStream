package handler

import (
	"BitStream/internal/database"
	"BitStream/internal/database/model"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type body struct{
	Username string
	Password string
}

func RegisterUser(w http.ResponseWriter,r *http.Request) {
	userInfo := new(body)
	err := json.NewDecoder(r.Body).Decode(userInfo)
	if err != nil {
		http.Error(w,"couldnt decode request body",http.StatusInternalServerError)
		return 
	}
	fmt.Printf("%v\n",&userInfo)

	db := database.GetDb()

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(userInfo.Password), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, "Failed to hash password", http.StatusInternalServerError)
		return
	}

	newUser := &model.User{
		Username: userInfo.Username,
		Password: string(hashedPassword),
	}
	result := db.Create(newUser)
	if result.Error != nil {
		http.Error(w, "Failed to create user", http.StatusInternalServerError)
		return
	}
	fmt.Println("user created. Id: ",newUser.ID)

}

func Login(w http.ResponseWriter,r *http.Request){
	userInfo := new(body)
	err := json.NewDecoder(r.Body).Decode(userInfo)
	if err != nil {
		http.Error(w,"couldnt decode request body",http.StatusInternalServerError)
		return 
	}

	db := database.GetDb()

	var user model.User
	result := db.Where("username = ?", userInfo.Username).First(&user)

	if result.Error == gorm.ErrRecordNotFound {
		http.Error(w, "User not found", http.StatusUnauthorized)
		return
	}

	if result.Error != nil {
		http.Error(w, "Failed to fetch user", http.StatusInternalServerError)
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(userInfo.Password))
	if err != nil {
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	// Passwords match, you can generate a JWT token here (not implemented yet)
	// For example:
	// tokenString, err := generateJWTToken(user)
	// if err != nil {
	//     http.Error(w, "Failed to generate token", http.StatusInternalServerError)
	//     return
	// }

	// For now, just send a success response (you should return a JWT in a real app)
	fmt.Fprintf(w, "Login successful for user: %s", user.Username)

}