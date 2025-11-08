package service

import (
	"backend/internal/dto"
	"backend/internal/models"
	"backend/internal/repository"
	"context"
	"errors"
)

type TaskService interface {
	CreateTask(ctx context.Context, req dto.CreateTaskRequest, userID uint) (*dto.TaskResponse, error)
	GetAllTasks(ctx context.Context, req dto.TaskListRequest) ([]dto.TaskResponse, int64, error)
	GetTasksByStatus(ctx context.Context, status string) ([]dto.TaskResponse, error)
	GetTaskByID(ctx context.Context, id uint) (*dto.TaskResponse, error)
	UpdateTask(ctx context.Context, id uint, req dto.UpdateTaskRequest, userID uint) (*dto.TaskResponse, error)
	DeleteTask(ctx context.Context, id uint) error
	GetTasksByFilter(ctx context.Context, req dto.TaskFilterRequest) ([]dto.TaskResponse, error)
}

type taskService struct {
	taskRepo repository.TaskRepository
}

func NewTaskService(taskRepo repository.TaskRepository) TaskService {
	return &taskService{
		taskRepo: taskRepo,
	}
}

func (s *taskService) CreateTask(ctx context.Context, req dto.CreateTaskRequest, userID uint) (*dto.TaskResponse, error) {
	if req.Title == "" {
		return nil, errors.New("title is required")
	}

	task := &models.Task{
		CreateAccountID: userID,
		AccountID:       req.AccountID,
		Title:           req.Title,
		Description:     req.Description,
		Status:          req.Status,
		Deadline:        req.Deadline,
	}

	if err := s.taskRepo.Create(ctx, task); err != nil {
		return nil, err
	}

	createdTask, err := s.taskRepo.GetByID(ctx, task.ID)
	if err != nil {
		return nil, err
	}

	return s.toTaskResponse(createdTask), nil
}

func (s *taskService) GetAllTasks(ctx context.Context, req dto.TaskListRequest) ([]dto.TaskResponse, int64, error) {
	tasks, count, err := s.taskRepo.GetAll(ctx, &req)
	if err != nil {
		return nil, 0, err
	}

	responses := make([]dto.TaskResponse, len(tasks))
	for i, task := range tasks {
		responses[i] = *s.toTaskResponse(&task)
	}

	return responses, count, nil
}

func (s *taskService) GetTaskByID(ctx context.Context, id uint) (*dto.TaskResponse, error) {
	task, err := s.taskRepo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}

	return s.toTaskResponse(task), nil
}

func (s *taskService) UpdateTask(ctx context.Context, id uint, req dto.UpdateTaskRequest, userID uint) (*dto.TaskResponse, error) {
	task, err := s.taskRepo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}

	if req.Title != nil {
		task.Title = *req.Title
	}
	if req.Description != nil {
		task.Description = *req.Description
	}
	if req.Status != nil {
		task.Status = *req.Status
	}
	if req.Deadline != nil {
		task.Deadline = *req.Deadline
	}
	task.UpdateAccountID = &userID

	if err := s.taskRepo.Update(ctx, task); err != nil {
		return nil, err
	}

	updatedTask, err := s.taskRepo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}

	return s.toTaskResponse(updatedTask), nil
}

func (s *taskService) DeleteTask(ctx context.Context, id uint) error {
	return s.taskRepo.Delete(ctx, id)
}

func (s *taskService) GetTasksByStatus(ctx context.Context, status string) ([]dto.TaskResponse, error) {
	tasks, err := s.taskRepo.GetByStatus(ctx, status)
	if err != nil {
		return nil, err
	}

	responses := make([]dto.TaskResponse, len(tasks))
	for i, task := range tasks {
		responses[i] = *s.toTaskResponse(&task)
	}

	return responses, nil
}

func (s *taskService) toTaskResponse(task *models.Task) *dto.TaskResponse {
	return &dto.TaskResponse{
		ID:              task.ID,
		CreateAccountID: task.CreateAccountID,
		CreateUser:      task.CreateUser,
		UpdateAccountID: task.UpdateAccountID,
		UpdateUser:      task.UpdateUser,
		AccountID:       task.AccountID,
		Account:         task.Account,
		Title:           task.Title,
		Description:     task.Description,
		Status:          task.Status,
		Deadline:        task.Deadline,
	}
}

func (s *taskService) GetTasksByFilter(ctx context.Context, req dto.TaskFilterRequest) ([]dto.TaskResponse, error) {
	tasks, err := s.taskRepo.GetByFilter(ctx, req)
	if err != nil {
		return nil, err
	}

	responses := make([]dto.TaskResponse, len(tasks))
	for i, task := range tasks {
		responses[i] = *s.toTaskResponse(&task)
	}

	return responses, nil
}
