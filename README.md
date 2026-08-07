# L manager v0.1.0

Local-first habit / life tracker inspired by the old spreadsheet workflow.

## Run

Open `index.html` in a modern browser. No server, npm install, account, or internet connection is required.

## What is in v0.1.0

- Empty start: no old habits are preloaded.
- Create, edit and delete habits.
- Two tracking modes:
  - **Target value**: set a daily target and enter the actual result. Percentage is calculated automatically.
  - **Manual percent**: enter the percentage directly.
- No upper percentage cap: 124%, 500%, etc. are stored and shown exactly.
- 0% is a real tracked value; an empty day means no data.
- Per-habit color with stronger tint as completion approaches 100%.
- Monthly calendar for every habit.
- Optional note for every day.
- Monthly average, tracked count and 100%+ count.
- Local browser storage.
- JSON export/import backup.
- Responsive layout.

## Data storage

Data is saved to browser `localStorage` under:

`l-manager:data:v1`

Use **Export** regularly if you want a portable backup.
