package handler

import (
	"BitStream/internal/database"
	"BitStream/internal/database/model"
	"BitStream/internal/util"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

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

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(userInfo.Password))
	if err != nil {
		fmt.Println("error login : ",err)
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	tokenString, err := util.CreateToken(user.Username)
	if err != nil {
		fmt.Println(err)
	    http.Error(w, "Failed to generate token", http.StatusInternalServerError)
	    return
	}

	util.SetAuthCookie(w,tokenString)

	fmt.Fprintf(w, "Login successful for user: %s", user.Username)
}

func Logout(w http.ResponseWriter, r *http.Request) {
	// Expire the cookie
	
	http.SetCookie(w, &http.Cookie{
		Name:     "access-token",
		Value:    "",
		HttpOnly: true,
		Secure:   false, // Set to true in production with HTTPS
		SameSite: http.SameSiteLaxMode,
		Path:     "/",
		Expires:  time.Unix(0, 0), 
	})

	w.Write([]byte("Logged out successfully"))
}

func CheckAuth(w http.ResponseWriter, r *http.Request) {
	username, err := util.VerifyToken(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte(username))
}
