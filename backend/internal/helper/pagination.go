package helper

import "strconv"

type Pagination struct {
	Page  int
	Limit int
}

func GetPagination(pageStr, limitStr string) Pagination {
	page, _ := strconv.Atoi(pageStr)
	if page < 1 {
		page = 1
	}

	limit, _ := strconv.Atoi(limitStr)
	if limit < 1 {
		limit = 50
	}
	if limit > 1000 {
		limit = 1000
	}

	return Pagination{
		Page:  page,
		Limit: limit,
	}
}

func (p Pagination) GetOffset() int {
	return (p.Page - 1) * p.Limit
}
