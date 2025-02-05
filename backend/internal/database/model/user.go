package model

type User struct{
	ID 			uint	`gorm:"primaryKey"`
	Username	string	`gorm:"not null;unique"`
	Password 	string	`gorm:"not null;unique"`
}

//use gorm.model {id,createdAt,updatedAt}