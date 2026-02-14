# F3 Helios Dashboard

A modern React + TypeScript + Vite dashboard for managing fitness community (F3) member data, attendance tracking, and community engagement metrics.

## Overview

The Helios Dashboard is designed for the F3 (Fitness, Friends, Faith) community to track member participation, consistency, and achievements. It provides real-time insights into attendee metrics, a searchable member roster, and administrative tools for data management.

### Key Features

- **📊 Dashboard View** - Real-time analytics showing total posts, member count, average consistency, and top performers
- **👥 PAX Roster** - Searchable table with member details including posts, consistency %, last workout date, and awards
- **🎮 RPG Profile System** - Gamified character sheets with RPG classes, stats, and progression tracking
- **📅 Q Schedule** - Upcoming workouts with Q leads, times, and locations
- **🔐 Admin Portal** - Multi-format CSV data ingestion (roster, attendance history, Q analytics)
- **🌐 Dual Data Sources** - Online Google Sheets sync + local CSV files for training/offline access
- **🌐 Live Data Integration** - Automatic synchronization with published Google Sheets, with demo fallback
- **📱 Responsive Design** - Mobile-optimized UI with adaptive navigation
- **⚡ Optimized Performance** - Built with React Compiler for enhanced rendering efficiency

## Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| **React** | 19.2 | UI Framework |
| **TypeScript** | 5.9 | Type-safe development |
| **Vite** | 7.2 | Build tool & dev server |
| **Tailwind CSS** | 4.1 | Styling |
| **Lucide React** | 0.563 | Icon library |
| **PapaParse** | 5.5 | CSV parsing |
| **ESLint** | 9.39 | Code linting |

## Project Structure

```
src/
├── components/
│   └── StatCard.tsx          # Reusable stat card component
├── hooks/
│   └── usePaxData.ts         # Custom hook for data fetching & caching
├── services/
│   └── dataService.ts        # CSV parsing & Google Sheets integration
├── views/
│   ├── DashboardView.tsx     # Main analytics dashboard
│   ├── RosterView.tsx        # Member roster table
│   └── IngestorView.tsx      # Admin data management
│   └── ScheduleView.tsx      # Weekly Q schedule grid
├── App.tsx                   # Main application shell
├── main.tsx                  # Entry point
├── types.ts                  # TypeScript interfaces
└── utils.ts                  # Utility functions
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd f3helios-dashboard

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_HELIOS_SHEET_ID=<your-google-sheet-id>
VITE_HELIOS_GID=<your-sheet-gid>
VITE_ADMIN_PASSWORD=<admin-password>
```

### Development

```bash
# Start dev server with HMR
npm run dev
```

### Local CSV Data Files

Place training data and local copies in `public/data/`:

```
public/data/
├── sample-roster.csv              # Demo data
├── Helios Q Sheet - Attendance.csv # 3,900+ attendance records ⭐
├── Helios Q Sheet - Postings Count.csv
└── manifest.json                  # File listing
```

Use the **Admin Portal** → "Load Local" to access without internet. Perfect for:
- 🧠 Model training and analytics
- 📊 Historical data analysis
- 🔒 Data privacy (keep sensitive data local)
- ⚡ Instant loading (no cloud latency)

See [public/data/README.md](public/data/README.md) for detailed CSV format documentation.

The app will be available at `http://localhost:5173`

### Build

```bash
# Type check and build for production
npm run build

# Preview production build locally
npm run preview
```

## Features in Detail

### Dashboard View
Displays aggregate metrics:
- **Total Posts** - Sum of all member workouts
- **Total PAX** - Active member count
- **Avg Consistency** - Average attendance percentage
- **Top Performers** - Leaderboard of most consistent members

### PAX Roster
Interactive table with:
- Member search/filter functionality
- Post count tracking
- Consistency percentage with color-coded indicators (green >50%, gray <50%)
- Last workout date
- Award badges (Cindy 🧱, Mug ☕, Shirt 👕)

### Admin Portal
Password-protected multi-source data ingestor:

| Option | Source | Speed | Internet | Best For |
|--------|--------|-------|----------|----------|
| **🌐 Sync Cloud** | Google Sheets | Medium | Required | Live updates |
| **📁 Load Local** | `public/data/` folder | Fast | Not required | Training data, offline |
| **📤 Upload CSV** | Browser file | Varies | Optional | One-time analysis |

**Auto-Detection:** Intelligently detects and parses three CSV formats:
- 📊 **Roster** - Member metrics (posts, consistency, awards)
- 📈 **Attendance** - Historical data (3,900+ records for model training)
- 🎯 **Postings** - Q leader analytics and engagement

**Features:**
- Format auto-detection with summary statistics
- Real-time record count and validation
- Support for offline training data
- Formatted results display (different UI for each format)

## Data Flow

```
┌─────────────────────────────────────┐
│   DATA SOURCES                      │
├─────────────────────────────────────┤
│ 🌐 Google Sheets (Cloud)            │
│ 📁 Local CSV Files (Training Data)  │
│ 📤 Browser File Upload              │
└──────────────┬──────────────────────┘
               ↓
┌──────────────────────────────────────┐
│   AUTO-DETECT CSV FORMAT             │
├──────────────────────────────────────┤
│ • Roster (Member Metrics)            │
│ • Attendance (History & Analytics)   │
│ • Postings (Q Leader Stats)          │
└──────────────┬──────────────────────┘
               ↓
        PapaParse Parser
               ↓
    ┌─────────┬────────┬──────────┐
    ↓         ↓        ↓          ↓
  Roster  Attendance  Postings  Dashboard
  Data    Analytics   Rankings    Display
```

## CSV Data Formats

Three intelligent CSV parsers handle different data types:

### 1. **Roster Format** - Member Attendance Metrics
```csv
Name,BD Count,Consistency,First BD,Last BD,Home AO or Visitor,Cindy,Mug,Shirt
```
- Powers dashboard stats, roster table, RPG profiles
- Ideal for member display and leaderboards

### 2. **Attendance Format** - Complete History (3,900+ Records)
```csv
Year,Month,Weekday,Name,BD Count,DD Count,Date,BD,Location Comment,...
```
- Perfect for **training machine learning models**
- Contains temporal, behavioral, and context data
- Enables trend analysis and pattern recognition

### 3. **Postings Format** - Q Leader Analytics  
```csv
Q Name,Date,Posting,...
```
- Tracks Q leader frequency and engagement
- Powers leadership leaderboards and metrics

**See [DATA_INTEGRATION.md](DATA_INTEGRATION.md) for complete guide.**

## Data Flow

```
Google Sheets (Online) → Fetch CSV
Local File (public/data/) → Load Local  
Browser Upload → Choose File
        ↓
   Fetch CSV Text
        ↓
  detectCSVType()
        ↓
   Parse Format
        ↓
  Transform Data
        ↓
 Save to State
        ↓
React Components (UI Display)

## Data Schema

### PaxData Interface
```typescript
interface PaxData {
  name: string;           // Member name
  posts: number;          // Total workouts attended
  consistency: number;    // Attendance percentage (0-100)
  firstBD: string;        // First workout date
  lastBD: string;         // Most recent workout date
  homeAo: string;         // Home area/location
  awards: string[];       // Array of earned awards
}
```

## Performance Optimizations

- **React Compiler Enabled** - Automatic memoization and optimization
- **Vite Fast Refresh** - Instant HMR updates during development
- **TailwindCSS v4 Vite Plugin** - Optimized CSS processing
- **Lazy Loading** - View components load on demand
- **Fallback Data** - Demo data prevents loading failures

## Linting & Quality

```bash
# Run ESLint
npm run lint
```

Uses modern ESLint 9 with TypeScript support and React best practices.

### Pre-commit Hooks

The project uses **Husky** and **lint-staged** to ensure code quality. Every time you commit, ESLint will run on the staged files and automatically fix fixable issues.

If the linting fails, the commit will be blocked until the issues are resolved.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Deployment

### GitHub Pages

The project includes a configured `gh-pages` script for automated deployment.

```bash
# Builds the project and pushes 'dist' folder to 'gh-pages' branch
npm run deploy
```

### Other Hosting (Vercel, Netlify, etc.)

The project is ready for deployment on any static hosting service.

```bash
npm run build
```

The build output will be located in the `dist/` directory.

## Contributing

Contributions are welcome! Please ensure:
1. TypeScript types are properly defined
2. Code passes ESLint checks
3. Components are responsive and accessible
4. Changes are tested locally

## License

MIT

## Support

For issues or questions, please open an issue in the repository.
