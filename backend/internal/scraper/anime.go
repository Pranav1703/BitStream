package scraper

import (
	"fmt"
	"log"
	// "net/http"
	"strings"
	// "time"

	"github.com/gocolly/colly/v2"
)

type AnimeInfo struct{
	Name string `json:"name"`
	MagnetLink string `json:"magnetLink"`
	Size string `json:"size"`
	Seeders string `json:"seeders"`
}

func SearchAnime(query string) []AnimeInfo {

	c := colly.NewCollector(
		colly.UserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"),
	)

	// c.WithTransport(&http.Transport{
	// 	ResponseHeaderTimeout: 10 * time.Second, // Increase timeout
	// })

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

	c.OnError(func(r *colly.Response, err error) {
		fmt.Println("[Anime Scrapper] error : ",err)
	})


	query = strings.Join(strings.Split(query, " "), "+")
	err := c.Visit(fmt.Sprintf("https://nyaa.iss.one/?q=%s",query))
	if err != nil {
		log.Println(err)
		return allAnime
	}
	return allAnime
}