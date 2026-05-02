# Frontend Folder Structure

Dokumentasi lengkap struktur folder frontend yang mengikuti best practices industri.

## 📁 Struktur Folder

```
frontend/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── api/                      # API routes
│   │   │   └── auth/
│   │   │       └── login/
│   │   │           └── route.ts
│   │   ├── dashboard/                # Dashboard page
│   │   │   └── page.tsx
│   │   ├── login/                    # Login page
│   │   │   └── page.tsx
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Home page
│   │   └── globals.css               # Global styles
│   │
│   ├── components/                   # Reusable components
│   │   ├── common/                   # Common/shared components
│   │   │   ├── Button.tsx            # Button component
│   │   │   ├── Input.tsx             # Input component
│   │   │   ├── Card.tsx              # Card component
│   │   │   └── index.ts              # Export all common components
│   │   ├── features/                 # Feature-specific components
│   │   │   ├── auth/                 # Auth components
│   │   │   ├── tasks/                # Task components
│   │   │   └── dashboard/            # Dashboard components
│   │   ├── layout/                   # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Footer.tsx
│   │   └── index.ts                  # Export all components
│   │
│   ├── hooks/                        # Custom React hooks
│   │   ├── useAuth.ts                # Authentication hook
│   │   ├── useTask.ts                # Task management hook
│   │   ├── useDebounce.ts            # Debounce hook
│   │   └── index.ts                  # Export all hooks
│   │
│   ├── services/                     # API services
│   │   ├── api.ts                    # API client configuration
│   │   ├── auth.service.ts           # Auth API service
│   │   ├── task.service.ts           # Task API service
│   │   └── index.ts                  # Export all services
│   │
│   ├── utils/                        # Utility functions
│   │   ├── date.ts                   # Date utilities
│   │   ├── string.ts                 # String utilities
│   │   ├── validation.ts             # Validation utilities
│   │   ├── storage.ts                # Storage utilities
│   │   └── index.ts                  # Export all utilities
│   │
│   ├── constants/                    # Application constants
│   │   └── index.ts                  # All constants
│   │
│   ├── types/                        # TypeScript type definitions
│   │   └── index.ts                  # All type definitions
│   │
│   ├── middleware/                   # Middleware functions
│   │   └── auth.ts                   # Auth middleware
│   │
│   ├── styles/                       # Global styles
│   │   ├── globals.css
│   │   └── variables.css
│   │
│   ├── public/                       # Static assets
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   │
│   └── helper/                       # Legacy helper (deprecated)
│       └── api.tsx
│
├── public/                           # Static files
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
│
├── .env.example                      # Environment variables template
├── .env.local                        # Local environment variables
├── .gitignore
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── tsconfig.json
├── FOLDER_STRUCTURE.md               # This file
└── README.md
```

## 📋 Penjelasan Setiap Folder

### `src/app/`
Next.js App Router directory. Berisi semua pages dan layouts.

**Files:**
- `page.tsx` - Home page
- `layout.tsx` - Root layout
- `globals.css` - Global styles

**Subdirectories:**
- `api/` - API routes (backend endpoints)
- `dashboard/` - Dashboard page
- `login/` - Login page

### `src/components/`
Reusable React components.

**Subdirectories:**
- `common/` - Shared components (Button, Input, Card, etc.)
- `features/` - Feature-specific components (Auth, Tasks, Dashboard)
- `layout/` - Layout components (Header, Sidebar, Footer)

### `src/hooks/`
Custom React hooks untuk logic reusable.

**Files:**
- `useAuth.ts` - Authentication logic
- `useTask.ts` - Task management logic
- `useDebounce.ts` - Debounce logic

### `src/services/`
API service layer untuk komunikasi dengan backend.

**Files:**
- `api.ts` - Axios client configuration
- `auth.service.ts` - Auth API calls
- `task.service.ts` - Task API calls

### `src/utils/`
Utility functions untuk common operations.

**Files:**
- `date.ts` - Date formatting dan manipulation
- `string.ts` - String manipulation
- `validation.ts` - Form validation
- `storage.ts` - LocalStorage/SessionStorage helpers

### `src/constants/`
Application-wide constants.

**Files:**
- `index.ts` - Semua constants (status, messages, routes, etc.)

### `src/types/`
TypeScript type definitions.

**Files:**
- `index.ts` - Semua type definitions

### `src/middleware/`
Middleware functions untuk request/response handling.

**Files:**
- `auth.ts` - Authentication middleware

## 🎯 Best Practices

### 1. Component Organization
```typescript
// ✅ Good - Organized by feature
src/components/
├── features/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── index.ts
│   └── tasks/
│       ├── TaskList.tsx
│       ├── TaskForm.tsx
│       └── index.ts
```

### 2. Service Layer
```typescript
// ✅ Good - Centralized API calls
import { taskService } from '@/services';

const tasks = await taskService.getAllTasks();
```

### 3. Custom Hooks
```typescript
// ✅ Good - Reusable logic
const { tasks, isLoading, createTask } = useTask();
```

### 4. Type Safety
```typescript
// ✅ Good - Strong typing
import { Task, CreateTaskRequest } from '@/types';

const createTask = async (data: CreateTaskRequest): Promise<Task> => {
  // ...
};
```

### 5. Constants
```typescript
// ✅ Good - Centralized constants
import { TASK_STATUS, ERROR_MESSAGES } from '@/constants';

if (status === TASK_STATUS.DONE) {
  // ...
}
```

## 🔄 Import Paths

Gunakan path aliases untuk imports yang lebih clean:

```typescript
// ✅ Good
import { Button } from '@/components';
import { useAuth } from '@/hooks';
import { taskService } from '@/services';
import { formatDate } from '@/utils/date';
import { TASK_STATUS } from '@/constants';

// ❌ Bad
import { Button } from '../../../components/common/Button';
import { useAuth } from '../../../hooks/useAuth';
```

## 📦 Dependencies

### Core
- `next` - React framework
- `react` - UI library
- `typescript` - Type safety

### HTTP
- `axios` - HTTP client

### UI/UX
- `tailwindcss` - Styling
- `sweetalert2` - Alerts
- `lodash` - Utilities

### Auth
- `jwt-decode` - JWT parsing
- `next-auth` - Authentication

## 🚀 Getting Started

### 1. Create New Component
```typescript
// src/components/common/NewComponent.tsx
import React from 'react';

interface NewComponentProps {
  // Props
}

export const NewComponent: React.FC<NewComponentProps> = (props) => {
  return (
    <div>
      {/* Component JSX */}
    </div>
  );
};
```

### 2. Create New Service
```typescript
// src/services/new.service.ts
import apiClient from './api';

class NewService {
  async getData() {
    const response = await apiClient.get('/endpoint');
    return response.data;
  }
}

export const newService = new NewService();
```

### 3. Create New Hook
```typescript
// src/hooks/useNew.ts
import { useState } from 'react';

export const useNew = () => {
  const [data, setData] = useState(null);
  
  return { data };
};
```

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

**Last Updated:** May 2, 2026
