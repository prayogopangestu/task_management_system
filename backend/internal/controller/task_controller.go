package controller

import (
	"backend/internal/dto"
	"backend/internal/helper"
	"backend/internal/service"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type TaskController struct {
	taskService service.TaskService
}

func NewTaskController(taskService service.TaskService) *TaskController {
	return &TaskController{
		taskService: taskService,
	}
}

func (c *TaskController) All(ctx *gin.Context) {
	var req dto.TaskListRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		helper.JSONError(ctx, http.StatusBadRequest, "Invalid request", err.Error())
		return
	}

	// Set default values if not provided
	if req.Limit == "" {
		req.Limit = "10"
	}
	if req.Page == "" {
		req.Page = "1"
	}
	if req.Order == "" {
		req.Order = "id desc"
	}

	tasks, count, err := c.taskService.GetAllTasks(ctx.Request.Context(), req)
	if err != nil {
		helper.JSONError(ctx, http.StatusInternalServerError, "Failed to get tasks", err.Error())
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"data":  tasks,
		"total": count,
		"page":  req.Page,
		"limit": req.Limit,
	})
}

func (c *TaskController) Insert(ctx *gin.Context) {
	var req dto.CreateTaskRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		helper.JSONError(ctx, http.StatusBadRequest, "Invalid request", err.Error())
		return
	}

	userIDStr, exists := ctx.Get("user_id")
	if !exists {
		helper.JSONError(ctx, http.StatusUnauthorized, "Unauthorized", "User not authenticated")
		return
	}

	userID, err := strconv.ParseUint(userIDStr.(string), 10, 32)
	if err != nil {
		helper.JSONError(ctx, http.StatusBadRequest, "Invalid user ID", err.Error())
		return
	}

	task, err := c.taskService.CreateTask(ctx.Request.Context(), req, uint(userID))
	if err != nil {
		helper.JSONError(ctx, http.StatusInternalServerError, "Failed to create task", err.Error())
		return
	}

	helper.CreatedResponse(ctx, "Task created successfully", task)
}

func (c *TaskController) FindByID(ctx *gin.Context) {
	idStr := ctx.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		helper.JSONError(ctx, http.StatusBadRequest, "Invalid ID", err.Error())
		return
	}

	task, err := c.taskService.GetTaskByID(ctx.Request.Context(), uint(id))
	if err != nil {
		helper.JSONError(ctx, http.StatusNotFound, "Task not found", err.Error())
		return
	}

	ctx.JSON(http.StatusOK, task)
}

func (c *TaskController) FindByFilter(ctx *gin.Context) {
	var req dto.TaskFilterRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		helper.JSONError(ctx, http.StatusBadRequest, "Invalid request", err.Error())
		return
	}

	tasks, err := c.taskService.GetTasksByFilter(ctx.Request.Context(), req)
	if err != nil {
		helper.JSONError(ctx, http.StatusInternalServerError, "Failed to get tasks", err.Error())
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"data": tasks,
	})
}

func (c *TaskController) Update(ctx *gin.Context) {
	idStr := ctx.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		helper.JSONError(ctx, http.StatusBadRequest, "Invalid ID", err.Error())
		return
	}

	var req dto.UpdateTaskRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		helper.JSONError(ctx, http.StatusBadRequest, "Invalid request", err.Error())
		return
	}

	userIDStr, exists := ctx.Get("user_id")
	if !exists {
		helper.JSONError(ctx, http.StatusUnauthorized, "Unauthorized", "User not authenticated")
		return
	}

	userID, err := strconv.ParseUint(userIDStr.(string), 10, 32)
	if err != nil {
		helper.JSONError(ctx, http.StatusBadRequest, "Invalid user ID", err.Error())
		return
	}

	task, err := c.taskService.UpdateTask(ctx.Request.Context(), uint(id), req, uint(userID))
	if err != nil {
		helper.JSONError(ctx, http.StatusInternalServerError, "Failed to update task", err.Error())
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Task updated successfully", "data": task})
}

func (c *TaskController) Delete(ctx *gin.Context) {
	idStr := ctx.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		helper.JSONError(ctx, http.StatusBadRequest, "Invalid ID", err.Error())
		return
	}

	err = c.taskService.DeleteTask(ctx.Request.Context(), uint(id))
	if err != nil {
		helper.JSONError(ctx, http.StatusInternalServerError, "Failed to delete task", err.Error())
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Task deleted successfully"})
}
