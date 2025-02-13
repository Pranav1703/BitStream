package authmiddleware

import (
	"BitStream/internal/util"
	"context"
	"fmt"
	"net/http"

	"github.com/golang-jwt/jwt/v5"
)

type contextKey string

const userContextKey contextKey = "user"

func AuthenticateToken(next http.Handler) http.Handler{
	secretKey := util.SecretKey
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie("jwt")
		if err != nil {
			http.Error(w, "JWT cookie missing", http.StatusUnauthorized)
			return
		}
	
		tokenString := cookie.Value
		fmt.Println(tokenString)

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			// Validate the signing method
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, http.ErrNotSupported
			}
			return secretKey, nil
		})
		if err != nil || !token.Valid {
			http.Error(w, "Invalid or expired token", http.StatusUnauthorized)
			return
		}

		// Pass the context with the token claims
		ctx := context.WithValue(r.Context(), userContextKey, token.Claims)
		r = r.WithContext(ctx)

		// Continue to the next handler
		next.ServeHTTP(w, r)

	})
}