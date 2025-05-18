export type Magnet = {
    link: string
    size: string
    quality: string
}

export type Movies = {
  title: string
  imgUrl : string
  magnets : Magnet[]
}

export type Anime = {
  name: string
	magnetLink: string
	size: string
	seeders: string
}

export type UserList = {
  Name: string
  Link: string
  Size: string
}