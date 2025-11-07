package helper

import (
	"github.com/gin-gonic/gin/binding"
	"github.com/go-playground/validator/v10"
)

func SetupValidators() {
	if v, ok := binding.Validator.Engine().(*validator.Validate); ok {
		// Register custom validators
		v.RegisterValidation("iso4217", validateISO4217)
		v.RegisterValidation("amount", validateAmount)
	}
}

func validateISO4217(fl validator.FieldLevel) bool {
	currency := fl.Field().String()

	// Common currency codes
	validCurrencies := map[string]bool{
		"USD": true, "EUR": true, "GBP": true, "JPY": true,
		"CAD": true, "AUD": true, "CHF": true, "CNY": true,
		"IDR": true, "SGD": true, "MYR": true, "THB": true,
	}

	return validCurrencies[currency]
}

func validateAmount(fl validator.FieldLevel) bool {
	amount := fl.Field().Int()
	return amount != 0
}
