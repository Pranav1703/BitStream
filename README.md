# BitStream
BitStream is a web-based application that allows users to stream videos directly from magnet links without waiting for full downloads.

## getting started
### Prerequisites
- Go (1.18+)  
- Node.js (16+)  
- Docker (optional)  
- PostgreSQL  

Clone the repo
```bash
git clone https://github.com/your-username/bitstream.git
cd bitstream
```
### env
frontend/env
```
VITE_SERVER="{your-backend-url}"
```

backend/env
```
DB_USER=
DB_PASS=
DB_HOST=
DB_PORT=
DB_NAME=
SECRET_KEY=
```
Set DB_HOST=localhost if running the backend locally.  
Set DB_HOST=db if using Docker Compose (where db is the name of the database service).

### Running the App Locally
Backend
```bash
cd backend
go run main.go
```

frontend
```bash
cd frontend
npm install
npm run dev
```

## RoadMap
- [x] Magnet link support
- [x] File selection before streaming
- [x] Watchlist/bookmark system
- [ ] Subtitle support (via FFmpeg)
- [ ] Streaming quality selector
