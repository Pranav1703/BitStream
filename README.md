# BitStream
BitStream is a web-based application that allows users to stream videos directly from magnet links without waiting for full downloads.

## getting started
### Prerequisites
**For running via Docker (Recommended):**
- Docker & Docker Compose

**For Local Development:**
- Go (1.24+)
- Node.js (22+)
- PostgreSQL (Local installation) 

Clone the repo
```bash
git clone https://github.com/your-username/bitstream.git
cd bitstream
```

## Running the App
### 1. Locally
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
create env files.
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
DB_NAME=BitStream
SECRET_KEY=
```
Set DB_HOST=localhost since you are running the backend locally.  

### 2. using docker
create .env in root folder
/.env
```
DB_USER={yourpostgresUsername}
DB_PASS={yourpostgresPassword}

DB_HOST=db
DB_PORT=5432
DB_NAME=BitStream
SECRET_KEY=replace_this-with_something_else_or-keep_it

# This creates the DB automatically on first run
POSTGRES_DB=BitStream
```
now run this command
```bash
docker compose up -d
```

## RoadMap
- [x] Magnet link support
- [x] File selection before streaming
- [x] Watchlist/bookmark system
- [ ] Subtitle support (via FFmpeg)
- [ ] Streaming quality selector
