const tasks = document.getElementById('tasks');
const overdueContainer = document.getElementById('overdueContainer');
const overdueTasks = document.getElementById('overdue');
const events = document.getElementById('events');

document.addEventListener("DOMContentLoaded", () => {
    getDateDisplay();
    loadTasks();
    loadOverdue();
    loadEvents();
});

/**
 * Retrieves the current date to display on the page. Format is "Month Day, Year"
 */
function getDateDisplay() {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 
                        'October', 'November', 'December']
    const weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const date = new Date();
    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    const weekday = weekdayNames[date.getDay()];

    document.getElementById('date').textContent = weekday + " " + month + " " + day + ", " + year;
}

/**
 * Load all tasks due today
 */
async function loadTasks() {
    const tasksArray = /**@type { Task[] }*/ await window.electronAPI.getTodaysTasks() || [];

    tasksArray.forEach(task => {
        const li = document.createElement('li');
        li.className = "group-item";
        li.dataset.taskId = task.TaskId;
        li.innerHTML = `
            <input type="checkbox" class="task-checkbox" title="Mark completed">
            <a>${ task.TaskName }</a>
        `;
        li.querySelector('.task-checkbox').addEventListener('change', () => completeTask(task));
        tasks.appendChild(li);
    });
}

/**
 * Load all overdue tasks. If there are no tasks overdue, hide the overdue box
 */
async function loadOverdue() {
    const overdueArray = /**@type { Task[] }*/ await window.electronAPI.getOverdueTasks() || [];

    if (overdueArray.length > 0) {
        overdueContainer.style.display = 'block';
        
        overdueArray.forEach(task => {
            const li = document.createElement('li');
            li.className = "group-item";
            li.innerHTML = `
                <input type="checkbox" class="task-checkbox" title="Mark completed">
                <a>${ task.TaskName }</a>
            `;
            li.querySelector('.task-checkbox').addEventListener('change', () => completeTask(task));
            overdueTasks.appendChild(li);
        });
    }
    else {
        overdueContainer.style.display = 'none';
    }
}

/**
 * Gets all events within range of today
 */
async function loadEvents() {
    const eventArray = /**@type { Event[] } */ await window.electronAPI.getTodaysEvents() || [];

    if (eventArray > 0) {
        eventArray.forEach(event => {
            const li = document.createElement('li');
            li.innerHTML = `
                <a>${ event.EventName }</a>
            `;
            events.appendChild(li);
        });

        const hr = document.createElement('hr');
        events.appendChild(hr);
    }
}

/**
 * Request to swap a task's status to complete. If successful, reload the page
 */
function completeTask(task) {
    const success = window.electronAPI.completeTask(task.TaskId);
    if (success) {
        loadPage();
    }
}