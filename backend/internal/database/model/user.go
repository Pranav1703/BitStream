package model

type User struct{
	ID 			uint	`gorm:"primaryKey"`
	Username	string	`gorm:"not null;unique"`
	Password 	string	`gorm:"type:varchar(100);not null;unique"`
	MagnetList  []Magnet
}

type Magnet struct{
	ID 			uint
	Link 		string	`gorm:"not null;unique"`
	Size 		int
	UserId		uint
}

//gorm.model -> {id,createdAt,updatedAt}