(() => {
  "use strict";

  const STORAGE_KEY = "l-manager:data:v1";
  const MIGRATION_BACKUP_KEY = "l-manager:data:backup:pre-sleep-v0.5.1";
  const APP_VERSION = "0.6.2";

  const I18N = {
    en: {
      habitTracker: "habit tracker", updateDay: "Update day", export: "Export", import: "Import", addHabit: "+ Habit", previousMonth: "Previous month", nextMonth: "Next month", today: "today",
      showPercentages: "Show percentages", showPercentagesTitle: "When off, values remain visible but calculated percentages are hidden",
      noHabitsYet: "No habits yet", emptyDescription: "Add your first habit. Set a numeric target and L manager calculates the result — 12%, 124%, 500%, or anything else.", createFirstHabit: "Create first habit",
      habitVisualization: "Habit visualization", visualization: "Visualization", habitOverview: "Habit overview", habitHistory: "Habit history", habitHistoryDescription: "One row per habit · dated daily history", habitHistoryMatrix: "Habit history matrix",
      habit: "Habit", dailyProgress: "Daily progress", relations: "Relations", relationsDescription: "Overlay many habits or compare two on the same days", overlayHabits: "Overlay habits", selectManyHabits: "Select as many habits as you want",
      relationVisualizationMode: "Relation visualization mode", overlay: "Overlay", scatter: "Scatter", habitsThisMonth: "Habits this month", averageTrackedDays: "Average result for tracked days",
      close: "Close", name: "Name", habitNamePlaceholder: "For example: Read", tracking: "Tracking", targetValue: "Target value", manualPercent: "Manual percent", yesNo: "Yes / No", dailyTarget: "Daily target", unit: "Unit", unitPlaceholder: "min, pages, km…", color: "Color",
      negativeHabit: "Negative habit", negativeHabitDescription: "For numbers, lower is better. Yes / No still aims for Yes.", delete: "Delete", cancel: "Cancel", saveHabit: "Save habit",
      yes: "Yes", no: "No", result: "Result", note: "Note", optional: "optional", notePlaceholder: "Context for the day, if useful…", clearDay: "Clear day", saveDay: "Save day",
      habits: "habits", tracked: "tracked", avg: "avg", success: "success", bestStreak: "best streak", day: "day", days: "days", target: "Target", perDay: "/ day", lowerIsBetter: "Lower is better", positiveHabit: "Positive habit", yesSuccess: "Yes = success", manualPercentageNoLimit: "Manual percentage · no upper limit",
      showVisualization: "Show visualization", editHabitAria: "Edit {name}", hasNote: "Has note", manual: "manual", future: "future", noData: "no data",
      currentMonthTarget: "{month} · target line at 100%", noTrackedDays: "No tracked days yet", dailyPercentageTrend: "Daily percentage trend for {name}",
      selectAtLeastOne: "Select at least one habit to draw the overlay.", noHabitsSelected: "No habits selected", habitSelected: "habit selected", habitsSelected: "habits selected", trackedDayThisMonth: "tracked day this month", trackedDaysThisMonth: "tracked days this month",
      addSecondHabit: "Add a second habit to compare relationships.", twoHabitsNeeded: "Two habits are needed", pearsonTitle: "Pearson correlation across days where both habits were tracked", sharedDays: "shared days",
      notEnoughVariation: "not enough variation", strong: "strong", moderate: "moderate", weak: "weak", little: "little", relation: "relation", inverse: "inverse relation", positive: "positive relation",
      overlayCaption: "Overlay uses % of target so habits with different units share one scale.", overlayAria: "Overlay comparison of selected habits", noTrackedData: "No tracked data yet",
      scatterCaption: "Scatter uses actual values from days where both habits were tracked.", noSharedDays: "No shared tracked days this month", eachDotCaption: "Each dot is one day · actual values · trend line shows direction, not causation.", scatterAria: "Scatter plot comparing {a} and {b}", value: "value",
      newHabit: "New habit", editHabit: "Edit habit", hintPercent: "Enter the percentage directly. You can record 0%, 124%, 500%, or any other non-negative value.", hintBooleanNegative: "Negative habit: Yes still means a successful day. Phrase the habit as the desired state — for example “Do not smoke” → Yes.", hintBoolean: "Yes means a successful day; No means not completed.", hintTargetNegative: "Negative habit: the lower the actual value, the better. Daily target = 100%; below target gives more than 100%, above target gives less than 100%.", hintTarget: "Enter the actual value and the percentage is calculated automatically. The higher relative to target, the better; there is no upper limit.",
      targetMustPositive: "Daily target must be greater than 0", habitUpdated: "Habit updated", habitCreated: "Habit created", deleteConfirm: "Delete “{name}” and all its tracked days?", habitDeleted: "Habit deleted",
      percentage: "Percentage", actualResult: "Actual result", chooseYesNo: "Choose Yes or No", daySaved: "Day saved", dayCleared: "Day cleared", backupExported: "Backup exported", importConfirm: "Import will replace current L manager data. Continue?", backupImported: "Backup imported", importFailed: "Could not import this file",
      language: "Language", chooseColor: "Choose color", quickColors: "Quick colors", sleep: "Sleep", sleepSettings: "Sleep settings", sleepSettingsHint: "Only the built-in Sleep habit uses these fields", sleepTargetDuration: "Target duration", targetBedtime: "Target bedtime", targetWakeTime: "Target wake-up", bedtime: "Bedtime", wakeUp: "Wake up", sleepDuration: "Sleep duration", sleepScore: "Sleep score", sleepInvalidTimes: "Choose both bedtime and wake-up", sleepMeta: "{hours} h target · {bedtime} → {wake}"
    },
    ru: {
      habitTracker: "трекер привычек", updateDay: "Обновить день", export: "Экспорт", import: "Импорт", addHabit: "+ Привычка", previousMonth: "Предыдущий месяц", nextMonth: "Следующий месяц", today: "сегодня",
      showPercentages: "Показать проценты", showPercentagesTitle: "Если выключено, значения остаются видны, но рассчитанные проценты скрываются",
      noHabitsYet: "Пока нет привычек", emptyDescription: "Добавь первую привычку. Задай числовую цель, а L manager сам посчитает результат — хоть 12%, хоть 124%, хоть 500%.", createFirstHabit: "Создать первую привычку",
      habitVisualization: "Визуализация привычек", visualization: "Визуализация", habitOverview: "Обзор привычки", habitHistory: "История привычек", habitHistoryDescription: "Одна строка на привычку · история по дням", habitHistoryMatrix: "Матрица истории привычек",
      habit: "Привычка", dailyProgress: "Прогресс по дням", relations: "Связи", relationsDescription: "Накладывай несколько привычек или сравнивай две по одним и тем же дням", overlayHabits: "Привычки на графике", selectManyHabits: "Выбери любое количество привычек",
      relationVisualizationMode: "Режим визуализации связей", overlay: "Наложение", scatter: "Рассеяние", habitsThisMonth: "Привычки за месяц", averageTrackedDays: "Средний результат по заполненным дням",
      close: "Закрыть", name: "Название", habitNamePlaceholder: "Например: Читать", tracking: "Отслеживание", targetValue: "Целевое значение", manualPercent: "Процент вручную", yesNo: "Да / Нет", dailyTarget: "Дневная цель", unit: "Единица", unitPlaceholder: "мин, страниц, км…", color: "Цвет",
      negativeHabit: "Негативная привычка", negativeHabitDescription: "Для чисел: чем меньше, тем лучше. В Да / Нет всё равно стремимся к Да.", delete: "Удалить", cancel: "Отмена", saveHabit: "Сохранить привычку",
      yes: "Да", no: "Нет", result: "Результат", note: "Заметка", optional: "необязательно", notePlaceholder: "Контекст дня, если нужен…", clearDay: "Очистить день", saveDay: "Сохранить день",
      habits: "привычки", tracked: "заполнено", avg: "среднее", success: "успех", bestStreak: "лучшая серия", day: "день", days: "дней", target: "Цель", perDay: "/ день", lowerIsBetter: "Чем меньше, тем лучше", positiveHabit: "Позитивная привычка", yesSuccess: "Да = успех", manualPercentageNoLimit: "Процент вручную · без верхнего лимита",
      showVisualization: "Показать визуализацию", editHabitAria: "Редактировать {name}", hasNote: "Есть заметка", manual: "вручную", future: "будущее", noData: "нет данных",
      currentMonthTarget: "{month} · линия цели на 100%", noTrackedDays: "Пока нет заполненных дней", dailyPercentageTrend: "Дневной процент для {name}",
      selectAtLeastOne: "Выбери хотя бы одну привычку для наложения.", noHabitsSelected: "Привычки не выбраны", habitSelected: "привычка выбрана", habitsSelected: "привычек выбрано", trackedDayThisMonth: "заполненный день в этом месяце", trackedDaysThisMonth: "заполненных дней в этом месяце",
      addSecondHabit: "Добавь вторую привычку, чтобы сравнивать связи.", twoHabitsNeeded: "Нужны две привычки", pearsonTitle: "Корреляция Пирсона по дням, где заполнены обе привычки", sharedDays: "общих дней",
      notEnoughVariation: "недостаточно вариации", strong: "сильная", moderate: "средняя", weak: "слабая", little: "почти отсутствующая", relation: "связь", inverse: "обратная связь", positive: "положительная связь",
      overlayCaption: "Наложение использует % от цели, поэтому привычки с разными единицами можно показать на одной шкале.", overlayAria: "Наложение выбранных привычек", noTrackedData: "Пока нет заполненных данных",
      scatterCaption: "Рассеяние использует фактические значения только по дням, где заполнены обе привычки.", noSharedDays: "В этом месяце нет общих заполненных дней", eachDotCaption: "Каждая точка — один день · фактические значения · линия тренда показывает направление, а не причинность.", scatterAria: "Диаграмма рассеяния: {a} и {b}", value: "значение",
      newHabit: "Новая привычка", editHabit: "Редактировать привычку", hintPercent: "Вводишь процент напрямую. Можно записать 0%, 124%, 500% или любое другое неотрицательное значение.", hintBooleanNegative: "Негативная привычка: Да всё равно означает успешный день. Формулируй привычку как желаемое состояние — например «Не курить» → Да.", hintBoolean: "Да означает успешный день, Нет — невыполнение.", hintTargetNegative: "Негативная привычка: чем фактическое значение меньше, тем лучше. Дневная цель = 100%; ниже цели даёт больше 100%, выше цели — меньше 100%.", hintTarget: "Вводишь фактическое значение — процент считается автоматически. Чем больше относительно цели, тем лучше; верхнего лимита нет.",
      targetMustPositive: "Дневная цель должна быть больше 0", habitUpdated: "Привычка обновлена", habitCreated: "Привычка создана", deleteConfirm: "Удалить «{name}» и все заполненные дни?", habitDeleted: "Привычка удалена",
      percentage: "Процент", actualResult: "Фактический результат", chooseYesNo: "Выбери Да или Нет", daySaved: "День сохранён", dayCleared: "День очищен", backupExported: "Резервная копия экспортирована", importConfirm: "Импорт заменит текущие данные L manager. Продолжить?", backupImported: "Резервная копия импортирована", importFailed: "Не удалось импортировать файл",
      language: "Язык", chooseColor: "Выбрать цвет", quickColors: "Быстрые цвета", sleep: "Сон", sleepSettings: "Настройки сна", sleepSettingsHint: "Эти поля используются только для встроенной привычки сна", sleepTargetDuration: "Целевая длительность", targetBedtime: "Цель отхода ко сну", targetWakeTime: "Цель подъёма", bedtime: "Лёг спать", wakeUp: "Проснулся", sleepDuration: "Длительность сна", sleepScore: "Оценка сна", sleepInvalidTimes: "Укажи время сна и пробуждения", sleepMeta: "цель {hours} ч · {bedtime} → {wake}"
    }
  };

  function getLanguage() {
    return state?.settings?.language === "en" ? "en" : "ru";
  }

  function t(key, vars = {}) {
    const language = getLanguage();
    let text = I18N[language]?.[key] ?? I18N.en[key] ?? key;
    Object.entries(vars).forEach(([name, value]) => { text = text.replaceAll(`{${name}}`, String(value)); });
    return text;
  }

  function localeCode() { return getLanguage() === "ru" ? "ru-RU" : "en-US"; }
  function formatMonth(date) { return new Intl.DateTimeFormat(localeCode(), { month: "long", year: "numeric" }).format(date); }
  function formatDate(date) { return new Intl.DateTimeFormat(localeCode(), { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(date); }
  function formatShortMonth(date) { return date.toLocaleDateString(localeCode(), { month: "short" }); }
  function formatShortDate(date) { return date.toLocaleDateString(localeCode(), { month: "short", day: "numeric" }); }
  function weekdays() { return getLanguage() === "ru" ? ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"] : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]; }
  function dayWord(count) {
    if (getLanguage() !== "ru") return count === 1 ? t("day") : t("days");
    const mod10 = Math.abs(count) % 10;
    const mod100 = Math.abs(count) % 100;
    if (mod10 === 1 && mod100 !== 11) return "день";
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "дня";
    return "дней";
  }
  function selectedHabitsPhrase(count) {
    if (getLanguage() !== "ru") return count === 1 ? t("habitSelected") : t("habitsSelected");
    const mod10 = Math.abs(count) % 10;
    const mod100 = Math.abs(count) % 100;
    if (mod10 === 1 && mod100 !== 11) return "привычка выбрана";
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "привычки выбраны";
    return "привычек выбрано";
  }

  function trackedDaysPhrase(count) {
    if (getLanguage() !== "ru") return count === 1 ? t("trackedDayThisMonth") : t("trackedDaysThisMonth");
    const mod10 = Math.abs(count) % 10;
    const mod100 = Math.abs(count) % 100;
    if (mod10 === 1 && mod100 !== 11) return "заполненный день в этом месяце";
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "заполненных дня в этом месяце";
    return "заполненных дней в этом месяце";
  }

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
    showPercentagesToggle: document.querySelector("#showPercentagesToggle"),
    langRuBtn: document.querySelector("#langRuBtn"),
    langEnBtn: document.querySelector("#langEnBtn"),
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
    trackingTypeField: document.querySelector("#trackingTypeField"),
    habitTarget: document.querySelector("#habitTarget"),
    habitNegative: document.querySelector("#habitNegative"),
    negativeHabitField: document.querySelector("#negativeHabitField"),
    habitUnit: document.querySelector("#habitUnit"),
    habitColor: document.querySelector("#habitColor"),
    habitColorText: document.querySelector("#habitColorText"),
    habitColorPreview: document.querySelector("#habitColorPreview"),
    habitColorPresets: document.querySelector("#habitColorPresets"),
    targetValueField: document.querySelector("#targetValueField"),
    unitField: document.querySelector("#unitField"),
    sleepSettingsField: document.querySelector("#sleepSettingsField"),
    sleepTargetHours: document.querySelector("#sleepTargetHours"),
    sleepTargetBedtime: document.querySelector("#sleepTargetBedtime"),
    sleepTargetWake: document.querySelector("#sleepTargetWake"),
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
    entryValueSliderWrap: document.querySelector("#entryValueSliderWrap"),
    entryValueSlider: document.querySelector("#entryValueSlider"),
    entrySliderMin: document.querySelector("#entrySliderMin"),
    entrySliderMax: document.querySelector("#entrySliderMax"),
    sleepEntry: document.querySelector("#sleepEntry"),
    entryBedtime: document.querySelector("#entryBedtime"),
    entryWakeTime: document.querySelector("#entryWakeTime"),
    booleanEntry: document.querySelector("#booleanEntry"),
    entryYesBtn: document.querySelector("#entryYesBtn"),
    entryNoBtn: document.querySelector("#entryNoBtn"),
    entryPercentPreview: document.querySelector("#entryPercentPreview"),
    entryNote: document.querySelector("#entryNote"),
    clearEntryBtn: document.querySelector("#clearEntryBtn"),
    toast: document.querySelector("#toast"),
  };

  function createDefaultSleepHabit(language = "ru") {
    return {
      id: createId("habit"),
      name: language === "en" ? "Sleep" : "Сон",
      trackingType: "sleep",
      target: 480,
      negativeHabit: false,
      unit: "h",
      color: "#4F8CFF",
      sleepTargetMinutes: 480,
      sleepTargetBedtime: "00:30",
      sleepTargetWake: "08:30",
      systemHabit: "sleep",
      createdAt: new Date().toISOString(),
    };
  }

  function defaultState() {
    return {
      version: APP_VERSION,
      habits: [createDefaultSleepHabit("ru")],
      entries: {},
      settings: { showPercentages: true, language: "ru", sleepFeatureInitialized: true },
    };
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      const parsed = JSON.parse(raw);
      if (!parsed || !Array.isArray(parsed.habits) || typeof parsed.entries !== "object") return defaultState();

      // Before the first Sleep migration, preserve the exact pre-migration payload.
      // This backup is never used during normal rendering and is not overwritten.
      if (parsed.version !== APP_VERSION && !localStorage.getItem(MIGRATION_BACKUP_KEY)) {
        localStorage.setItem(MIGRATION_BACKUP_KEY, raw);
      }

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

      const language = parsed.settings?.language === "en" ? "en" : "ru";
      const sleepFeatureInitialized = parsed.settings?.sleepFeatureInitialized === true;
      if (!sleepFeatureInitialized && !habits.some((habit) => habit.trackingType === "sleep")) {
        habits.unshift(createDefaultSleepHabit(language));
        migrated = true;
      }

      const normalizedState = {
        version: APP_VERSION,
        habits,
        entries,
        settings: {
          ...(parsed.settings || {}),
          showPercentages: parsed.settings?.showPercentages !== false,
          language,
          sleepFeatureInitialized: true,
        },
      };
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

  function applyStaticTranslations() {
    document.documentElement.lang = getLanguage();
    document.querySelectorAll("[data-i18n]").forEach((element) => {
      element.textContent = t(element.dataset.i18n);
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
      element.placeholder = t(element.dataset.i18nPlaceholder);
    });
    document.querySelectorAll("[data-i18n-title]").forEach((element) => {
      element.title = t(element.dataset.i18nTitle);
    });
    document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
      element.setAttribute("aria-label", t(element.dataset.i18nAriaLabel));
    });
    els.langRuBtn.classList.toggle("selected", getLanguage() === "ru");
    els.langEnBtn.classList.toggle("selected", getLanguage() === "en");
    document.querySelector(".language-switch")?.setAttribute("aria-label", t("language"));
  }

  function bindEvents() {
    els.prevMonthBtn.addEventListener("click", () => changeMonth(-1));
    els.nextMonthBtn.addEventListener("click", () => changeMonth(1));
    els.monthButton.addEventListener("click", () => {
      viewDate = startOfMonth(new Date());
      render();
    });
    els.showPercentagesToggle.addEventListener("change", () => {
      state.settings = state.settings || {};
      state.settings.showPercentages = els.showPercentagesToggle.checked;
      saveState();
      render();
      updateEntryPreview();
    });
    [els.langRuBtn, els.langEnBtn].forEach((button) => {
      button.addEventListener("click", () => {
        state.settings = state.settings || {};
        state.settings.language = button.dataset.lang === "en" ? "en" : "ru";
        saveState();
        render();
      });
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
      applyHabitColor(els.habitColor.value, { updateText: true });
    });
    els.habitColorText.addEventListener("input", () => {
      const color = normalizeHex(els.habitColorText.value);
      els.habitColorText.closest(".color-hex-field")?.classList.toggle("invalid", Boolean(els.habitColorText.value.trim()) && !color);
      if (color) applyHabitColor(color, { updateText: false });
    });
    els.habitColorText.addEventListener("blur", () => {
      const color = normalizeHex(els.habitColorText.value);
      if (color) applyHabitColor(color, { updateText: true });
      else applyHabitColor(els.habitColor.value, { updateText: true });
    });
    els.habitColorPresets.addEventListener("click", (event) => {
      const button = event.target.closest("[data-color]");
      if (!button) return;
      applyHabitColor(button.dataset.color, { updateText: true });
    });

    els.habitForm.addEventListener("submit", saveHabitFromForm);
    els.deleteHabitBtn.addEventListener("click", deleteCurrentHabit);

    els.entryValue.addEventListener("input", () => {
      syncEntrySliderFromValue();
      updateEntryPreview();
    });
    els.entryValueSlider.addEventListener("input", () => {
      els.entryValue.value = String(Math.round(Number(els.entryValueSlider.value) || 0));
      updateEntrySliderFill();
      updateEntryPreview();
    });
    els.entryBedtime.addEventListener("input", updateEntryPreview);
    els.entryWakeTime.addEventListener("input", updateEntryPreview);
    [els.entryYesBtn, els.entryNoBtn].forEach((button) => {
      button.addEventListener("click", () => setBooleanEntry(Number(button.dataset.booleanValue)));
    });
    els.entryForm.addEventListener("submit", saveEntryFromForm);
    els.clearEntryBtn.addEventListener("click", clearCurrentEntry);

    els.exportBtn.addEventListener("click", exportData);
    els.importInput.addEventListener("change", importData);

    // Visualization is highly dynamic: its options, overlay list and comparison rows
    // are rebuilt during rendering. Delegate interaction handling to the stable panel
    // so controls keep working regardless of which descendants were re-rendered.
    els.insightsPanel.addEventListener("change", handleInsightsChange);
    els.insightsPanel.addEventListener("click", handleInsightsClick);
  }

  function handleInsightsChange(event) {
    const target = event.target;
    if (!(target instanceof Element)) return;

    if (target.matches("#visualHabitSelect")) {
      selectedHabitId = target.value;
      renderInsights();
      syncSelectedHabitCard();
      return;
    }

    if (target.matches("#relationHabitA")) {
      relationHabitAId = target.value;
      ensureRelationHabits();
      renderRelations();
      return;
    }

    if (target.matches("#relationHabitB")) {
      relationHabitBId = target.value;
      ensureRelationHabits();
      renderRelations();
      return;
    }

    const checkbox = target.closest("input[type=checkbox][data-overlay-habit]");
    if (checkbox) {
      const habitId = checkbox.dataset.overlayHabit;
      relationOverlayInitialized = true;
      if (checkbox.checked) {
        if (!relationOverlayHabitIds.includes(habitId)) relationOverlayHabitIds.push(habitId);
      } else {
        relationOverlayHabitIds = relationOverlayHabitIds.filter((id) => id !== habitId);
      }
      ensureRelationHabits();
      renderRelations();
    }
  }

  function handleInsightsClick(event) {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const modeButton = target.closest("[data-relation-mode]");
    if (modeButton) {
      relationMode = modeButton.dataset.relationMode === "scatter" ? "scatter" : "overlay";
      renderRelations();
      return;
    }

    const comparisonButton = target.closest("[data-comparison-habit]");
    if (comparisonButton) {
      selectedHabitId = comparisonButton.dataset.comparisonHabit;
      renderInsights();
      syncSelectedHabitCard();
    }
  }

  function render() {
    state.settings = state.settings || { showPercentages: true, language: "ru" };
    if (state.settings.language !== "en" && state.settings.language !== "ru") state.settings.language = "ru";
    applyStaticTranslations();
    els.showPercentagesToggle.checked = state.settings.showPercentages !== false;
    els.monthLabel.textContent = formatMonth(viewDate);
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
        <div class="summary-item"><span>${t("habits")}</span><strong>0</strong></div>
        <div class="summary-item"><span>${t("tracked")}</span><strong>0</strong></div>
        <div class="summary-item"><span>${t("avg")}</span><strong>—</strong></div>`;
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
    const meta = habit.trackingType === "sleep"
      ? t("sleepMeta", {
          hours: formatSleepHours((Number(habit.sleepTargetMinutes || habit.target || 480)) / 60),
          bedtime: habit.sleepTargetBedtime || "00:30",
          wake: habit.sleepTargetWake || "08:30",
        })
      : habit.trackingType === "percent"
        ? t("manualPercentageNoLimit")
        : habit.trackingType === "boolean"
          ? negativeHabit
            ? `<span class="negative-target-badge">${t("negativeHabit")}</span> · ${t("yesSuccess")}`
            : `<span class="positive-target-badge">${t("positiveHabit")}</span> · ${t("yesSuccess")}`
          : negativeHabit
            ? `<span class="negative-target-badge">${t("negativeHabit")}</span> · ${t("lowerIsBetter")} · ${t("target")}: ${formatNumber(habit.target)}${habit.unit ? ` ${escapeHtml(habit.unit)}` : ""} ${t("perDay")}`
            : `${t("target")}: ${formatNumber(habit.target)}${habit.unit ? ` ${escapeHtml(habit.unit)}` : ""} ${t("perDay")}`;

    const weekdayLabels = weekdays().map((day) => `<div class="weekday">${day}</div>`).join("");
    const cells = calendar.map((date) => renderDayCell(habit, date)).join("");

    return `
      <article class="habit-card" data-habit-card-id="${habit.id}" style="--habit-color: ${habit.color}">
        <header class="habit-header">
          <div class="habit-heading">
            <button class="habit-title-row habit-view-button" type="button" data-view-habit="${habit.id}" title="${escapeHtml(t("showVisualization"))}">
              <span class="habit-color-dot"></span>
              <h2 class="habit-title">${escapeHtml(habit.name)}</h2>
            </button>
            <p class="habit-meta">${meta}</p>
          </div>
          <div class="habit-actions">
            <div class="habit-kpis">
              <div class="habit-kpi"><span>${t("avg")}</span><strong>${stats.average == null ? "—" : `${formatPercent(stats.average)}%`}</strong></div>
              <div class="habit-kpi"><span>${habit.trackingType === "boolean" || habit.trackingType === "sleep" ? t("success") : "100%+"}</span><strong>${stats.hitTarget}</strong></div>
              <div class="habit-kpi"><span>${t("tracked")}</span><strong>${stats.tracked}</strong></div>
            </div>
            <button class="icon-button edit-habit" type="button" data-edit-habit="${habit.id}" aria-label="${escapeHtml(t("editHabitAria", { name: habit.name }))}">•••</button>
          </div>
        </header>
        <div class="calendar-wrap">
          <div class="calendar">
            ${weekdayLabels}
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
    let title = `${habit.name} · ${formatDate(date)}`;

    if (entry) {
      const percent = getEntryPercent(habit, entry);
      const bg = colorForPercent(habit.color, percent);
      const fg = textColorForPercent(habit.color, percent);
      style = `--entry-bg:${bg}; --entry-fg:${fg};`;
      const valueText = habit.trackingType === "sleep"
        ? formatSleepDuration(getSleepDurationMinutes(entry))
        : habit.trackingType === "percent"
          ? t("manual")
          : habit.trackingType === "boolean"
            ? (Number(entry.value) === 1 ? t("yes") : t("no"))
            : `${formatNumber(entry.value)}${habit.unit ? ` ${escapeHtml(habit.unit)}` : ""}`;
      const noteDot = entry.note ? `<span class="day-note-dot" title="${escapeHtml(t("hasNote"))}"></span>` : "";
      const showPercentages = state.settings?.showPercentages !== false;
      let detailContent = "";
      if (habit.trackingType === "boolean") {
        detailContent = `<strong class="day-percent">${Number(entry.value) === 1 ? t("yes").toUpperCase() : t("no").toUpperCase()}</strong>`;
      } else if (habit.trackingType === "percent") {
        detailContent = showPercentages ? `<strong class="day-percent">${formatPercent(percent)}%</strong>` : "";
      } else {
        detailContent = `<span class="day-value">${valueText}</span>${showPercentages ? `<strong class="day-percent">${formatPercent(percent)}%</strong>` : ""}`;
      }
      content = `
        <div class="day-top"><span class="day-number">${date.getDate()}</span>${noteDot}</div>
        ${detailContent}`;
      if (habit.trackingType === "sleep") {
        title += ` · ${entry.bedtime || "—"} → ${entry.wakeTime || "—"} · ${valueText} · ${formatPercent(percent)}%`;
      } else {
        title += habit.trackingType === "boolean"
          ? ` · ${Number(entry.value) === 1 ? t("yes") : t("no")}`
          : ` · ${formatPercent(percent)}%`;
      }
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
    const successLabel = habit.trackingType === "boolean" || habit.trackingType === "sleep" ? t("success") : "100%+";
    els.insightKpis.innerHTML = `
      <div class="insight-kpi"><span>${t("avg")}</span><strong>${stats.average == null ? "—" : `${formatPercent(stats.average)}%`}</strong></div>
      <div class="insight-kpi"><span>${successLabel}</span><strong>${stats.hitTarget}</strong></div>
      <div class="insight-kpi"><span>${t("bestStreak")}</span><strong>${bestStreak} ${dayWord(bestStreak)}</strong></div>`;

    els.allHabitsHeatmap.innerHTML = renderAllHabitsHeatmap(viewDate);
    els.trendCaption.textContent = t("currentMonthTarget", { month: formatMonth(viewDate) });
    els.habitTrendChart.innerHTML = renderTrendChart(habit, viewDate);
    renderRelations();
    els.habitComparison.innerHTML = renderHabitComparison(viewDate);
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
        ? `${formatShortMonth(day)} ${day.getDate()}`
        : String(day.getDate());
      const tooltip = formatDate(day);
      return `<span class="habit-matrix-date${day > today ? " is-future" : ""}" title="${escapeHtml(tooltip)}">${escapeHtml(label)}</span>`;
    }).join("");

    const firstVisible = visibleDays[0];
    const lastVisible = visibleDays[visibleDays.length - 1];
    const rangeLabel = `${formatShortDate(firstVisible)} – ${formatShortDate(lastVisible)}`;

    const rows = state.habits.map((habit) => {
      const cells = [];

      for (let index = 0; index < daysToShow; index += 1) {
        const day = new Date(start);
        day.setDate(start.getDate() + index);
        const dateKey = toDateKey(day);
        const entry = state.entries[entryKey(habit.id, dateKey)];

        if (!entry) {
          const future = day > today;
          const tooltip = `${habit.name} · ${formatDate(day)} · ${future ? t("future") : t("noData")}`;
          cells.push(`<span class="habit-matrix-cell is-empty${future ? " is-future" : ""}" title="${escapeHtml(tooltip)}" aria-label="${escapeHtml(tooltip)}"></span>`);
          continue;
        }

        const percent = getEntryPercent(habit, entry);
        const background = colorForPercent(habit.color, percent);
        let resultText;
        if (habit.trackingType === "sleep") {
          resultText = `${formatSleepDuration(getSleepDurationMinutes(entry))} · ${entry.bedtime || "—"} → ${entry.wakeTime || "—"} · ${formatPercent(percent)}%`;
        } else if (habit.trackingType === "boolean") {
          resultText = Number(entry.value) === 1 ? t("yes") : t("no");
        } else if (habit.trackingType === "percent") {
          resultText = `${formatPercent(percent)}%`;
        } else {
          resultText = `${formatNumber(entry.value)}${habit.unit ? ` ${habit.unit}` : ""} · ${formatPercent(percent)}%`;
        }
        const tooltip = `${habit.name} · ${formatDate(day)} · ${resultText}`;
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
      return `<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="3.25" fill="${habit.color}" stroke="#111319" stroke-width="1.6"><title>${t("day")} ${index + 1}: ${formatPercent(value)}%</title></circle>`;
    }).join("");

    const midDay = Math.ceil(days / 2);
    const xLabels = [1, midDay, days].map((day) => {
      const x = xFor(day - 1);
      return `<text x="${x.toFixed(2)}" y="${height - 6}" text-anchor="middle" class="chart-axis-label">${day}</text>`;
    }).join("");

    const empty = trackedValues.length === 0
      ? `<text x="${width / 2}" y="${height / 2}" text-anchor="middle" class="chart-empty-label">${t("noTrackedDays")}</text>`
      : "";

    return `
      <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeHtml(t("dailyPercentageTrend", { name: habit.name }))}">
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
        els.relationMeta.innerHTML = `<span class="relation-empty">${t("selectAtLeastOne")}</span>`;
        els.relationChart.innerHTML = `<div class="relation-empty-chart">${t("noHabitsSelected")}</div>`;
        return;
      }

      const trackedDays = getOverlayTrackedDayCount(selectedHabits, viewDate);
      els.relationMeta.innerHTML = `
        <div class="relation-legend">
          ${selectedHabits.map((habit) => `<span><i style="--relation-color:${habit.color}"></i>${escapeHtml(habit.name)}</span>`).join("")}
        </div>
        <div class="relation-correlation relation-overlay-summary">
          <span>${t("overlay")}</span><strong>${selectedHabits.length}</strong><em>${selectedHabitsPhrase(selectedHabits.length)}</em><small>${trackedDays} ${trackedDaysPhrase(trackedDays)}</small>
        </div>`;
      els.relationChart.innerHTML = renderRelationOverlayMulti(selectedHabits, viewDate);
      return;
    }

    if (state.habits.length < 2) {
      els.relationMeta.innerHTML = `<span class="relation-empty">${t("addSecondHabit")}</span>`;
      els.relationChart.innerHTML = `<div class="relation-empty-chart">${t("twoHabitsNeeded")}</div>`;
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
      <div class="relation-correlation" title="${escapeHtml(t("pearsonTitle"))}">
        <span>r</span><strong>${correlationText}</strong><em>${escapeHtml(relationLabel)}</em><small>${paired.length} ${t("sharedDays")}</small>
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
    if (habit.trackingType === "sleep") {
      const minutes = getSleepDurationMinutes(entry);
      return Number.isFinite(minutes) ? minutes / 60 : null;
    }
    return Number(entry.value);
  }

  function getRelationUnit(habit) {
    if (habit.trackingType === "sleep") return "h";
    if (habit.trackingType === "boolean") return t("yesNo");
    if (habit.trackingType === "percent") return "%";
    return habit.unit || t("value");
  }

  function describeCorrelation(value) {
    if (!Number.isFinite(value)) return t("notEnoughVariation");
    const magnitude = Math.abs(value);
    const strength = magnitude >= 0.75 ? t("strong") : magnitude >= 0.45 ? t("moderate") : magnitude >= 0.2 ? t("weak") : t("little");
    if (magnitude < 0.2) return `${strength} ${t("relation")}`;
    return `${strength} ${value < 0 ? t("inverse") : t("positive")}`;
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
        `<circle cx="${xFor(index).toFixed(2)}" cy="${yFor(value).toFixed(2)}" r="2.5" fill="${habit.color}" stroke="#111319" stroke-width="1.2"><title>${escapeHtml(habit.name)} · ${t("day")} ${index + 1}: ${formatPercent(value)}%</title></circle>`).join("");
      return lines + points;
    }).join("");

    const midDay = Math.ceil(days / 2);
    const xLabels = [1, midDay, days].map((day) => `<text x="${xFor(day - 1).toFixed(2)}" y="${height - 6}" text-anchor="middle" class="chart-axis-label">${day}</text>`).join("");
    const empty = finite.length === 0 ? `<text x="${width / 2}" y="${height / 2}" text-anchor="middle" class="chart-empty-label">${t("noTrackedData")}</text>` : "";

    return `<div class="relation-chart-caption">${t("overlayCaption")}</div>
      <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeHtml(t("overlayAria"))}">
        ${grids}${paths}${xLabels}${empty}
      </svg>`;
  }

  function renderRelationScatter(habitA, habitB, paired) {
    const width = 336;
    const height = 220;
    const pad = { left: 42, right: 18, top: 16, bottom: 36 };
    if (!paired.length) {
      return `<div class="relation-chart-caption">${t("scatterCaption")}</div><div class="relation-empty-chart">${t("noSharedDays")}</div>`;
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
      return `<circle cx="${xFor(item.rawA).toFixed(2)}" cy="${yFor(item.rawB).toFixed(2)}" r="4" fill="${habitB.color}" stroke="${habitA.color}" stroke-width="1.8" opacity=".92"><title>${t("day")} ${item.day} · ${escapeHtml(habitA.name)}: ${escapeHtml(labelA)} · ${escapeHtml(habitB.name)}: ${escapeHtml(labelB)}</title></circle>`;
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

    return `<div class="relation-chart-caption">${t("eachDotCaption")}</div>
      <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeHtml(t("scatterAria", { a: habitA.name, b: habitB.name }))}">
        ${grid}${regression}${dots}
        <text x="${pad.left + innerW / 2}" y="${height - 7}" text-anchor="middle" class="relation-axis-title">${escapeHtml(habitA.name)} · ${escapeHtml(getRelationUnit(habitA))}</text>
        <text x="11" y="${pad.top + innerH / 2}" text-anchor="middle" class="relation-axis-title" transform="rotate(-90 11 ${pad.top + innerH / 2})">${escapeHtml(habitB.name)} · ${escapeHtml(getRelationUnit(habitB))}</text>
      </svg>`;
  }

  function formatRelationRaw(habit, value) {
    if (habit.trackingType === "sleep") return `${formatNumber(value)} h`;
    if (habit.trackingType === "boolean") return value === 1 ? t("yes") : t("no");
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
          <span class="comparison-meta">${tracked} ${t("tracked")}</span>
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
      <div class="summary-item"><span>${t("habits")}</span><strong>${state.habits.length}</strong></div>
      <div class="summary-item"><span>${t("tracked")}</span><strong>${entries.length}</strong></div>
      <div class="summary-item"><span>100%+</span><strong>${targetHits}</strong></div>
      <div class="summary-item"><span>${t("avg")}</span><strong>${avg == null ? "—" : `${formatPercent(avg)}%`}</strong></div>`;
  }

  function changeMonth(offset) {
    viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1);
    render();
  }

  function openHabitModal(habitId = null) {
    const habit = state.habits.find((item) => item.id === habitId);
    els.habitForm.reset();
    els.habitId.value = habit?.id || "";
    els.habitModalTitle.textContent = habit ? t("editHabit") : t("newHabit");
    els.deleteHabitBtn.hidden = !habit;

    els.habitName.value = habit?.name || "";
    els.habitTrackingType.value = habit?.trackingType || "target";
    els.habitTarget.value = habit?.trackingType === "target" ? (habit.target ?? 1) : 1;
    els.habitNegative.checked = Boolean(habit?.negativeHabit);
    els.habitUnit.value = habit?.unit || "";
    els.sleepTargetHours.value = formatSleepHours((habit?.sleepTargetMinutes ?? habit?.target ?? 480) / 60);
    els.sleepTargetBedtime.value = habit?.sleepTargetBedtime || "00:30";
    els.sleepTargetWake.value = habit?.sleepTargetWake || "08:30";
    applyHabitColor(habit?.color || "#7C5CFC", { updateText: true });
    syncTrackingFields();
    openModal(els.habitModal);
    setTimeout(() => els.habitName.focus(), 30);
  }

  function applyHabitColor(value, { updateText = true } = {}) {
    const color = normalizeHex(value) || "#7C5CFC";
    els.habitColor.value = color;
    if (updateText) els.habitColorText.value = color;
    els.habitColorPreview?.style.setProperty("--preview-color", color);
    els.habitColorText.closest(".color-hex-field")?.classList.remove("invalid");
    els.habitColorPresets?.querySelectorAll("[data-color]").forEach((button) => {
      button.classList.toggle("selected", normalizeHex(button.dataset.color) === color);
    });
    return color;
  }

  function syncTrackingFields() {
    const type = els.habitTrackingType.value;
    const isTarget = type === "target";
    const isBoolean = type === "boolean";
    const isPercent = type === "percent";
    const isSleep = type === "sleep";
    const isNegative = els.habitNegative.checked;

    els.trackingTypeField.hidden = isSleep;
    els.trackingTypeField.style.display = isSleep ? "none" : "flex";

    els.targetValueField.hidden = !isTarget;
    els.targetValueField.style.display = isTarget ? "flex" : "none";
    els.unitField.hidden = !isTarget;
    els.unitField.style.display = isTarget ? "flex" : "none";
    els.habitTarget.required = isTarget;

    els.sleepSettingsField.hidden = !isSleep;
    els.sleepSettingsField.style.display = isSleep ? "grid" : "none";
    els.sleepTargetHours.required = isSleep;
    els.sleepTargetBedtime.required = isSleep;
    els.sleepTargetWake.required = isSleep;

    els.negativeHabitField.hidden = isPercent || isSleep;
    els.negativeHabitField.style.display = isPercent || isSleep ? "none" : "grid";
    if (isPercent || isSleep) els.habitNegative.checked = false;

    if (isSleep) {
      els.trackingHint.textContent = t("sleepSettingsHint");
    } else if (isPercent) {
      els.trackingHint.textContent = t("hintPercent");
    } else if (isBoolean) {
      els.trackingHint.textContent = isNegative ? t("hintBooleanNegative") : t("hintBoolean");
    } else if (isNegative) {
      els.trackingHint.textContent = t("hintTargetNegative");
    } else {
      els.trackingHint.textContent = t("hintTarget");
    }
  }

  function saveHabitFromForm(event) {
    event.preventDefault();
    const id = els.habitId.value || createId("habit");
    const trackingType = els.habitTrackingType.value;
    const target = Number(els.habitTarget.value);
    const sleepTargetHours = Number(els.sleepTargetHours.value);
    const color = normalizeHex(els.habitColorText.value) || els.habitColor.value;
    const previous = state.habits.find((item) => item.id === id);

    if (!els.habitName.value.trim()) return;
    if (trackingType === "target" && (!Number.isFinite(target) || target <= 0)) {
      showToast(t("targetMustPositive"));
      return;
    }
    if (trackingType === "sleep" && (!Number.isFinite(sleepTargetHours) || sleepTargetHours <= 0 || !els.sleepTargetBedtime.value || !els.sleepTargetWake.value)) {
      showToast(t("sleepInvalidTimes"));
      return;
    }

    const sleepTargetMinutes = trackingType === "sleep" ? Math.round(sleepTargetHours * 60) : undefined;
    const habit = {
      id,
      name: els.habitName.value.trim(),
      trackingType,
      target: trackingType === "target" ? target : trackingType === "boolean" ? 1 : trackingType === "sleep" ? sleepTargetMinutes : 100,
      negativeHabit: trackingType === "percent" || trackingType === "sleep" ? false : els.habitNegative.checked,
      unit: trackingType === "target" ? els.habitUnit.value.trim() : trackingType === "percent" ? "%" : trackingType === "sleep" ? "h" : "",
      color,
      createdAt: previous?.createdAt || new Date().toISOString(),
      ...(trackingType === "sleep" ? {
        systemHabit: previous?.systemHabit || "sleep",
        sleepTargetMinutes,
        sleepTargetBedtime: els.sleepTargetBedtime.value,
        sleepTargetWake: els.sleepTargetWake.value,
      } : {}),
    };

    const index = state.habits.findIndex((item) => item.id === id);
    if (index >= 0) state.habits[index] = habit;
    else state.habits.push(habit);

    saveState();
    closeModal(els.habitModal);
    render();
    showToast(index >= 0 ? t("habitUpdated") : t("habitCreated"));
  }

  function deleteCurrentHabit() {
    const id = els.habitId.value;
    const habit = state.habits.find((item) => item.id === id);
    if (!habit) return;
    if (!window.confirm(t("deleteConfirm", { name: habit.name }))) return;

    state.habits = state.habits.filter((item) => item.id !== id);
    for (const key of Object.keys(state.entries)) {
      if (key.startsWith(`${id}::`)) delete state.entries[key];
    }
    saveState();
    closeModal(els.habitModal);
    render();
    showToast(t("habitDeleted"));
  }

  function openEntryModal(habitId, dateKey) {
    const habit = state.habits.find((item) => item.id === habitId);
    if (!habit) return;

    const entry = state.entries[entryKey(habitId, dateKey)];
    const date = fromDateKey(dateKey);
    els.entryHabitId.value = habitId;
    els.entryDate.value = dateKey;
    els.entryDateLabel.textContent = formatDate(date);
    els.entryModalTitle.textContent = habit.name;
    els.entryValue.value = habit.trackingType === "boolean" || habit.trackingType === "sleep" ? "" : (entry?.value ?? "");
    els.entryBedtime.value = entry?.bedtime || "";
    els.entryWakeTime.value = entry?.wakeTime || "";
    els.entryNote.value = entry?.note || "";
    els.clearEntryBtn.hidden = !entry;
    syncEntryTrackingFields(habit);
    configureEntrySlider(habit, entry?.value);
    els.booleanEntry.dataset.value = habit.trackingType === "boolean" && entry ? String(Number(entry.value) === 1 ? 1 : 0) : "";
    syncBooleanButtons();

    if (habit.trackingType === "percent") {
      els.entryValueLabel.textContent = t("percentage");
      els.entryUnitBadge.textContent = "%";
      els.entryValue.placeholder = "100";
    } else if (habit.trackingType === "target") {
      els.entryValueLabel.textContent = t("actualResult");
      els.entryUnitBadge.textContent = habit.unit || "";
      els.entryValue.placeholder = String(habit.target);
    }

    updateEntryPreview();
    openModal(els.entryModal);
    setTimeout(() => {
      if (habit.trackingType === "sleep") els.entryBedtime.focus();
      else if (habit.trackingType !== "boolean") els.entryValue.focus();
    }, 30);
  }

  function syncEntryTrackingFields(habit) {
    const isBoolean = habit.trackingType === "boolean";
    const isSleep = habit.trackingType === "sleep";

    els.entryValueField.hidden = isBoolean || isSleep;
    els.entryValueField.style.display = isBoolean || isSleep ? "none" : "flex";
    els.entryValueSliderWrap.hidden = isBoolean || isSleep;
    els.entryValue.required = !isBoolean && !isSleep;

    els.booleanEntry.hidden = !isBoolean;
    els.booleanEntry.style.display = isBoolean ? "grid" : "none";

    els.sleepEntry.hidden = !isSleep;
    els.sleepEntry.style.display = isSleep ? "grid" : "none";
    els.entryBedtime.required = isSleep;
    els.entryWakeTime.required = isSleep;
  }

  function configureEntrySlider(habit, currentValue = null) {
    if (!habit || habit.trackingType === "boolean" || habit.trackingType === "sleep") return;

    const current = Number(currentValue);
    const finiteCurrent = Number.isFinite(current) && current >= 0 ? current : 0;
    let max;

    if (habit.trackingType === "percent") {
      max = Math.max(500, niceSliderMax(finiteCurrent));
    } else {
      const target = Math.max(0, Number(habit.target) || 0);
      const multiplier = habit.negativeHabit ? 6 : 2;
      max = niceSliderMax(Math.max(10, target * multiplier, finiteCurrent));
    }

    els.entryValueSlider.min = "0";
    els.entryValueSlider.max = String(max);
    els.entryValueSlider.step = "1";
    els.entrySliderMin.textContent = "0";
    els.entrySliderMax.textContent = formatNumber(max);
    syncEntrySliderFromValue();
  }

  function niceSliderMax(value) {
    const safe = Math.max(1, Number(value) || 1);
    const power = 10 ** Math.floor(Math.log10(safe));
    const normalized = safe / power;
    const nice = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
    return Math.ceil(nice * power);
  }

  function syncEntrySliderFromValue() {
    const habit = state.habits.find((item) => item.id === els.entryHabitId.value);
    if (!habit || habit.trackingType === "boolean" || habit.trackingType === "sleep") return;

    const raw = Number(els.entryValue.value);
    if (!Number.isFinite(raw) || raw < 0) {
      els.entryValueSlider.value = "0";
      updateEntrySliderFill();
      return;
    }

    let max = Number(els.entryValueSlider.max) || 100;
    if (raw > max) {
      max = niceSliderMax(raw);
      els.entryValueSlider.max = String(max);
      els.entrySliderMax.textContent = formatNumber(max);
    }

    els.entryValueSlider.value = String(Math.round(raw));
    updateEntrySliderFill();
  }

  function updateEntrySliderFill() {
    const min = Number(els.entryValueSlider.min) || 0;
    const max = Number(els.entryValueSlider.max) || 100;
    const value = Number(els.entryValueSlider.value) || 0;
    const progress = max > min ? ((value - min) / (max - min)) * 100 : 0;
    els.entryValueSlider.style.setProperty("--slider-progress", `${clamp(progress, 0, 100)}%`);
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

    const showPercentages = state.settings?.showPercentages !== false;

    if (habit.trackingType === "sleep") {
      const bedtime = els.entryBedtime.value;
      const wakeTime = els.entryWakeTime.value;
      const duration = getSleepDurationMinutes({ bedtime, wakeTime });
      if (!Number.isFinite(duration)) {
        els.entryPercentPreview.textContent = "—";
        return;
      }
      const score = getSleepScore(habit, { bedtime, wakeTime, value: duration });
      els.entryPercentPreview.textContent = showPercentages
        ? `${formatSleepDuration(duration)} · ${formatPercent(score)}%`
        : formatSleepDuration(duration);
      return;
    }

    if (habit.trackingType === "boolean") {
      const selected = els.booleanEntry.dataset.value;
      if (selected !== "1" && selected !== "0") {
        els.entryPercentPreview.textContent = "—";
        return;
      }
      const value = Number(selected);
      const label = value === 1 ? t("yes") : t("no");
      els.entryPercentPreview.textContent = showPercentages
        ? `${label} · ${value === 1 ? "100%" : "0%"}`
        : label;
      return;
    }

    const value = Number(els.entryValue.value);
    if (els.entryValue.value === "" || !Number.isFinite(value) || value < 0) {
      els.entryPercentPreview.textContent = "—";
      return;
    }

    if (!showPercentages) {
      if (habit.trackingType === "percent") {
        els.entryPercentPreview.textContent = "—";
      } else {
        els.entryPercentPreview.textContent = `${formatNumber(value)}${habit.unit ? ` ${habit.unit}` : ""}`;
      }
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

    let entry;
    if (habit.trackingType === "sleep") {
      const bedtime = els.entryBedtime.value;
      const wakeTime = els.entryWakeTime.value;
      const duration = getSleepDurationMinutes({ bedtime, wakeTime });
      if (!Number.isFinite(duration)) {
        showToast(t("sleepInvalidTimes"));
        return;
      }
      entry = {
        value: duration,
        bedtime,
        wakeTime,
        note: els.entryNote.value.trim(),
        updatedAt: new Date().toISOString(),
      };
    } else if (habit.trackingType === "boolean") {
      if (els.booleanEntry.dataset.value !== "1" && els.booleanEntry.dataset.value !== "0") {
        showToast(t("chooseYesNo"));
        return;
      }
      entry = {
        value: Number(els.booleanEntry.dataset.value),
        note: els.entryNote.value.trim(),
        updatedAt: new Date().toISOString(),
      };
    } else {
      const value = Number(els.entryValue.value);
      if (!Number.isFinite(value) || value < 0) return;
      entry = {
        value,
        note: els.entryNote.value.trim(),
        updatedAt: new Date().toISOString(),
      };
    }

    state.entries[entryKey(habitId, dateKey)] = entry;
    saveState();
    closeModal(els.entryModal);
    render();
    showToast(t("daySaved"));
  }

  function clearCurrentEntry() {
    const key = entryKey(els.entryHabitId.value, els.entryDate.value);
    if (!state.entries[key]) return;
    delete state.entries[key];
    saveState();
    closeModal(els.entryModal);
    render();
    showToast(t("dayCleared"));
  }

  function parseTimeToMinutes(value) {
    if (!/^\d{2}:\d{2}$/.test(value || "")) return null;
    const [hours, minutes] = value.split(":").map(Number);
    if (!Number.isInteger(hours) || !Number.isInteger(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;
    return hours * 60 + minutes;
  }

  function getSleepDurationMinutes(entry) {
    if (!entry) return null;
    const bedtime = parseTimeToMinutes(entry.bedtime);
    const wakeTime = parseTimeToMinutes(entry.wakeTime);
    if (bedtime == null || wakeTime == null) {
      const legacy = Number(entry.value);
      return Number.isFinite(legacy) && legacy > 0 ? legacy : null;
    }
    let duration = wakeTime - bedtime;
    if (duration === 0) return null;
    if (duration < 0) duration += 24 * 60;
    return duration;
  }

  function circularTimeDifferenceMinutes(actual, target) {
    const actualMinutes = parseTimeToMinutes(actual);
    const targetMinutes = parseTimeToMinutes(target);
    if (actualMinutes == null || targetMinutes == null) return 0;
    let delta = Math.abs(actualMinutes - targetMinutes);
    return Math.min(delta, 24 * 60 - delta);
  }

  function getSleepScore(habit, entry) {
    const duration = getSleepDurationMinutes(entry);
    if (!Number.isFinite(duration)) return 0;
    const targetDuration = Number(habit.sleepTargetMinutes || habit.target || 480);
    const durationScore = targetDuration > 0 ? Math.min(100, (duration / targetDuration) * 100) : 0;
    const bedtimeDeviation = circularTimeDifferenceMinutes(entry.bedtime, habit.sleepTargetBedtime || "00:30");
    const wakeDeviation = circularTimeDifferenceMinutes(entry.wakeTime, habit.sleepTargetWake || "08:30");
    const bedtimeScore = Math.max(0, 100 - bedtimeDeviation / 3);
    const wakeScore = Math.max(0, 100 - wakeDeviation / 3);
    return durationScore * 0.6 + bedtimeScore * 0.2 + wakeScore * 0.2;
  }

  function formatSleepDuration(minutes) {
    if (!Number.isFinite(minutes)) return "—";
    const rounded = Math.max(0, Math.round(minutes));
    const hours = Math.floor(rounded / 60);
    const mins = rounded % 60;
    if (getLanguage() === "ru") return mins ? `${hours}ч ${mins}м` : `${hours}ч`;
    return mins ? `${hours}h ${mins}m` : `${hours}h`;
  }

  function formatSleepHours(hours) {
    if (!Number.isFinite(hours)) return "8";
    return Number(hours.toFixed(2)).toString();
  }

  function getEntryPercent(habit, entry) {
    if (!entry) return null;
    if (habit.trackingType === "sleep") return getSleepScore(habit, entry);
    const value = Number(entry.value) || 0;
    if (habit.trackingType === "percent") return value;
    if (habit.trackingType === "boolean") return value === 1 ? 100 : 0;

    const target = Number(habit.target);
    if (!Number.isFinite(target) || target < 0) return 0;

    if (target === 0) return value === 0 ? 100 : 0;

    if (habit.negativeHabit) {
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

  function getPercentShade(hex, percent) {
    const base = hexToRgb(hex) || { r: 124, g: 92, b: 252 };
    const value = Number.isFinite(Number(percent)) ? Number(percent) : 0;

    // Positive scale: pale tint at 0%, exact chosen HEX at 100%, then gently darker.
    // Negative scale is deliberately separate: the farther below 0, the more the
    // cell shifts toward a muted dark failure tone. This keeps 0%, -100%, -300%
    // and -500% clearly distinguishable instead of collapsing into the same white.
    let r;
    let g;
    let b;

    if (value < 0) {
      const zeroWhiteMix = 0.80;
      const zeroShade = {
        r: base.r * (1 - zeroWhiteMix) + 255 * zeroWhiteMix,
        g: base.g * (1 - zeroWhiteMix) + 255 * zeroWhiteMix,
        b: base.b * (1 - zeroWhiteMix) + 255 * zeroWhiteMix,
      };

      // Keep a little of the habit hue in the failure anchor so different habits
      // remain identifiable, while desaturating enough to read as a bad state.
      const failureNeutral = { r: 72, g: 76, b: 90 };
      const baseWeight = 0.15;
      const failureAnchor = {
        r: base.r * baseWeight + failureNeutral.r * (1 - baseWeight),
        g: base.g * baseWeight + failureNeutral.g * (1 - baseWeight),
        b: base.b * baseWeight + failureNeutral.b * (1 - baseWeight),
      };

      const negativeIntensity = 1 - Math.exp(-Math.abs(value) / 170);
      r = Math.round(zeroShade.r + (failureAnchor.r - zeroShade.r) * negativeIntensity);
      g = Math.round(zeroShade.g + (failureAnchor.g - zeroShade.g) * negativeIntensity);
      b = Math.round(zeroShade.b + (failureAnchor.b - zeroShade.b) * negativeIntensity);
    } else {
      let mixWithWhite = 0;
      let mixWithBlack = 0;

      if (value < 100) {
        const progress = value / 100;
        mixWithWhite = 0.80 * (1 - progress);
      } else if (value > 100) {
        const overIntensity = 1 - Math.exp(-(value - 100) / 110);
        mixWithBlack = 0.22 * overIntensity;
      }

      r = Math.round((base.r * (1 - mixWithWhite) + 255 * mixWithWhite) * (1 - mixWithBlack));
      g = Math.round((base.g * (1 - mixWithWhite) + 255 * mixWithWhite) * (1 - mixWithBlack));
      b = Math.round((base.b * (1 - mixWithWhite) + 255 * mixWithWhite) * (1 - mixWithBlack));
    }

    // Perceived luminance is used only to choose readable text colour.
    const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    return { r, g, b, luminance };
  }

  function colorForPercent(hex, percent) {
    const shade = getPercentShade(hex, percent);
    return `rgb(${shade.r}, ${shade.g}, ${shade.b})`;
  }

  function textColorForPercent(hex, percent) {
    const shade = getPercentShade(hex, percent);
    return shade.luminance >= 0.62 ? "rgba(17, 19, 25, 0.86)" : "rgba(255, 255, 255, 0.92)";
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
    showToast(t("backupExported"));
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
      if (!window.confirm(t("importConfirm"))) return;

      const importedLanguage = incoming.settings?.language === "en"
        ? "en"
        : incoming.settings?.language === "ru"
          ? "ru"
          : getLanguage();
      state.habits = incoming.habits;
      if (incoming.settings?.sleepFeatureInitialized !== true && !state.habits.some((habit) => habit.trackingType === "sleep")) {
        state.habits.unshift(createDefaultSleepHabit(importedLanguage));
      }
      state.entries = incoming.entries || {};
      state.settings = {
        ...(incoming.settings || {}),
        showPercentages: incoming.settings?.showPercentages !== false,
        language: importedLanguage,
        sleepFeatureInitialized: true,
      };
      relationOverlayHabitIds = [];
      relationOverlayInitialized = false;
      state.version = APP_VERSION;
      saveState();
      render();
      showToast(t("backupImported"));
    } catch (error) {
      console.error(error);
      showToast(t("importFailed"));
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
    return new Intl.NumberFormat(localeCode(), { maximumFractionDigits: 2 }).format(value);
  }

  function formatPercent(value) {
    if (!Number.isFinite(value)) return "0";
    const isInteger = Math.abs(value - Math.round(value)) < 0.000001;
    return new Intl.NumberFormat(localeCode(), {
      minimumFractionDigits: 0,
      maximumFractionDigits: isInteger ? 0 : 1,
    }).format(value);
  }

  function createId(prefix) {
    if (window.crypto?.randomUUID) return `${prefix}-${crypto.randomUUID()}`;
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function normalizeHex(value) {
    let text = String(value || "").trim().replace(/^#/, "");
    if (/^[0-9a-fA-F]{3}$/.test(text)) {
      text = text.split("").map((char) => char + char).join("");
    }
    if (/^[0-9a-fA-F]{6}$/.test(text)) return `#${text.toUpperCase()}`;
    return null;
  }

  function rgbToHsl(r, g, b) {
    const rn = r / 255;
    const gn = g / 255;
    const bn = b / 255;
    const max = Math.max(rn, gn, bn);
    const min = Math.min(rn, gn, bn);
    const delta = max - min;
    let h = 0;
    const l = (max + min) / 2;
    const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

    if (delta !== 0) {
      if (max === rn) h = ((gn - bn) / delta) % 6;
      else if (max === gn) h = (bn - rn) / delta + 2;
      else h = (rn - gn) / delta + 4;
      h /= 6;
      if (h < 0) h += 1;
    }
    return { h, s, l };
  }

  function hslToRgb(h, s, l) {
    const hueToRgb = (p, q, t) => {
      let value = t;
      if (value < 0) value += 1;
      if (value > 1) value -= 1;
      if (value < 1 / 6) return p + (q - p) * 6 * value;
      if (value < 1 / 2) return q;
      if (value < 2 / 3) return p + (q - p) * (2 / 3 - value) * 6;
      return p;
    };

    if (s === 0) {
      const gray = Math.round(l * 255);
      return { r: gray, g: gray, b: gray };
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    return {
      r: Math.round(hueToRgb(p, q, h + 1 / 3) * 255),
      g: Math.round(hueToRgb(p, q, h) * 255),
      b: Math.round(hueToRgb(p, q, h - 1 / 3) * 255),
    };
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

  // Start only after every helper in this script has been initialized.
  // This prevents the first render after a hard refresh from running against
  // a partially initialized module; month navigation was masking this by
  // triggering a later render.
  bindEvents();
  requestAnimationFrame(() => {
    viewDate = startOfMonth(new Date());
    ensureSelectedHabit();
    render();
  });
})();
