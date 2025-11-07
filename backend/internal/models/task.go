package models

import (
	"time"
)

type Task struct {
	ID              uint      `gorm:"primaryKey" json:"id"`
	CreateAccountID uint      `gorm:"column:create_accounts_id;NOT NULL" json:"create_accounts_id"`
	CreateUser      *Account  `gorm:"foreignKey:CreateAccountID;constraint:onDelete:RESTRICT,onUpdate:RESTRICT" json:"create_accounts"`
	UpdateAccountID *uint     `gorm:"column:update_accounts_id" json:"update_accounts_id"`
	UpdateUser      *Account  `gorm:"foreignKey:UpdateAccountID;constraint:onDelete:RESTRICT,onUpdate:RESTRICT" json:"update_accounts"`
	AccountID       uint      `gorm:"column:accounts_id;NOT NULL" json:"accounts_id"`
	Account         *Account  `gorm:"foreignKey:AccountID;constraint:onDelete:RESTRICT,onUpdate:RESTRICT" json:"accounts"`
	Title           string    `gorm:"column:title" json:"title"`
	Description     string    `gorm:"column:description" json:"description"`
	Status          string    `gorm:"column:status" json:"status"`
	Deadline        time.Time `gorm:"column:deadline" json:"deadline"`
}

func (t *Task) TableName() string {
	return "Tasks"
}
