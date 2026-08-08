(() => {
  "use strict";

  const STORAGE_KEY = "l-manager:data:v1";
  const APP_VERSION = "0.3.4";
  const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const MONTH_FORMAT = new Intl.DateTimeFormat("en", { month: "long", year: "numeric" });
  const DATE_FORMAT = new Intl.DateTimeFormat("ru", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  const state = loadState();
  let viewDate = startOfMonth(new Date());
  let toastTimer = null;
  let selectedHabitId = null;
  let relationHabitAId = null;
  let relationHabitBId = null;
  let relationOverlayHabitIds = [];
  let relationOverlayInitialized = false;
  let relationMode = "overlay";

  const els = {
    habitList: document.querySelector("#habitList"),
    emptyState: document.querySelector("#emptyState"),
    monthLabel: document.querySelector("#monthLabel"),
    monthSummary: document.querySelector("#monthSummary"),
    prevMonthBtn: document.querySelector("#prevMonthBtn"),
    nextMonthBtn: document.querySelector("#nextMonthBtn"),
    monthButton: document.querySelector("#monthButton"),
    addHabitBtn: document.querySelector("#addHabitBtn"),
    emptyAddHabitBtn: document.querySelector("#emptyAddHabitBtn"),
    exportBtn: document.querySelector("#exportBtn"),
    importInput: document.querySelector("#importInput"),
    insightsPanel: document.querySelector("#insightsPanel"),
    visualHabitSelect: document.querySelector("#visualHabitSelect"),
    allHabitsHeatmap: document.querySelector("#allHabitsHeatmap"),
    insightKpis: document.querySelector("#insightKpis"),
    habitTrendChart: document.querySelector("#habitTrendChart"),
    trendCaption: document.querySelector("#trendCaption"),
    habitComparison: document.querySelector("#habitComparison"),
    relationPairControls: document.querySelector("#relationPairControls"),
    relationOverlayControls: document.querySelector("#relationOverlayControls"),
    relationOverlayList: document.querySelector("#relationOverlayList"),
    relationHabitA: document.querySelector("#relationHabitA"),
    relationHabitB: document.querySelector("#relationHabitB"),
    relationOverlayBtn: document.querySelector("#relationOverlayBtn"),
    relationScatterBtn: document.querySelector("#relationScatterBtn"),
    relationMeta: document.querySelector("#relationMeta"),
    relationChart: document.querySelector("#relationChart"),

    habitModal: document.querySelector("#habitModal"),
    habitForm: document.querySelector("#habitForm"),
    habitModalTitle: document.querySelector("#habitModalTitle"),
    habitId: document.querySelector("#habitId"),
    habitName: document.querySelector("#habitName"),
    habitTrackingType: document.querySelector("#habitTrackingType"),
    habitTarget: document.querySelector("#habitTarget"),
    habitNegative: document.querySelector("#habitNegative"),
    negativeHabitField: document.querySelector("#negativeHabitField"),
    habitUnit: document.querySelector("#habitUnit"),
    habitColor: document.querySelector("#habitColor"),
    habitColorText: document.querySelector("#habitColorText"),
    targetValueField: document.querySelector("#targetValueField"),
    unitField: document.querySelector("#unitField"),
    trackingHint: document.querySelector("#trackingHint"),
    deleteHabitBtn: document.querySelector("#deleteHabitBtn"),

    entryModal: document.querySelector("#entryModal"),
    entryForm: document.querySelector("#entryForm"),
    entryHabitId: document.querySelector("#entryHabitId"),
    entryDate: document.querySelector("#entryDate"),
    entryDateLabel: document.querySelector("#entryDateLabel"),
    entryModalTitle: document.querySelector("#entryModalTitle"),
    entryValueField: document.querySelector("#entryValueField"),
    entryValueLabel: document.querySelector("#entryValueLabel"),
    entryValue: document.querySelector("#entryValue"),
    entryUnitBadge: document.querySelector("#entryUnitBadge"),
    booleanEntry: document.querySelector("#booleanEntry"),
    entryYesBtn: document.querySelector("#entryYesBtn"),
    entryNoBtn: document.querySelector("#entryNoBtn"),
    entryPercentPreview: document.querySelector("#entryPercentPreview"),
    entryNote: document.querySelector("#entryNote"),
    clearEntryBtn: document.querySelector("#clearEntryBtn"),
    toast: document.querySelector("#toast"),
  };

  bindEvents();
  render();

  function defaultState() {
    return {
      version: APP_VERSION,
      habits: [],
      entries: {},
    };
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      const parsed = JSON.parse(raw);
      if (!parsed || !Array.isArray(parsed.habits) || typeof parsed.entries !== "object") return defaultState();

      const entries = parsed.entries || {};
      let migrated = false;
      const habits = parsed.habits.map((habit) => {
        const hadNegativeFlag = typeof habit.negativeHabit === "boolean";
        const legacyBooleanNegative = !hadNegativeFlag && habit.trackingType === "boolean" && Number(habit.target) === 0;
        const legacyNumericNegative = !hadNegativeFlag && habit.trackingType === "target" && Number(habit.target) === 0;
        const negativeHabit = hadNegativeFlag ? habit.negativeHabit : (legacyBooleanNegative || legacyNumericNegative);

        if (legacyBooleanNegative) {
          const prefix = `${habit.id}::`;
          Object.entries(entries).forEach(([key, entry]) => {
            if (!key.startsWith(prefix) || !entry) return;
            const value = Number(entry.value);
            if (value === 0 || value === 1) entry.value = value === 1 ? 0 : 1;
          });
          migrated = true;
        }
        if (!hadNegativeFlag || Object.prototype.hasOwnProperty.call(habit, "negativeTarget")) migrated = true;

        const normalized = {
          ...habit,
          negativeHabit,
          target: habit.trackingType === "boolean" ? 1 : habit.target,
        };
        delete normalized.negativeTarget;
        return normalized;
      });

      const normalizedState = { version: APP_VERSION, habits, entries };
      if (migrated || parsed.version !== APP_VERSION) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedState));
      }
      return normalizedState;
    } catch (error) {
      console.warn("L manager: failed to load local data", error);
      return defaultState();
    }
  }

  function saveState() {
    state.version = APP_VERSION;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function bindEvents() {
    els.prevMonthBtn.addEventListener("click", () => changeMonth(-1));
    els.nextMonthBtn.addEventListener("click", () => changeMonth(1));
    els.monthButton.addEventListener("click", () => {
      viewDate = startOfMonth(new Date());
      render();
    });

    els.addHabitBtn.addEventListener("click", () => openHabitModal());
    els.emptyAddHabitBtn.addEventListener("click", () => openHabitModal());

    document.querySelectorAll("[data-close-modal]").forEach((button) => {
      button.addEventListener("click", () => closeModal(document.querySelector(`#${button.dataset.closeModal}`)));
    });

    [els.habitModal, els.entryModal].forEach((modal) => {
      modal.addEventListener("mousedown", (event) => {
        if (event.target === modal) closeModal(modal);
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeModal(els.habitModal);
        closeModal(els.entryModal);
      }
    });

    els.habitTrackingType.addEventListener("change", syncTrackingFields);
    els.habitTarget.addEventListener("input", syncTrackingFields);
    els.habitNegative.addEventListener("change", syncTrackingFields);
    els.habitColor.addEventListener("input", () => {
      els.habitColorText.value = els.habitColor.value.toUpperCase();
    });
    els.habitColorText.addEventListener("input", () => {
      const color = normalizeHex(els.habitColorText.value);
      if (color) els.habitColor.value = color;
    });

    els.habitForm.addEventListener("submit", saveHabitFromForm);
    els.deleteHabitBtn.addEventListener("click", deleteCurrentHabit);

    els.entryValue.addEventListener("input", updateEntryPreview);
    [els.entryYesBtn, els.entryNoBtn].forEach((button) => {
      button.addEventListener("click", () => setBooleanEntry(Number(button.dataset.booleanValue)));
    });
    els.entryForm.addEventListener("submit", saveEntryFromForm);
    els.clearEntryBtn.addEventListener("click", clearCurrentEntry);

    els.exportBtn.addEventListener("click", exportData);
    els.importInput.addEventListener("change", importData);
    els.visualHabitSelect.addEventListener("change", () => {
      selectedHabitId = els.visualHabitSelect.value;
      renderInsights();
      syncSelectedHabitCard();
    });

    els.relationHabitA.addEventListener("change", () => {
      relationHabitAId = els.relationHabitA.value;
      ensureRelationHabits();
      renderRelations();
    });
    els.relationHabitB.addEventListener("change", () => {
      relationHabitBId = els.relationHabitB.value;
      ensureRelationHabits();
      renderRelations();
    });
    els.relationOverlayList.addEventListener("change", (event) => {
      const checkbox = event.target.closest("input[type=checkbox][data-overlay-habit]");
      if (!checkbox) return;
      const habitId = checkbox.dataset.overlayHabit;
      relationOverlayInitialized = true;
      if (checkbox.checked) {
        if (!relationOverlayHabitIds.includes(habitId)) relationOverlayHabitIds.push(habitId);
      } else {
        relationOverlayHabitIds = relationOverlayHabitIds.filter((id) => id !== habitId);
      }
      ensureRelationHabits();
      renderRelations();
    });
    [els.relationOverlayBtn, els.relationScatterBtn].forEach((button) => {
      button.addEventListener("click", () => {
        relationMode = button.dataset.relationMode;
        renderRelations();
      });
    });
  }

  function render() {
    els.monthLabel.textContent = MONTH_FORMAT.format(viewDate);
    els.emptyState.hidden = state.habits.length !== 0;
    els.habitList.hidden = state.habits.length === 0;
    els.insightsPanel.hidden = state.habits.length === 0;

    if (state.habits.length === 0) {
      selectedHabitId = null;
      relationHabitAId = null;
      relationHabitBId = null;
      relationOverlayHabitIds = [];
      relationOverlayInitialized = false;
      els.habitList.innerHTML = "";
      els.monthSummary.innerHTML = `
        <div class="summary-item"><span>habits</span><strong>0</strong></div>
        <div class="summary-item"><span>tracked</span><strong>0</strong></div>
        <div class="summary-item"><span>avg</span><strong>—</strong></div>`;
      return;
    }

    ensureSelectedHabit();
    els.habitList.innerHTML = state.habits.map(renderHabitCard).join("");
    renderMonthSummary();
    renderInsights();

    els.habitList.querySelectorAll("[data-edit-habit]").forEach((button) => {
      button.addEventListener("click", () => openHabitModal(button.dataset.editHabit));
    });

    els.habitList.querySelectorAll("[data-day]").forEach((cell) => {
      cell.addEventListener("click", () => openEntryModal(cell.dataset.habitId, cell.dataset.day));
    });

    els.habitList.querySelectorAll("[data-view-habit]").forEach((button) => {
      button.addEventListener("click", () => {
        selectedHabitId = button.dataset.viewHabit;
        renderInsights();
        syncSelectedHabitCard();
      });
    });
    syncSelectedHabitCard();
  }

  function renderHabitCard(habit) {
    const calendar = getCalendarDays(viewDate);
    const monthEntries = getHabitMonthEntries(habit.id, viewDate);
    const stats = computeHabitStats(habit, monthEntries);
    const negativeHabit = Boolean(habit.negativeHabit);
    const meta = habit.trackingType === "percent"
      ? "Manual percentage · no upper limit"
      : habit.trackingType === "boolean"
        ? negativeHabit
          ? `<span class="negative-target-badge">Negative habit</span> · Yes = success`
          : `<span class="positive-target-badge">Positive habit</span> · Yes = success`
        : negativeHabit
          ? `<span class="negative-target-badge">Negative habit</span> · Lower is better · Target: ${formatNumber(habit.target)}${habit.unit ? ` ${escapeHtml(habit.unit)}` : ""} / day`
          : `Target: ${formatNumber(habit.target)}${habit.unit ? ` ${escapeHtml(habit.unit)}` : ""} / day`;

    const weekdays = WEEKDAYS.map((day) => `<div class="weekday">${day}</div>`).join("");
    const cells = calendar.map((date) => renderDayCell(habit, date)).join("");

    return `
      <article class="habit-card" data-habit-card-id="${habit.id}" style="--habit-color: ${habit.color}">
        <header class="habit-header">
          <div class="habit-heading">
            <button class="habit-title-row habit-view-button" type="button" data-view-habit="${habit.id}" title="Show visualization">
              <span class="habit-color-dot"></span>
              <h2 class="habit-title">${escapeHtml(habit.name)}</h2>
            </button>
            <p class="habit-meta">${meta}</p>
          </div>
          <div class="habit-actions">
            <div class="habit-kpis">
              <div class="habit-kpi"><span>avg</span><strong>${stats.average == null ? "—" : `${formatPercent(stats.average)}%`}</strong></div>
              <div class="habit-kpi"><span>${habit.trackingType === "boolean" ? "success" : "100%+"}</span><strong>${stats.hitTarget}</strong></div>
              <div class="habit-kpi"><span>tracked</span><strong>${stats.tracked}</strong></div>
            </div>
            <button class="icon-button edit-habit" type="button" data-edit-habit="${habit.id}" aria-label="Edit ${escapeHtml(habit.name)}">•••</button>
          </div>
        </header>
        <div class="calendar-wrap">
          <div class="calendar">
            ${weekdays}
            ${cells}
          </div>
        </div>
      </article>`;
  }

  function renderDayCell(habit, date) {
    const inMonth = date.getMonth() === viewDate.getMonth();
    if (!inMonth) return `<button class="day-cell day-outside" tabindex="-1" aria-hidden="true"></button>`;

    const dateKey = toDateKey(date);
    const entry = state.entries[entryKey(habit.id, dateKey)];
    const today = isSameDate(date, new Date());
    const classes = ["day-cell"];
    if (entry) classes.push("has-entry");
    if (today) classes.push("day-today");

    let style = "";
    let content = `<div class="day-top"><span class="day-number">${date.getDate()}</span></div>`;
    let title = `${habit.name} · ${DATE_FORMAT.format(date)}`;

    if (entry) {
      const percent = getEntryPercent(habit, entry);
      const bg = colorForPercent(habit.color, percent);
      style = `--entry-bg:${bg};`;
      const valueText = habit.trackingType === "percent"
        ? "manual"
        : habit.trackingType === "boolean"
          ? (Number(entry.value) === 1 ? "Yes" : "No")
          : `${formatNumber(entry.value)}${habit.unit ? ` ${escapeHtml(habit.unit)}` : ""}`;
      const noteDot = entry.note ? `<span class="day-note-dot" title="Has note"></span>` : "";
      content = `
        <div class="day-top"><span class="day-number">${date.getDate()}</span>${noteDot}</div>
        <span class="day-value">${valueText}</span>
        <strong class="day-percent">${habit.trackingType === "boolean" ? (Number(entry.value) === 1 ? "YES" : "NO") : `${formatPercent(percent)}%`}</strong>`;
      title += habit.trackingType === "boolean"
        ? ` · ${Number(entry.value) === 1 ? "Yes" : "No"}`
        : ` · ${formatPercent(percent)}%`;
      if (entry.note) title += ` · ${entry.note}`;
    }

    return `<button class="${classes.join(" ")}" style="${style}" type="button" data-habit-id="${habit.id}" data-day="${dateKey}" title="${escapeHtml(title)}">${content}</button>`;
  }

  function ensureSelectedHabit() {
    if (!state.habits.length) {
      selectedHabitId = null;
      return;
    }
    if (!state.habits.some((habit) => habit.id === selectedHabitId)) {
      selectedHabitId = state.habits[0].id;
    }
  }

  function syncSelectedHabitCard() {
    els.habitList.querySelectorAll("[data-habit-card-id]").forEach((card) => {
      card.classList.toggle("is-visualized", card.dataset.habitCardId === selectedHabitId);
    });
  }

  function renderInsights() {
    if (!state.habits.length) return;
    ensureSelectedHabit();
    const habit = state.habits.find((item) => item.id === selectedHabitId) || state.habits[0];
    if (!habit) return;

    els.visualHabitSelect.innerHTML = state.habits.map((item) => `
      <option value="${item.id}" ${item.id === habit.id ? "selected" : ""}>${escapeHtml(item.name)}</option>`).join("");

    const monthEntries = getHabitMonthEntries(habit.id, viewDate);
    const stats = computeHabitStats(habit, monthEntries);
    const bestStreak = computeBestStreak(habit, viewDate);
    const successLabel = habit.trackingType === "boolean" ? "success" : "100%+";
    els.insightKpis.innerHTML = `
      <div class="insight-kpi"><span>avg</span><strong>${stats.average == null ? "—" : `${formatPercent(stats.average)}%`}</strong></div>
      <div class="insight-kpi"><span>${successLabel}</span><strong>${stats.hitTarget}</strong></div>
      <div class="insight-kpi"><span>best streak</span><strong>${bestStreak}${bestStreak === 1 ? " day" : " days"}</strong></div>`;

    els.allHabitsHeatmap.innerHTML = renderAllHabitsHeatmap(viewDate);
    els.trendCaption.textContent = `${MONTH_FORMAT.format(viewDate)} · target line at 100%`;
    els.habitTrendChart.innerHTML = renderTrendChart(habit, viewDate);
    renderRelations();
    els.habitComparison.innerHTML = renderHabitComparison(viewDate);
    els.habitComparison.querySelectorAll("[data-comparison-habit]").forEach((button) => {
      button.addEventListener("click", () => {
        selectedHabitId = button.dataset.comparisonHabit;
        renderInsights();
        syncSelectedHabitCard();
      });
    });
  }

  function renderAllHabitsHeatmap(date) {
    // A compact matrix: one row per habit, one square per day.
    // Fresh trackers start at the first recorded day so unused cells appear AFTER the data.
    // Once there is more history than fits, the matrix becomes a rolling recent window.
    const daysToShow = 28;
    const today = new Date();
    today.setHours(12, 0, 0, 0);

    const trackedDateKeys = Object.keys(state.entries)
      .map((key) => {
        const match = key.match(/(\d{4}-\d{2}-\d{2})$/);
        return match ? match[1] : null;
      })
      .filter(Boolean)
      .sort();

    let start;
    if (trackedDateKeys.length) {
      const firstTracked = fromDateKey(trackedDateKeys[0]);
      firstTracked.setHours(12, 0, 0, 0);
      const elapsedDays = Math.floor((today - firstTracked) / 86400000);

      if (elapsedDays < daysToShow) {
        start = firstTracked;
      } else {
        start = new Date(today);
        start.setDate(today.getDate() - (daysToShow - 1));
      }
    } else {
      start = new Date(today);
    }

    const visibleDays = Array.from({ length: daysToShow }, (_, index) => {
      const day = new Date(start);
      day.setDate(start.getDate() + index);
      return day;
    });

    const dateLabels = visibleDays.map((day, index) => {
      const showMonth = index === 0 || day.getDate() === 1;
      const label = showMonth
        ? `${day.toLocaleDateString("en", { month: "short" })} ${day.getDate()}`
        : String(day.getDate());
      const tooltip = DATE_FORMAT.format(day);
      return `<span class="habit-matrix-date${day > today ? " is-future" : ""}" title="${escapeHtml(tooltip)}">${escapeHtml(label)}</span>`;
    }).join("");

    const firstVisible = visibleDays[0];
    const lastVisible = visibleDays[visibleDays.length - 1];
    const rangeLabel = `${firstVisible.toLocaleDateString("en", { month: "short", day: "numeric" })} – ${lastVisible.toLocaleDateString("en", { month: "short", day: "numeric" })}`;

    const rows = state.habits.map((habit) => {
      const cells = [];

      for (let index = 0; index < daysToShow; index += 1) {
        const day = new Date(start);
        day.setDate(start.getDate() + index);
        const dateKey = toDateKey(day);
        const entry = state.entries[entryKey(habit.id, dateKey)];

        if (!entry) {
          const future = day > today;
          const tooltip = `${habit.name} · ${DATE_FORMAT.format(day)} · ${future ? "future" : "no data"}`;
          cells.push(`<span class="habit-matrix-cell is-empty${future ? " is-future" : ""}" title="${escapeHtml(tooltip)}" aria-label="${escapeHtml(tooltip)}"></span>`);
          continue;
        }

        const percent = getEntryPercent(habit, entry);
        const background = colorForPercent(habit.color, percent);
        let resultText;
        if (habit.trackingType === "boolean") {
          resultText = Number(entry.value) === 1 ? "Yes" : "No";
        } else if (habit.trackingType === "percent") {
          resultText = `${formatPercent(percent)}%`;
        } else {
          resultText = `${formatNumber(entry.value)}${habit.unit ? ` ${habit.unit}` : ""} · ${formatPercent(percent)}%`;
        }
        const tooltip = `${habit.name} · ${DATE_FORMAT.format(day)} · ${resultText}`;
        cells.push(`<span class="habit-matrix-cell has-value" style="--matrix-cell-bg:${background}; --matrix-cell-color:${habit.color}" title="${escapeHtml(tooltip)}" aria-label="${escapeHtml(tooltip)}"></span>`);
      }

      return `
        <div class="habit-matrix-row">
          <div class="habit-matrix-label" title="${escapeHtml(habit.name)}">
            <i style="--matrix-habit-color:${habit.color}"></i>
            <span>${escapeHtml(habit.name)}</span>
          </div>
          <div class="habit-matrix-cells">${cells.join("")}</div>
        </div>`;
    });

    return `
      <div class="habit-matrix-range">${escapeHtml(rangeLabel)}</div>
      <div class="habit-matrix-date-row" aria-hidden="true">
        <div></div>
        <div class="habit-matrix-dates">${dateLabels}</div>
      </div>
      ${rows.join("")}`;
  }

  function renderTrendChart(habit, date) {
    const width = 336;
    const height = 196;
    const pad = { left: 34, right: 10, top: 14, bottom: 25 };
    const days = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const values = [];
    for (let day = 1; day <= days; day += 1) {
      const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const entry = state.entries[entryKey(habit.id, dateKey)];
      values.push(entry ? getEntryPercent(habit, entry) : null);
    }

    const trackedValues = values.filter((value) => value != null && Number.isFinite(value));
    const highest = trackedValues.length ? Math.max(...trackedValues, 100) : 100;
    const lowest = trackedValues.length ? Math.min(...trackedValues, 0) : 0;
    const yMax = Math.max(100, Math.ceil(highest / 50) * 50);
    const yMin = Math.min(0, Math.floor(lowest / 50) * 50);
    const innerW = width - pad.left - pad.right;
    const innerH = height - pad.top - pad.bottom;
    const xFor = (index) => pad.left + (days === 1 ? 0 : (index / (days - 1)) * innerW);
    const yFor = (value) => {
      const clamped = Math.max(yMin, Math.min(value, yMax));
      return pad.top + innerH - ((clamped - yMin) / (yMax - yMin)) * innerH;
    };

    const tickValues = [...new Set([yMin, 0, 100, yMax])].sort((a, b) => a - b);
    const grids = tickValues.map((tick) => {
      const y = yFor(tick);
      const isTarget = Math.abs(tick - 100) < 0.001;
      return `
        <line x1="${pad.left}" y1="${y.toFixed(2)}" x2="${width - pad.right}" y2="${y.toFixed(2)}" class="chart-grid${isTarget ? " chart-target-line" : ""}" />
        <text x="${pad.left - 7}" y="${(y + 3).toFixed(2)}" text-anchor="end" class="chart-axis-label">${formatPercent(tick)}%</text>`;
    }).join("");

    const segments = [];
    let current = [];
    values.forEach((value, index) => {
      if (value == null || !Number.isFinite(value)) {
        if (current.length) segments.push(current);
        current = [];
      } else {
        current.push(`${xFor(index).toFixed(2)},${yFor(value).toFixed(2)}`);
      }
    });
    if (current.length) segments.push(current);

    const lines = segments.map((segment) => segment.length > 1
      ? `<polyline points="${segment.join(" ")}" fill="none" stroke="${habit.color}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" />`
      : "").join("");

    const points = values.map((value, index) => {
      if (value == null || !Number.isFinite(value)) return "";
      const x = xFor(index);
      const y = yFor(value);
      return `<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="3.25" fill="${habit.color}" stroke="#111319" stroke-width="1.6"><title>Day ${index + 1}: ${formatPercent(value)}%</title></circle>`;
    }).join("");

    const midDay = Math.ceil(days / 2);
    const xLabels = [1, midDay, days].map((day) => {
      const x = xFor(day - 1);
      return `<text x="${x.toFixed(2)}" y="${height - 6}" text-anchor="middle" class="chart-axis-label">${day}</text>`;
    }).join("");

    const empty = trackedValues.length === 0
      ? `<text x="${width / 2}" y="${height / 2}" text-anchor="middle" class="chart-empty-label">No tracked days yet</text>`
      : "";

    return `
      <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Daily percentage trend for ${escapeHtml(habit.name)}">
        ${grids}
        ${lines}
        ${points}
        ${xLabels}
        ${empty}
      </svg>`;
  }

  function ensureRelationHabits() {
    if (!state.habits.length) {
      relationHabitAId = null;
      relationHabitBId = null;
      relationOverlayHabitIds = [];
      return;
    }

    if (!state.habits.some((habit) => habit.id === relationHabitAId)) {
      relationHabitAId = state.habits.some((habit) => habit.id === selectedHabitId)
        ? selectedHabitId
        : state.habits[0].id;
    }

    if (!state.habits.some((habit) => habit.id === relationHabitBId) || (relationHabitBId === relationHabitAId && state.habits.length > 1)) {
      relationHabitBId = state.habits.find((habit) => habit.id !== relationHabitAId)?.id || relationHabitAId;
    }

    const validIds = new Set(state.habits.map((habit) => habit.id));
    relationOverlayHabitIds = relationOverlayHabitIds.filter((id) => validIds.has(id));
    if (!relationOverlayInitialized) {
      relationOverlayHabitIds = state.habits.slice(0, Math.min(4, state.habits.length)).map((habit) => habit.id);
      relationOverlayInitialized = true;
    }
  }

  function renderOverlayHabitPicker() {
    if (!els.relationOverlayList) return;
    els.relationOverlayList.innerHTML = state.habits.map((habit) => {
      const checked = relationOverlayHabitIds.includes(habit.id) ? 'checked' : '';
      return `<label class="relation-overlay-item">
        <input type="checkbox" data-overlay-habit="${habit.id}" ${checked} />
        <span class="relation-overlay-swatch" style="--relation-color:${habit.color}"></span>
        <span class="relation-overlay-name">${escapeHtml(habit.name)}</span>
      </label>`;
    }).join("");
  }

  function renderRelations() {
    if (!els.relationChart || !state.habits.length) return;
    ensureRelationHabits();

    const habitA = state.habits.find((habit) => habit.id === relationHabitAId);
    const habitB = state.habits.find((habit) => habit.id === relationHabitBId);
    if (!habitA || !habitB) return;

    const options = state.habits.map((habit) => `<option value="${habit.id}">${escapeHtml(habit.name)}</option>`).join("");
    els.relationHabitA.innerHTML = options;
    els.relationHabitB.innerHTML = options;
    els.relationHabitA.value = habitA.id;
    els.relationHabitB.value = habitB.id;
    els.relationHabitB.disabled = state.habits.length < 2;
    renderOverlayHabitPicker();

    const overlayMode = relationMode === "overlay";
    els.relationPairControls.hidden = overlayMode;
    els.relationOverlayControls.hidden = !overlayMode;
    els.relationOverlayBtn.classList.toggle("selected", overlayMode);
    els.relationScatterBtn.classList.toggle("selected", relationMode === "scatter");

    if (overlayMode) {
      const selectedHabits = state.habits.filter((habit) => relationOverlayHabitIds.includes(habit.id));
      if (!selectedHabits.length) {
        els.relationMeta.innerHTML = `<span class="relation-empty">Select at least one habit to draw the overlay.</span>`;
        els.relationChart.innerHTML = `<div class="relation-empty-chart">No habits selected</div>`;
        return;
      }

      const trackedDays = getOverlayTrackedDayCount(selectedHabits, viewDate);
      els.relationMeta.innerHTML = `
        <div class="relation-legend">
          ${selectedHabits.map((habit) => `<span><i style="--relation-color:${habit.color}"></i>${escapeHtml(habit.name)}</span>`).join("")}
        </div>
        <div class="relation-correlation relation-overlay-summary">
          <span>overlay</span><strong>${selectedHabits.length}</strong><em>${selectedHabits.length === 1 ? 'habit selected' : 'habits selected'}</em><small>${trackedDays} tracked day${trackedDays === 1 ? '' : 's'} this month</small>
        </div>`;
      els.relationChart.innerHTML = renderRelationOverlayMulti(selectedHabits, viewDate);
      return;
    }

    if (state.habits.length < 2) {
      els.relationMeta.innerHTML = `<span class="relation-empty">Add a second habit to compare relationships.</span>`;
      els.relationChart.innerHTML = `<div class="relation-empty-chart">Two habits are needed</div>`;
      return;
    }

    const paired = getPairedRelationData(habitA, habitB, viewDate);
    const correlation = pearsonCorrelation(paired.map((item) => item.rawA), paired.map((item) => item.rawB));
    const correlationText = Number.isFinite(correlation) ? `${correlation >= 0 ? "+" : ""}${correlation.toFixed(2)}` : "—";
    const relationLabel = describeCorrelation(correlation);

    els.relationMeta.innerHTML = `
      <div class="relation-legend">
        <span><i style="--relation-color:${habitA.color}"></i>${escapeHtml(habitA.name)}</span>
        <span><i style="--relation-color:${habitB.color}"></i>${escapeHtml(habitB.name)}</span>
      </div>
      <div class="relation-correlation" title="Pearson correlation across days where both habits were tracked">
        <span>r</span><strong>${correlationText}</strong><em>${escapeHtml(relationLabel)}</em><small>${paired.length} shared days</small>
      </div>`;

    els.relationChart.innerHTML = renderRelationScatter(habitA, habitB, paired);
  }

  function getOverlayTrackedDayCount(habits, date) {
    const days = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    let count = 0;
    for (let day = 1; day <= days; day += 1) {
      const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const hasEntry = habits.some((habit) => state.entries[entryKey(habit.id, dateKey)]);
      if (hasEntry) count += 1;
    }
    return count;
  }

  function getPairedRelationData(habitA, habitB, date) {
    const days = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const paired = [];
    for (let day = 1; day <= days; day += 1) {
      const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const entryA = state.entries[entryKey(habitA.id, dateKey)];
      const entryB = state.entries[entryKey(habitB.id, dateKey)];
      if (!entryA || !entryB) continue;
      const rawA = getRelationRawValue(habitA, entryA);
      const rawB = getRelationRawValue(habitB, entryB);
      if (!Number.isFinite(rawA) || !Number.isFinite(rawB)) continue;
      paired.push({ day, dateKey, entryA, entryB, rawA, rawB, percentA: getEntryPercent(habitA, entryA), percentB: getEntryPercent(habitB, entryB) });
    }
    return paired;
  }

  function getRelationRawValue(habit, entry) {
    if (!entry) return null;
    return Number(entry.value);
  }

  function getRelationUnit(habit) {
    if (habit.trackingType === "boolean") return "Yes/No";
    if (habit.trackingType === "percent") return "%";
    return habit.unit || "value";
  }

  function describeCorrelation(value) {
    if (!Number.isFinite(value)) return "not enough variation";
    const magnitude = Math.abs(value);
    const strength = magnitude >= 0.75 ? "strong" : magnitude >= 0.45 ? "moderate" : magnitude >= 0.2 ? "weak" : "little";
    if (magnitude < 0.2) return `${strength} relation`;
    return `${strength} ${value < 0 ? "inverse" : "positive"}`;
  }

  function pearsonCorrelation(xs, ys) {
    if (xs.length !== ys.length || xs.length < 2) return null;
    const n = xs.length;
    const meanX = xs.reduce((sum, value) => sum + value, 0) / n;
    const meanY = ys.reduce((sum, value) => sum + value, 0) / n;
    let numerator = 0;
    let sumX = 0;
    let sumY = 0;
    for (let i = 0; i < n; i += 1) {
      const dx = xs[i] - meanX;
      const dy = ys[i] - meanY;
      numerator += dx * dy;
      sumX += dx * dx;
      sumY += dy * dy;
    }
    const denominator = Math.sqrt(sumX * sumY);
    return denominator > 0 ? numerator / denominator : null;
  }

  function renderRelationOverlayMulti(habits, date) {
    const width = 336;
    const height = 205;
    const pad = { left: 34, right: 10, top: 20, bottom: 25 };
    const days = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const series = habits.map((habit) => {
      const values = [];
      for (let day = 1; day <= days; day += 1) {
        const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        const entry = state.entries[entryKey(habit.id, dateKey)];
        values.push(entry ? getEntryPercent(habit, entry) : null);
      }
      return { habit, values };
    });
    const finite = series.flatMap((item) => item.values).filter((value) => value != null && Number.isFinite(value));
    const highest = finite.length ? Math.max(...finite, 100) : 100;
    const lowest = finite.length ? Math.min(...finite, 0) : 0;
    const yMax = Math.max(100, Math.ceil(highest / 50) * 50);
    const yMin = Math.min(0, Math.floor(lowest / 50) * 50);
    const innerW = width - pad.left - pad.right;
    const innerH = height - pad.top - pad.bottom;
    const xFor = (index) => pad.left + (days === 1 ? 0 : (index / (days - 1)) * innerW);
    const yFor = (value) => {
      const clamped = Math.max(yMin, Math.min(value, yMax));
      return pad.top + innerH - ((clamped - yMin) / (yMax - yMin)) * innerH;
    };

    const tickValues = [...new Set([yMin, 0, 100, yMax])].sort((a, b) => a - b);
    const grids = tickValues.map((tick) => {
      const y = yFor(tick);
      const isTarget = Math.abs(tick - 100) < 0.001;
      return `<line x1="${pad.left}" y1="${y.toFixed(2)}" x2="${width - pad.right}" y2="${y.toFixed(2)}" class="chart-grid${isTarget ? " chart-target-line" : ""}" />
        <text x="${pad.left - 7}" y="${(y + 3).toFixed(2)}" text-anchor="end" class="chart-axis-label">${formatPercent(tick)}%</text>`;
    }).join("");

    const paths = series.map(({ habit, values }) => {
      const segments = [];
      let current = [];
      values.forEach((value, index) => {
        if (value == null || !Number.isFinite(value)) {
          if (current.length) segments.push(current);
          current = [];
        } else current.push(`${xFor(index).toFixed(2)},${yFor(value).toFixed(2)}`);
      });
      if (current.length) segments.push(current);
      const lines = segments.map((segment) => segment.length > 1
        ? `<polyline points="${segment.join(" ")}" fill="none" stroke="${habit.color}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" opacity=".92" />`
        : "").join("");
      const points = values.map((value, index) => value == null || !Number.isFinite(value) ? "" :
        `<circle cx="${xFor(index).toFixed(2)}" cy="${yFor(value).toFixed(2)}" r="2.5" fill="${habit.color}" stroke="#111319" stroke-width="1.2"><title>${escapeHtml(habit.name)} · day ${index + 1}: ${formatPercent(value)}%</title></circle>`).join("");
      return lines + points;
    }).join("");

    const midDay = Math.ceil(days / 2);
    const xLabels = [1, midDay, days].map((day) => `<text x="${xFor(day - 1).toFixed(2)}" y="${height - 6}" text-anchor="middle" class="chart-axis-label">${day}</text>`).join("");
    const empty = finite.length === 0 ? `<text x="${width / 2}" y="${height / 2}" text-anchor="middle" class="chart-empty-label">No tracked data yet</text>` : "";

    return `<div class="relation-chart-caption">Overlay uses % of target so habits with different units share one scale.</div>
      <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Overlay comparison of selected habits">
        ${grids}${paths}${xLabels}${empty}
      </svg>`;
  }

  function renderRelationScatter(habitA, habitB, paired) {
    const width = 336;
    const height = 220;
    const pad = { left: 42, right: 18, top: 16, bottom: 36 };
    if (!paired.length) {
      return `<div class="relation-chart-caption">Scatter uses actual values from days where both habits were tracked.</div><div class="relation-empty-chart">No shared tracked days this month</div>`;
    }

    const xs = paired.map((item) => item.rawA);
    const ys = paired.map((item) => item.rawB);
    const xMin = Math.min(0, ...xs);
    const yMin = Math.min(0, ...ys);
    const xMaxRaw = Math.max(...xs);
    const yMaxRaw = Math.max(...ys);
    const xMax = xMaxRaw === xMin ? xMin + 1 : xMaxRaw * 1.08 || 1;
    const yMax = yMaxRaw === yMin ? yMin + 1 : yMaxRaw * 1.08 || 1;
    const innerW = width - pad.left - pad.right;
    const innerH = height - pad.top - pad.bottom;
    const xFor = (value) => pad.left + ((value - xMin) / (xMax - xMin)) * innerW;
    const yFor = (value) => pad.top + innerH - ((value - yMin) / (yMax - yMin)) * innerH;

    const grid = [0, .5, 1].map((factor) => {
      const x = pad.left + factor * innerW;
      const y = pad.top + factor * innerH;
      const xValue = xMin + factor * (xMax - xMin);
      const yValue = yMax - factor * (yMax - yMin);
      return `<line x1="${x.toFixed(2)}" y1="${pad.top}" x2="${x.toFixed(2)}" y2="${height - pad.bottom}" class="chart-grid" />
        <line x1="${pad.left}" y1="${y.toFixed(2)}" x2="${width - pad.right}" y2="${y.toFixed(2)}" class="chart-grid" />
        <text x="${x.toFixed(2)}" y="${height - pad.bottom + 13}" text-anchor="middle" class="chart-axis-label">${formatCompactAxis(xValue)}</text>
        <text x="${pad.left - 7}" y="${(y + 3).toFixed(2)}" text-anchor="end" class="chart-axis-label">${formatCompactAxis(yValue)}</text>`;
    }).join("");

    const dots = paired.map((item) => {
      const labelA = formatRelationRaw(habitA, item.rawA);
      const labelB = formatRelationRaw(habitB, item.rawB);
      return `<circle cx="${xFor(item.rawA).toFixed(2)}" cy="${yFor(item.rawB).toFixed(2)}" r="4" fill="${habitB.color}" stroke="${habitA.color}" stroke-width="1.8" opacity=".92"><title>Day ${item.day} · ${escapeHtml(habitA.name)}: ${escapeHtml(labelA)} · ${escapeHtml(habitB.name)}: ${escapeHtml(labelB)}</title></circle>`;
    }).join("");

    let regression = "";
    if (paired.length >= 2) {
      const meanX = xs.reduce((a, b) => a + b, 0) / xs.length;
      const meanY = ys.reduce((a, b) => a + b, 0) / ys.length;
      const denominator = xs.reduce((sum, x) => sum + (x - meanX) ** 2, 0);
      if (denominator > 0) {
        const slope = xs.reduce((sum, x, index) => sum + (x - meanX) * (ys[index] - meanY), 0) / denominator;
        const intercept = meanY - slope * meanX;
        const rx1 = Math.min(...xs);
        const rx2 = Math.max(...xs);
        const ry1 = slope * rx1 + intercept;
        const ry2 = slope * rx2 + intercept;
        regression = `<line x1="${xFor(rx1).toFixed(2)}" y1="${yFor(ry1).toFixed(2)}" x2="${xFor(rx2).toFixed(2)}" y2="${yFor(ry2).toFixed(2)}" class="relation-regression" />`;
      }
    }

    return `<div class="relation-chart-caption">Each dot is one day · actual values · trend line shows direction, not causation.</div>
      <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Scatter plot comparing ${escapeHtml(habitA.name)} and ${escapeHtml(habitB.name)}">
        ${grid}${regression}${dots}
        <text x="${pad.left + innerW / 2}" y="${height - 7}" text-anchor="middle" class="relation-axis-title">${escapeHtml(habitA.name)} · ${escapeHtml(getRelationUnit(habitA))}</text>
        <text x="11" y="${pad.top + innerH / 2}" text-anchor="middle" class="relation-axis-title" transform="rotate(-90 11 ${pad.top + innerH / 2})">${escapeHtml(habitB.name)} · ${escapeHtml(getRelationUnit(habitB))}</text>
      </svg>`;
  }

  function formatRelationRaw(habit, value) {
    if (habit.trackingType === "boolean") return value === 1 ? "Yes" : "No";
    if (habit.trackingType === "percent") return `${formatPercent(value)}%`;
    return `${formatNumber(value)}${habit.unit ? ` ${habit.unit}` : ""}`;
  }

  function formatCompactAxis(value) {
    const abs = Math.abs(value);
    if (abs >= 1000000) return `${(value / 1000000).toFixed(abs >= 10000000 ? 0 : 1)}m`;
    if (abs >= 1000) return `${(value / 1000).toFixed(abs >= 10000 ? 0 : 1)}k`;
    if (abs >= 100) return String(Math.round(value));
    if (abs >= 10) return value.toFixed(0);
    return value.toFixed(1).replace(/\.0$/, "");
  }

  function renderHabitComparison(date) {
    const rows = state.habits.map((habit) => {
      const stats = computeHabitStats(habit, getHabitMonthEntries(habit.id, date));
      return { habit, average: stats.average, tracked: stats.tracked };
    });
    const finite = rows.map((row) => row.average).filter((value) => value != null && Number.isFinite(value));
    const scaleMax = Math.max(100, finite.length ? Math.max(...finite) : 100);

    return rows.map(({ habit, average, tracked }) => {
      const width = average == null ? 0 : Math.max(0, Math.min(100, (average / scaleMax) * 100));
      return `
        <button class="comparison-row${habit.id === selectedHabitId ? " selected" : ""}" type="button" data-comparison-habit="${habit.id}">
          <span class="comparison-name"><i style="--comparison-color:${habit.color}"></i>${escapeHtml(habit.name)}</span>
          <span class="comparison-value">${average == null ? "—" : `${formatPercent(average)}%`}</span>
          <span class="comparison-track"><span style="width:${width.toFixed(2)}%; background:${habit.color}"></span></span>
          <span class="comparison-meta">${tracked} tracked</span>
        </button>`;
    }).join("");
  }

  function computeBestStreak(habit, date) {
    const days = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    let best = 0;
    let current = 0;
    for (let day = 1; day <= days; day += 1) {
      const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const entry = state.entries[entryKey(habit.id, dateKey)];
      const success = entry && getEntryPercent(habit, entry) >= 100;
      if (success) {
        current += 1;
        best = Math.max(best, current);
      } else {
        current = 0;
      }
    }
    return best;
  }

  function renderMonthSummary() {
    const entries = [];
    for (const habit of state.habits) {
      for (const item of getHabitMonthEntries(habit.id, viewDate)) {
        entries.push({ habit, entry: item.entry });
      }
    }

    const percentages = entries.map(({ habit, entry }) => getEntryPercent(habit, entry));
    const avg = percentages.length ? percentages.reduce((a, b) => a + b, 0) / percentages.length : null;
    const targetHits = percentages.filter((value) => value >= 100).length;

    els.monthSummary.innerHTML = `
      <div class="summary-item"><span>habits</span><strong>${state.habits.length}</strong></div>
      <div class="summary-item"><span>tracked</span><strong>${entries.length}</strong></div>
      <div class="summary-item"><span>100%+</span><strong>${targetHits}</strong></div>
      <div class="summary-item"><span>avg</span><strong>${avg == null ? "—" : `${formatPercent(avg)}%`}</strong></div>`;
  }

  function changeMonth(offset) {
    viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1);
    render();
  }

  function openHabitModal(habitId = null) {
    const habit = state.habits.find((item) => item.id === habitId);
    els.habitForm.reset();
    els.habitId.value = habit?.id || "";
    els.habitModalTitle.textContent = habit ? "Edit habit" : "New habit";
    els.deleteHabitBtn.hidden = !habit;

    els.habitName.value = habit?.name || "";
    els.habitTrackingType.value = habit?.trackingType || "target";
    els.habitTarget.value = habit?.trackingType === "target" ? (habit.target ?? 1) : 1;
    els.habitNegative.checked = Boolean(habit?.negativeHabit);
    els.habitUnit.value = habit?.unit || "";
    els.habitColor.value = habit?.color || "#7C5CFC";
    els.habitColorText.value = (habit?.color || "#7C5CFC").toUpperCase();
    syncTrackingFields();
    openModal(els.habitModal);
    setTimeout(() => els.habitName.focus(), 30);
  }

  function syncTrackingFields() {
    const type = els.habitTrackingType.value;
    const isTarget = type === "target";
    const isBoolean = type === "boolean";
    const isPercent = type === "percent";
    const isNegative = els.habitNegative.checked;

    els.targetValueField.hidden = !isTarget;
    els.targetValueField.style.display = isTarget ? "flex" : "none";
    els.unitField.hidden = !isTarget;
    els.unitField.style.display = isTarget ? "flex" : "none";
    els.habitTarget.required = isTarget;

    els.negativeHabitField.hidden = isPercent;
    els.negativeHabitField.style.display = isPercent ? "none" : "grid";
    if (isPercent) els.habitNegative.checked = false;

    if (isPercent) {
      els.trackingHint.textContent = "Вводишь процент напрямую. Можно записать 0%, 124%, 500% или любое другое неотрицательное значение.";
    } else if (isBoolean) {
      els.trackingHint.textContent = isNegative
        ? "Negative habit: Yes всё равно означает успешный день. Формулируй привычку как желаемое состояние — например «Не курить» → Yes."
        : "Yes означает успешный день, No — невыполнение.";
    } else if (isNegative) {
      els.trackingHint.textContent = "Negative habit: чем фактическое значение меньше, тем лучше. Daily target = 100%; ниже target даёт больше 100%, выше target — меньше 100%.";
    } else {
      els.trackingHint.textContent = "Вводишь фактическое значение — процент считается автоматически. Чем больше относительно target, тем лучше; верхнего лимита нет.";
    }
  }

  function saveHabitFromForm(event) {
    event.preventDefault();
    const id = els.habitId.value || createId("habit");
    const trackingType = els.habitTrackingType.value;
    const target = Number(els.habitTarget.value);
    const color = normalizeHex(els.habitColorText.value) || els.habitColor.value;

    if (!els.habitName.value.trim()) return;
    if (trackingType === "target" && (!Number.isFinite(target) || target <= 0)) {
      showToast("Daily target must be greater than 0");
      return;
    }

    const habit = {
      id,
      name: els.habitName.value.trim(),
      trackingType,
      target: trackingType === "target" ? target : trackingType === "boolean" ? 1 : 100,
      negativeHabit: trackingType === "percent" ? false : els.habitNegative.checked,
      unit: trackingType === "target" ? els.habitUnit.value.trim() : trackingType === "percent" ? "%" : "",
      color,
      createdAt: state.habits.find((item) => item.id === id)?.createdAt || new Date().toISOString(),
    };

    const index = state.habits.findIndex((item) => item.id === id);
    if (index >= 0) state.habits[index] = habit;
    else state.habits.push(habit);

    saveState();
    closeModal(els.habitModal);
    render();
    showToast(index >= 0 ? "Habit updated" : "Habit created");
  }

  function deleteCurrentHabit() {
    const id = els.habitId.value;
    const habit = state.habits.find((item) => item.id === id);
    if (!habit) return;
    if (!window.confirm(`Delete “${habit.name}” and all its tracked days?`)) return;

    state.habits = state.habits.filter((item) => item.id !== id);
    for (const key of Object.keys(state.entries)) {
      if (key.startsWith(`${id}::`)) delete state.entries[key];
    }
    saveState();
    closeModal(els.habitModal);
    render();
    showToast("Habit deleted");
  }

  function openEntryModal(habitId, dateKey) {
    const habit = state.habits.find((item) => item.id === habitId);
    if (!habit) return;

    const entry = state.entries[entryKey(habitId, dateKey)];
    const date = fromDateKey(dateKey);
    els.entryHabitId.value = habitId;
    els.entryDate.value = dateKey;
    els.entryDateLabel.textContent = DATE_FORMAT.format(date);
    els.entryModalTitle.textContent = habit.name;
    els.entryValue.value = habit.trackingType === "boolean" ? "" : (entry?.value ?? "");
    els.entryNote.value = entry?.note || "";
    els.clearEntryBtn.hidden = !entry;
    syncEntryTrackingFields(habit);
    els.booleanEntry.dataset.value = habit.trackingType === "boolean" && entry ? String(Number(entry.value) === 1 ? 1 : 0) : "";
    syncBooleanButtons();

    if (habit.trackingType === "percent") {
      els.entryValueLabel.textContent = "Percentage";
      els.entryUnitBadge.textContent = "%";
      els.entryValue.placeholder = "100";
    } else if (habit.trackingType === "target") {
      els.entryValueLabel.textContent = "Actual result";
      els.entryUnitBadge.textContent = habit.unit || "";
      els.entryValue.placeholder = String(habit.target);
    }

    updateEntryPreview();
    openModal(els.entryModal);
    setTimeout(() => els.entryValue.focus(), 30);
  }


  function syncEntryTrackingFields(habit) {
    const isBoolean = habit.trackingType === "boolean";

    // Keep the two day-entry UIs mutually exclusive.
    // We set both `hidden` and an inline display value so this remains correct
    // even if an older cached stylesheet has rules that override [hidden].
    els.entryValueField.hidden = isBoolean;
    els.entryValueField.style.display = isBoolean ? "none" : "flex";
    els.entryValue.required = !isBoolean;

    els.booleanEntry.hidden = !isBoolean;
    els.booleanEntry.style.display = isBoolean ? "grid" : "none";
  }

  function setBooleanEntry(value) {
    els.booleanEntry.dataset.value = String(value === 1 ? 1 : 0);
    syncBooleanButtons();
    updateEntryPreview();
  }

  function syncBooleanButtons() {
    const selected = els.booleanEntry.dataset.value;
    els.entryYesBtn.classList.toggle("selected", selected === "1");
    els.entryNoBtn.classList.toggle("selected", selected === "0");
  }

  function updateEntryPreview() {
    const habit = state.habits.find((item) => item.id === els.entryHabitId.value);
    if (!habit) {
      els.entryPercentPreview.textContent = "—";
      return;
    }
    if (habit.trackingType === "boolean") {
      const selected = els.booleanEntry.dataset.value;
      if (selected !== "1" && selected !== "0") {
        els.entryPercentPreview.textContent = "—";
        return;
      }
      const value = Number(selected);
      const success = value === 1;
      els.entryPercentPreview.textContent = `${value === 1 ? "Yes" : "No"} · ${success ? "100%" : "0%"}`;
      return;
    }
    const value = Number(els.entryValue.value);
    if (els.entryValue.value === "" || !Number.isFinite(value) || value < 0) {
      els.entryPercentPreview.textContent = "—";
      return;
    }
    const percent = getEntryPercent(habit, { value });
    els.entryPercentPreview.textContent = `${formatPercent(percent)}%`;
  }

  function saveEntryFromForm(event) {
    event.preventDefault();
    const habitId = els.entryHabitId.value;
    const dateKey = els.entryDate.value;
    const habit = state.habits.find((item) => item.id === habitId);
    if (!habit) return;

    let value;
    if (habit.trackingType === "boolean") {
      if (els.booleanEntry.dataset.value !== "1" && els.booleanEntry.dataset.value !== "0") {
        showToast("Choose Yes or No");
        return;
      }
      value = Number(els.booleanEntry.dataset.value);
    } else {
      value = Number(els.entryValue.value);
      if (!Number.isFinite(value) || value < 0) return;
    }

    state.entries[entryKey(habitId, dateKey)] = {
      value,
      note: els.entryNote.value.trim(),
      updatedAt: new Date().toISOString(),
    };
    saveState();
    closeModal(els.entryModal);
    render();
    showToast("Day saved");
  }

  function clearCurrentEntry() {
    const key = entryKey(els.entryHabitId.value, els.entryDate.value);
    if (!state.entries[key]) return;
    delete state.entries[key];
    saveState();
    closeModal(els.entryModal);
    render();
    showToast("Day cleared");
  }

  function getEntryPercent(habit, entry) {
    if (!entry) return null;
    const value = Number(entry.value) || 0;
    if (habit.trackingType === "percent") return value;
    if (habit.trackingType === "boolean") return value === 1 ? 100 : 0;

    const target = Number(habit.target);
    if (!Number.isFinite(target) || target < 0) return 0;

    // Legacy target=0 habits from older builds keep their old binary scoring
    // until the user edits them and supplies a positive reference target.
    if (target === 0) return value === 0 ? 100 : 0;

    if (habit.negativeHabit) {
      // Negative numerical habits use the target as the 100% reference point.
      // The scale stays linear without a lower floor, so increasingly large
      // overruns remain distinguishable: target=100%, 2x=0%, 3x=-100%, etc.
      return (2 - value / target) * 100;
    }
    return (value / target) * 100;
  }

  function computeHabitStats(habit, monthEntries) {
    if (!monthEntries.length) return { average: null, tracked: 0, hitTarget: 0 };
    const values = monthEntries.map(({ entry }) => getEntryPercent(habit, entry));
    return {
      average: values.reduce((a, b) => a + b, 0) / values.length,
      tracked: values.length,
      hitTarget: values.filter((value) => value >= 100).length,
    };
  }

  function getHabitMonthEntries(habitId, date) {
    const prefix = `${habitId}::${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-`;
    return Object.entries(state.entries)
      .filter(([key]) => key.startsWith(prefix))
      .map(([key, entry]) => ({ dateKey: key.split("::")[1], entry }));
  }

  function colorForPercent(hex, percent) {
    const rgb = hexToRgb(hex) || { r: 124, g: 92, b: 252 };
    const clamped = Math.max(0, Math.min(100, percent));
    const progress = clamped / 100;

    // 0% is intentionally distinct from no data: a faint but visible tint.
    const alpha = 0.12 + progress * 0.58;
    const darken = 0.72 + progress * 0.28;
    const r = Math.round(rgb.r * darken);
    const g = Math.round(rgb.g * darken);
    const b = Math.round(rgb.b * darken);

    return `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})`;
  }

  function exportData() {
    const payload = {
      app: "L manager",
      version: APP_VERSION,
      exportedAt: new Date().toISOString(),
      data: state,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `l-manager-backup-${toDateKey(new Date())}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    showToast("Backup exported");
  }

  async function importData(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const incoming = parsed.data || parsed;
      if (!incoming || !Array.isArray(incoming.habits) || typeof incoming.entries !== "object") throw new Error("Invalid backup");
      if (!window.confirm("Import will replace current L manager data. Continue?")) return;

      state.habits = incoming.habits;
      state.entries = incoming.entries || {};
      relationOverlayHabitIds = [];
      relationOverlayInitialized = false;
      state.version = APP_VERSION;
      saveState();
      render();
      showToast("Backup imported");
    } catch (error) {
      console.error(error);
      showToast("Could not import this file");
    }
  }

  function getCalendarDays(date) {
    const first = startOfMonth(date);
    const jsDay = first.getDay(); // Sun = 0
    const mondayIndex = (jsDay + 6) % 7;
    const start = new Date(first);
    start.setDate(first.getDate() - mondayIndex);

    const last = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const lastMondayIndex = (last.getDay() + 6) % 7;
    const trailing = 6 - lastMondayIndex;
    const cells = mondayIndex + last.getDate() + trailing;

    return Array.from({ length: cells }, (_, index) => {
      const day = new Date(start);
      day.setDate(start.getDate() + index);
      return day;
    });
  }

  function openModal(modal) {
    modal.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeModal(modal) {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    if (els.habitModal.hidden && els.entryModal.hidden) document.body.style.overflow = "";
  }

  function showToast(message) {
    clearTimeout(toastTimer);
    els.toast.textContent = message;
    els.toast.classList.add("show");
    toastTimer = setTimeout(() => els.toast.classList.remove("show"), 1800);
  }

  function startOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  function isSameDate(a, b) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }

  function toDateKey(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  }

  function fromDateKey(key) {
    const [year, month, day] = key.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  function entryKey(habitId, dateKey) {
    return `${habitId}::${dateKey}`;
  }

  function formatNumber(value) {
    return new Intl.NumberFormat("en", { maximumFractionDigits: 2 }).format(value);
  }

  function formatPercent(value) {
    if (!Number.isFinite(value)) return "0";
    const isInteger = Math.abs(value - Math.round(value)) < 0.000001;
    return new Intl.NumberFormat("en", {
      minimumFractionDigits: 0,
      maximumFractionDigits: isInteger ? 0 : 1,
    }).format(value);
  }

  function createId(prefix) {
    if (window.crypto?.randomUUID) return `${prefix}-${crypto.randomUUID()}`;
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
  }

  function normalizeHex(value) {
    const text = String(value || "").trim();
    if (/^#[0-9a-fA-F]{6}$/.test(text)) return text.toUpperCase();
    return null;
  }

  function hexToRgb(hex) {
    const valid = normalizeHex(hex);
    if (!valid) return null;
    return {
      r: parseInt(valid.slice(1, 3), 16),
      g: parseInt(valid.slice(3, 5), 16),
      b: parseInt(valid.slice(5, 7), 16),
    };
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
})();
