# India Shop Data Extractor

A complete full-stack web application for extracting and managing local shop data across all states and districts of India. Built with Next.js 14, Node.js, MySQL, and Tailwind CSS.

## Overview

India Shop Data Extractor is a powerful tool that allows users to:

- Select states, districts, and shop categories
- Generate Google Maps search links for manual data collection
- Enter and manage shop information
- Export data to CSV, Excel, or JSON formats
- View analytics and statistics about collected data
- Manage bulk shop data with duplicate detection

## Features

✅ **State & District Selection** - All 28 states + 8 UTs with complete district listings
✅ **Multi-Select Categories** - 12 shop categories with visual grid selection
✅ **Google Maps Integration** - Generate and open Maps links in bulk
✅ **Shop Management** - Add, edit, delete, and search shops
✅ **Data Export** - CSV, Excel, and JSON export formats
✅ **Analytics Dashboard** - Visual charts and statistics
✅ **Dark Mode** - Built-in dark/light theme toggle
✅ **Responsive Design** - Works on desktop, tablet, and mobile
✅ **Duplicate Detection** - Warns before adding duplicate shops
✅ **XMPP Notifications** - Optional real-time notifications when shops are added
✅ **Bulk Import** - Import shops from CSV/Excel files
✅ **Pagination** - Handle large datasets with 50 items per page

## Tech Stack

| Layer             | Technology                                                 |
| ----------------- | ---------------------------------------------------------- |
| **Frontend**      | Next.js 14 (App Router), React 18, Tailwind CSS, shadcn/ui |
| **Backend**       | Next.js API Routes (Node.js), TypeScript                   |
| **Database**      | MySQL 8.0+                                                 |
| **ORM**           | Prisma                                                     |
| **Charts**        | Recharts                                                   |
| **Export**        | XLSX, PapaParse                                            |
| **Notifications** | node-xmpp-client (optional)                                |
| **UI Components** | Radix UI, Lucide Icons                                     |
| **Styling**       | Tailwind CSS, dark mode support                            |

## Prerequisites

Before you begin, ensure you have installed:

- **Node.js** (v18.0 or higher) - [Download](https://nodejs.org/)
- **npm** (v9.0 or higher) - Comes with Node.js
- **MySQL** (v8.0 or higher) - [Download](https://www.mysql.com/downloads/)
- **Git** - [Download](https://git-scm.com/)

## Installation

### 1. Clone or Setup the Project

```bash
cd "d:\finding data"
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages listed in `package.json`.

### 3. Setup MySQL Database

Create a new MySQL database:

```bash
mysql -u root -p
```

Then in MySQL:

```sql
CREATE DATABASE shopdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. Configure Environment Variables

Copy `.env.local` and update with your MySQL credentials:

```bash
# .env.local
DATABASE_URL="mysql://root:your_password@localhost:3306/shopdb"

# Optional XMPP Configuration (leave empty to disable)
XMPP_JID=""
XMPP_PASSWORD=""
XMPP_HOST=""
XMPP_NOTIFY_JID=""
```

Replace:

- `root` with your MySQL username
- `your_password` with your MySQL password
- `localhost` with your MySQL host if different
- `3306` with your MySQL port if different

### 5. Initialize Database with Prisma

Generate Prisma client and run migrations:

```bash
npm run prisma:generate
npm run prisma:push
```

Or if you want to create a migration:

```bash
npm run prisma:migrate
```

This will create the `shops` table in your MySQL database.

### 6. Verify Setup

Check that everything is working:

```bash
mysql -u root -p shopdb -e "SHOW TABLES;"
```

You should see a `Shop` table created.

## Running the Application

### Development Mode

Start the development server:

```bash
npm run dev
```

The application will be available at:

- **http://localhost:3000** - Main application
- **http://localhost:3000/api/shops** - Shops API endpoint
- **http://localhost:3000/api/stats** - Stats API endpoint

### Production Build

Create an optimized production build:

```bash
npm run build
npm start
```

## Project Structure

```
.
├── app/
│   ├── api/
│   │   ├── shops/
│   │   │   └── route.ts          # Shops CRUD API
│   │   └── stats/
│   │       └── route.ts          # Statistics API
│   ├── data/
│   │   └── page.tsx              # Saved data page
│   ├── stats/
│   │   └── page.tsx              # Analytics page
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   └── globals.css               # Global styles
├── components/
│   ├── Sidebar.tsx               # Navigation sidebar
│   ├── StateDistrictSelector.tsx # State/district filters
│   ├── CategorySelector.tsx      # Category selector
│   ├── MapLinksList.tsx          # Google Maps links
│   ├── ShopEntryForm.tsx         # Shop entry form
│   ├── ShopsTable.tsx            # Shops table with export
│   └── StatsCharts.tsx           # Analytics charts
├── data/
│   └── india-districts.json      # All states and districts
├── lib/
│   ├── db.ts                     # Prisma client
│   ├── xmpp.ts                   # XMPP notifications
│   └── export.ts                 # CSV/Excel export helpers
├── prisma/
│   └── schema.prisma             # Database schema
├── .env.local                    # Environment variables
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── tailwind.config.ts            # Tailwind config
├── postcss.config.js             # PostCSS config
├── next.config.js                # Next.js config
└── README.md                     # This file
```

## Database Schema

### Shops Table

```sql
CREATE TABLE `Shop` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `shopName` VARCHAR(191) NOT NULL,
  `ownerName` VARCHAR(191),
  `phone` VARCHAR(191),
  `address` TEXT,
  `district` VARCHAR(191) NOT NULL,
  `state` VARCHAR(191) NOT NULL,
  `category` VARCHAR(191) NOT NULL,
  `pincode` VARCHAR(191),
  `onlineStatus` BOOLEAN DEFAULT false,
  `createdAt` DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  INDEX `Shop_district_idx` (`district`),
  INDEX `Shop_state_idx` (`state`),
  INDEX `Shop_category_idx` (`category`)
);
```

## API Documentation

### GET /api/shops

Fetch shops with pagination and filtering.

**Query Parameters:**

- `page` (number) - Page number (default: 1)
- `limit` (number) - Items per page (default: 50)
- `state` (string) - Filter by state
- `district` (string) - Filter by district
- `category` (string) - Filter by category
- `search` (string) - Search by name, phone, or address
- `format` (csv|xlsx|json) - Export format

**Response:**

```json
{
  "data": [Shop...],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 50,
    "pages": 2
  }
}
```

### POST /api/shops

Create a new shop.

**Request Body:**

```json
{
  "shopName": "ABC Electronics",
  "ownerName": "John Doe",
  "phone": "9876543210",
  "address": "123 Main St, City",
  "district": "Agra",
  "state": "Uttar Pradesh",
  "category": "Electronics Shops",
  "pincode": "282001",
  "onlineStatus": true
}
```

**Response:**

```json
{
  "id": 1,
  "shopName": "ABC Electronics",
  ...
}
```

### DELETE /api/shops?id={id}

Delete a shop by ID.

**Response:**

```json
{
  "id": 1,
  ...
}
```

### GET /api/stats

Get aggregated statistics.

**Response:**

```json
{
  "totalShops": 150,
  "shopsByState": [{state: "Uttar Pradesh", count: 50}, ...],
  "shopsByCategory": [{category: "Electronics", count: 30}, ...],
  "onlineShops": 50,
  "offlineShops": 100,
  "recentShops": [Shop...],
  "topDistricts": [{district: "Agra", count: 10}, ...]
}
```

## Features in Detail

### 1. Data Extractor (Home Page)

- **Left Panel**: Select state, districts, and categories
- **Center Panel**: Auto-generated Google Maps search links
- **Right Panel**: Form to manually enter shop data

Click "Open All Links" to open all Maps links at once and manually collect data.

### 2. Saved Data (Data Page)

- **Table View**: All shops with sortable columns
- **Filters**: By state, district, category, online status
- **Search**: Full-text search across shop names, phones, addresses
- **Export**: CSV, Excel, or JSON formats
- **Bulk Actions**: Select multiple shops and delete or export them
- **Pagination**: 50 shops per page

### 3. Analytics (Stats Page)

- **Summary Cards**: Total shops, online delivery count, states covered
- **Shops by State**: Bar chart of top 10 states
- **Shops by Category**: Pie chart distribution
- **Online Delivery Status**: Donut chart
- **Top Districts**: Horizontal bar chart of top 5 districts
- **Recent Shops**: Table of last 10 added shops

## XMPP Notifications (Optional)

To enable XMPP notifications when shops are added:

1. Configure XMPP credentials in `.env.local`:

```env
XMPP_JID="user@jabber.org"
XMPP_PASSWORD="your_password"
XMPP_HOST="jabber.org"
XMPP_NOTIFY_JID="recipient@jabber.org"
```

2. If XMPP is not configured, the app will work normally without notifications.

## Troubleshooting

### "Cannot find module 'mysql2'"

Install the mysql2 package:

```bash
npm install mysql2
```

### "Database connection failed"

1. Check MySQL is running: `mysql -u root -p`
2. Verify DATABASE_URL in `.env.local`
3. Ensure the database exists: `mysql -u root -p shopdb -e "SHOW TABLES;"`

### "Prisma client not generated"

Run:

```bash
npm run prisma:generate
```

### "Port 3000 already in use"

Kill the process or use a different port:

```bash
npm run dev -- -p 3001
```

### "Dark mode not working"

Clear browser cache and restart the development server:

```bash
npm run dev
```

## Performance Optimization

- Database indexes on `state`, `district`, and `category` columns
- Pagination to handle large datasets
- Image optimization with Next.js
- CSS minification with Tailwind
- Code splitting with Next.js App Router
- Caching headers for static assets

## Security Considerations

- SQL injection protection via Prisma
- Input validation on all endpoints
- CORS headers configured
- Environment variables for sensitive data
- No authentication by design (open app)

## Browser Support

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Common Tasks

### Add Multiple Shops

1. Go to Home page
2. Select state, districts, and categories
3. Click "Open All Links" to get Google Maps
4. Manually find shops and enter data
5. Use Quick Add mode for faster entry

### Export All Data

1. Go to Saved Data page
2. Click "Export CSV/Excel/JSON"
3. File will download automatically

### View Analytics

1. Go to Analytics page
2. See all charts and statistics
3. Data refreshes every 30 seconds

### Filter Shops

1. Go to Saved Data page
2. Use filters for state, district, category
3. Use search box for specific shops
4. Results update immediately

## Development

### Code Style

The project uses TypeScript strict mode. Ensure all types are properly defined.

### Adding New Features

1. Create components in `/components`
2. Add API routes in `/app/api`
3. Update Prisma schema if needed
4. Run `npm run prisma:migrate` for DB changes

### Git Workflow

```bash
git add .
git commit -m "Add feature description"
git push
```

## Deployment

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Other Platforms

Ensure MySQL is accessible and DATABASE_URL is set in platform environment variables.

## License

MIT License - Feel free to use for personal or commercial projects.

## Support

For issues or questions:

1. Check the troubleshooting section
2. Review the code comments
3. Check browser console for errors
4. Verify MySQL is running and accessible

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Changelog

### Version 1.0.0 (Initial Release)

- Complete shop data management system
- All Indian states and districts
- Google Maps integration
- CSV/Excel/JSON export
- Analytics dashboard
- Dark mode support
- Responsive design
- XMPP notifications (optional)

---

**Built with ❤️ using Next.js 14, MySQL, and Tailwind CSS**
#   F e t c h _ S h o p _ D a t a  
 