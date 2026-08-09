const err = document.getElementById('err');
const taskForm = document.getElementById('taskForm');
const dueInput = document.getElementById('due');
const allDayCheckbox = document.getElementById('all-day');
const taskMenu = document.getElementById('three-dots-task');
const menu = document.getElementById('three-dots-list');

document.addEventListener('DOMContentLoaded', () => {
    loadPage();
});

/** Load the page contents */
async function loadPage() {
    const container = document.getElementById('lists');
    container.innerHTML = '';
    container.className = 'all-groups';

    const listsArray = /** @type { List[] } */ await window.electronAPI.getLists() || [];
    const listElements = await Promise.all(listsArray.map(async (list) => {
        return await createListElement(list);
    }));

    listElements.forEach(el => container.appendChild(el));
}

/** Create a list box element for the given list */
async function createListElement(list) {
    const tasksArray = await window.electronAPI.getTasksByList(list) || [];
    const completedTasksArray = await window.electronAPI.getCompletedTasksByList(list) || [];

    const groupDiv = document.createElement('div');
    groupDiv.className = 'border-container group';
    groupDiv.dataset.listId = list.ListId; 

    groupDiv.innerHTML = `
        <div class="d-flex-row space-between">
            <h3>${ list.ListName }</h3>
            <button class="nobkg-button vellip-btn" title="List options">⋮</button>
        </div>

        <button class="add-button">+ Add a task</button>
        <ul class="task-list"></ul>

        <details class="subheader">
            <summary>Completed (${ completedTasksArray.length })</summary>
            <ul class="completed-tasks"></ul>
        </details>
    `;

    groupDiv.querySelector('.vellip-btn').addEventListener('click', (e) => {
        openListDropdownMenu(e, list.ListId);
    });

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

        li.querySelector('.task-btn').addEventListener('click', (e) => {
            openDropdownMenu(e, task.taskId);
        });
        li.querySelector('.task-checkbox').addEventListener('change', () => completeTask(task));
        taskList.appendChild(li);
    });

    const completedList = groupDiv.querySelector('.completed-tasks');
    completedTasksArray.forEach(task => {
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

/** Allows swap between an all-day task and allowing time input */
allDayCheckbox.addEventListener('change', function() {
    if (this.checked) {
        dueInput.type = 'date';
    }
    else {
        dueInput.type = 'datetime-local';
    }
});

/** Open task creation dialog */
async function openCreateForm() {
    const listsArray = await window.electronAPI.getLists() || [];
    const listDropdown = document.getElementById('list-select');

    listsArray.forEach(list => {
        const listOption = document.createElement('option');
        listOption.value = list.ListId;
        listOption.textContent = list.ListName;
        listDropdown.appendChild(listOption);
    });

    document.getElementById('taskFormDialog').style.display = 'block';
}

/** Close task creation dialog */
function closeCreateForm() {
    document.getElementById('taskFormDialog').style.display = 'none';
}

/** Handle taskForm submission */
taskForm.addEventListener('submit', async (event) => {
    event.preventDefault();
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

    const isSuccess = await window.electronAPI.createTask(taskInfo);
    if (isSuccess) {
        err.style.display = 'none';
        taskForm.reset();
        closeCreateForm();
        loadPage();
    }
    else {
        err.textContent = 'Save failed, please check inputs for errors and try again';
        err.style.display = 'block';
    }
});

/** Swaps a task's status to complete, then reloads the page */
function completeTask(task) {
    window.electronAPI.completeTask(task.TaskId);
    loadPage();
}

/** Swaps a task's status to incomplete, then reloads the page */
function uncompleteTask(task) {
    window.electronAPI.uncompleteTask(task.TaskId);
    loadPage();
}

/** Open edit dropdown for a task */
function openDropdownMenu(event, taskId) {
    const rect = event.currentTarget.getBoundingClientRect();
    const container = document.getElementById('lists');
    taskMenu.style.top = `${ rect.top }px`;
    taskMenu.style.left = `${ rect.left - 165 }px`;
    taskMenu.style.display = 'block';
    taskMenu.dataset.taskId = taskId;

    setTimeout(() => {
        document.addEventListener('click', closeThreeDotsTask);
    }, 0);
}

/** Close dropdown menu for task */
function closeThreeDotsTask(event) {
    if (!taskMenu.contains(event.target)) {
        hideMenuTask();
    }
}
function hideMenuTask() {
    taskMenu.style.display = 'none';
    document.removeEventListener('click', closeThreeDotsTask);
}

/** Handles task editing ability */
function editTask() {
    console.log(taskMenu.dataset.taskId);
    hideMenuTask();
}

/** Requests to delete a task from the database */
function deleteTask() {
    window.electronAPI.deleteList(taskMenu.dataset.taskId);
    hideMenuTask();
}

/** Open edit dropdown for a list */
function openListDropdownMenu(event, listId) {
    const rect = event.currentTarget.getBoundingClientRect();
    const container = document.getElementById('lists');
    menu.style.top = `${ rect.top }px`;
    menu.style.left = `${ rect.left - 165 }px`;
    menu.style.display = 'block';
    menu.dataset.listId = listId;

    setTimeout(() => {
        document.addEventListener('click', closeThreeDots);
    }, 0);
}

/** Close dropdown menu for list */
function closeThreeDots(event) {
    if (!menu.contains(event.target)) {
        hideMenu();
    }
}
function hideMenu() {
    menu.style.display = 'none';
    document.removeEventListener('click', closeThreeDots);
}