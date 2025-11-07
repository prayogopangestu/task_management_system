package api

import (
	"backend/internal/controller"
	"backend/internal/middleware"
	"backend/internal/repository"
	"backend/internal/service"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func TaskRoutes(r *gin.RouterGroup, db *gorm.DB, jwtService service.JWTService) {
	var (
		repo        repository.TaskRepository  = repository.NewTaskRepository(db)
		taskService service.TaskService        = service.NewTaskService(repo)
		controller  *controller.TaskController = controller.NewTaskController(taskService)
	)

	taskGroup := r.Group("/task", middleware.AuthorizeJWT(jwtService))

	{
		taskGroup.GET("/", controller.All)
		taskGroup.POST("/", controller.Insert)
		taskGroup.GET("/:id", controller.FindByID)
		taskGroup.PUT("/:id", controller.Update)
		taskGroup.DELETE("/:id", controller.Delete)
	}
}
