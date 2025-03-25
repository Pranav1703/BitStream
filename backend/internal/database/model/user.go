package model

type User struct{
	ID 			uint	`gorm:"primaryKey"`
	Username	string	`gorm:"not null;unique"`
	Password 	string	`gorm:"type:varchar(100);not null;unique"`
	MagnetList  []Magnet `gorm:"foreignKey:UserId"`
}

//gorm.model -> {id,createdAt,updatedAt}