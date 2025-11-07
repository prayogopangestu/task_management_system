package repository

import (
	"backend/internal/models"
	"context"
	"errors"

	"gorm.io/gorm"
)

type AccountRepository interface {
	Create(ctx context.Context, account *models.Account) error
	GetByCode(ctx context.Context, code string) (*models.Account, error)
	GetByID(ctx context.Context, id uint) (*models.Account, error)
	GetByEmail(ctx context.Context, email string) (*models.Account, error)
	GetAccounts(ctx context.Context, limit, offset int) ([]models.Account, int64, error)
	UpdateBalance(ctx context.Context, accountID uint, amount int64) error
	Update(ctx context.Context, account *models.Account) error
	UpdateLastLogin(ctx context.Context, accountID uint) error
}

type accountRepository struct {
	*BaseRepository
}

func NewAccountRepository(db *gorm.DB) AccountRepository {
	return &accountRepository{
		BaseRepository: NewBaseRepository(db),
	}
}

func (r *accountRepository) Create(ctx context.Context, account *models.Account) error {
	return r.db.WithContext(ctx).Create(account).Error
}

func (r *accountRepository) GetByCode(ctx context.Context, code string) (*models.Account, error) {
	var account models.Account
	err := r.db.WithContext(ctx).Where("code = ?", code).First(&account).Error

	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, nil // tidak ditemukan → return nil, nil
	}

	if err != nil {
		return nil, err // error lain → return error
	}

	return &account, nil
}

func (r *accountRepository) GetByID(ctx context.Context, id uint) (*models.Account, error) {
	var account models.Account
	err := r.db.WithContext(ctx).First(&account, id).Error
	return &account, err
}

// Get account by email
func (r *accountRepository) GetByEmail(ctx context.Context, email string) (*models.Account, error) {
	var account models.Account
	err := r.db.WithContext(ctx).Where("email = ?", email).First(&account).Error

	//EXPLICITLY HANDLE "record not found"
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, nil // Return nil, nil jika tidak ditemukan
	}

	if err != nil {
		return nil, err // Return error untuk error lainnya
	}

	return &account, nil
}

func (r *accountRepository) GetAccounts(ctx context.Context, limit, offset int) ([]models.Account, int64, error) {
	var accounts []models.Account
	var total int64

	err := r.db.WithContext(ctx).Model(&models.Account{}).Count(&total).Error
	if err != nil {
		return nil, 0, err
	}

	err = r.db.WithContext(ctx).
		Limit(limit).
		Offset(offset).
		Order("created_at DESC").
		Find(&accounts).Error

	return accounts, total, err
}

func (r *accountRepository) UpdateBalance(ctx context.Context, accountID uint, amount int64) error {
	return r.db.WithContext(ctx).
		Model(&models.Account{}).
		Where("id = ?", accountID).
		Update("balance", gorm.Expr("balance + ?", amount)).
		Error
}

// NEW: Update account
func (r *accountRepository) Update(ctx context.Context, account *models.Account) error {
	return r.db.WithContext(ctx).Save(account).Error
}

// NEW: Update last login
func (r *accountRepository) UpdateLastLogin(ctx context.Context, accountID uint) error {
	return r.db.WithContext(ctx).
		Model(&models.Account{}).
		Where("id = ?", accountID).
		Update("last_login", "NOW()").
		Error
}
