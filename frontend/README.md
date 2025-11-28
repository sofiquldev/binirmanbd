# Binirman BD - Frontend Application

A modern, scalable Next.js application for managing election candidates, manifestos, and feedback.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
frontend/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   ├── (public)/          # Public routes
│   ├── (admin)/           # Admin routes
│   └── layout.jsx         # Root layout
├── components/            # React components
│   ├── common/           # Shared components
│   ├── ui/               # UI primitives
│   └── layouts/          # Layout components
├── lib/                   # Utilities & helpers
│   ├── constants/        # App constants
│   ├── services/         # API services
│   ├── utils/            # Utility functions
│   └── providers/        # Context providers
├── hooks/                 # Custom React hooks
├── contexts/              # React contexts
├── stores/                # Zustand stores
└── styles/                # Global styles
```

## 🛠️ Tech Stack

- **Framework**: Next.js 15
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand, React Query
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **HTTP Client**: Axios

## 📝 Code Standards

See [CODE_STANDARDS.md](./CODE_STANDARDS.md) for detailed coding conventions and best practices.

## 🔐 Authentication

Authentication is handled through:
- JWT tokens stored in cookies
- Protected routes via middleware
- Role-based access control (RBAC)

## 🎨 Styling

- Tailwind CSS for utility-first styling
- Custom theme configuration
- Dark mode support
- Responsive design

## 🚀 Performance

- React Query for server state caching
- Next.js Image optimization
- Code splitting with dynamic imports
- Static generation where possible

## 📦 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

## 🌍 Internationalization

- English (en) - Default
- Bengali (bn)

## 📄 License

Copyright © 2025 coderfleek. All rights reserved.
