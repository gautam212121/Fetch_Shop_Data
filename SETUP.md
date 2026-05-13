# India Shop Data Extractor - Quick Start Guide

## ⚡ Quick Setup (5 minutes)

### Prerequisites Check

- ✅ Node.js v18+ installed? [Check](https://nodejs.org/en/download/)
- ✅ MySQL 8.0+ installed and running? [Check](https://www.mysql.com/downloads/)
- ✅ npm v9+ installed? Check with `npm -v`

## Step-by-Step Setup

### 1️⃣ Install Dependencies

```bash
cd "d:\finding data"
npm install
```

**Expected output:** `added XXX packages in XXs`

### 2️⃣ Create MySQL Database

Open MySQL command line or MySQL Workbench:

```sql
CREATE DATABASE shopdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

**Or using command line:**

```bash
mysql -u root -p -e "CREATE DATABASE shopdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

### 3️⃣ Configure Database Connection

Edit `.env.local` file:

```env
DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/shopdb"
```

Replace `YOUR_PASSWORD` with your MySQL password.

### 4️⃣ Initialize Database Schema

```bash
npm run prisma:generate
npm run prisma:push
```

**Or to create a migration:**

```bash
npm run prisma:migrate
```

### 5️⃣ Start Development Server

```bash
npm run dev
```

**Expected output:**

```
▲ Next.js 14.1.0
- Local:        http://localhost:3000
```

### 6️⃣ Open in Browser

Visit: **http://localhost:3000**

---

## Common Commands

| Command                  | Purpose                   |
| ------------------------ | ------------------------- |
| `npm run dev`            | Start development server  |
| `npm run build`          | Create production build   |
| `npm start`              | Run production server     |
| `npm run prisma:studio`  | Visual database manager   |
| `npm run prisma:migrate` | Create database migration |
| `npm run lint`           | Check code quality        |

---

## Troubleshooting

### ❌ "Error: connect ECONNREFUSED 127.0.0.1:3306"

MySQL is not running or credentials are wrong.

**Fix:**

```bash
# Check if MySQL is running
mysql -u root -p

# If connection fails, start MySQL:
# Windows: Services > MySQL80 > Start
# Mac: brew services start mysql
# Linux: sudo systemctl start mysql
```

### ❌ "Database connection failed"

Wrong credentials in `.env.local`

**Fix:** Test connection:

```bash
mysql -u root -p shopdb -e "SHOW TABLES;"
```

### ❌ "Port 3000 already in use"

Another app is using port 3000.

**Fix:**

```bash
npm run dev -- -p 3001
```

Then visit: http://localhost:3001

### ❌ "Module not found"

Dependencies not installed properly.

**Fix:**

```bash
rm -rf node_modules package-lock.json
npm install
```

---

## First Use Tutorial

### 1. Add a Shop

1. Go to **Home** page
2. Select a state (e.g., "Uttar Pradesh")
3. Select a district (e.g., "Agra")
4. Select a category (e.g., "Electronics Shops")
5. Click "Open All Links" to view Google Maps
6. Fill in shop details and click "Add Shop"

### 2. View Data

1. Go to **Saved Data** page
2. See all saved shops in table format
3. Use filters to search specific shops
4. Click "Export CSV/Excel" to download data

### 3. View Analytics

1. Go to **Analytics** page
2. See charts and statistics
3. View recently added shops

---

## API Endpoints

### Get All Shops

```bash
curl http://localhost:3000/api/shops?page=1&limit=50
```

### Add New Shop

```bash
curl -X POST http://localhost:3000/api/shops \
  -H "Content-Type: application/json" \
  -d '{
    "shopName": "ABC Electronics",
    "ownerName": "John Doe",
    "phone": "9876543210",
    "address": "123 Main St",
    "district": "Agra",
    "state": "Uttar Pradesh",
    "category": "Electronics Shops",
    "pincode": "282001",
    "onlineStatus": true
  }'
```

### Delete Shop

```bash
curl -X DELETE http://localhost:3000/api/shops?id=1
```

### Export Data

```bash
# CSV
curl http://localhost:3000/api/shops?format=csv > shops.csv

# Excel
curl http://localhost:3000/api/shops?format=xlsx > shops.xlsx

# JSON
curl http://localhost:3000/api/shops?format=json > shops.json
```

### Get Statistics

```bash
curl http://localhost:3000/api/stats
```

---

## Project Structure Quick Reference

```
d:\finding data\
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── data/              # Data page
│   ├── stats/             # Analytics page
│   ├── page.tsx           # Home page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # React components
├── lib/                   # Helper utilities
├── data/                  # Static data (districts)
├── prisma/                # Database schema
├── public/                # Static files
├── .env.local             # Environment variables
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript config
├── tailwind.config.ts     # Tailwind CSS config
├── next.config.js         # Next.js config
└── README.md              # Full documentation
```

---

## Database Schema

**Shop Table:**

- `id` - Primary key (auto-increment)
- `shopName` - Shop name (required)
- `ownerName` - Owner name (optional)
- `phone` - Contact number (optional)
- `address` - Full address (optional)
- `district` - District (required)
- `state` - State (required)
- `category` - Category (required)
- `pincode` - Postal code (optional)
- `onlineStatus` - Delivery available (boolean)
- `createdAt` - Creation timestamp
- `updatedAt` - Update timestamp

---

## Production Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Connect to Vercel
3. Set environment variables
4. Auto-deploy on push

```bash
npm install -g vercel
vercel login
vercel
```

### Deploy Elsewhere

1. Build the project: `npm run build`
2. Set DATABASE_URL environment variable
3. Run: `npm start`

---

## Features Overview

✨ **Complete Features:**

- ✅ All Indian states & districts
- ✅ Google Maps integration
- ✅ CSV/Excel/JSON export
- ✅ Real-time analytics dashboard
- ✅ Dark/Light mode
- ✅ Mobile responsive
- ✅ Duplicate detection
- ✅ Full-text search
- ✅ Pagination (50 per page)
- ✅ XMPP notifications (optional)

---

## Support & Debugging

### Enable Debug Mode

Set in `.env.local`:

```env
DEBUG=*
```

### Check Database

```bash
npm run prisma:studio
```

Opens visual database editor at http://localhost:5555

### View Server Logs

Look at terminal where `npm run dev` is running

### Browser Console Errors

Press `F12` in browser, check Console tab for errors

---

## Next Steps

1. ✅ **Setup complete** - Application is running
2. 📚 **Read full README.md** for detailed documentation
3. 🧪 **Test the app** - Add some test shops
4. 📊 **Explore analytics** - View the dashboard
5. 💾 **Export data** - Try CSV/Excel export
6. 🚀 **Deploy** - When ready, deploy to production

---

## Need Help?

1. **Check README.md** - Comprehensive documentation
2. **Check troubleshooting section above**
3. **Check browser console** - Press F12
4. **Check server logs** - Terminal output
5. **Verify MySQL is running** - `mysql -u root -p`
6. **Verify environment variables** - Check `.env.local`

---

**Last Updated:** May 13, 2026  
**Version:** 1.0.0  
**Status:** ✅ Production Ready
