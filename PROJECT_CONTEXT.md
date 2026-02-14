# Project Context: F3 Helios Dashboard

## Overview
The F3 Helios Dashboard is a React-based Progressive Web App (PWA) designed for the F3 Helios region. It serves as a central hub for tracking workout attendance (Pax), managing the Q schedule (The Weinke), and visualizing region statistics.

## Tech Stack
- **Build Tool**: Vite
- **Framework**: React (TypeScript)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **PWA**: vite-plugin-pwa configured for offline capability and installation.

## Project Structure

### Core
- `src/App.tsx`: Main application controller. Handles data fetching hooks (`usePaxData`, `useQData`) and manages the active view state.
- `vite.config.ts`: Vite configuration including PWA manifest settings.

### Views (`src/views/`)
- **DashboardView (`The Gloom`)**: Displays high-level stats (Total Posts, Shield Lock %), "High Impact Men" leaderboard, and the next upcoming workout.
- **RosterView (`The Pax`)**: A searchable table/list of all members with their post counts and achievements.
- **ScheduleView (`The Weinke`)**: A weekly calendar view of upcoming workouts and Q assignments.
- **IngestorView (`Nantan Ops`)**: Admin interface for importing data via Google Sheets sync, local CSV files, or file upload. Includes data validation logic.
- **BackblastCard**: Component for displaying workout reports (Backblasts) with a "Gloom Factor" temperature indicator.

### Components (`src/components/`)
- **Navigation**: Responsive sidebar (desktop) and bottom bar (mobile) navigation.
- **StatCard**: Reusable component for displaying metrics.
- **Logo**: Application branding.

### Data & Services
- **Data Sources**: The app consumes data primarily from CSVs (Google Sheets exports or local files).
- **Services**: `src/services/csvParser.ts` and `src/services/dataService.ts` handle parsing, validation, and normalization of Roster, Attendance, and Schedule data.

## F3 Terminology Mapping
The UI uses specific F3 cultural terms mapped to standard technical concepts:
- **Dashboard** → The Gloom
- **Roster** → The Pax
- **Schedule** → The Weinke
- **Admin** → Nantan Ops
- **Stats** → Shield Lock / AO Report
- **Leader** → The Q

## Key Data Models
- **PaxData**: Member profile, post count, consistency, awards.
- **QRecord**: Schedule entry (Date, AO, Q, Time).
- **Backblast**: Workout report (Date, AO, Q, Pax Count, Moleskin, Temperature).