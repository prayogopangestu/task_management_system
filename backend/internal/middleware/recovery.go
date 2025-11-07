package middleware

import (
	"net/http"

	"backend/internal/helper"

	"github.com/gin-gonic/gin"
)

func Recovery() gin.HandlerFunc {
	return func(c *gin.Context) {
		defer func() {
			if err := recover(); err != nil {
				helper.JSONError(c, http.StatusInternalServerError, "Internal server error", err.(error).Error())
				c.Abort()
			}
		}()
		c.Next()
	}
}
