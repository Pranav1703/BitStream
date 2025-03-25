package database

import (
	"BitStream/internal/database/model"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var Db *gorm.DB

func InitDb() (error){

	err := godotenv.Load()
	if err != nil {
		log.Println("Warning: No .env file found.",err)
		return err
	}

	user := os.Getenv("DB_USER")
	pass := os.Getenv("DB_PASS")

	var dbErr error
	
	Db, dbErr = gorm.Open(postgres.New(postgres.Config{
		DSN: fmt.Sprintf("user=%s password=%s dbname=BitStream sslmode=disable",user,pass),
		PreferSimpleProtocol: true, // disables implicit prepared statement usage
	  }), &gorm.Config{})

	if dbErr != nil {
		return err
	}	

	postgresDb, _ := Db.DB()
	err = postgresDb.Ping()
	if err != nil {
		return err
	}

	err = Db.AutoMigrate(&model.User{},&model.Magnet{})
	if err != nil {
		return err
	}
	return nil
}

func GetDb()*gorm.DB{
	return Db
}

func CloseDb(){
	conn, err := Db.DB()
	if err != nil {
		log.Println(err)
		return
	}
	conn.Close()
}