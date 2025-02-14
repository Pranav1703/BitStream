package util

import (
	"net/http"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var SecretKey []byte = []byte(os.Getenv("SECRET_KEY"))

func CreateToken(username string)(string,error){

	claims := jwt.NewWithClaims(jwt.SigningMethodHS256,jwt.MapClaims{
		"username": username,
		"exp": time.Now().Add(time.Hour).Unix(),
		"iat": time.Now().Unix(),
	})

	tokenString, err := claims.SignedString(SecretKey)
    if err != nil {
        return "", err
    }
	return tokenString,nil

}

func SetAuthCookie(w http.ResponseWriter, token string) {
	cookie := &http.Cookie{
		Name:     "access-token",
		Value:    token,
		HttpOnly: true,          
		Secure:   false,         
		SameSite: http.SameSiteNoneMode,
		Path:     "/",
	}
	http.SetCookie(w, cookie)
	
}

