export type Movies = {
  title: string
  imgUrl : string
  magnets : {
    link: string
    size: string
    quality: string
  }[]
}

export type Anime = {
  name: string
	magnetLink: string
	size: string
	seeders: string
}

export type UserList = {
  Name: string
  MagnetLink: string
  Size: string
}