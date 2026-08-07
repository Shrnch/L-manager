# L manager v0.2.1

Local-first habit / life tracker inspired by the old spreadsheet workflow.

## Run

Open `index.html` in a modern browser. No server, npm install, account, or internet connection is required.

## What is in v0.2.1

- Empty start: no old habits are preloaded.
- Create, edit and delete habits.
- Three tracking modes:
  - **Target value**: set a daily numeric target and enter the actual result. Percentage is calculated automatically.
  - **Manual percent**: enter the percentage directly.
  - **Yes / No**: choose a Daily target of `Yes` or `No`, then record the actual Yes / No result each day.
- Yes / No target logic:
  - `Daily target = Yes` → **Positive habit**.
  - `Daily target = No` → **Negative habit**.
  - Matching the target counts as 100%; the opposite result counts as 0%.
  - Empty day remains untracked.
- Numeric `Daily target = 0` remains a **Negative target**: actual 0 = 100%, any value above 0 = 0%.
- No upper percentage cap for normal numeric and manual-percent habits: 124%, 500%, etc. are stored and shown exactly.
- 0% is a real tracked value; an empty day means no data.
- Per-habit color with stronger tint as completion approaches 100%.
- Monthly calendar for every habit.
- Optional note for every day.
- Monthly average, tracked count and success / 100%+ count.
- Local browser storage.
- JSON export/import backup.
- Responsive layout.

## Data storage

Data is saved to browser `localStorage` under:

`l-manager:data:v1`

Existing Yes / No habits created in v0.1.1 or v0.1.2 are treated as **Positive habits** (`Daily target = Yes`) for backward compatibility.

Use **Export** regularly if you want a portable backup.


## v0.2.1
- Right-side visualization panel
- Daily progress line chart for the selected habit
- 100% target reference line with support for values above 100%
- Monthly habit comparison bars
- Best streak, average, and target-hit summary


## v0.2.1
- Added a compact GitHub-style heatmap in the right sidebar.
- Each square represents one day across all habits; shade intensity reflects the average completion of tracked habits on that day.
- Hover a square to see the date, average percentage, and how many habits were tracked.


### v0.2.4
- Replaced the aggregated all-habits heatmap with a per-habit contribution matrix.
- One row per habit and one square per day (42 recent days).
- Each habit keeps its own color; shade reflects that habit's result only.
- Negative habits use the same normalized 100%/0% success logic as the rest of the app.


## v0.2.4
- Fixed habit-history lookup for stored entry keys (`habitId::YYYY-MM-DD`).
- Added visible date labels and range above the per-habit history matrix.
