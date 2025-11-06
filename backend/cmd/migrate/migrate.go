package main

import (
	config "backend/config"
	"log"
)

func main() {
	log.Println("Starting database migration...")

	// Setup database connection using Server style
	var server config.Server
	db := server.SetupDatabaseConnection()
	defer config.CloseDatabaseConnection(db)

	log.Println("✅ Database migrations completed successfully")
}
