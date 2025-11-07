package controller

import (
	"backend/internal/dto"
	"backend/internal/helper"
	"backend/internal/service"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type AuthController struct {
	authService service.AuthService
}

func NewAuthController(authService service.AuthService) *AuthController {
	return &AuthController{
		authService: authService,
	}
}

func (c *AuthController) Login(ctx *gin.Context) {
	var req dto.LoginRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		helper.JSONError(ctx, http.StatusBadRequest, "Invalid request", err.Error())
		return
	}

	authResponse, err := c.authService.Login(ctx.Request.Context(), req)
	if err != nil {
		helper.JSONError(ctx, http.StatusUnauthorized, "Login failed", err.Error())
		return
	}

	helper.SuccessResponse(ctx, "Login successful", authResponse)
}

func (c *AuthController) Register(ctx *gin.Context) {
	var req dto.RegisterRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		helper.JSONError(ctx, http.StatusBadRequest, "Invalid request", err.Error())
		return
	}

	authResponse, err := c.authService.Register(ctx.Request.Context(), req)
	if err != nil {
		helper.JSONError(ctx, http.StatusBadRequest, "Registration failed", err.Error())
		return
	}

	helper.CreatedResponse(ctx, "Account registered successfully", authResponse)
}

func (c *AuthController) ChangePassword(ctx *gin.Context) {
	accountID, exists := ctx.Get("user_id")
	if !exists {
		helper.JSONError(ctx, http.StatusUnauthorized, "Unauthorized", "User not authenticated")
		return
	}

	var req dto.ChangePasswordRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		helper.JSONError(ctx, http.StatusBadRequest, "Invalid request", err.Error())
		return
	}

	// Convert accountID to uint
	uid, err := strconv.ParseUint(accountID.(string), 10, 32)
	if err != nil {
		helper.JSONError(ctx, http.StatusBadRequest, "Invalid account ID", err.Error())
		return
	}

	if err := c.authService.ChangePassword(ctx.Request.Context(), uint(uid), req); err != nil {
		helper.JSONError(ctx, http.StatusBadRequest, "Failed to change password", err.Error())
		return
	}

	helper.SuccessResponse(ctx, "Password changed successfully", nil)
}

func (c *AuthController) GetProfile(ctx *gin.Context) {
	accountID, exists := ctx.Get("user_id")
	if !exists {
		helper.JSONError(ctx, http.StatusUnauthorized, "Unauthorized", "User not authenticated")
		return
	}

	// Convert accountID to uint
	uid, err := strconv.ParseUint(accountID.(string), 10, 32)
	if err != nil {
		helper.JSONError(ctx, http.StatusBadRequest, "Invalid account ID", err.Error())
		return
	}

	profile := map[string]interface{}{
		"account_id": uid,
		"email":      ctx.GetString("email"),
	}

	helper.SuccessResponse(ctx, "Profile retrieved successfully", profile)
}
