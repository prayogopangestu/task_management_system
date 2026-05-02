/**
 * Task Service
 * Handles all task-related API calls
 */

import apiClient from './api';
import {
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  TaskFilterRequest,
  TaskListResponse,
} from '@/types';

class TaskService {
  /**
   * Get all tasks with pagination
   */
  async getAllTasks(page: number = 1, limit: number = 10) {
    try {
      const response = await apiClient.post<TaskListResponse>('/task/list', {
        page: page.toString(),
        limit: limit.toString(),
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get task by ID
   */
  async getTaskById(id: number): Promise<Task> {
    try {
      const response = await apiClient.get<Task>(`/task/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create new task
   */
  async createTask(data: CreateTaskRequest): Promise<Task> {
    try {
      const response = await apiClient.post<Task>('/task', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update task
   */
  async updateTask(id: number, data: UpdateTaskRequest): Promise<Task> {
    try {
      const response = await apiClient.put<Task>(`/task/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete task
   */
  async deleteTask(id: number): Promise<void> {
    try {
      await apiClient.delete(`/task/${id}`);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Filter tasks by status and date range
   */
  async filterTasks(filters: TaskFilterRequest): Promise<TaskListResponse> {
    try {
      const response = await apiClient.post<TaskListResponse>('/task/byfilter', filters);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const taskService = new TaskService();
export default taskService;
