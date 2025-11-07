package repository

import (
	"backend/internal/dto"
	"backend/internal/models"
	"context"
	"strconv"

	"gorm.io/gorm"
)

type TaskRepository interface {
	Create(ctx context.Context, task *models.Task) error
	GetAll(ctx context.Context, req *dto.TaskListRequest) ([]models.Task, int64, error)
	GetByStatus(ctx context.Context, status string) ([]models.Task, error)
	GetByID(ctx context.Context, id uint) (*models.Task, error)
	Update(ctx context.Context, task *models.Task) error
	Delete(ctx context.Context, id uint) error
}

type taskRepository struct {
	db *gorm.DB
}

func NewTaskRepository(db *gorm.DB) TaskRepository {
	return &taskRepository{db: db}
}

func (r *taskRepository) Create(ctx context.Context, task *models.Task) error {
	return r.db.WithContext(ctx).Create(task).Error
}

func (r *taskRepository) GetAll(ctx context.Context, req *dto.TaskListRequest) ([]models.Task, int64, error) {
	limits, _ := strconv.Atoi(req.Limit)
	pages, _ := strconv.Atoi(req.Page)
	var count_ int64
	offset := (pages - 1) * limits
	var tasks []models.Task

	queryBuilder := r.db.WithContext(ctx).Model(&models.Task{})

	if req.Search != nil {
		queryBuilder = queryBuilder.Where("title ILIKE ? OR description ILIKE ?",
			"%"+*req.Search+"%",
			"%"+*req.Search+"%",
		)
	}

	if req.Status != nil {
		queryBuilder = queryBuilder.Where("status = ?", *req.Status)
	}

	if req.StartDate != nil && req.EndDate != nil {
		queryBuilder = queryBuilder.Where("deadline >= ? AND deadline <= ?", *req.StartDate, *req.EndDate)
	}

	prosesCount := queryBuilder.Count(&count_)
	if prosesCount.Error != nil {
		return nil, 0, prosesCount.Error
	}

	proses := queryBuilder.
		Preload("CreateUser").
		Preload("UpdateUser").
		Preload("Account").
		Limit(limits).
		Offset(offset).
		Order(req.Order).
		Find(&tasks)

	if proses.Error != nil {
		return nil, 0, proses.Error
	}

	return tasks, count_, nil
}

func (r *taskRepository) GetByID(ctx context.Context, id uint) (*models.Task, error) {
	var task models.Task
	err := r.db.WithContext(ctx).
		Preload("CreateUser").
		Preload("UpdateUser").
		Preload("Account").
		First(&task, id).Error
	if err != nil {
		return nil, err
	}
	return &task, nil
}

func (r *taskRepository) Update(ctx context.Context, task *models.Task) error {
	return r.db.WithContext(ctx).Save(task).Error
}

func (r *taskRepository) Delete(ctx context.Context, id uint) error {
	return r.db.WithContext(ctx).Delete(&models.Task{}, id).Error
}

func (r *taskRepository) GetByStatus(ctx context.Context, status string) ([]models.Task, error) {
	var tasks []models.Task
	err := r.db.WithContext(ctx).
		Preload("CreateUser").
		Preload("UpdateUser").
		Preload("Account").
		Where("status = ?", status).
		Find(&tasks).Error
	return tasks, err
}
