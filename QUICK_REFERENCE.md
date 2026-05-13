# Quick Reference Guide

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Create MySQL database
mysql -u root -p -e "CREATE DATABASE shopdb CHARACTER SET utf8mb4;"

# 3. Configure .env.local
# Edit DATABASE_URL with your MySQL password

# 4. Initialize database
npm run prisma:push

# 5. Start development server
npm run dev

# 6. Open in browser
# http://localhost:3000
```

---

## ⚡ Common Commands

| Command                   | Purpose                |
| ------------------------- | ---------------------- |
| `npm run dev`             | Start dev server       |
| `npm run build`           | Build for production   |
| `npm start`               | Run production         |
| `npm run prisma:studio`   | Open database UI       |
| `npm run prisma:migrate`  | Create migration       |
| `npm run prisma:push`     | Apply schema to DB     |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run lint`            | Check code             |

---

## 🛠️ Development Workflow

### Add a Shop (Manual)

1. Go to Home page
2. Select state → district → categories
3. Click "Open All Links"
4. Find shop details on Google Maps
5. Fill form and click "Add Shop"

### View Data

1. Go to Saved Data page
2. Use search/filters to find shops
3. Click Export to download CSV/Excel/JSON

### Check Stats

1. Go to Analytics page
2. See charts and recent shops
3. Page auto-refreshes every 30 seconds

---

## 🗄️ Database Operations

### View Database

```bash
npm run prisma:studio
```

Opens http://localhost:5555

### Create Backup

```bash
mysqldump -u root -p shopdb > backup.sql
```

### Restore Backup

```bash
mysql -u root -p shopdb < backup.sql
```

### Reset Database

```bash
npm run prisma:push -- --force-reset
```

### Delete All Shops

```bash
npx prisma db execute --stdin < delete_all.sql
```

---

## 🔌 API Quick Reference

### Add Shop

```bash
curl -X POST http://localhost:3000/api/shops \
  -H "Content-Type: application/json" \
  -d '{
    "shopName": "ABC Shop",
    "phone": "9876543210",
    "address": "123 Main St",
    "district": "Agra",
    "state": "Uttar Pradesh",
    "category": "Electronics Shops"
  }'
```

### Get Shops

```bash
curl "http://localhost:3000/api/shops?page=1&limit=50"
```

### Search Shops

```bash
curl "http://localhost:3000/api/shops?search=ABC&state=UP"
```

### Export as CSV

```bash
curl "http://localhost:3000/api/shops?format=csv" > shops.csv
```

### Export as Excel

```bash
curl "http://localhost:3000/api/shops?format=xlsx" > shops.xlsx
```

### Delete Shop

```bash
curl -X DELETE "http://localhost:3000/api/shops?id=1"
```

### Get Stats

```bash
curl http://localhost:3000/api/stats
```

---

## 📁 File Locations

| File                        | Purpose            |
| --------------------------- | ------------------ |
| `app/page.tsx`              | Home page          |
| `app/data/page.tsx`         | Data page          |
| `app/stats/page.tsx`        | Stats page         |
| `app/api/shops/route.ts`    | Shops API          |
| `app/api/stats/route.ts`    | Stats API          |
| `components/`               | React components   |
| `lib/db.ts`                 | Database client    |
| `lib/export.ts`             | Export functions   |
| `data/india-districts.json` | States & districts |
| `prisma/schema.prisma`      | DB schema          |
| `.env.local`                | Environment vars   |

---

## 🎨 Component Props

### StateDistrictSelector

```typescript
<StateDistrictSelector
  onStateChange={(state) => {}}
  onDistrictChange={(districts) => {}}
  selectedState="Uttar Pradesh"
  selectedDistricts={["Agra", "Aligarh"]}
/>
```

### CategorySelector

```typescript
<CategorySelector
  onCategoryChange={(categories) => {}}
  selectedCategories={["Electronics Shops"]}
/>
```

### MapLinksList

```typescript
<MapLinksList
  selectedState="Uttar Pradesh"
  selectedDistricts={["Agra"]}
  selectedCategories={["Electronics Shops"]}
/>
```

### ShopEntryForm

```typescript
<ShopEntryForm
  selectedState="Uttar Pradesh"
  selectedDistricts={["Agra"]}
  onShopAdded={() => {}}
/>
```

### ShopsTable

```typescript
<ShopsTable refreshTrigger={0} />
```

### StatsCharts

```typescript
<StatsCharts />
```

---

## 🔍 Debugging Tips

### Check Console

Press `F12` to open DevTools → Console tab

### Check Network

Press `F12` → Network tab → Perform action → See API calls

### Check Database

```bash
npm run prisma:studio
```

### Check TypeScript Errors

```bash
npx tsc --noEmit
```

### View Prisma Logs

Add to `lib/db.ts`:

```typescript
log: ['query', 'error', 'warn'];
```

### Check API Response

```bash
curl -v http://localhost:3000/api/shops
```

---

## 🚨 Common Errors & Fixes

### "Cannot connect to database"

```bash
# Check MySQL is running
mysql -u root -p -e "SELECT 1"

# Check .env.local DATABASE_URL is correct
# Format: mysql://user:password@host:port/database
```

### "Port 3000 already in use"

```bash
npm run dev -- -p 3001
```

### "Module not found"

```bash
npm install
npm run prisma:generate
```

### "Prisma client out of sync"

```bash
npm run prisma:generate
```

---

## 📊 API Query Parameters

### Pagination

```
?page=1&limit=50
```

### Filter by State

```
?state=Uttar%20Pradesh
```

### Filter by District

```
?district=Agra
```

### Filter by Category

```
?category=Electronics%20Shops
```

### Search

```
?search=ABC
```

### Export Format

```
?format=csv
?format=xlsx
?format=json
```

### Combine Filters

```
?state=UP&district=Agra&category=Electronics&page=1&limit=50
```

---

## 🌙 Dark Mode

### Toggle in UI

Click moon/sun icon in sidebar

### Check State

```typescript
// In component
const isDark = document.documentElement.classList.contains('dark');
```

### Manual Toggle

```typescript
document.documentElement.classList.toggle('dark');
```

---

## 📱 Responsive Breakpoints

| Device  | Width      | Layout                  |
| ------- | ---------- | ----------------------- |
| Mobile  | < 768px    | Single column (stacked) |
| Tablet  | 768-1024px | Adapted spacing         |
| Desktop | > 1024px   | 3-column layout         |

---

## 🔐 Security Checklist

- [ ] Change MySQL default password
- [ ] Use strong database password
- [ ] Never commit `.env.local` to git
- [ ] Enable HTTPS in production
- [ ] Add rate limiting
- [ ] Add authentication if needed
- [ ] Validate all inputs
- [ ] Keep dependencies updated

---

## 📚 Important Files to Edit

| File                   | When           | What             |
| ---------------------- | -------------- | ---------------- |
| `.env.local`           | Setup          | Database URL     |
| `prisma/schema.prisma` | Add fields     | Database model   |
| `components/*.tsx`     | UI changes     | Component code   |
| `app/api/*/route.ts`   | API changes    | API logic        |
| `lib/export.ts`        | Export changes | Export functions |

---

## 🎯 Feature Quick Links

### Add Shop Data

Home page → Form section on right

### View Saved Data

Saved Data page → Table with all shops

### Search & Filter

Saved Data page → Top filters

### Export Data

Saved Data page → Blue export buttons

### View Analytics

Analytics page → Entire dashboard

### Toggle Dark Mode

Sidebar → Bottom button

---

## 📞 Support Files

| File                   | Contains           |
| ---------------------- | ------------------ |
| `README.md`            | Full documentation |
| `SETUP.md`             | Installation guide |
| `FEATURES.md`          | Feature details    |
| `DEVELOPMENT.md`       | Developer guide    |
| `COMPLETION_REPORT.md` | Project summary    |

---

## ⏰ Regular Tasks

### Daily

- Check recent shops added
- Review top districts
- Check database size

### Weekly

- Export & backup data
- Review analytics trends
- Check error logs

### Monthly

- Database maintenance
- Update dependencies
- Performance optimization

---

## 🎓 Learning Path

1. **Start:** Read SETUP.md
2. **Understand:** Read FEATURES.md
3. **Build:** Follow DEVELOPMENT.md
4. **Reference:** Use this guide

---

## 💡 Quick Tips

- Use Ctrl+K/Cmd+K in Vercel to deploy
- Use Prisma Studio to visualize data
- Use Export function to backup data
- Dark mode persists per session
- API uses standard HTTP methods
- All API responses are JSON
- Pagination is 50 per page default
- Search is real-time (no submit button)

---

## 📈 Monitor Performance

```bash
# Check bundle size
npm run build

# Check TypeScript errors
npx tsc --noEmit

# Check code quality
npm run lint
```

---

**Need more help? Check README.md or SETUP.md** ✨
