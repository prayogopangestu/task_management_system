/**
 * useTask Hook
 * Custom hook for task management using Redux
 */

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchTasks,
  fetchTaskById,
  createNewTask,
  updateExistingTask,
  deleteExistingTask,
  filterTasksList,
  clearError,
  clearCurrentTask,
} from '@/store/slices/taskSlice';
import { Task, CreateTaskRequest, UpdateTaskRequest, TaskFilterRequest } from '@/types';

interface UseTaskReturn {
  tasks: Task[];
  currentTask: Task | null;
  isLoading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
  getTasks: (page?: number, limit?: number) => Promise<void>;
  getTaskById: (id: number) => Promise<void>;
  createTask: (data: CreateTaskRequest) => Promise<void>;
  updateTask: (id: number, data: UpdateTaskRequest) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  filterTasks: (filters: TaskFilterRequest) => Promise<void>;
  clearTaskError: () => void;
  clearTask: () => void;
}

export const useTask = (): UseTaskReturn => {
  const dispatch = useAppDispatch();
  const { tasks, currentTask, isLoading, error, total, page, limit } = useAppSelector(
    (state) => state.task
  );

  const getTasks = async (pageNum: number = 1, limitNum: number = 10) => {
    try {
      await dispatch(fetchTasks({ page: pageNum, limit: limitNum })).unwrap();
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };

  const getTaskById = async (id: number) => {
    try {
      await dispatch(fetchTaskById(id)).unwrap();
    } catch (error) {
      console.error('Failed to fetch task:', error);
    }
  };

  const createTask = async (data: CreateTaskRequest) => {
    try {
      await dispatch(createNewTask(data)).unwrap();
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const updateTask = async (id: number, data: UpdateTaskRequest) => {
    try {
      await dispatch(updateExistingTask({ id, data })).unwrap();
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const deleteTask = async (id: number) => {
    try {
      await dispatch(deleteExistingTask(id)).unwrap();
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const filterTasks = async (filters: TaskFilterRequest) => {
    try {
      await dispatch(filterTasksList(filters)).unwrap();
    } catch (error) {
      console.error('Failed to filter tasks:', error);
    }
  };

  const clearTaskError = () => {
    dispatch(clearError());
  };

  const clearTask = () => {
    dispatch(clearCurrentTask());
  };

  return {
    tasks,
    currentTask,
    isLoading,
    error,
    total,
    page,
    limit,
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    filterTasks,
    clearTaskError,
    clearTask,
  };
};
