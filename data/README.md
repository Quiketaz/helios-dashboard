# Local CSV Data Folder

This folder contains CSV data files that can be loaded locally without requiring internet access. The dashboard automatically detects and parses different CSV formats for various use cases.

## Supported CSV Formats

### 1. **Roster Format** - PAX Attendance & Metrics
Used for member profiles and roster displays.

**Columns:**
- `Name` - PAX member name
- `BD Count` or `BD Count ` - Total posts
- `Consistency` - Attendance percentage (e.g., "92%")
- `First BD` - First workout date
- `Last BD` - Most recent workout date
- `Home AO or Visitor` - Area of Operation
- `Cindy`, `Mug`, `Shirt` - Awards (mark with "X")

**Example:**
```csv
Name,BD Count,Consistency,First BD,Last BD,Home AO or Visitor,Cindy,Mug,Shirt
Alice,45,92%,1/15/2024,2/6/2026,Helios,X,,
Bob,32,78%,3/22/2024,2/4/2026,Helios,,X,X
```

**Features:**
- ✅ Loads on Dashboard
- ✅ Powers RPG Profile System
- ✅ Displays in Roster Table

---

### 2. **Attendance Format** - Complete BD/DD History
Historical attendance with Q lead information.

**Key Columns:**
- `Date` - Workout date
- `Name` - Attendee name  
- `BD Count` - Number of BDs that day
- `DD Count` - Number of DDs (Double Downs)
- `BD` - Whether this person led (blank or "1")
- `Pax Comment` - Notes (mark "Q" for Q count)
- `BD Type` - Workout type (BC, SB, etc.)
- `Location Comment` - Where the workout occurred
- `Home AO or Visitor` - Member type

**Features:**
- ✅ Excellent for **Training Data**
- ✅ Complete historical analysis
- ✅ Q lead tracking
- ✅ Date range statistics
- ✅ Peak attendance patterns

**Format:** Auto-detects by `Year`, `Month`, `Name`, `BD` columns

---

### 3. **Postings Format** - Q Leader Analytics
Q posting frequency and leader statistics.

**Key Columns:**
- `Q Name` or `Q` - Q leader name
- `Date` - Date of Q
- `Posting` - Boolean/count field

**Features:**
- ✅ Q leader leaderboards
- ✅ Posting frequency analysis
- ✅ Leadership engagement metrics
- ✅ Consistency patterns per Q

**Format:** Auto-detects by `Q Name`, `Posting` columns

---

## How to Use

### Option 1: Load via Admin Portal
1. Go to **Admin Portal** (password protected)
2. Enter filename in "Load Local" field (e.g., `Helios Q Sheet - Attendance.csv`)
3. Click **LOAD LOCAL**
4. Dashboard auto-detects format and displays summary

### Option 2: Online Sources
1. Click **SYNC CLOUD** to fetch from Google Sheets
2. Or use **UPLOAD CSV** for browser file selection

### Option 3: Add Your Own Files
1. Place CSV in `public/data/` folder
2. Update `manifest.json` with file metadata
3. Use any of the three loading methods

---

## Data Flow & Use Cases

```
Roster CSV
    ↓
[Parsed] → Dashboard Stats, Roster Table, RPG Profiles

Attendance CSV  
    ↓
[Parsed] → Training Data, Historical Analysis, Q Statistics

Postings CSV
    ↓
[Parsed] → Q Leader Rankings, Engagement Metrics
```

---

## Auto-Detection Logic

The Admin Portal automatically detects CSV type by analyzing headers:

| Format | Detection Signals |
|--------|------------------|
| **Roster** | `BD Count` + `Consistency` |
| **Attendance** | `Year` + `Month` + `BD` + `Name` |
| **Postings** | `Q Name` + `Posting` |

---

## Example Files

### Sample Roster
[sample-roster.csv](sample-roster.csv) - A small roster for testing

### Production Files
- `Helios Q Sheet - Attendance.csv` - Complete attendance history (recommended for training)
- `Helios Q Sheet - Postings Count.csv` - Q leader analytics

---

## Benefits of Local Files

✅ **Offline Access** - No internet required  
✅ **Instant Loading** - No cloud latency  
✅ **Training Data** - Rich history for analytics  
✅ **Data Privacy** - Keep sensitive data local  
✅ **Fallback** - Works when internet is unavailable  
✅ **Batch Processing** - Perfect for data science workflows  

---

## Tips

1. **Format Consistency** - Ensure column headers match exactly (case-sensitive on `Name`, `Date`)
2. **Date Format** - Use M/D/YYYY format for dates
3. **Awards** - Mark achievements with "X" in corresponding column
4. **Missing Data** - Empty cells are handled gracefully
5. **Large Files** - Local files can be quite large (>10MB) without performance issues

---

## Troubleshooting

**"Failed to load" error:**
- ✓ Check filename spelling matches exactly
- ✓ Make sure file is in `public/data/` folder
- ✓ Verify format is `.csv` (not `.xlsx`)

**Data not parsing correctly:**
- ✓ Check column headers match expected format
- ✓ Look for extra spaces in headers
- ✓ Ensure date format is M/D/YYYY

**For local development:**
```bash
# Files in public/data are auto-served by Vite
npm run dev
# Access via /data/filename.csv
```

---

## Next Steps

1. 📥 Place CSV files in this folder
2. 🔐 Go to Admin Portal
3. 📁 Use "Load Local" with filename  
4. 📊 View auto-generated summaries
5. 🧠 Use data for model training

