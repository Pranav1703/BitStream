package scraper

import (
	"fmt"
	"log"

	"github.com/gocolly/colly/v2"
)

type Magnet struct{
	Link string
	Info string
}

type Moive struct{
	Title string
	ImgUrl string
	Magnets []Magnet
}


func ScrapeMovies(){
	c := colly.NewCollector()

	var Movies []Moive

	url := "https://www.5movierulz.soy/category/hollywood-featured"

	c.OnHTML(".entry-content",func(e *colly.HTMLElement) {
		movie := &Moive{}
		//var magnetLinks []string
		//var linkInfo []string
		fmt.Println("title: ",e.ChildAttr("img","alt"))
		fmt.Println(e.ChildTexts(".mv_button_css>small"))
		// fmt.Println(e.ChildAttrs(".mv_button_css","href"))
		
	})

	c.OnHTML("li", func(e *colly.HTMLElement) {
		
		e.ForEach(".boxed",func(i int, h *colly.HTMLElement) {
			// fmt.Println("-------------------------------------------------------------------------")
			// img := e.ChildAttr("img","src")
			// fmt.Println("img url:",img)
			// title := e.ChildAttr("img","alt")
			// fmt.Println("title: ",title)
			link := e.ChildAttr("a","href")
			// fmt.Println("-------------------------------------------------------------------------")
			
			e.Request.Visit(link)

		}) 
	})



	// c.OnResponse(func(r *colly.Response) {
	// 	fmt.Println("Got response from ", r.Request.URL)
	// })

	err := c.Visit(url)
	if err != nil {
	 log.Fatal(err)
	}

}

