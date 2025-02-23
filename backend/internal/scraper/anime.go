package scraper

import (
	"fmt"
	"log"
	"strings"

	"github.com/gocolly/colly/v2"
)

func SearchAnime(query string){

	c := colly.NewCollector()
	
	c.OnHTML(".default, .success",func(h *colly.HTMLElement) {
		fmt.Println(h.ChildTexts("td"))
	})
	fmt.Println(query)
	query = strings.Join(strings.Split(query, " "), "+")
	err := c.Visit(fmt.Sprintf("https://nyaa.si/?q=%s",query))
	if err != nil {
		log.Fatal(err)
	}
}