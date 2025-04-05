package util

import (
	"fmt"
	"log"
	"os"
	"path/filepath"
	"time"
)

func CreateDownloadsDir(){
	if _, err := os.Stat("./downloads"); err != nil {
		if os.IsNotExist(err) {
			if err := os.Mkdir("./downloads", os.ModePerm); err != nil {
				fmt.Println("Error creating directory:", err)
			} else {
				fmt.Println("created a new Dir for downloads")
			}
		} else {
			fmt.Println(err)
		}
	} else {
		dirInfo, err := os.Stat("./downloads")

		if err != nil {
			fmt.Println("error reading the Dir.", err)
			return
		}
		fmt.Printf("%v directory already exists. perm: %v\n", dirInfo.Name(), dirInfo.Mode())
	}
}

func MonitorDownloadsDir(closeSignal chan os.Signal){

	for{
		select {
		case <-closeSignal:
			log.Println("monitoring stopped.")
			return
		default:
			files, err := os.ReadDir("./downloads")
			if err!=nil{
				log.Println("error reading dir: ",err)
			}
			fmt.Println("files in 'downloads' dir")
			fmt.Println(files)
			for _,file := range files{
				
				info,err := os.Stat(filepath.Join("./downloads", file.Name()))
				if err!=nil{
					log.Println(err)
				}

				if time.Since(info.ModTime()) > 3*time.Hour + 30*time.Minute { 
					os.Remove(filepath.Join("./downloads", file.Name()))
					log.Println("deleted ", file.Name())
				}
			}
			time.Sleep(1*time.Hour)
		}
	}
	

}