package database

import (
	"BitStream/internal/database/model"
	"fmt"
	"log"
	"os"
	"time"

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

	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")
	user := os.Getenv("DB_USER")
	pass := os.Getenv("DB_PASS")
	name := os.Getenv("DB_NAME")
	var dbErr error
	
	for i:=0;i<3;i++{
		Db, dbErr = gorm.Open(postgres.New(postgres.Config{
			DSN: fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",host,port,user,pass,name),
			PreferSimpleProtocol: true, // disables implicit prepared statement usage
	 		}), &gorm.Config{})

		if dbErr == nil {
			postgresDb, _ := Db.DB()
			err = postgresDb.Ping()
			if err == nil {
				log.Println("Connected to db.")
				break
			}
		}		
		log.Println("Waiting for DB to be ready...")
		time.Sleep(2 * time.Second)
	}

	if err != nil {
		return fmt.Errorf("failed to connect to DB after retries: %w", err)
	}

	log.Println("Running AutoMigrate...")
	err = Db.AutoMigrate(&model.User{},&model.Magnet{})
	if err != nil {
		return err
	}
	log.Println("AutoMigrate successful.")
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