/**
 * Store Index
 * Export store, hooks, and slices
 */

export { store } from './store';
export type { RootState, AppDispatch } from './store';
export { useAppDispatch, useAppSelector } from './hooks';
export {
  loginUser,
  checkAuth,
  logout as authLogout,
  clearError as authClearError,
} from './slices/authSlice';
export {
  fetchTasks,
  fetchTaskById,
  createNewTask,
  updateExistingTask,
  deleteExistingTask,
  filterTasksList,
  clearError as taskClearError,
  clearCurrentTask,
} from './slices/taskSlice';
