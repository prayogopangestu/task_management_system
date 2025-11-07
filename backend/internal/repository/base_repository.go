package repository

import (
	"context"

	"gorm.io/gorm"
)

type BaseRepository struct {
	db *gorm.DB
}

func NewBaseRepository(db *gorm.DB) *BaseRepository {
	return &BaseRepository{db: db}
}

func (r *BaseRepository) DB() *gorm.DB {
	return r.db
}

func (r *BaseRepository) WithTransaction(tx *gorm.DB) *BaseRepository {
	return &BaseRepository{db: tx}
}

func (r *BaseRepository) Begin() *BaseRepository {
	return r.WithTransaction(r.db.Begin())
}

func (r *BaseRepository) Commit() error {
	return r.db.Commit().Error
}

func (r *BaseRepository) Rollback() error {
	return r.db.Rollback().Error
}

func (r *BaseRepository) Create(ctx context.Context, model interface{}) error {
	return r.db.WithContext(ctx).Create(model).Error
}

func (r *BaseRepository) FindByID(ctx context.Context, model interface{}, id uint) error {
	return r.db.WithContext(ctx).First(model, id).Error
}

func (r *BaseRepository) Update(ctx context.Context, model interface{}) error {
	return r.db.WithContext(ctx).Save(model).Error
}

func (r *BaseRepository) Delete(ctx context.Context, model interface{}) error {
	return r.db.WithContext(ctx).Delete(model).Error
}
