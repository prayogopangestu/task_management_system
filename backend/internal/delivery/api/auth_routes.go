package api

import (
	"backend/internal/controller"
	"backend/internal/middleware"
	"backend/internal/repository"
	"backend/internal/service"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func AuthRoutes(r *gin.RouterGroup, db *gorm.DB, jwtService service.JWTService) {
	var (
		accountRepo    repository.AccountRepository = repository.NewAccountRepository(db)
		authService    service.AuthService          = service.NewAuthService(accountRepo, jwtService)
		authController *controller.AuthController   = controller.NewAuthController(authService)
	)

	// Public routes
	auth := r.Group("/auth")
	{
		auth.POST("/login", authController.Login)
		auth.POST("/register", authController.Register)
	}

	// Protected routes
	protected := auth.Group("")
	protected.Use(middleware.AuthorizeJWT(jwtService))
	{
		protected.GET("/profile", authController.GetProfile)
		protected.POST("/change-password", authController.ChangePassword)
	}
}
