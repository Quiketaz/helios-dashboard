# F3 Helios Dashboard

A modern React + TypeScript + Vite dashboard for managing fitness community (F3) member data, attendance tracking, and community engagement metrics.

## Overview

The Helios Dashboard is designed for the F3 (Fitness, Friends, Faith) community to track member participation, consistency, and achievements. It provides real-time insights into attendee metrics, a searchable member roster, and administrative tools for data management.

### Key Features

- **📊 Dashboard View** - Real-time analytics showing total posts, member count, average consistency, and top performers
- **👥 PAX Roster** - Searchable table with member details including posts, consistency %, last workout date, and awards
- **🔐 Admin Portal** - Password-protected data ingestor syncing data from Google Sheets or uploading CSV files
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
Requires password authentication. Once unlocked, allows:
- **Sync Cloud** - Fetch latest data from published Google Sheet
- **Upload CSV** - Import custom CSV files
- Real-time validation and record count display

## Data Flow

```
Google Sheets (Published CSV)
        ↓
fetchPaxRoster() / File Upload
        ↓
PapaParse (CSV Parsing)
        ↓
processRawCSV() (Data Transformation)
        ↓
usePaxData Hook (State Management)
        ↓
React Components (UI Rendering)
```

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

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Deployment

The project is ready for deployment on:
- Vercel
- Netlify
- GitHub Pages
- Any static hosting service

Build output is in the `dist/` directory after running `npm run build`.

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
