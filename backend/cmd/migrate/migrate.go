package main

import (
	config "backend/config"
	"log"
)

// jika ingin migrate pakai ini dengan go run cmd/migrate/migrate.go
func main() {
	log.Println("Starting database migration...")

	var server config.Server
	db := server.SetupDatabaseConnection()
	defer config.CloseDatabaseConnection(db)

	log.Println("Database migrations completed successfully")
}
