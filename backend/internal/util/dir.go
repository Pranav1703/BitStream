package util

import (
	"log"
	"os"
	"path/filepath"
	"time"
)

func CreateDownloadsDir() {
	dirs := []string{"./downloads/video", "./downloads/subs"}
    for _, d := range dirs {
        if err := os.MkdirAll(d, os.ModePerm); err != nil {
            log.Printf("Error creating %s: %v", d, err)
        } else {
            log.Printf("Directory created: %s", d)
        }
    }
}

func MonitorVideoDir(closeSignal chan os.Signal) {

	for {
		select {
		case <-closeSignal:
			log.Println("monitoring stopped.")
			return
		default:
			targetDir := "./downloads/video"
			files, err := os.ReadDir(targetDir)
			if err != nil {
				log.Println("error reading dir: ", err)
				break
			}
			log.Println("files in './downloads/video' directory --> ", files)
			for _, file := range files {
				filePath := filepath.Join(targetDir, file.Name())
				info, err := os.Stat(filePath)
				if err != nil {
					log.Println(err)
					continue
				}

				if time.Since(info.ModTime()) > 3*time.Hour+30*time.Minute {
					os.Remove(filePath)
					log.Println("deleted ", file.Name())
				}
			}
			time.Sleep(1 * time.Hour)
		}
	}
}
