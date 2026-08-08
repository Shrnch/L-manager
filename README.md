# L manager v0.3.5

Local-first habit / life tracker inspired by the old spreadsheet workflow.

## Run

Open `index.html` in a modern browser. No server, npm install, account, or internet connection is required.

## Core tracking

- Create, edit and delete habits.
- **Target value**: numeric daily target, automatic percentage.
- **Manual percent**: enter any percentage directly.
- **Yes / No**: Yes always means a successful day; No means failure.
- **Negative habit** is a separate toggle:
  - for **Yes / No**, Yes still means success (name the habit as the desired state, e.g. “No smoking”);
  - for **Target value**, lower actual values are better;
  - the target is the 100% reference point, 0 equals 200%, and results continue below 0% when the value exceeds 2× target.
- Empty day is different from a tracked 0% day.
- Per-habit color, notes, monthly calendar, averages, success counts and streaks.
- Local `localStorage` plus JSON Export / Import backups.

## Visualization

- Per-habit history matrix with dated daily squares and habit-specific shades; values above 100% continue into brighter shades instead of being visually capped at target.
- Daily progress graph for the selected habit.
- Monthly comparison across habits.
- **Relations** mode:
  - **Overlay** can draw multiple selected habits on one timeline using normalized performance percentages;
  - **Scatter** compares two habits using actual values from shared tracked days;
  - Pearson correlation `r` and a simple direction/strength label are shown for Scatter;
  - Scatter includes a trend line as a visual aid; correlation is association, not proof of causation.

## Data storage

Data is saved to browser `localStorage` under `l-manager:data:v1`.

Use **Export** regularly if you want a portable backup.


### v0.3.4
Negative numerical habits no longer floor at 0%. Their score continues linearly below zero when the result exceeds 2× the target, and trend/overlay charts now display negative percentages.
