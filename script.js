const STORAGE_KEY = 'course-schedule';
const MAX_DEFAULT_PERIODS = 12;
const DAYS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

const state = {
  courses: [],
  currentWeek: 1,
  maxPeriods: MAX_DEFAULT_PERIODS,
};

const weekSelector = document.getElementById('week-selector');
const weekDisplay = document.getElementById('week-display');
const scheduleGrid = document.getElementById('schedule-grid');
const fileInput = document.getElementById('file-input');
const rawInput = document.getElementById('raw-input');
const importButton = document.getElementById('import-button');
const courseForm = document.getElementById('course-form');
const clearButton = document.getElementById('clear-storage');

const randomPalette = [
  ['#2563eb', '#dbeafe'],
  ['#16a34a', '#dcfce7'],
  ['#db2777', '#fce7f3'],
  ['#0891b2', '#cffafe'],
  ['#f97316', '#ffedd5'],
  ['#7c3aed', '#ede9fe'],
  ['#ca8a04', '#fef9c3'],
];

function loadFromStorage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed.courses)) {
        state.courses = parsed.courses;
        state.currentWeek = parsed.currentWeek || 1;
        state.maxPeriods = parsed.maxPeriods || MAX_DEFAULT_PERIODS;
        weekSelector.value = String(state.currentWeek);
        updateWeekDisplay();
      }
    }
  } catch (error) {
    console.error('读取本地数据失败', error);
  }
}

function saveToStorage() {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        courses: state.courses,
        currentWeek: state.currentWeek,
        maxPeriods: state.maxPeriods,
      }),
    );
  } catch (error) {
    console.warn('保存本地数据失败', error);
  }
}

function updateWeekDisplay() {
  weekDisplay.textContent = `第 ${state.currentWeek} 周`;
}

function updateWeekRange() {
  let maxWeek = 20;
  state.courses.forEach((course) => {
    if (course.weeks?.length) {
      maxWeek = Math.max(maxWeek, Math.max(...course.weeks));
    }
  });

  weekSelector.max = String(maxWeek);
  if (state.currentWeek > maxWeek) {
    state.currentWeek = maxWeek;
    weekSelector.value = String(state.currentWeek);
    updateWeekDisplay();
  }
}

function parseWeeks(weekString) {
  if (!weekString) return Array.from({ length: 20 }, (_, i) => i + 1);
  const cleaned = weekString.replace(/\s+/g, '');
  const tokens = cleaned.split(/[,，;]/).filter(Boolean);
  const weeks = new Set();

  tokens.forEach((token) => {
    const isOdd = /单/.test(token);
    const isEven = /双/.test(token);
    const match = token.match(/(\d+)(?:-(\d+))?/);
    if (!match) return;

    const start = Number(match[1]);
    const end = match[2] ? Number(match[2]) : start;
    for (let week = start; week <= end; week += 1) {
      if (isOdd && week % 2 === 0) continue;
      if (isEven && week % 2 === 1) continue;
      weeks.add(week);
    }
  });

  return [...weeks].sort((a, b) => a - b);
}

function parsePeriods(periodString) {
  const match = /^(\d+)(?:-(\d+))?$/.exec(periodString.trim());
  if (!match) return null;
  const start = Number(match[1]);
  const end = match[2] ? Number(match[2]) : start;
  return { start, end };
}

function normalizeCourse(raw) {
  const weeks = parseWeeks(raw.weeks);
  const periods = parsePeriods(raw.periods);
  if (!periods) {
    throw new Error(`无法识别节次：${raw.periods}`);
  }

  const course = {
    id: crypto.randomUUID(),
    name: raw.name || '未命名课程',
    teacher: raw.teacher || '',
    location: raw.location || '',
    day: Number(raw.day),
    start: periods.start,
    end: periods.end,
    weeks,
    color: randomPalette[Math.floor(Math.random() * randomPalette.length)],
  };

  if (Number.isNaN(course.day) || course.day < 1 || course.day > 7) {
    throw new Error(`星期字段需要为 1-7：${raw.day}`);
  }

  return course;
}

function importFromCSV(text) {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const imported = [];
  const errors = [];

  lines.forEach((line, index) => {
    const cells = line.split(/\s*,\s*/);
    if (cells.length < 6) {
      errors.push(`第 ${index + 1} 行字段不足，请检查是否包含 6 个字段。`);
      return;
    }

    try {
      const course = normalizeCourse({
        name: cells[0],
        teacher: cells[1],
        location: cells[2],
        day: cells[3],
        periods: cells[4],
        weeks: cells[5],
      });
      imported.push(course);
    } catch (error) {
      errors.push(`第 ${index + 1} 行：${error.message}`);
    }
  });

  return { imported, errors };
}

function renderDesktopView(matrix) {
  scheduleGrid.innerHTML = '';
  scheduleGrid.removeAttribute('data-layout');

  const header = document.createElement('div');
  header.className = 'schedule-header';
  header.appendChild(document.createElement('span'));
  DAYS.forEach((day) => {
    const span = document.createElement('span');
    span.textContent = day;
    header.appendChild(span);
  });
  scheduleGrid.appendChild(header);

  for (let period = 1; period <= state.maxPeriods; period += 1) {
    const row = document.createElement('div');
    row.className = 'schedule-row';

    const timeCell = document.createElement('div');
    timeCell.className = 'time-cell';
    timeCell.textContent = `${period}`;
    row.appendChild(timeCell);

    for (let day = 1; day <= 7; day += 1) {
      const cell = document.createElement('div');
      cell.className = 'course-cell empty';

      const courses = matrix[day]?.[period] || [];
      if (courses.length > 0) {
        cell.classList.remove('empty');
        courses.forEach((course) => {
          cell.appendChild(createCourseContent(course));
        });
      }
      row.appendChild(cell);
    }

    scheduleGrid.appendChild(row);
  }
}

function renderMobileView(matrix) {
  scheduleGrid.innerHTML = '';
  scheduleGrid.dataset.layout = 'compact';

  for (let day = 1; day <= 7; day += 1) {
    const dayCard = document.createElement('div');
    dayCard.className = 'day-card';
    const title = document.createElement('h3');
    title.textContent = DAYS[day - 1];
    dayCard.appendChild(title);

    let hasCourse = false;
    for (let period = 1; period <= state.maxPeriods; period += 1) {
      const courses = matrix[day]?.[period] || [];
      courses.forEach((course) => {
        hasCourse = true;
        const cell = document.createElement('div');
        cell.className = 'course-cell';
        cell.appendChild(createCourseContent(course));
        dayCard.appendChild(cell);
      });
    }

    if (!hasCourse) {
      const empty = document.createElement('div');
      empty.className = 'course-cell empty';
      empty.textContent = '本周无课程';
      dayCard.appendChild(empty);
    }

    scheduleGrid.appendChild(dayCard);
  }
}

function createCourseContent(course) {
  const wrapper = document.createElement('div');
  wrapper.className = 'course-content';
  wrapper.style.setProperty('background', `linear-gradient(140deg, ${course.color[1]}, rgba(255,255,255,0.8))`);
  wrapper.style.setProperty('border-radius', '16px');
  wrapper.style.setProperty('padding', '0.6rem 0.75rem');
  wrapper.style.setProperty('width', '100%');

  const name = document.createElement('div');
  name.className = 'course-name';
  name.textContent = course.name;

  const meta = document.createElement('div');
  meta.className = 'course-meta';

  if (course.teacher) {
    const teacherBadge = document.createElement('span');
    teacherBadge.className = 'badge';
    teacherBadge.textContent = course.teacher;
    meta.appendChild(teacherBadge);
  }

  if (course.location) {
    const locationBadge = document.createElement('span');
    locationBadge.className = 'badge';
    locationBadge.textContent = course.location;
    meta.appendChild(locationBadge);
  }

  const period = document.createElement('span');
  period.className = 'badge';
  period.textContent = `${course.start}-${course.end} 节`;
  meta.appendChild(period);

  wrapper.appendChild(name);
  wrapper.appendChild(meta);
  return wrapper;
}

function buildMatrix() {
  let maxPeriods = MAX_DEFAULT_PERIODS;
  state.courses.forEach((course) => {
    if (course.weeks.includes(state.currentWeek)) {
      maxPeriods = Math.max(maxPeriods, course.end);
    }
  });

  state.maxPeriods = maxPeriods;

  const matrix = {};
  for (let day = 1; day <= 7; day += 1) {
    matrix[day] = {};
    for (let period = 1; period <= state.maxPeriods; period += 1) {
      matrix[day][period] = [];
    }
  }

  state.courses.forEach((course) => {
    if (!course.weeks.includes(state.currentWeek)) return;
    for (let period = course.start; period <= course.end; period += 1) {
      matrix[course.day][period].push(course);
    }
  });

  return matrix;
}

function renderSchedule() {
  const matrix = buildMatrix();
  const hasCourses = state.courses.some((course) => course.weeks.includes(state.currentWeek));

  if (!hasCourses) {
    scheduleGrid.innerHTML = '';
    scheduleGrid.removeAttribute('data-layout');
    const empty = document.createElement('div');
    empty.className = 'empty-message';
    empty.textContent = '本周暂未安排课程，试试导入或手动添加吧！';
    scheduleGrid.appendChild(empty);
    return;
  }

  const isMobile = window.matchMedia('(max-width: 960px)').matches;
  if (isMobile) {
    renderMobileView(matrix);
  } else {
    renderDesktopView(matrix);
  }
}

function handleResize() {
  renderSchedule();
}

function addCourses(newCourses) {
  state.courses.push(...newCourses);
  updateWeekRange();
  saveToStorage();
  renderSchedule();
}

function handleFileUpload(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const content = e.target?.result;
    if (typeof content === 'string') {
      processImport(content);
    }
    fileInput.value = '';
  };
  reader.readAsText(file, 'utf-8');
}

function processImport(text) {
  if (!text.trim()) return;
  const { imported, errors } = importFromCSV(text);
  if (errors.length) {
    alert(`导入过程中发现以下问题：\n${errors.join('\n')}`);
  }
  if (imported.length) {
    addCourses(imported);
  }
}

function handleManualSubmit(event) {
  event.preventDefault();
  const formData = new FormData(courseForm);
  const raw = {
    name: formData.get('name'),
    teacher: formData.get('teacher'),
    location: formData.get('location'),
    day: formData.get('day'),
    periods: `${formData.get('start')}-${formData.get('end')}`,
    weeks: formData.get('weeks'),
  };

  try {
    const course = normalizeCourse(raw);
    addCourses([course]);
    courseForm.reset();
  } catch (error) {
    alert(error.message);
  }
}

function clearSchedule() {
  if (!state.courses.length) return;
  const confirmClear = confirm('确定要清空当前课表吗？此操作不可撤销。');
  if (!confirmClear) return;
  state.courses = [];
  state.maxPeriods = MAX_DEFAULT_PERIODS;
  weekSelector.max = '20';
  state.currentWeek = Math.min(state.currentWeek, 20);
  weekSelector.value = String(state.currentWeek);
  updateWeekDisplay();
  saveToStorage();
  renderSchedule();
}

function initializeColors() {
  state.courses = state.courses.map((course) => {
    if (!course.color) {
      return {
        ...course,
        color: randomPalette[Math.floor(Math.random() * randomPalette.length)],
      };
    }
    return course;
  });
}

function init() {
  loadFromStorage();
  initializeColors();
  updateWeekRange();
  renderSchedule();

  weekSelector.addEventListener('input', (event) => {
    state.currentWeek = Number(event.target.value);
    updateWeekDisplay();
    saveToStorage();
    renderSchedule();
  });

  fileInput.addEventListener('change', handleFileUpload);
  importButton.addEventListener('click', () => processImport(rawInput.value));
  courseForm.addEventListener('submit', handleManualSubmit);
  clearButton.addEventListener('click', clearSchedule);
  window.addEventListener('resize', handleResize);

  updateWeekDisplay();
}

init();
