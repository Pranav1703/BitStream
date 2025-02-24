package scraper

import (
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/gocolly/colly/v2"
)

type AnimeInfo struct{
	Name string
	MagnetLink string
	Size string
	Seeders string
}

func SearchAnime(query string) []AnimeInfo {

	c := colly.NewCollector()

	c.WithTransport(&http.Transport{
		ResponseHeaderTimeout: 10 * time.Second, // Increase timeout
	})

	var allAnime []AnimeInfo
	c.OnHTML(".default, .success",func(h *colly.HTMLElement) {
		anime := &AnimeInfo{}
		// for i,v := range h.ChildTexts("td"){
		// 	fmt.Print(i,": ",v,'\t')
		// 	fmt.Println("")
		// }
		anime.Name = h.ChildText("td[colspan='2'] a")
		info := h.ChildTexts(".text-center")
		anime.Size = info[1]
		anime.Seeders = info[3]
		anime.MagnetLink = h.ChildAttrs("td:nth-child(3) a","href")[1]

		allAnime = append(allAnime,*anime)
	})
	fmt.Println(allAnime)
	query = strings.Join(strings.Split(query, " "), "+")
	err := c.Visit(fmt.Sprintf("https://nyaa.si/?q=%s",query))
	if err != nil {
		log.Fatal(err)
	}
	return allAnime
}