package scraper

import (
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"
    "crypto/tls"
	"github.com/gocolly/colly/v2"
)

type Magnet struct {
	Link    string `json:"link"`
	Size    string `json:"size"`
	Quality string `json:"quality"`
}

type Movie struct {
	Title   string   `json:"title"`
	ImgUrl  string   `json:"imgUrl"`
	Magnets []Magnet `json:"magnets"`
}

type SearchResults struct {
	Msg    string  `json:"msg"`
	Movies []Movie `json:"movies"`
}


func ScrapeRecentMovies() []Movie {
	c := colly.NewCollector()

	var movies []Movie

	url := "https://www.5movierulz.gdn/category/hollywood-featured"

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

		for i:=0; i<len(linkInfos); i++ {
			magnet := &Magnet{}

			info := linkInfos[i]
			splitInfo := strings.Split(info," ")
			
			magnet.Size = splitInfo[0] + " " + splitInfo[1]
			magnet.Quality = splitInfo[2]
			magnet.Link = magnetLinks[i]

			movie.Magnets = append(movie.Magnets, *magnet)
		}
		
		movies = append(movies, *movie)
		
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

	err := c.Visit(url)
	if err != nil {
	 log.Fatal(err)
	}

	return movies
}

func MovieSearchResults(query string) *SearchResults{
	c := colly.NewCollector(
		
	)

	c.Limit(&colly.LimitRule{
		Parallelism: 3,
		Delay:       500 * time.Millisecond ,
	})

	c.WithTransport(&http.Transport{
        TLSClientConfig: &tls.Config{InsecureSkipVerify: true},
    })

	sr := &SearchResults{}
	movies := []Movie{}

	c.OnHTML(".content",func(h *colly.HTMLElement){
		noResults := h.ChildText("h1")
		if noResults!= ""{
			sr.Msg = fmt.Sprintf("No results found for '%s'",query)
			return 
		}
	})

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
		
		for i:=0; i<len(linkInfos); i++{
			magnet := &Magnet{}
			
			info := linkInfos[i]
			splitInfo := strings.Split(info," ")
			
			if len(splitInfo) == 3{
				magnet.Size = splitInfo[0] + " " + splitInfo[1]
				magnet.Quality = splitInfo[2]
			}else if len(splitInfo)==2{
				magnet.Size = splitInfo[0]
				magnet.Quality = splitInfo[1]
			}

			magnet.Link = magnetLinks[i]

			movie.Magnets = append(movie.Magnets, *magnet)
		}
		
		movies = append(movies, *movie)

	})

	c.OnHTML(".boxed",func(h *colly.HTMLElement) {
		h.Request.Visit(h.ChildAttr("a","href"))
	})
	
	//pagination scraping
	// for i:=2;i<5;i++{
	// 	c.Visit(fmt.Sprintf("https://www.5movierulz.spa/search_movies/page/%d?s=hi",i))
	// }

	c.OnResponse(func(r *colly.Response) {
		// fmt.Println("\nGot response from ", r.Request.URL)
	})

	c.OnError(func(r *colly.Response, err error) {
		log.Println(err)
	})

	err := c.Visit(fmt.Sprintf("https://www.5movierulz.gdn/search_movies?s=%s",query))
	if err != nil {
		log.Println(err)
	}
	// if len(movies)!= 0{
	// 	sr.Movies = movies
	// }
	sr.Movies = movies
	return sr
}
