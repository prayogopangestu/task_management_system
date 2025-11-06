package main

import (
	config "backend/config"
	"log"
)

func main() {
	log.Println("Starting database migration...")

	var server config.Server
	db := server.SetupDatabaseConnection()
	defer config.CloseDatabaseConnection(db)

	log.Println("✅ Database migrations completed successfully")
}
