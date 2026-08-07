# L manager v0.3.0

Local-first habit / life tracker inspired by the old spreadsheet workflow.

## Run

Open `index.html` in a modern browser. No server, npm install, account, or internet connection is required.

## Core tracking

- Create, edit and delete habits.
- **Target value**: numeric daily target, automatic percentage, no upper cap.
- **Manual percent**: enter any percentage directly.
- **Yes / No**: choose a daily target of Yes or No.
  - Target Yes = Positive habit.
  - Target No = Negative habit.
  - Match = 100%, opposite = 0%.
- Numeric target `0` = Negative target: actual 0 = 100%, anything above 0 = 0%.
- Empty day is different from a tracked 0% day.
- Per-habit color, notes, monthly calendar, averages, success counts and streaks.
- Local `localStorage` plus JSON Export / Import backups.

## Visualization

- Per-habit history matrix with dated daily squares and habit-specific shades.
- Daily progress graph for the selected habit.
- Monthly comparison across habits.
- **Relations** mode for comparing two habits:
  - **Overlay** puts both habits on one timeline using normalized `% of target` / success, so different units can share one graph.
  - **Scatter** plots actual values from days where both habits were tracked.
  - Pearson correlation `r` and a simple direction/strength label are shown for shared tracked days.
  - Scatter includes a trend line as a visual aid; correlation is association, not proof of causation.

## Data storage

Data is saved to browser `localStorage` under `l-manager:data:v1`.

Use **Export** regularly if you want a portable backup.
