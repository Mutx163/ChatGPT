// 数据存储
let courses = [];
let homeworks = [];
let currentView = 'day';
let currentDate = new Date();

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    initEventListeners();
    updateView();
});

// 加载数据
function loadData() {
    const savedCourses = localStorage.getItem('courses');
    const savedHomeworks = localStorage.getItem('homeworks');
    
    if (savedCourses) {
        courses = JSON.parse(savedCourses);
    }
    
    if (savedHomeworks) {
        homeworks = JSON.parse(savedHomeworks);
    }
}

// 保存数据
function saveData() {
    localStorage.setItem('courses', JSON.stringify(courses));
    localStorage.setItem('homeworks', JSON.stringify(homeworks));
}

// 初始化事件监听器
function initEventListeners() {
    // 视图切换
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentView = this.dataset.view;
            updateView();
        });
    });

    // 日期导航
    document.getElementById('prevBtn').addEventListener('click', navigatePrev);
    document.getElementById('nextBtn').addEventListener('click', navigateNext);
    document.getElementById('todayBtn').addEventListener('click', goToToday);

    // 添加按钮
    document.getElementById('addCourseBtn').addEventListener('click', () => openCourseModal());
    document.getElementById('addHomeworkBtn').addEventListener('click', () => openHomeworkModal());

    // 导入导出
    document.getElementById('importBtn').addEventListener('click', importICS);
    document.getElementById('exportBtn').addEventListener('click', exportICS);

    // 模态框关闭
    document.querySelectorAll('[data-modal]').forEach(btn => {
        btn.addEventListener('click', function() {
            closeModal(this.dataset.modal);
        });
    });

    // 表单提交
    document.getElementById('courseForm').addEventListener('submit', saveCourse);
    document.getElementById('homeworkForm').addEventListener('submit', saveHomework);

    // 文件输入
    document.getElementById('fileInput').addEventListener('change', handleFileSelect);
}

// 更新视图
function updateView() {
    updateDateDisplay();
    
    // 隐藏所有视图
    document.querySelectorAll('.view-container').forEach(container => {
        container.classList.remove('active');
    });

    // 显示当前视图
    if (currentView === 'day') {
        document.getElementById('dayView').classList.add('active');
        renderDayView();
    } else if (currentView === 'week') {
        document.getElementById('weekView').classList.add('active');
        renderWeekView();
    } else if (currentView === 'overview') {
        document.getElementById('overviewView').classList.add('active');
        renderOverview();
    }
}

// 更新日期显示
function updateDateDisplay() {
    const dateStr = currentDate.toLocaleDateString('zh-CN', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        weekday: 'long'
    });
    document.getElementById('currentDate').textContent = dateStr;
}

// 日期导航
function navigatePrev() {
    if (currentView === 'day') {
        currentDate.setDate(currentDate.getDate() - 1);
    } else if (currentView === 'week') {
        currentDate.setDate(currentDate.getDate() - 7);
    }
    updateView();
}

function navigateNext() {
    if (currentView === 'day') {
        currentDate.setDate(currentDate.getDate() + 1);
    } else if (currentView === 'week') {
        currentDate.setDate(currentDate.getDate() + 7);
    }
    updateView();
}

function goToToday() {
    currentDate = new Date();
    updateView();
}

// 渲染日视图
function renderDayView() {
    const grid = document.getElementById('dayTimeGrid');
    grid.innerHTML = '';

    const dayOfWeek = currentDate.getDay();
    const dayCourses = courses.filter(c => parseInt(c.day) === dayOfWeek);

    // 创建时间网格（8:00 - 22:00）
    for (let hour = 8; hour <= 21; hour++) {
        // 时间标签
        const timeLabel = document.createElement('div');
        timeLabel.className = 'time-label';
        timeLabel.textContent = `${hour.toString().padStart(2, '0')}:00`;
        grid.appendChild(timeLabel);

        // 时间槽
        const timeSlot = document.createElement('div');
        timeSlot.className = 'time-slot';
        
        // 查找该时间段的课程
        dayCourses.forEach(course => {
            const [startHour, startMinute] = course.startTime.split(':').map(Number);
            const [endHour, endMinute] = course.endTime.split(':').map(Number);
            
            if (startHour === hour) {
                const eventCard = createEventCard(course);
                const duration = (endHour - startHour) + (endMinute - startMinute) / 60;
                eventCard.style.height = `${duration * 60 - 4}px`;
                eventCard.style.top = `${startMinute}px`;
                timeSlot.appendChild(eventCard);
            }
        });

        grid.appendChild(timeSlot);
    }
}

// 渲染周视图
function renderWeekView() {
    const grid = document.getElementById('weekGrid');
    grid.innerHTML = '';

    const weekStart = getWeekStart(currentDate);
    const days = ['日', '一', '二', '三', '四', '五', '六'];

    // 空白角落
    const corner = document.createElement('div');
    corner.className = 'time-label';
    grid.appendChild(corner);

    // 星期标题
    for (let i = 0; i < 7; i++) {
        const dayDate = new Date(weekStart);
        dayDate.setDate(weekStart.getDate() + i);
        
        const dayHeader = document.createElement('div');
        dayHeader.className = 'day-header';
        
        if (isToday(dayDate)) {
            dayHeader.classList.add('today');
        }
        
        dayHeader.innerHTML = `
            <div class="day-name">星期${days[i]}</div>
            <div class="day-date">${dayDate.getDate()}</div>
        `;
        grid.appendChild(dayHeader);
    }

    // 时间行
    for (let hour = 8; hour <= 21; hour++) {
        // 时间标签
        const timeLabel = document.createElement('div');
        timeLabel.className = 'time-label';
        timeLabel.textContent = `${hour.toString().padStart(2, '0')}:00`;
        grid.appendChild(timeLabel);

        // 每天的时间槽
        for (let day = 0; day < 7; day++) {
            const timeSlot = document.createElement('div');
            timeSlot.className = 'time-slot';
            
            const dayCourses = courses.filter(c => parseInt(c.day) === day);
            
            dayCourses.forEach(course => {
                const [startHour, startMinute] = course.startTime.split(':').map(Number);
                const [endHour, endMinute] = course.endTime.split(':').map(Number);
                
                if (startHour === hour) {
                    const eventCard = createEventCard(course);
                    const duration = (endHour - startHour) + (endMinute - startMinute) / 60;
                    eventCard.style.height = `${duration * 60 - 4}px`;
                    eventCard.style.top = `${startMinute}px`;
                    timeSlot.appendChild(eventCard);
                }
            });

            grid.appendChild(timeSlot);
        }
    }
}

// 渲染总览
function renderOverview() {
    renderCourseList();
    renderHomeworkList();
}

// 渲染课程列表
function renderCourseList() {
    const container = document.getElementById('courseList');
    
    if (courses.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📚</div>
                <div class="empty-state-text">暂无课程，点击"添加课程"开始添加</div>
            </div>
        `;
        return;
    }

    const sortedCourses = [...courses].sort((a, b) => {
        if (a.day !== b.day) return a.day - b.day;
        return a.startTime.localeCompare(b.startTime);
    });

    container.innerHTML = sortedCourses.map(course => {
        const days = ['日', '一', '二', '三', '四', '五', '六'];
        return `
            <div class="course-item" style="border-left-color: ${course.color}">
                <h3>${course.name}</h3>
                <div class="course-info">
                    <div>🗓 星期${days[course.day]} ${course.startTime} - ${course.endTime}</div>
                    ${course.teacher ? `<div>👨‍🏫 ${course.teacher}</div>` : ''}
                    ${course.location ? `<div>📍 ${course.location}</div>` : ''}
                    ${course.notes ? `<div>📝 ${course.notes}</div>` : ''}
                </div>
                <div class="item-actions">
                    <button class="edit-btn" onclick="editCourse('${course.id}')">编辑</button>
                    <button class="delete-btn" onclick="deleteCourse('${course.id}')">删除</button>
                </div>
            </div>
        `;
    }).join('');
}

// 渲染作业列表
function renderHomeworkList() {
    const container = document.getElementById('homeworkList');
    
    if (homeworks.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📋</div>
                <div class="empty-state-text">暂无作业，点击"添加作业"开始添加</div>
            </div>
        `;
        return;
    }

    const sortedHomeworks = [...homeworks].sort((a, b) => {
        const dateA = new Date(a.date + ' ' + a.time);
        const dateB = new Date(b.date + ' ' + b.time);
        return dateA - dateB;
    });

    container.innerHTML = sortedHomeworks.map(homework => {
        const statusText = {
            'pending': '待完成',
            'in-progress': '进行中',
            'completed': '已完成'
        };
        const priorityText = {
            'low': '低',
            'medium': '中',
            'high': '高'
        };
        
        return `
            <div class="homework-item">
                <h3>${homework.title}</h3>
                <div class="homework-info">
                    ${homework.course ? `<div>📚 ${homework.course}</div>` : ''}
                    <div>📅 ${homework.date} ${homework.time}</div>
                    ${homework.description ? `<div>📝 ${homework.description}</div>` : ''}
                </div>
                <div>
                    <span class="homework-status ${homework.status}">${statusText[homework.status]}</span>
                    <span class="homework-priority ${homework.priority}">${priorityText[homework.priority]}</span>
                </div>
                <div class="item-actions">
                    <button class="edit-btn" onclick="editHomework('${homework.id}')">编辑</button>
                    <button class="delete-btn" onclick="deleteHomework('${homework.id}')">删除</button>
                </div>
            </div>
        `;
    }).join('');
}

// 创建事件卡片
function createEventCard(course) {
    const card = document.createElement('div');
    card.className = 'event-card';
    card.style.backgroundColor = course.color;
    card.innerHTML = `
        <div class="event-title">${course.name}</div>
        <div class="event-time">${course.startTime} - ${course.endTime}</div>
        ${course.location ? `<div class="event-location">📍 ${course.location}</div>` : ''}
    `;
    card.onclick = () => editCourse(course.id);
    return card;
}

// 模态框操作
function openCourseModal(courseId = null) {
    const modal = document.getElementById('courseModal');
    const form = document.getElementById('courseForm');
    form.reset();

    if (courseId) {
        const course = courses.find(c => c.id === courseId);
        if (course) {
            document.getElementById('courseModalTitle').textContent = '编辑课程';
            document.getElementById('courseId').value = course.id;
            document.getElementById('courseName').value = course.name;
            document.getElementById('courseTeacher').value = course.teacher || '';
            document.getElementById('courseLocation').value = course.location || '';
            document.getElementById('courseDay').value = course.day;
            document.getElementById('courseStartTime').value = course.startTime;
            document.getElementById('courseEndTime').value = course.endTime;
            document.getElementById('courseColor').value = course.color;
            document.getElementById('courseNotes').value = course.notes || '';
        }
    } else {
        document.getElementById('courseModalTitle').textContent = '添加课程';
        document.getElementById('courseId').value = '';
    }

    modal.classList.add('active');
}

function openHomeworkModal(homeworkId = null) {
    const modal = document.getElementById('homeworkModal');
    const form = document.getElementById('homeworkForm');
    form.reset();

    if (homeworkId) {
        const homework = homeworks.find(h => h.id === homeworkId);
        if (homework) {
            document.getElementById('homeworkModalTitle').textContent = '编辑作业';
            document.getElementById('homeworkId').value = homework.id;
            document.getElementById('homeworkTitle').value = homework.title;
            document.getElementById('homeworkCourse').value = homework.course || '';
            document.getElementById('homeworkDate').value = homework.date;
            document.getElementById('homeworkTime').value = homework.time;
            document.getElementById('homeworkPriority').value = homework.priority;
            document.getElementById('homeworkStatus').value = homework.status;
            document.getElementById('homeworkDescription').value = homework.description || '';
        }
    } else {
        document.getElementById('homeworkModalTitle').textContent = '添加作业';
        document.getElementById('homeworkId').value = '';
        // 设置默认日期为今天
        document.getElementById('homeworkDate').value = new Date().toISOString().split('T')[0];
    }

    modal.classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// 保存课程
function saveCourse(e) {
    e.preventDefault();

    const courseId = document.getElementById('courseId').value;
    const courseData = {
        id: courseId || generateId(),
        name: document.getElementById('courseName').value,
        teacher: document.getElementById('courseTeacher').value,
        location: document.getElementById('courseLocation').value,
        day: document.getElementById('courseDay').value,
        startTime: document.getElementById('courseStartTime').value,
        endTime: document.getElementById('courseEndTime').value,
        color: document.getElementById('courseColor').value,
        notes: document.getElementById('courseNotes').value
    };

    if (courseId) {
        // 更新现有课程
        const index = courses.findIndex(c => c.id === courseId);
        if (index !== -1) {
            courses[index] = courseData;
        }
    } else {
        // 添加新课程
        courses.push(courseData);
    }

    saveData();
    closeModal('courseModal');
    updateView();
}

// 保存作业
function saveHomework(e) {
    e.preventDefault();

    const homeworkId = document.getElementById('homeworkId').value;
    const homeworkData = {
        id: homeworkId || generateId(),
        title: document.getElementById('homeworkTitle').value,
        course: document.getElementById('homeworkCourse').value,
        date: document.getElementById('homeworkDate').value,
        time: document.getElementById('homeworkTime').value,
        priority: document.getElementById('homeworkPriority').value,
        status: document.getElementById('homeworkStatus').value,
        description: document.getElementById('homeworkDescription').value
    };

    if (homeworkId) {
        // 更新现有作业
        const index = homeworks.findIndex(h => h.id === homeworkId);
        if (index !== -1) {
            homeworks[index] = homeworkData;
        }
    } else {
        // 添加新作业
        homeworks.push(homeworkData);
    }

    saveData();
    closeModal('homeworkModal');
    updateView();
}

// 编辑和删除
function editCourse(id) {
    openCourseModal(id);
}

function deleteCourse(id) {
    if (confirm('确定要删除这门课程吗？')) {
        courses = courses.filter(c => c.id !== id);
        saveData();
        updateView();
    }
}

function editHomework(id) {
    openHomeworkModal(id);
}

function deleteHomework(id) {
    if (confirm('确定要删除这个作业吗？')) {
        homeworks = homeworks.filter(h => h.id !== id);
        saveData();
        updateView();
    }
}

// ICS 导入导出
function importICS() {
    document.getElementById('fileInput').click();
}

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        try {
            parseICS(event.target.result);
            alert('导入成功！');
            updateView();
        } catch (error) {
            alert('导入失败：' + error.message);
        }
    };
    reader.readAsText(file);
}

function parseICS(icsContent) {
    const lines = icsContent.split('\n');
    let currentEvent = null;
    let importedCount = 0;

    for (let line of lines) {
        line = line.trim();

        if (line === 'BEGIN:VEVENT') {
            currentEvent = {};
        } else if (line === 'END:VEVENT' && currentEvent) {
            // 处理事件
            if (currentEvent.summary) {
                // 尝试解析为课程或作业
                if (currentEvent.rrule && currentEvent.dtstart) {
                    // 有重复规则，视为课程
                    const course = parseEventAsCourse(currentEvent);
                    if (course) {
                        courses.push(course);
                        importedCount++;
                    }
                } else if (currentEvent.dtstart) {
                    // 单次事件，视为作业
                    const homework = parseEventAsHomework(currentEvent);
                    if (homework) {
                        homeworks.push(homework);
                        importedCount++;
                    }
                }
            }
            currentEvent = null;
        } else if (currentEvent) {
            const colonIndex = line.indexOf(':');
            if (colonIndex > 0) {
                const key = line.substring(0, colonIndex);
                const value = line.substring(colonIndex + 1);

                if (key.startsWith('DTSTART')) {
                    currentEvent.dtstart = value;
                } else if (key.startsWith('DTEND')) {
                    currentEvent.dtend = value;
                } else if (key === 'SUMMARY') {
                    currentEvent.summary = value;
                } else if (key === 'DESCRIPTION') {
                    currentEvent.description = value;
                } else if (key === 'LOCATION') {
                    currentEvent.location = value;
                } else if (key === 'RRULE') {
                    currentEvent.rrule = value;
                }
            }
        }
    }

    if (importedCount > 0) {
        saveData();
    }
}

function parseEventAsCourse(event) {
    try {
        // 解析开始时间
        const dtstart = parseICSDateTime(event.dtstart);
        const dtend = parseICSDateTime(event.dtend);

        return {
            id: generateId(),
            name: event.summary,
            teacher: '',
            location: event.location || '',
            day: dtstart.getDay().toString(),
            startTime: formatTime(dtstart),
            endTime: formatTime(dtend),
            color: '#' + Math.floor(Math.random()*16777215).toString(16),
            notes: event.description || ''
        };
    } catch (error) {
        console.error('解析课程失败:', error);
        return null;
    }
}

function parseEventAsHomework(event) {
    try {
        const dtstart = parseICSDateTime(event.dtstart);

        return {
            id: generateId(),
            title: event.summary,
            course: '',
            date: dtstart.toISOString().split('T')[0],
            time: formatTime(dtstart),
            priority: 'medium',
            status: 'pending',
            description: event.description || ''
        };
    } catch (error) {
        console.error('解析作业失败:', error);
        return null;
    }
}

function parseICSDateTime(dateTimeStr) {
    // ICS 格式: 20231201T090000 或 20231201T090000Z
    dateTimeStr = dateTimeStr.replace(/[:-]/g, '');
    
    const year = parseInt(dateTimeStr.substring(0, 4));
    const month = parseInt(dateTimeStr.substring(4, 6)) - 1;
    const day = parseInt(dateTimeStr.substring(6, 8));
    const hour = parseInt(dateTimeStr.substring(9, 11));
    const minute = parseInt(dateTimeStr.substring(11, 13));

    return new Date(year, month, day, hour, minute);
}

function exportICS() {
    let icsContent = 'BEGIN:VCALENDAR\n';
    icsContent += 'VERSION:2.0\n';
    icsContent += 'PRODID:-//课程表管理系统//CN\n';
    icsContent += 'CALSCALE:GREGORIAN\n';

    // 导出课程（作为重复事件）
    courses.forEach(course => {
        const weekStart = getWeekStart(new Date());
        const courseDate = new Date(weekStart);
        courseDate.setDate(weekStart.getDate() + parseInt(course.day));

        const [startHour, startMinute] = course.startTime.split(':');
        const [endHour, endMinute] = course.endTime.split(':');

        const startDateTime = new Date(courseDate);
        startDateTime.setHours(parseInt(startHour), parseInt(startMinute), 0);

        const endDateTime = new Date(courseDate);
        endDateTime.setHours(parseInt(endHour), parseInt(endMinute), 0);

        icsContent += 'BEGIN:VEVENT\n';
        icsContent += `UID:${course.id}@course-scheduler\n`;
        icsContent += `DTSTART:${formatICSDateTime(startDateTime)}\n`;
        icsContent += `DTEND:${formatICSDateTime(endDateTime)}\n`;
        icsContent += `SUMMARY:${course.name}\n`;
        if (course.location) icsContent += `LOCATION:${course.location}\n`;
        if (course.teacher) icsContent += `DESCRIPTION:教师: ${course.teacher}${course.notes ? '\\n' + course.notes : ''}\n`;
        icsContent += `RRULE:FREQ=WEEKLY;BYDAY=${getDayAbbr(course.day)}\n`;
        icsContent += 'END:VEVENT\n';
    });

    // 导出作业
    homeworks.forEach(homework => {
        const [year, month, day] = homework.date.split('-');
        const [hour, minute] = homework.time.split(':');

        const dateTime = new Date(year, month - 1, day, hour, minute);

        icsContent += 'BEGIN:VEVENT\n';
        icsContent += `UID:${homework.id}@course-scheduler\n`;
        icsContent += `DTSTART:${formatICSDateTime(dateTime)}\n`;
        icsContent += `DTEND:${formatICSDateTime(new Date(dateTime.getTime() + 3600000))}\n`;
        icsContent += `SUMMARY:${homework.title}\n`;
        if (homework.course) icsContent += `DESCRIPTION:课程: ${homework.course}${homework.description ? '\\n' + homework.description : ''}\n`;
        icsContent += 'END:VEVENT\n';
    });

    icsContent += 'END:VCALENDAR';

    // 下载文件
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `课程表_${new Date().toISOString().split('T')[0]}.ics`;
    link.click();
}

// 工具函数
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function formatTime(date) {
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
}

function formatICSDateTime(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    return `${year}${month}${day}T${hour}${minute}00`;
}

function getDayAbbr(day) {
    const days = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
    return days[parseInt(day)];
}

function getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
}

function isToday(date) {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
}
