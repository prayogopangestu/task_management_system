# Frontend Structure - Quick Reference

Panduan cepat untuk menggunakan struktur frontend yang telah dibuat.

## 🚀 Quick Start

### Import Components
```typescript
import { Button, Input, Card } from '@/components';
```

### Import Hooks
```typescript
import { useAuth, useTask, useDebounce } from '@/hooks';
```

### Import Services
```typescript
import { authService, taskService } from '@/services';
```

### Import Utils
```typescript
import { formatDate, validateEmail, getLocalStorage } from '@/utils';
```

### Import Constants
```typescript
import { TASK_STATUS, ERROR_MESSAGES, ROUTES } from '@/constants';
```

### Import Types
```typescript
import { Task, AuthResponse, CreateTaskRequest } from '@/types';
```

## 📋 Common Tasks

### 1. Create a New Page
```typescript
// src/app/new-page/page.tsx
'use client';

import { useAuth } from '@/hooks';
import { Card, Button } from '@/components';

export default function NewPage() {
  const { user } = useAuth();

  return (
    <div>
      <Card>
        <h1>Welcome, {user?.name}</h1>
        <Button>Click me</Button>
      </Card>
    </div>
  );
}
```

### 2. Create a New Component
```typescript
// src/components/features/new/NewComponent.tsx
import React from 'react';
import { Card, Button } from '@/components';

interface NewComponentProps {
  title: string;
  onAction: () => void;
}

export const NewComponent: React.FC<NewComponentProps> = ({
  title,
  onAction,
}) => {
  return (
    <Card>
      <h2>{title}</h2>
      <Button onClick={onAction}>Action</Button>
    </Card>
  );
};
```

### 3. Create a New Service
```typescript
// src/services/new.service.ts
import apiClient from './api';

class NewService {
  async getData() {
    const response = await apiClient.get('/endpoint');
    return response.data;
  }

  async createData(data: any) {
    const response = await apiClient.post('/endpoint', data);
    return response.data;
  }
}

export const newService = new NewService();
```

### 4. Create a New Hook
```typescript
// src/hooks/useNew.ts
import { useState, useCallback } from 'react';
import { newService } from '@/services';

export const useNew = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await newService.getData();
      setData(result);
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { data, isLoading, error, fetchData };
};
```

### 5. Use Authentication
```typescript
import { useAuth } from '@/hooks';

export default function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Please login</div>;
  }

  return (
    <div>
      <p>Welcome, {user?.name}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### 6. Use Task Management
```typescript
import { useTask } from '@/hooks';
import { useEffect } from 'react';

export default function TasksPage() {
  const { tasks, isLoading, getTasks, createTask, deleteTask } = useTask();

  useEffect(() => {
    getTasks();
  }, []);

  const handleCreate = async () => {
    await createTask({
      title: 'New Task',
      description: 'Task description',
      status: 'todo',
      deadline: new Date().toISOString(),
      account_id: 1,
    });
  };

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          {tasks.map((task) => (
            <div key={task.id}>
              <h3>{task.title}</h3>
              <button onClick={() => deleteTask(task.id)}>Delete</button>
            </div>
          ))}
          <button onClick={handleCreate}>Create Task</button>
        </>
      )}
    </div>
  );
}
```

### 7. Use Utilities
```typescript
import { formatDate, validateEmail, truncate } from '@/utils';

// Date utilities
const formatted = formatDate('2024-05-02');
const relative = getRelativeTime('2024-05-02');

// String utilities
const title = toTitleCase('hello world');
const slug = slugify('Hello World');

// Validation utilities
const isValid = validateEmail('test@example.com');
const passwordCheck = validatePassword('MyPass123');

// Storage utilities
const token = getLocalStorage('token');
setLocalStorage('user', { id: 1, name: 'John' });
```

### 8. Use Constants
```typescript
import { TASK_STATUS, ERROR_MESSAGES, ROUTES } from '@/constants';

// Task status
if (task.status === TASK_STATUS.DONE) {
  // Task is done
}

// Error messages
console.log(ERROR_MESSAGES.INVALID_EMAIL);

// Routes
router.push(ROUTES.DASHBOARD);
```

## 🎨 Component Variants

### Button Variants
```typescript
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="danger">Danger</Button>
<Button variant="success">Success</Button>
```

### Button Sizes
```typescript
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
```

### Button States
```typescript
<Button disabled>Disabled</Button>
<Button isLoading>Loading...</Button>
```

### Input with Validation
```typescript
<Input
  label="Email"
  type="email"
  error={error}
  helperText="Enter a valid email"
  required
/>
```

### Card with Header and Footer
```typescript
<Card
  header={<h2>Card Title</h2>}
  footer={<Button>Action</Button>}
>
  Card content here
</Card>
```

## 🔄 Common Patterns

### Pattern 1: Fetch Data on Mount
```typescript
useEffect(() => {
  getTasks();
}, []);
```

### Pattern 2: Debounced Search
```typescript
const [search, setSearch] = useState('');
const debouncedSearch = useDebounce(search, 300);

useEffect(() => {
  if (debouncedSearch) {
    filterTasks({ status: 'todo' });
  }
}, [debouncedSearch]);
```

### Pattern 3: Form Submission
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!validateEmail(email)) {
    setError('Invalid email');
    return;
  }

  try {
    await createTask({ title, description, status, deadline, account_id });
    setSuccess('Task created');
  } catch (err) {
    setError('Failed to create task');
  }
};
```

### Pattern 4: Protected Route
```typescript
export default function ProtectedPage() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Not authenticated</div>;

  return <div>Protected content</div>;
}
```

## 📝 Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `Button.tsx` |
| Hooks | camelCase with `use` | `useAuth.ts` |
| Services | camelCase with `.service` | `auth.service.ts` |
| Utils | camelCase | `date.ts` |
| Types | PascalCase | `Task`, `User` |
| Constants | UPPER_SNAKE_CASE | `TASK_STATUS` |
| Files | kebab-case or PascalCase | `new-component.tsx` |

## 🔗 Path Aliases

```typescript
// ✅ Good
import { Button } from '@/components';
import { useAuth } from '@/hooks';
import { taskService } from '@/services';

// ❌ Bad
import { Button } from '../../../components/common/Button';
import { useAuth } from '../../../hooks/useAuth';
```

## 📚 File Locations

| Item | Location |
|------|----------|
| Pages | `src/app/` |
| Components | `src/components/` |
| Hooks | `src/hooks/` |
| Services | `src/services/` |
| Utils | `src/utils/` |
| Types | `src/types/` |
| Constants | `src/constants/` |
| Middleware | `src/middleware/` |

## 🆘 Troubleshooting

### Import not found
- Check path aliases in `tsconfig.json`
- Verify file exists in correct location
- Check file name spelling

### Type errors
- Import types from `@/types`
- Use `React.FC<Props>` for components
- Check function signatures

### API errors
- Check backend is running
- Verify `.env.local` has correct `NEXT_PUBLIC_BACKEND_URL`
- Check network tab in DevTools

### Hook errors
- Hooks must be called in components
- Can't call hooks conditionally
- Use `useCallback` for memoized functions

## 📖 Documentation

- Full structure: `FOLDER_STRUCTURE.md`
- Implementation: `STRUCTURE_SUMMARY.md`
- Complete guide: `FRONTEND_STRUCTURE_COMPLETE.md`
- This file: `QUICK_REFERENCE.md`

## 🚀 Tips & Tricks

1. **Use path aliases** - Makes imports cleaner
2. **Reuse components** - Don't duplicate code
3. **Use hooks** - Extract logic into custom hooks
4. **Type everything** - Use TypeScript fully
5. **Follow conventions** - Consistent naming
6. **Document code** - Add comments for complex logic
7. **Test components** - Write unit tests
8. **Optimize performance** - Use `useCallback`, `useMemo`

---

**Last Updated:** May 2, 2026
