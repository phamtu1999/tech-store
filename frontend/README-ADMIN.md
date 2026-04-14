# Admin Dashboard - Setup Instructions

## Project Structure

```
src/
 ├── components/
 │    ├── ui/              # Reusable UI components (Button, Card, Table)
 │    ├── layout/          # Layout components (Sidebar, Header, AdminLayout)
 │    └── dashboard/       # Dashboard-specific components (StatCard)
 ├── pages/
 │    └── dashboard/       # Dashboard page
 ├── styles/
 │    ├── theme.ts         # Design system tokens
 │    └── globals.css      # Global styles with Tailwind
 ├── hooks/                # Custom React hooks
 └── types/                # TypeScript type definitions
```

## Installation

### 1. Install TypeScript dependencies

```bash
npm install -D typescript @types/react @types/react-dom
```

### 2. Install Framer Motion for animations

```bash
npm install framer-motion
```

### 3. Update tailwind.config.js

Add the design system colors to your tailwind config:

```javascript
export default {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'primary-main': '#ee4d2d',
        'secondary-main': '#f5f5f5',
        'text-primary': '#222222',
        'text-secondary': '#555555',
        'dark-bg': '#1a1a2e',
        'dark-card': '#16213e',
        'dark-border': '#2a2a4a',
        'dark-text': '#e4e4e7',
        'success-DEFAULT': '#22c55e',
        'warning-DEFAULT': '#eab308',
        'error-DEFAULT': '#ef4444',
        'info-DEFAULT': '#3b82f6',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 4px 16px rgba(0, 0, 0, 0.1)',
        'card-dark': '0 2px 8px rgba(0, 0, 0, 0.3)',
      },
    },
  },
}
```

## Features

### ✅ Design System Compliance
- **Colors**: Shopee primary (#ee4d2d), secondary, text, border colors
- **Spacing**: 4px, 8px, 12px, 16px, 24px, 32px scale
- **Typography**: Inter/Roboto/system-ui, proper font sizes
- **Border Radius**: 8px, 12px, 16px, 20px
- **Shadows**: Card shadows with dark mode variants

### ✅ UI Components
- **Button**: Primary, secondary, ghost, danger variants with loading state
- **Card**: Hoverable, different padding options, dark mode support
- **Table**: Custom columns, render functions, empty state, row click

### ✅ Layout
- **Sidebar**: Fixed width (256px), navigation menu, bottom actions
- **Header**: Sticky, dark mode toggle, user info
- **AdminLayout**: Full layout with sidebar + header + content

### ✅ Dashboard
- **Stat Cards**: 4 stat cards with icons, change indicators
- **Recent Orders Table**: Order list with status badges
- **Order Status Chart**: Progress bars with animations
- **Top Products**: Product list with hover effects

### ✅ Animations (Framer Motion)
- Fade in animations on page load
- Staggered animations for cards
- Icon rotation animations
- Progress bar animations
- Hover scale effects

### ✅ Dark Mode
- Toggle button in header
- System preference detection
- Local storage persistence
- Smooth transitions

### ✅ Responsive Design
- Mobile: 1 column grid
- Tablet: 2 columns grid
- Desktop: 4 columns grid
- Responsive header (hidden user info on mobile)

## Usage

### Import components

```typescript
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Table from '@/components/ui/Table'
import AdminLayout from '@/components/layout/AdminLayout'
```

### Use theme tokens

```typescript
import { tokens } from '@/styles/theme'

const primaryColor = tokens.colors.primary.main
const spacing = tokens.spacing.lg
```

### Use dark mode hook

```typescript
import { useTheme } from '@/hooks/useTheme'

const { isDarkMode, toggleTheme } = useTheme()
```

## Design System Check Results

### ✅ Spacing
- All spacing uses scale: 4px, 8px, 12px, 16px, 24px, 32px
- Container padding: p-6 sm:p-8 (16px-32px)
- Card padding: p-4 (16px)
- Grid gaps: gap-4 (16px), gap-6 (24px)

### ✅ Colors
- Primary: #ee4d2d (Shopee orange)
- Secondary: #f5f5f5
- Text: #222222 (primary), #555555 (secondary)
- Border: #e5e7eb
- Dark mode colors properly defined

### ✅ Consistency
- All buttons use rounded-xl (12px)
- All cards use rounded-2xl (16px)
- All inputs use h-12 (48px)
- All transitions use duration-200/300
- Consistent hover effects across components

### ✅ Typography
- Font: Inter, Roboto, system-ui
- H1: text-xl sm:text-2xl (20-24px)
- H2: text-lg (18px)
- Body: text-sm (14px)
- Small: text-xs (12px)

### ✅ Responsive
- Mobile: grid-cols-1
- Tablet: sm:grid-cols-2
- Desktop: lg:grid-cols-4
- Header responsive with hidden elements

## Notes

- TypeScript errors are expected until framer-motion is installed
- Project needs proper TypeScript migration for all files
- Current .jsx files should be converted to .tsx
- Update package.json scripts to handle TypeScript
