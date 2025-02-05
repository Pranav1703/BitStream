package database

import (
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var Db *gorm.DB

func InitDb(){
	var err error
	Db, err = gorm.Open(postgres.New(postgres.Config{
		DSN: "user=gorm password=gorm dbname=gorm port=9920 sslmode=disable TimeZone=Asia/Shanghai",
		PreferSimpleProtocol: true, // disables implicit prepared statement usage
	  }), &gorm.Config{})

	if err != nil {
		log.Println(err)
		return
	}	
}

func GetDb()*gorm.DB{
	if Db!=nil{
		return Db
	}
	return nil
}

//check db conn is pgadmin...