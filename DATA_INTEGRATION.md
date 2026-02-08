# Helios Dashboard - Data Integration Guide

> **Training Data Ready**: The dashboard now supports three CSV formats for complete data flexibility—online Google Sheets, local files, and file uploads.

## Overview

Your **Helios Dashboard** integrates with multiple data sources in real-time:

```
┌─────────────────────────────────────────────────────────────┐
│                    DATA SOURCES                              │
├─────────────────────────────────────────────────────────────┤
│  🌐 Google Sheets (Online)                                  │
│  📁 Local CSV Files (Training Data)                         │
│  📤 File Upload (Browser)                                   │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│              AUTO-DETECTING PARSER                           │
├─────────────────────────────────────────────────────────────┤
│  🔍 Detects Format (Roster / Attendance / Postings)        │
│  📊 Parses & Validates Data                                 │
│  📈 Generates Summary Stats                                 │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌──────────────┬──────────────────┬──────────────────────────┐
│   ROSTER     │   ATTENDANCE     │   POSTINGS ANALYTICS     │
├──────────────┼──────────────────┼──────────────────────────┤
│ • Dashboard  │ • Training Data  │ • Q Rankings             │
│ • Profiles   │ • History Stats  │ • Leadership Metrics     │
│ • Roster     │ • Date Range     │ • Engagement Analytics   │
│ • Awards     │ • Q Count Stats  │                          │
└──────────────┴──────────────────┴──────────────────────────┘
```

---

## Three CSV Data Formats

### 1️⃣ **Roster Format** (PAX Membership Data)
**Purpose:** Member profiles, attendance metrics, awards

**Structure:**
```csv
Name,BD Count,Consistency,First BD,Last BD,Home AO or Visitor,Cindy,Mug,Shirt
Boomer,89,94%,1/10/2023,2/6/2026,Helios,X,X,X
Shovel,76,89%,3/15/2023,2/5/2026,Helios,X,X,
```

**Auto-Loads:**
- Dashboard statistics
- Roster table with search
- RPG character profiles
- Member leaderboards

**File:** `public/data/sample-roster.csv`

---

### 2️⃣ **Attendance Format** (Historical BD/DD Records)
**Purpose:** Complete history, training data, analytics

**Key Columns:**
- `Year`, `Month`, `Weekday` - Date info
- `Name` - Attendee  
- `BD Count`, `DD Count` - Participation
- `BD` - Whether they led (Q count)
- `Date` - Specific date
- `Location Comment` - Where

**Statistics Generated:**
- Total records processed
- Unique PAX count
- Total BDs/DDs
- Unique Q leaders
- Date range (earliest to latest)

**Use Cases:**
- 🧠 Model training (attendance patterns)
- 📊 Historical trend analysis
- 🎯 Q leader identification
- 📈 Peak activity detection

**File:** `public/data/Helios Q Sheet - Attendance.csv` (3,900+ records!)

---

### 3️⃣ **Postings Format** (Q Leader Analytics)
**Purpose:** Q posting frequency, leadership metrics

**Key Columns:**
- `Q Name` - Q leader name
- `Posting` - Count/boolean
- `Date` - When they led

**Statistics Generated:**
- Total Q postings
- Per-leader breakdown
- Top Q leaders (ranked)
- Average Qs per leader

**Use Cases:**
- 🏆 Q leader leaderboards
- 📊 Engagement metrics
- 🎯 Leadership consistency
- 📈 Recognizing top contributors

**File:** `public/data/Helios Q Sheet - Postings Count.csv`

---

## How to Load Data

### 🔐 Access Admin Portal
1. Go to **Admin Portal** in the sidebar
2. Enter password to unlock
3. Choose one of three data source options:

### Option A: 🌐 Sync Cloud
```
[SYNC CLOUD] → Fetches latest from Google Sheets
```
- **Pro:** Always current, no manual steps
- **Con:** Requires internet
- **Best For:** Live dashboard updates

### Option B: 📁 Load Local
```
Enter filename → [LOAD LOCAL] → Loads from public/data/
Example: "Helios Q Sheet - Attendance.csv"
```
- **Pro:** Instant loading, no internet, great for training
- **Con:** Requires files in folder
- **Best For:** Development, model training, offline work

### Option C: 📤 Upload CSV
```
Select file → Auto-detects format → Displays results
```
- **Pro:** Any CSV file, browser interface
- **Con:** Manual each time
- **Best For:** One-time analysis, testing

---

## Admin Portal - Data Results

After loading any CSV, you'll see **auto-generated summaries**:

### Roster Loaded ✅
```
┌─────────────────────────────────┐
│ 📊 PAX Roster Data              │
├─────────────────────────────────┤
│ Members:        42              │
│ Avg Posts:      35              │
│ Total Posts:    1,470           │
│ Avg Consistency: 76%            │
└─────────────────────────────────┘
```

### Attendance Loaded ✅
```
┌─────────────────────────────────┐
│ 📈 Attendance History           │
├─────────────────────────────────┤
│ Records:        3,900+          │
│ Unique PAX:     150             │
│ Total BDs:      10,200          │
│ Q Leaders:      45              │
│ Period: 5/4/2024 - 2/6/2026     │
└─────────────────────────────────┘
```

### Postings Loaded ✅
```
┌─────────────────────────────────┐
│ 🎯 Q Posting Analytics          │
├─────────────────────────────────┤
│ Total Qs:       1,224           │
│ Q Leaders:      45              │
│ Avg per Leader: 27              │
│ Top Leaders:    [Rankings]      │
└─────────────────────────────────┘
```

---

## Available Local CSV Files

| File | Type | Records | Purpose |
|------|------|---------|---------|
| `sample-roster.csv` | Roster | 5 | Testing/Demo |
| `Helios Q Sheet - Attendance.csv` | Attendance | 3,900+ | **Training Data** ⭐ |
| `Helios Q Sheet - Postings Count.csv` | Postings | Varies | Q Analytics |

---

## Loading Instructions

### Try It Now:

1. **🔓 Unlock Admin Portal** (password)
2. **📁 Load Local** → Type: `Helios Q Sheet - Attendance.csv`
3. **View Results** → Summary stats display
4. **📊 Analyze** → 3,900+ records of training data ready!

---

## Model Training Benefits

The **Attendance CSV** is perfect for training models because it includes:

✅ **Complete History** - Dates from May 2024 to Feb 2026  
✅ **Member Behavior** - All attendees and their patterns  
✅ **Q Lead Data** - Who led each workout  
✅ **Temporal Data** - Year/Month/Weekday breakdown  
✅ **Rich Context** - Location, comments, participation type  
✅ **Volume** - 3,900+ records for robust analysis  

### Example Analyses:
```
- Attendance prediction: "Will X attend this workout?"
- Q rotation: "Who should lead next?"
- Peak activity: "When is most participation?"
- Member clustering: "Which members frequent together?"
- Consistency patterns: "What predicts high attendance?"
```

---

## Data Flow Architecture

```
User Selects Source
        ↓
┌─────────────────────────┐
│ Cloud | Local | Upload  │
└────────────┬────────────┘
             ↓
       Fetch CSV Text
             ↓
┌─────────────────────────┐
│  detectCSVType()        │ ← Checks headers
└────────────┬────────────┘
             ↓
    ┌───────┴───────┐
    ↓               ↓
┌─────────┐   ┌─────────┐
│ Roster? │   │Other?   │
└────┬────┘   └────┬────┘
     │             │
  [Parse]      [Parse]
     │             │
     ↓             ↓
  Display      Display
  Results      Results
```

---

## File Locations

```
project/
├── public/
│   └── data/                              ← PUT CSV FILES HERE
│       ├── manifest.json                  (file list)
│       ├── README.md                      (documentation)  
│       ├── sample-roster.csv             (demo)
│       ├── Helios Q Sheet - Attendance.csv         (3,900+ records) ⭐
│       ├── Helios Q Sheet - Postings Count.csv   (Q analytics)
│       └── Helios Q Sheet - Q Sheet.csv          (Q schedule)
└── src/
    ├── views/
    │   └── IngestorView.tsx              ← Admin portal
    ├── services/
    │   ├── csvParser.ts                  ← Auto-detector & parsers
    │   └── dataService.ts                ← Cloud/local loaders
    └── hooks/
        └── useLocalCSVFiles.ts           ← File manifest hook
```

---

## Environment Setup

**.env.local** (optional for cloud sync):
```env
VITE_HELIOS_SHEET_ID=your-google-sheet-id
VITE_HELIOS_GID=649963747
VITE_ADMIN_PASSWORD=your-password
```

---

## Next Steps

1. ✅ **Local files ready** - All three CSVs in `public/data/`
2. 🔐 **Access Admin** - Go to Admin Portal
3. 📁 **Load Local** - Try: `Helios Q Sheet - Attendance.csv`
4. 📊 **See Results** - Auto-generated summary stats
5. 🧠 **Use for Training** - Perfect data for ML models
6. 🚀 **Build Analytics** - Create custom views using parsed data

---

## Support

**Q: How do I know it loaded correctly?**
A: The Admin Portal shows summary stats. Check if record count matches expected.

**Q: Can I use multiple file formats?**
A: Yes! Load roster, then attendance, then postings — each auto-detected.

**Q: Is internet required?**
A: Only for "Sync Cloud". Local loading works entirely offline.

**Q: How do I add my own CSV?**
A: Place in `public/data/`, use filename to load via "Load Local".

---

**Status:** ✅ Data integration complete with 3,900+ training records ready!
