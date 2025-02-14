package util

import (
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var SecretKey []byte = []byte(os.Getenv("SECRET_KEY"))

func CreateToken(username string)(string,error){

	claims := jwt.NewWithClaims(jwt.SigningMethodHS256,jwt.MapClaims{
		"username": username,
		"exp": time.Now().Add(2 *time.Hour).Unix(),
		"iat": time.Now().Unix(),
	})

	tokenString, err := claims.SignedString(SecretKey)
    if err != nil {
        return "", err
    }
	return tokenString,nil

}

func VerifyToken(r *http.Request) (string, error) {
	// Get the token from the cookie
	cookie, err := r.Cookie("access-token")
	if err != nil {
		return "", fmt.Errorf("no cookie found")
	}

	// Parse and validate the token
	tokenString := cookie.Value
	claims := jwt.MapClaims{}
	_, err = jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return SecretKey, nil
	})

	if err != nil {
		return "", fmt.Errorf("invalid token")
	}

	// iat,_ := claims["iat"].(float64);
	// exp,_ := claims["exp"].(float64)
	// fmt.Println("issued at: ",time.Unix(int64(iat),0))
	// fmt.Println("expiry : ",time.Unix(int64(exp),0))

	username, ok := claims["username"].(string)
	if !ok {
		return "", fmt.Errorf("invalid token data")
	}

	return username, nil
}

func SetAuthCookie(w http.ResponseWriter, token string) {
	cookie := &http.Cookie{
		Name:     "access-token",
		Value:    token,
		HttpOnly: true,          
		Secure:   true,         
		SameSite: http.SameSiteNoneMode,
		Path:     "/",
	}
	http.SetCookie(w, cookie)
	
}

