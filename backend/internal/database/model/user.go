package model

type User struct{
	ID 			uint	`gorm:"primaryKey"`
	Username	string	`gorm:"not null;unique"`
	Password 	string	`gorm:"gorm:"type:varchar(100);not null;unique"`
}

//gorm.model -> {id,createdAt,updatedAt}