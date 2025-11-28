# Code Standards & Conventions

This document outlines the coding standards and conventions for the Binirman BD frontend application.

## Naming Conventions

### Files & Directories
- **Components**: PascalCase (e.g., `UserProfile.jsx`, `DataTable.jsx`)
- **Utilities/Helpers**: camelCase (e.g., `formatDate.js`, `validateEmail.js`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_CONFIG.js`, `ROUTES.js`)
- **Directories**: kebab-case (e.g., `user-profile/`, `data-table/`)
- **Route Groups**: Parentheses (e.g., `(auth)/`, `(public)/`, `(admin)/`)

### Code
- **Components**: PascalCase (e.g., `UserProfile`, `DataTable`)
- **Functions**: camelCase (e.g., `formatDate`, `validateEmail`)
- **Variables**: camelCase (e.g., `userName`, `isLoading`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`, `MAX_RETRY_COUNT`)
- **Hooks**: camelCase with `use` prefix (e.g., `useAuth`, `usePermissions`)
- **Types/Interfaces**: PascalCase (e.g., `User`, `ApiResponse`)

## Directory Structure

```
frontend/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication route group
│   │   ├── login/
│   │   ├── register/
│   │   └── layout.jsx
│   ├── (public)/                 # Public route group
│   │   ├── coming-soon/
│   │   └── layout.jsx
│   ├── (admin)/                  # Admin route group
│   │   ├── dashboard/
│   │   └── layout.jsx
│   └── layout.jsx                # Root layout
├── components/
│   ├── common/                   # Shared/common components
│   │   ├── EntityDetailModal.jsx
│   │   └── LoadingSpinner.jsx
│   ├── ui/                       # UI primitives (shadcn)
│   └── layouts/                  # Layout components
├── lib/
│   ├── constants/                # Application constants
│   │   └── index.js
│   ├── services/                 # API services
│   │   └── api-service.js
│   ├── utils/                    # Utility functions
│   │   ├── cache.js
│   │   ├── format.js
│   │   ├── validation.js
│   │   └── index.js
│   └── providers/                # Context providers
│       └── query-provider.jsx
├── hooks/                        # Custom React hooks
├── contexts/                     # React contexts
├── stores/                       # Zustand stores
└── styles/                       # Global styles
```

## Component Structure

### Standard Component Template

```jsx
'use client';

import { useState, useEffect } from 'react';
import { ComponentProps } from '@/types';

interface ComponentNameProps {
  // Props definition
}

export function ComponentName({ prop1, prop2 }: ComponentNameProps) {
  // Hooks
  const [state, setState] = useState();
  
  // Effects
  useEffect(() => {
    // Effect logic
  }, []);
  
  // Handlers
  const handleAction = () => {
    // Handler logic
  };
  
  // Render
  return (
    <div>
      {/* Component JSX */}
    </div>
  );
}
```

## Import Order

1. React & Next.js imports
2. Third-party libraries
3. Type definitions
4. Constants
5. Config
6. Utilities
7. Hooks
8. Contexts
9. Services
10. UI Components
11. Common Components
12. Feature Components
13. Styles
14. Relative imports

## Code Formatting

- Use Prettier for automatic formatting
- Run `npm run format` before committing
- Maximum line length: 100 characters
- Use 2 spaces for indentation
- Always use semicolons
- Use single quotes for strings
- Use trailing commas

## Best Practices

### Performance
- Use React.memo for expensive components
- Implement proper caching with React Query
- Lazy load heavy components
- Optimize images with Next.js Image component
- Use dynamic imports for code splitting

### Error Handling
- Always handle errors in async operations
- Provide user-friendly error messages
- Log errors for debugging
- Use try-catch blocks appropriately

### State Management
- Use local state for component-specific data
- Use Zustand for global state
- Use React Query for server state
- Avoid prop drilling

### API Calls
- Use centralized API service
- Implement proper caching
- Handle loading and error states
- Use TypeScript for type safety

### Accessibility
- Use semantic HTML
- Provide ARIA labels where needed
- Ensure keyboard navigation
- Test with screen readers

## Testing

- Write unit tests for utilities
- Write integration tests for components
- Test error scenarios
- Test edge cases

## Documentation

- Document complex functions
- Add JSDoc comments for public APIs
- Keep README files updated
- Document breaking changes

