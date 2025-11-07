# Task CRUD Fix Plan

## Steps to Complete

- [x] Update internal/dto/task.go to match Task model (Title, Description, Status, Deadline)
- [x] Update internal/repository/task_repository.go to standard CRUD for Task model
- [x] Update internal/service/task_service.go to simple CRUD without ledger logic
- [x] Update internal/controller/task_controller.go to have All, Insert, FindByID, Update, Delete methods
- [x] Update internal/delivery/api/task_routes.go to instantiate controller with TaskService and call correct methods

## Followup Steps

- [x] Run tests to verify CRUD works
- [x] Check database schema matches model
