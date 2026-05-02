# Redux Migration Guide

## Overview
Project ini telah berhasil dimigrasi dari React Hooks + Local Storage ke **Redux Toolkit** untuk state management yang lebih scalable dan maintainable.

## Struktur Redux

### Store Structure
```
src/store/
├── store.ts              # Redux store configuration
├── hooks.ts              # Typed Redux hooks (useAppDispatch, useAppSelector)
├── index.ts              # Export all store-related items
└── slices/
    ├── authSlice.ts      # Authentication state & actions
    └── taskSlice.ts      # Task management state & actions
```

## Key Changes

### 1. **Auth State Management**

#### Before (Hooks)
```typescript
const { user, isAuthenticated, isLoading, error, login, logout } = useAuth();
```

#### After (Redux)
```typescript
const { user, isAuthenticated, isLoading, error, login, logout } = useAuth();
// Internally uses Redux dispatch and selectors
```

**Auth Slice Features:**
- `loginUser` - Async thunk untuk login
- `checkAuth` - Async thunk untuk check token validity
- `logout` - Synchronous action untuk logout
- `clearError` - Clear error state

### 2. **Task State Management**

#### Before (Hooks)
```typescript
const {
  tasks,
  isLoading,
  error,
  total,
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  filterTasks,
} = useTask();
```

#### After (Redux)
```typescript
const {
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
} = useTask();
```

**Task Slice Features:**
- `fetchTasks` - Get all tasks with pagination
- `fetchTaskById` - Get single task
- `createNewTask` - Create new task
- `updateExistingTask` - Update task
- `deleteExistingTask` - Delete task
- `filterTasksList` - Filter tasks by criteria
- `clearError` - Clear error state
- `clearCurrentTask` - Clear current task

### 3. **Redux Hooks**

File: `src/store/hooks.ts`

```typescript
// Use these instead of plain react-redux hooks
import { useAppDispatch, useAppSelector } from '@/store/hooks';

// In components:
const dispatch = useAppDispatch();
const state = useAppSelector((state) => state.auth);
```

### 4. **Provider Setup**

File: `src/app/providers.tsx`

Redux Provider dibungkus dalam client component dan diintegrasikan ke layout:

```typescript
// src/app/layout.tsx
import { Providers } from "./providers";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

## Usage Examples

### Login Page
```typescript
'use client';

import { useAuth } from '@/hooks/useAuth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    // JSX...
  );
}
```

### Dashboard Page
```typescript
'use client';

import { useAuth } from '@/hooks/useAuth';
import { useTask } from '@/hooks/useTask';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const {
    tasks,
    isLoading,
    getTasks,
    createTask,
    updateTask,
    deleteTask,
  } = useTask();

  useEffect(() => {
    getTasks(1, 10);
  }, []);

  // JSX...
}
```

## Redux DevTools

Redux Toolkit automatically includes Redux DevTools support. Install the browser extension:
- [Redux DevTools Extension](https://github.com/reduxjs/redux-devtools-extension)

Then you can inspect state changes in browser DevTools.

## Benefits of Redux

✅ **Centralized State** - Single source of truth  
✅ **Predictable State Updates** - Actions & reducers  
✅ **Time-Travel Debugging** - Redux DevTools  
✅ **Middleware Support** - Async operations with thunks  
✅ **Better Performance** - Optimized selectors  
✅ **Scalability** - Easy to add new features  
✅ **Testing** - Easier to test pure functions  

## Migration Checklist

- [x] Install Redux Toolkit & React-Redux
- [x] Create store configuration
- [x] Create auth slice with async thunks
- [x] Create task slice with async thunks
- [x] Create typed hooks
- [x] Create Providers component
- [x] Update layout.tsx with Providers
- [x] Update useAuth hook to use Redux
- [x] Update useTask hook to use Redux
- [x] Update login page
- [x] Update dashboard page
- [x] Build verification

## Next Steps

1. **Testing** - Add unit tests for slices and thunks
2. **Middleware** - Add custom middleware if needed
3. **Persistence** - Add redux-persist for localStorage integration
4. **Selectors** - Create reusable selectors with reselect
5. **Error Handling** - Enhance error handling in slices

## Troubleshooting

### Issue: "Module has already exported a member named 'clearError'"
**Solution:** Use explicit re-exports in store/index.ts to avoid naming conflicts

### Issue: "Cannot read property 'user' of undefined"
**Solution:** Ensure Providers component wraps your app in layout.tsx

### Issue: "Async thunk rejected"
**Solution:** Check network requests and error handling in slice extraReducers

## Resources

- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [Redux Thunks](https://redux-toolkit.js.org/usage/usage-guide#async-thunks)
- [React-Redux Hooks](https://react-redux.js.org/api/hooks)
- [Redux DevTools](https://github.com/reduxjs/redux-devtools-extension)
