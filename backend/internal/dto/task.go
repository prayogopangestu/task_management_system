package dto

import (
	"backend/internal/models"
	"time"
)

type CreateTaskRequest struct {
	Title       string    `json:"title" binding:"required"`
	Description string    `json:"description"`
	Status      string    `json:"status"`
	Deadline    time.Time `json:"deadline"`
	AccountID   uint      `json:"account_id" binding:"required"`
}

type UpdateTaskRequest struct {
	Title       *string    `json:"title"`
	Description *string    `json:"description"`
	Status      *string    `json:"status"`
	Deadline    *time.Time `json:"deadline"`
}

type TaskListRequest struct {
	Search    *string `json:"search"`
	Status    *string `json:"status"`
	StartDate *string `json:"start_date"`
	EndDate   *string `json:"end_date"`
	Limit     string  `json:"limit" default:"10"`
	Page      string  `json:"page" default:"1"`
	Order     string  `json:"order" default:"id desc"`
}

type TaskResponse struct {
	ID              uint            `json:"id"`
	CreateAccountID uint            `json:"create_accounts_id"`
	CreateUser      *models.Account `json:"create_accounts"`
	UpdateAccountID *uint           `json:"update_accounts_id"`
	UpdateUser      *models.Account `json:"update_accounts"`
	AccountID       uint            `json:"accounts_id"`
	Account         *models.Account `json:"accounts"`
	Title           string          `json:"title"`
	Description     string          `json:"description"`
	Status          string          `json:"status"`
	Deadline        time.Time       `json:"deadline"`
}
