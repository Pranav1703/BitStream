package tests

import (

	"bytes"
	"net/http"

	"testing"
)

func TestLogin(t *testing.T) {
	body := []byte(`{"username": "testuser", "password": "testpass"}`)
	resp, err := http.Post("http://localhost:3000/login", "application/json", bytes.NewBuffer(body))
	if err != nil {
		t.Fatalf("Failed to make request: %v", err)
	}
	defer resp.Body.Close()

	// rr := httptest.NewRecorder()
	// handler := http.HandlerFunc(handler.RegisterUser)
	// handler.ServeHTTP(rr, req)
	
	if resp.StatusCode != http.StatusOK {
		t.Errorf("Expected status 200, got %d", resp.StatusCode)
	}

}
