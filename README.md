# L manager v0.4.3

Local-first habit tracker built with plain HTML, CSS and JavaScript.

## v0.4.3
- Reworked completion shades to match the original spreadsheet logic: better results are progressively darker/richer versions of the habit color.
- 0–100% now runs from a pale tint to a strong habit-colored shade.
- Values above 100% continue darker without collapsing into black; a lightness floor keeps different habit hues distinguishable.
- Values below 0% continue in the opposite direction as progressively paler tints.
- Calendar text automatically switches between dark and light for contrast on pale/dark cells.

## Run
Open `index.html` directly or run `start.bat` on Windows.

All data is stored locally in the browser. Use Export / Import for JSON backups.
