package model

type Magnet struct{
	ID 			uint	`gorm:"primaryKey"`
	Link 		string	`gorm:"not null;unique"`
	Name 		string	`gorm:"not null"`
	Size 		int		`gorm:"not null;unique"`
	UserId		uint
}