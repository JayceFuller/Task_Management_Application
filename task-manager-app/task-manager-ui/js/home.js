document.addEventListener("DOMContentLoaded", () => {
    getDateDisplay();
    loadTasks();
    loadOverdue();
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

/** Opens the week view page */
function openWeekView() {
    window.location.href = "week-view.html";
}

async function loadTasks() {
    const tasksArray = await window.electronAPI.getTodaysTasks() || [];
    const taskEl = document.getElementById('tasks');
    taskEl.innerHTML = '';

    tasksArray.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.className = "group-item";
        const taskName = document.createTextNode(` ${task.TaskName}`);
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.addEventListener("change", (event) => {
            //handle checking here
        });

        taskItem.appendChild(checkbox);
        taskItem.appendChild(taskName);
        taskEl.appendChild(taskItem);
    });
}

async function loadOverdue() {
    const overdueArray = await window.electronAPI.getOverdueTasks() || [];
    const overdueContainer = document.getElementById('overdueContainer');

    if (overdueArray.length != 0) {
        overdueContainer.style.display = 'block';
        const overdueEl = document.getElementById('overdue');
        overdueEl.innerHTML = '';

        overdueArray.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.className = "group-item";
            const taskName = document.createTextNode(` ${task.TaskName}`);
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.addEventListener("change", (event) => {
                //handle checking here
            });

            taskItem.appendChild(checkbox);
            taskItem.appendChild(taskName);
            overdueEl.appendChild(taskItem);
        });
    }
    else {
        overdueContainer.style.display = 'none';
    }
}