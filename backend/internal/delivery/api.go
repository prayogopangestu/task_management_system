package api

import (
	"os"

	"backend/config"
	"backend/internal/delivery/api"
	"backend/internal/repository"
	"backend/internal/service"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

var server = config.Server{}

var (
	db                *gorm.DB                     = server.SetupDatabaseConnection()
	jwtService        service.JWTService           = service.NewJWTService()
	accountRepository repository.AccountRepository = repository.NewAccountRepository(db)
	authService       service.AuthService          = service.NewAuthService(accountRepository, jwtService)
)

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Max-Age", "86400")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE, UPDATE")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Access-Control-Allow-Origin, Origin, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
		c.Writer.Header().Set("Access-Control-Expose-Headers", "Content-Length")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(200)
		} else {
			c.Next()
		}
	}
}

func InitializeRoutes() {
	defer config.CloseDatabaseConnection(db)

	r := gin.Default()
	r.MaxMultipartMemory = 8 << 20
	r.Use(CORSMiddleware())

	api.AuthRoutes(r.Group("/api"), db, jwtService)

	port := os.Getenv("APP_PORT")
	if port == "" {
		port = "5000"
	}
	r.Run(":" + port)
}
