export type Movies = {
  Title: string
  ImgUrl : string
  Magnets : {
    Link: string
    Size: string
    Quality: string
  }[]
}

export type Anime = {
  Name: string
	MagnetLink: string
	Size: string
	Seeders: string
}