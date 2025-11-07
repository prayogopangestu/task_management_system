package service

import (
	"backend/internal/dto"
	"backend/internal/models"
	"backend/internal/repository"
	"backend/internal/utils"
	"context"
	"errors"
	"fmt"
	"time"
)

type AuthService interface {
	Login(ctx context.Context, req dto.LoginRequest) (*dto.AuthResponse, error)
	Register(ctx context.Context, req dto.RegisterRequest) (*dto.AuthResponse, error)
	ChangePassword(ctx context.Context, accountID uint, req dto.ChangePasswordRequest) error
	ValidateAccount(ctx context.Context, email, password string) (*models.Account, error)
}

type authService struct {
	accountRepo repository.AccountRepository
	jwtService  JWTService
}

func NewAuthService(accountRepo repository.AccountRepository, jwtService JWTService) AuthService {
	return &authService{
		accountRepo: accountRepo,
		jwtService:  jwtService,
	}
}

func (s *authService) Login(ctx context.Context, req dto.LoginRequest) (*dto.AuthResponse, error) {
	// Get account by email
	account, err := s.accountRepo.GetByEmail(ctx, req.Email)
	if err != nil {
		return nil, fmt.Errorf("database error: %v", err)
	}

	// cek akun jika nil (not found)
	if account == nil {
		return nil, errors.New("invalid email or password")
	}

	// cek akun jika active
	if !account.IsActive {
		return nil, errors.New("account is deactivated")
	}

	// Validasi password
	if !utils.VerifyPassword(req.Password, account.Password) {
		return nil, errors.New("invalid email or password")
	}

	// Generate JWT token
	token := s.jwtService.GenerateToken(string(rune(account.ID)), account.Email)

	// Update last login
	s.accountRepo.UpdateLastLogin(ctx, account.ID)

	// Create response
	authResponse := &dto.AuthResponse{
		Account:     s.toAccountResponse(account),
		AccessToken: token,
		TokenType:   "Bearer",
		ExpiresAt:   time.Now().Add(24 * time.Hour).Format(time.RFC3339),
	}

	return authResponse, nil
}

func (s *authService) Register(ctx context.Context, req dto.RegisterRequest) (*dto.AuthResponse, error) {
	// Check jika akun ada
	existingByEmail, err := s.accountRepo.GetByEmail(ctx, req.Email)
	if err != nil {
		return nil, fmt.Errorf("database error: %v", err)
	}

	if existingByEmail != nil {
		return nil, errors.New("email already registered")
	}

	// Hash password
	hashedPassword, err := utils.HashPassword(req.Password)
	if err != nil {
		return nil, errors.New("failed to hash password")
	}

	// Create account
	account := &models.Account{
		Name:     req.Name,
		Email:    req.Email,
		Password: hashedPassword,
		IsActive: true,
	}

	if err := s.accountRepo.Create(ctx, account); err != nil {
		return nil, err
	}

	// Generate JWT token
	token := s.jwtService.GenerateToken(string(rune(account.ID)), account.Email)

	// Create response
	authResponse := &dto.AuthResponse{
		Account:     s.toAccountResponse(account),
		AccessToken: token,
		TokenType:   "Bearer",
		ExpiresAt:   time.Now().Add(24 * time.Hour).Format(time.RFC3339),
	}

	return authResponse, nil
}

func (s *authService) ChangePassword(ctx context.Context, accountID uint, req dto.ChangePasswordRequest) error {
	account, err := s.accountRepo.GetByID(ctx, accountID)
	if err != nil {
		return errors.New("account not found")
	}

	// Verifikasi password lama
	if !utils.VerifyPassword(req.OldPassword, account.Password) {
		return errors.New("old password is incorrect")
	}

	// Hash password baru
	hashedPassword, err := utils.HashPassword(req.NewPassword)
	if err != nil {
		return errors.New("failed to hash password")
	}

	account.Password = hashedPassword
	return s.accountRepo.Update(ctx, account)
}

func (s *authService) ValidateAccount(ctx context.Context, email, password string) (*models.Account, error) {

	account, err := s.accountRepo.GetByEmail(ctx, email)
	if err != nil {
		return nil, err
	}

	// Cek apakah akun nil
	if account == nil {
		return nil, errors.New("account not found")
	}

	if !utils.VerifyPassword(password, account.Password) {
		return nil, errors.New("invalid password")
	}

	return account, nil
}

func (s *authService) toAccountResponse(account *models.Account) *dto.AccountResponse {
	return &dto.AccountResponse{
		ID:        account.ID,
		Name:      account.Name,
		Email:     account.Email,
		IsActive:  account.IsActive,
		CreatedAt: account.CreatedAt.Format("2006-01-02T15:04:05Z"),
		UpdatedAt: account.UpdatedAt.Format("2006-01-02T15:04:05Z"),
	}
}
