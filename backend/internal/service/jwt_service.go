package service

import (
	"errors"
	"log"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v4"
)

// JWTService interface
type JWTService interface {
	GenerateToken(userID string, email string) string
	ValidateToken(token string) (*jwt.Token, error)
	ExtractTokenMetadata(token string) (map[string]interface{}, error)
}

type jwtService struct {
	secretKey string
	issuer    string
}

// NewJWTService membuat instance baru JWTService
func NewJWTService() JWTService {
	return &jwtService{
		secretKey: getSecretKey(),
		issuer:    "backend",
	}
}

func getSecretKey() string {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		secret = "backend_secret_key_2024" // default secret for development
	}
	return secret
}

// JWTClaim custom claims
type JWTClaim struct {
	UserID string `json:"user_id"`
	Email  string `json:"email"`
	jwt.RegisteredClaims
}

// GenerateToken membuat token JWT baru
func (j *jwtService) GenerateToken(userID string, email string) string {
	claims := &JWTClaim{
		UserID: userID,
		Email:  email,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)), // 24 jam
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			NotBefore: jwt.NewNumericDate(time.Now()),
			Issuer:    j.issuer,
			Subject:   email,
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(j.secretKey))
	if err != nil {
		log.Printf("Error generating token: %v", err)
		return ""
	}

	return tokenString
}

// ValidateToken memvalidasi token JWT
func (j *jwtService) ValidateToken(tokenString string) (*jwt.Token, error) {
	// Remove "Bearer " prefix if present
	if len(tokenString) > 7 && tokenString[:7] == "Bearer " {
		tokenString = tokenString[7:]
	}

	token, err := jwt.ParseWithClaims(tokenString, &JWTClaim{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected signing method")
		}
		return []byte(j.secretKey), nil
	})

	if err != nil {
		log.Printf("Error validating token: %v", err)
		return nil, err
	}

	if !token.Valid {
		return nil, errors.New("invalid token")
	}

	return token, nil
}

// ExtractTokenMetadata mengekstrak metadata dari token
func (j *jwtService) ExtractTokenMetadata(tokenString string) (map[string]interface{}, error) {
	token, err := j.ValidateToken(tokenString)
	if err != nil {
		return nil, err
	}

	claims, ok := token.Claims.(*JWTClaim)
	if !ok {
		return nil, errors.New("invalid token claims")
	}

	metadata := map[string]interface{}{
		"user_id": claims.UserID,
		"email":   claims.Email,
		"issuer":  claims.Issuer,
		"exp":     claims.ExpiresAt.Time.Unix(),
	}

	return metadata, nil
}
