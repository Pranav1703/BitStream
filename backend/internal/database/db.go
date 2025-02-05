package database

import (

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var Db *gorm.DB
type Database struct{
	Db *gorm.DB
}

func InitDb() (*Database,error){
	var err error
	Db, err = gorm.Open(postgres.New(postgres.Config{
		DSN: "user=postgres password=popcat dbname=BitStream sslmode=disable",
		PreferSimpleProtocol: true, // disables implicit prepared statement usage
	  }), &gorm.Config{})

	if err != nil {
		return nil,err
	}	
	return &Database{Db: Db},nil
}

func (db *Database) GetDb()*gorm.DB{
	return db.Db
}
