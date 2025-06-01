# Build Stage
FROM golang:1.24 AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN go build -o bs-backend

# Run Stage
FROM debian:bookworm-slim

WORKDIR /app

# Copy only the binary
COPY --from=builder /app/bs-backend .
COPY --from=builder /app/.env .

RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates && rm -rf /var/lib/apt/lists/*

EXPOSE 3000

CMD ["./bs-backend"]
