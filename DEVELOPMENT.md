# Development Guide

## Code Organization

This project follows Next.js 14 best practices with App Router.

### Directory Structure Explanation

```
app/
├── api/              # API Route Handlers (backend)
│   ├── shops/       # CRUD operations for shops
│   └── stats/       # Aggregation and statistics
├── data/            # Data display and management page
├── stats/           # Analytics and dashboard page
├── layout.tsx       # Root layout with navigation
├── page.tsx         # Home/extractor page
└── globals.css      # Global tailwind imports

components/         # Reusable React Components
├── Sidebar.tsx      # Navigation (dark mode toggle)
├── StateDistrictSelector.tsx  # Filters
├── CategorySelector.tsx        # Category multi-select
├── MapLinksList.tsx           # Google Maps links
├── ShopEntryForm.tsx          # Shop data entry
├── ShopsTable.tsx             # Table with export
└── StatsCharts.tsx            # Dashboard charts

lib/               # Utilities and helpers
├── db.ts          # Prisma client singleton
├── xmpp.ts        # XMPP notification handler
└── export.ts      # CSV/Excel/JSON export functions

data/              # Static data
└── india-districts.json  # All states and districts

prisma/            # Database
└── schema.prisma   # Prisma schema definition
```

## Technology Stack Explained

### Frontend (Client)

- **Next.js 14 App Router** - Server and client rendering, file-based routing
- **React 18** - UI components, hooks, state management
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide Icons** - Beautiful SVG icons
- **Recharts** - Composable charting library
- **Sonner** - Toast notifications
- **PapaParse** - CSV parsing and generation

### Backend (API Routes)

- **Node.js** - Runtime environment
- **TypeScript** - Type safety
- **Prisma ORM** - Type-safe database access
- **MySQL 2** - MySQL driver

### Database

- **MySQL 8.0+** - Relational database
- **Prisma** - ORM with migrations

### Dev Tools

- **Next.js** - Build tooling
- **TypeScript** - Type checking
- **Tailwind CSS** - Styling
- **PostCSS** - CSS processing

## Adding Features

### 1. Add a New Database Model

Edit `prisma/schema.prisma`:

```prisma
model NewModel {
  id    Int     @id @default(autoincrement())
  name  String
  // ... add fields
  @@index([name])
}
```

Then run:

```bash
npm run prisma:migrate
```

### 2. Create a New API Route

Create `app/api/newroute/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const data = await prisma.newModel.findMany();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = await prisma.newModel.create({ data: body });
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}
```

### 3. Create a New Component

Create `components/NewComponent.tsx`:

```typescript
'use client';

import { useState } from 'react';

interface NewComponentProps {
  title: string;
}

export default function NewComponent({ title }: NewComponentProps) {
  const [data, setData] = useState<any>(null);

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-gray-200 dark:border-slate-700">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        {title}
      </h2>
      {/* Component content */}
    </div>
  );
}
```

### 4. Create a New Page

Create `app/newpage/page.tsx`:

```typescript
'use client';

import NewComponent from '@/components/NewComponent';

export default function NewPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
        New Page
      </h1>
      <NewComponent title="Test Component" />
    </div>
  );
}
```

Then update `components/Sidebar.tsx` to add navigation link.

## Common Development Tasks

### Format Code

```bash
npm run lint
```

### View Database

```bash
npm run prisma:studio
```

Opens http://localhost:5555 with visual database editor.

### Create Database Backup

```bash
mysqldump -u root -p shopdb > backup.sql
```

### Restore Database

```bash
mysql -u root -p shopdb < backup.sql
```

### Reset Database

```bash
npm run prisma:push -- --force-reset
```

### Check TypeScript

```bash
npx tsc --noEmit
```

## Performance Optimization

### Database Queries

- Use indexes: `@@index([field])`
- Limit results: `take: 50`
- Pagination: `skip: (page - 1) * limit`
- Only select needed fields: `select: { field1: true }`

### API Responses

```typescript
// Good - specific fields
const shops = await prisma.shop.findMany({
  select: {
    id: true,
    shopName: true,
    district: true,
  },
  take: 50,
});

// Bad - fetches everything
const shops = await prisma.shop.findMany();
```

### Frontend

- Use `'use client'` for interactive components
- Lazy load with `dynamic()`:

```typescript
import dynamic from 'next/dynamic';

const StatsCharts = dynamic(() => import('@/components/StatsCharts'), {
  loading: () => <p>Loading...</p>,
});
```

- Memoize expensive components:

```typescript
import { memo } from 'react';

export default memo(function MyComponent() {
  // Component
});
```

## Security Best Practices

### Input Validation

```typescript
if (!body.shopName || body.shopName.trim() === '') {
  return NextResponse.json({ error: 'Shop name is required' }, { status: 400 });
}
```

### Error Handling

Never expose internal error details to client:

```typescript
try {
  // database operation
} catch (error) {
  console.error('Internal error:', error);
  return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
}
```

### SQL Injection Prevention

Use Prisma (automatic):

```typescript
// Safe - Prisma escapes values
await prisma.shop.findMany({
  where: { shopName: { contains: searchTerm } },
});
```

### Rate Limiting

For production, add rate limiting middleware.

## Testing

### Test API Endpoints

```bash
# GET shops
curl http://localhost:3000/api/shops

# POST new shop
curl -X POST http://localhost:3000/api/shops \
  -H "Content-Type: application/json" \
  -d '{"shopName":"Test","district":"Agra","state":"UP","category":"Electronics Shops"}'

# GET stats
curl http://localhost:3000/api/stats
```

### Test Database

```typescript
// In a test file
import prisma from '@/lib/db';

async function testDatabase() {
  const count = await prisma.shop.count();
  console.log('Total shops:', count);
}
```

## Debugging

### Enable Logging

Add to `lib/db.ts`:

```typescript
const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
});
```

### Debug Requests

```typescript
// In API route
console.log('Query params:', request.nextUrl.searchParams);
console.log('Body:', body);
```

### Browser DevTools

- Press `F12`
- Check Network tab for API calls
- Check Console for errors
- Use React DevTools extension

## Environment Variables

- `.env.local` - Local development (DO NOT commit)
- `.env.example` - Template for others
- Platform (Vercel, etc) - Production settings

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes
git add .
git commit -m "Add new feature"

# Push and create pull request
git push origin feature/new-feature
```

## Code Style

- Use `const` over `let`
- Use arrow functions
- Type all props with interfaces
- Use Tailwind classes (no inline styles)
- Name components PascalCase
- Name variables/functions camelCase
- Add comments for complex logic

## Useful Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Hooks](https://react.dev/reference/react)
- [TypeScript](https://www.typescriptlang.org/docs)

## Troubleshooting Development

### Hot Reload Not Working

```bash
# Restart dev server
npm run dev
```

### Tailwind Styles Not Applied

```bash
# Check tailwind.config.ts content paths
# Rebuild CSS
npm run dev
```

### Prisma Client Out of Sync

```bash
npm run prisma:generate
```

### Database Connection Issues

```bash
# Verify MySQL is running
mysql -u root -p -e "SELECT 1"

# Check .env.local DATABASE_URL
```

## Production Deployment Checklist

- [ ] Remove debug logs
- [ ] Set production environment variables
- [ ] Test build: `npm run build`
- [ ] Test production server: `npm start`
- [ ] Database backups in place
- [ ] Error monitoring configured
- [ ] CORS headers set if needed
- [ ] Rate limiting configured
- [ ] SSL/HTTPS enabled

## Performance Monitoring

Monitor these metrics:

1. **API Response Time** - Should be < 200ms
2. **Database Query Time** - Should be < 100ms
3. **Page Load Time** - Should be < 2s
4. **Bundle Size** - Keep JavaScript under 100KB

Use Prisma query logging to identify slow queries.

---

**Happy Coding! 🚀**
