const taskForm = document.getElementById('task-form');
const taskMenu = document.getElementById('task-menu');
const taskDialog = document.getElementById('task-dialog');
const dueInput = document.getElementById('due');
const allDayCheckbox = document.getElementById('all-day');
let currentTaskId = null;

document.addEventListener('DOMContentLoaded', () => {
    loadPage();
});

/** 
 * Load the page contents
 */
async function loadPage() {
    const container = document.getElementById('lists');
    container.innerHTML = '';
    container.className = 'all-groups';

    const listsArray = /**@type { List[] }*/ await window.electronAPI.getLists() || [];
    const listElements = await Promise.all(listsArray.map(async (list) => {
        return await createListElement(list);
    }));

    listElements.forEach(el => container.appendChild(el));
}

/** 
 * Creates a list box element for the given list object
 * @param {List} list the list to create a display box for
 * @returns the group div to be displayed
 */
async function createListElement(list) {
    const tasksArray = /**@type { Task[] }*/ await window.electronAPI.getTasksByList(list) || [];
    const completedArray = /**@type { Task[] }*/ await window.electronAPI.getCompletedTasksByList(list) || [];

    const groupDiv = document.createElement('div');
    groupDiv.className = 'border-container group';
    groupDiv.dataset.listId = list.ListId; 
    groupDiv.innerHTML = `
        <div class="d-flex-row space-between">
            <h3>${ list.ListName }</h3>
            <button class="nobkg-button vellip-btn" title="List options">⋮</button>
        </div>

        <button class="add-button" title="Add a task">+ Add a task</button>
        <ul class="task-list"></ul>

        <details class="subheader">
            <summary>Completed (${ completedArray.length })</summary>
            <ul class="completed-tasks"></ul>
        </details>
    `;
    groupDiv.querySelector('.vellip-btn').addEventListener('click', (e) => openListMenu(e, list.ListId));
    groupDiv.querySelector('.add-button').addEventListener('click', () => openTaskDialog(null, list.ListId))

    const taskList = groupDiv.querySelector('.task-list');
    tasksArray.forEach(task => {
        const li = document.createElement('li');
        li.className = 'group-item';
        li.dataset.taskId = task.TaskId;
        li.innerHTML = `
            <input type="checkbox" class="task-checkbox" title="Mark completed">
            <a>${ task.TaskName }</a>
            <button class="task-btn" title="Task options">⋮</button>
        `;
        li.querySelector('.task-btn').addEventListener('click', (e) => openTaskMenu(e, task.TaskId));
        li.querySelector('.task-checkbox').addEventListener('change', () => completeTask(task));
        taskList.appendChild(li);
    });

    const completedList = groupDiv.querySelector('.completed-tasks');
    completedArray.forEach(task => {
        const li = document.createElement('li');
        li.className = 'group-item strike-through';
        li.dataset.taskId = task.TaskId;
        li.innerHTML = `
            <input type="checkbox" class="task-checkbox" title="Mark uncompleted" checked>
            <a>${ task.TaskName }</a>
            <button class="task-btn" title="Task options">⋮</button>
        `;
        li.querySelector('.task-checkbox').addEventListener('change', () => uncompleteTask(task));
        completedList.appendChild(li);
    });

    return groupDiv;
}

/**
 * Swap between task due date input being date only or date time
 */
allDayCheckbox.addEventListener('change', function() {
    if (this.checked) {
        dueInput.type = 'date';
    }
    else {
        dueInput.type = 'datetime-local';
    }
});

/**
 * Open task dialog for editing and creation. Gets all current lists for dropdown input
 * @param {any} id the id of the task currently being edited, null if it is a new task
 */
async function openTaskDialog(id = null, listId = null) {
    const listsArray = /** @type { List[] } */ await window.electronAPI.getLists() || [];
    const listDropdown = document.getElementById('list-select');
    listDropdown.innerHTML = '';
    listsArray.forEach(list => {
        const listOption = document.createElement('option');
        listOption.value = list.ListId;
        listOption.textContent = list.ListName;
        listDropdown.appendChild(listOption);
    });

    const name = document.getElementById('task-name');
    const due = document.getElementById('due');
    const level = document.getElementById('level');
    const details = document.getElementById('details');
    const list = document.getElementById('list-select');

    if (id != null) {
        const task = /**@type { Task }*/await window.electronAPI.getTaskById(id) || null;
        name.value = task.TaskName;
        due.value = new Date(task.DueDate);
        level.value = task.PriorityLevel;
        details.value = task.TaskDesc;
        list.value = task.ListId;
    }
    else {
        name.value = '';
        due.value = '';
        level.value = 0;
        details.value = '';
    }

    if (listId != null) {
        list.value = listId;
    }
    else {
        list.value = '';
    }

    currentTaskId = id;
    taskDialog.style.display = 'block';
}

/**
 * Close the task dialog
 */
function closeTaskDialog() {
    taskDialog.style.display = 'none';
}

/**
 * Handle the submission request to edit or create a task
 */
taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(taskForm)
    const taskInfo = {
        name: formData.get('task-name'),
        details: formData.get('details'),
        due: formData.get('due'),
        allDay: formData.get('all-day'),
        recurrence: formData.get('recurrence'),
        level: formData.get('level'),
        list: formData.get('list')
    };
    if (taskInfo.allDay !== null) {
        taskInfo.due = new Date(`${dueInput.value}T00:00`).toISOString();
    }

    var isSuccess = null;
    if (currentTaskId == null) {
        isSuccess = await window.electronAPI.createTask(taskInfo);
    }
    else {
        isSuccess = await window.electronAPI.updateTask(taskInfo, currentTaskId);
    }

    if (isSuccess) {
        currentTaskId = null;
        taskForm.reset();
        closeTaskDialog();
        loadPage();
    }
});

/**
 * Request to swap a task's status to complete. If successful, reload the page
 */
function completeTask(task) {
    const success = window.electronAPI.completeTask(task.TaskId);
    if (success) {
        loadPage();
    }
}

/**
 * Request to swap a task's status to incomplete. If successful, reload the page
 */
function uncompleteTask(task) {
    const success = window.electronAPI.uncompleteTask(task.TaskId);
    if (success) {
        loadPage();
    }
}

/**
 * Open the task menu options for the selected task. Sets an event listener to check if the user
 * clicks outside the menu area
 */
function openTaskMenu(e, taskId) {
    const rect = e.currentTarget.getBoundingClientRect();
    const container = document.getElementById('lists');
    taskMenu.style.top = `${ rect.top }px`;
    taskMenu.style.left = `${ rect.left - 80 }px`;
    taskMenu.style.display = 'block';
    taskMenu.dataset.taskId = taskId;

    setTimeout(() => {
        document.addEventListener('click', taskMenuListener);
    }, 0);
}

/**
 * Handles the task menu event listener to check if a user clicks outside the menu. If they do,
 * hide the menu
 */
function taskMenuListener(event) {
    if (!taskMenu.contains(event.target)) {
        hideTaskMenu();
    }
}

/**
 * Hide the task menu
 */
function hideTaskMenu() {
    taskMenu.style.display = 'none';
    document.removeEventListener('click', taskMenuListener);
}

/**
 * Open the task dialog for editing and send over the selected task's id
 */
function editTask() {
    hideTaskMenu();
    openTaskDialog(taskMenu.dataset.taskId, null);
}

/**
 * Request to delete the selected task from the database
 */
function deleteTask() {
    hideMenuTask();
    window.electronAPI.deleteTask(taskMenu.dataset.taskId);
}