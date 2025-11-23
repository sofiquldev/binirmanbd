# Binirman BD - Frontend (Next.js)

This is the Next.js frontend application for Binirman BD, built with Metronic React Next.js starter kit.

## Getting Started

### Prerequisites
- Node.js 16.x or higher
- NPM or Yarn

### Installation

```bash
npm install --force
```

### Environment Setup

Copy `.env.local.example` to `.env.local` and configure:

```bash
cp .env.local.example .env.local
```

Update the API URL in `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
frontend/
├── app/                    # Next.js app directory
│   ├── (layouts)/         # Layout-specific pages
│   └── layout.jsx         # Root layout
├── components/            # React components
│   ├── layouts/           # Layout components
│   └── ui/                # UI components
├── contexts/              # React contexts
│   └── AuthContext.jsx    # Authentication context
├── lib/                   # Utility libraries
│   ├── api.js             # API client (Axios)
│   └── auth.js             # Authentication service
├── hooks/                 # Custom React hooks
├── config/                # Configuration files
└── styles/                # Global styles
```

## API Integration

The frontend communicates with the Laravel API backend. The API client is configured in `lib/api.js` and uses:

- Base URL: `NEXT_PUBLIC_API_URL` from environment variables
- Authentication: Bearer token stored in localStorage
- Automatic token injection via Axios interceptors

## Authentication

Authentication is handled through:
- `lib/auth.js` - Authentication service
- `contexts/AuthContext.jsx` - React context for auth state
- `middleware.js` - Route protection middleware

## Features

- ✅ Authentication (Login/Register/Logout)
- ✅ Dashboard with metrics
- ✅ Candidate management
- ✅ Party management
- ✅ Constituency management
- ✅ User management (Admin)
- ✅ Template management (Admin)

## Layout

The application uses Metronic's Layout 1 by default. To change layouts, update `app/(layouts)/layout-1/layout.jsx` or create a new layout.

## Next Steps

1. Migrate remaining Blade views to React components
2. Implement real-time updates (WebSockets/Polling)
3. Add form validation with React Hook Form + Zod
4. Implement file uploads
5. Add error boundaries
6. Add loading states and skeletons
