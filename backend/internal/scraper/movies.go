package scraper

import (
	"fmt"
	"log"
	"strings"
	"github.com/gocolly/colly/v2"
)

type Magnet struct{
	Link string
	Info string
}

type Movie struct{
	Title string
	ImgUrl string
	Magnets []Magnet
}


func ScrapeRecentMovies() []Movie {
	c := colly.NewCollector()

	var movies []Movie

	url := "https://www.5movierulz.soy/category/hollywood-featured"

	c.OnHTML(".entry-content",func(e *colly.HTMLElement) {
		movie := &Movie{}
		var magnetLinks []string
		var linkInfos []string

		title:=e.ChildAttr("img","alt")
		movie.Title = strings.TrimSpace(title)

		url := e.ChildAttr("img","src")
		movie.ImgUrl = url


		linkInfos = e.ChildTexts(".mv_button_css>small")
		magnetLinks = e.ChildAttrs(".mv_button_css","href")
		// fmt.Println("--------------")
		// fmt.Println("infoArr length: ",len(linkInfos),"\n linksArr length: ",len(magnetLinks))
		// fmt.Println("--------------")

		for i:=0; i<len(linkInfos); i++{
			magnet := &Magnet{}
			magnet.Info = linkInfos[i]
			magnet.Link = magnetLinks[i]

			movie.Magnets = append(movie.Magnets, *magnet)
		}
		
		movies = append(movies, *movie)
		fmt.Println("scraped movie info: ",*movie)
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

	c.OnResponse(func(r *colly.Response) {
		fmt.Println("\nGot response from ", r.Request.URL)
	})

	err := c.Visit(url)
	if err != nil {
	 log.Fatal(err)
	}

	return movies
}

func MovieSearchResults(query string) {
	c := colly.NewCollector()



	c.OnResponse(func(r *colly.Response) {
		fmt.Println("\nGot response from ", r.Request.URL)
	})

	err := c.Visit(fmt.Sprintf("https://www.5movierulz.soy/search_movies?s=%s",query))
	if err != nil {
		log.Fatal(err)
	}
}
