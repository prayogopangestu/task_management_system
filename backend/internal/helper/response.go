package helper

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type Response struct {
	Success bool        `json:"success"`
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
	Error   interface{} `json:"error,omitempty"`
	Meta    interface{} `json:"meta,omitempty"`
	Status  string      `json:"status"`
}

type PaginationMeta struct {
	Page    int   `json:"page"`
	Limit   int   `json:"limit"`
	Total   int64 `json:"total"`
	HasNext bool  `json:"has_next"`
}

func SuccessResponse(c *gin.Context, message string, data interface{}) {
	c.JSON(http.StatusOK, Response{
		Success: true,
		Message: message,
		Data:    data,
	})
}

func CreatedResponse(c *gin.Context, message string, data interface{}) {
	c.JSON(http.StatusCreated, Response{
		Success: true,
		Message: message,
		Data:    data,
	})
}

func JSONPaginatedResponse(c *gin.Context, message string, data interface{}, total int64, page, limit int) {
	hasNext := (int64(page) * int64(limit)) < total
	meta := PaginationMeta{
		Page:    page,
		Limit:   limit,
		Total:   total,
		HasNext: hasNext,
	}

	c.JSON(http.StatusOK, Response{
		Success: true,
		Message: message,
		Data:    data,
		Meta:    meta,
	})
}

// BuildSuccessResponse untuk response sukses
func BuildSuccessResponse(message string, data interface{}) Response {
	return Response{
		Status:  "error",
		Message: message,
		Data:    data,
	}
}

// BuildErrorResponse untuk response error
func BuildErrorResponse(message string, error string, data interface{}) Response {
	return Response{
		Status:  "error",
		Message: message,
		Error:   error,
		Data:    data,
	}
}

// JSONSuccess untuk mengirim response sukses dengan HTTP status code
func JSONSuccess(c *gin.Context, message string, data interface{}) {
	response := BuildSuccessResponse(message, data)
	c.JSON(http.StatusOK, response)
}

// JSONError untuk mengirim response error dengan HTTP status code
func JSONError(c *gin.Context, statusCode int, message string, error string) {
	response := BuildErrorResponse(message, error, nil)
	c.JSON(statusCode, response)
}

// JSONValidationError untuk error validasi
func JSONValidationError(c *gin.Context, errors interface{}) {
	response := Response{
		Status:  "error",
		Message: "Validation failed",
		Error:   errors,
	}
	c.JSON(http.StatusBadRequest, response)
}
