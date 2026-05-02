/**
 * Task Slice
 * Redux slice for task state management
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import taskService from '@/services/task.service';
import { Task, CreateTaskRequest, UpdateTaskRequest, TaskFilterRequest } from '@/types';
import { apiClient } from '@/services/api';

interface TaskState {
  tasks: Task[];
  currentTask: Task | null;
  isLoading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
}

const initialState: TaskState = {
  tasks: [],
  currentTask: null,
  isLoading: false,
  error: null,
  total: 0,
  page: 1,
  limit: 10,
};

// Async thunks
export const fetchTasks = createAsyncThunk(
  'task/fetchTasks',
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      const response = await taskService.getAllTasks(page, limit);
      return { data: response.data, total: response.total, page, limit };
    } catch (error: any) {
      const errorMsg = apiClient.handleError(error);
      return rejectWithValue(errorMsg.message);
    }
  }
);

export const fetchTaskById = createAsyncThunk(
  'task/fetchTaskById',
  async (id: number, { rejectWithValue }) => {
    try {
      const task = await taskService.getTaskById(id);
      return task;
    } catch (error: any) {
      const errorMsg = apiClient.handleError(error);
      return rejectWithValue(errorMsg.message);
    }
  }
);

export const createNewTask = createAsyncThunk(
  'task/createNewTask',
  async (data: CreateTaskRequest, { rejectWithValue }) => {
    try {
      const newTask = await taskService.createTask(data);
      return newTask;
    } catch (error: any) {
      const errorMsg = apiClient.handleError(error);
      return rejectWithValue(errorMsg.message);
    }
  }
);

export const updateExistingTask = createAsyncThunk(
  'task/updateExistingTask',
  async ({ id, data }: { id: number; data: UpdateTaskRequest }, { rejectWithValue }) => {
    try {
      const updatedTask = await taskService.updateTask(id, data);
      return updatedTask;
    } catch (error: any) {
      const errorMsg = apiClient.handleError(error);
      return rejectWithValue(errorMsg.message);
    }
  }
);

export const deleteExistingTask = createAsyncThunk(
  'task/deleteExistingTask',
  async (id: number, { rejectWithValue }) => {
    try {
      await taskService.deleteTask(id);
      return id;
    } catch (error: any) {
      const errorMsg = apiClient.handleError(error);
      return rejectWithValue(errorMsg.message);
    }
  }
);

export const filterTasksList = createAsyncThunk(
  'task/filterTasksList',
  async (filters: TaskFilterRequest, { rejectWithValue }) => {
    try {
      const response = await taskService.filterTasks(filters);
      return { data: response.data, total: response.total };
    } catch (error: any) {
      const errorMsg = apiClient.handleError(error);
      return rejectWithValue(errorMsg.message);
    }
  }
);

const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentTask: (state) => {
      state.currentTask = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Tasks
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Task By ID
    builder
      .addCase(fetchTaskById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTaskById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentTask = action.payload;
      })
      .addCase(fetchTaskById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create Task
    builder
      .addCase(createNewTask.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createNewTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks.unshift(action.payload);
        state.total += 1;
      })
      .addCase(createNewTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update Task
    builder
      .addCase(updateExistingTask.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateExistingTask.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.tasks.findIndex((task) => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
        if (state.currentTask?.id === action.payload.id) {
          state.currentTask = action.payload;
        }
      })
      .addCase(updateExistingTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Delete Task
    builder
      .addCase(deleteExistingTask.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteExistingTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
        state.total -= 1;
      })
      .addCase(deleteExistingTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Filter Tasks
    builder
      .addCase(filterTasksList.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(filterTasksList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(filterTasksList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentTask } = taskSlice.actions;
export default taskSlice.reducer;
