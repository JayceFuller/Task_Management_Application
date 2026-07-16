const err = document.getElementById('err');
const taskForm = document.getElementById('taskForm');
const dueInput = document.getElementById('due');
const allDayCheckbox = document.getElementById('all-day');
const menu = document.getElementById('three-dots');

/** Create the initial page content */
document.addEventListener('DOMContentLoaded', () => {
    loadPage();
});

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

async function createListElement(list) {
    const tasksArray = /** @type { Task[] } */ await window.electronAPI.getTasksByList(list) || [];
    const completedTasksArray = /** @type { Task[] } */ await window.electronAPI.getCompletedTasksByList(list) || [];

    const groupDiv = document.createElement('div');
    groupDiv.className = 'border-container group';
    groupDiv.dataset.listId = list.ListId; 

    groupDiv.innerHTML = `
        <div class="d-flex-row space-between">
        <h3>${list.ListName}</h3>
        <button class="nobkg-button vellip-btn">⋮</button>
        </div>
        <ul class="task-list"></ul>
        <div class="subheader">Completed (${completedTasksArray.length})</div>
        <ul class="completed-tasks m0"></ul>
    `;

    groupDiv.querySelector('.vellip-btn').addEventListener('click', (e) => {
        openDropdownMenu(e, list.ListId);
    });

    const taskListUl = groupDiv.querySelector('.task-list');
    tasksArray.forEach(task => {
        const li = document.createElement('li');
        li.className = 'group-item';
        li.dataset.taskId = task.TaskId;
        li.innerHTML = `
        <input type="checkbox" class="task-checkbox">
        <a class="task-link">${task.TaskName}</a>
        `;
        li.querySelector('.task-checkbox').addEventListener('change', () => completeTask(task));
        taskListUl.appendChild(li);
    });

    const completedUl = groupDiv.querySelector('.completed-tasks');
    completedTasksArray.forEach(task => {
        const li = document.createElement('li');
        li.className = 'group-item strike-through';
        li.innerHTML = `
        <input type="checkbox" checked disabled>
        <a>${task.TaskName}</a>
        `;
        completedUl.appendChild(li);
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
    const listDropdown = document.getElementById('listSelect');

    listsArray.forEach(list => {
        const listOption = document.createElement('option');
        listOption.value = list.ListId;
        listOption.textContent = list.ListName;
        listDropdown.appendChild(listOption);
    })

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

function completeTask(task) {
    window.electronAPI.completeTask(task.TaskId);
}

function openDropdownMenu(event, listId) {
    const rect = event.currentTarget.getBoundingClientRect();
    const container = document.getElementById('lists');
    menu.style.top = `${rect.top}px`;
    menu.style.left = `${rect.left - 165}px`;
    menu.style.display = 'block';
    menu.dataset.listId = listId;

    setTimeout(() => {
        document.addEventListener('click', closeThreeDots);
    }, 0);
}

function closeThreeDots(event) {
    if (!menu.contains(event.target)) {
        hideMenu();
    }
}

function hideMenu() {
    menu.style.display = 'none';
    document.removeEventListener('click', closeThreeDots);
}

function editList() {
    console.log(menu.dataset.listId);
    hideMenu();
}

function deleteList() {
    window.electronAPI.deleteList(menu.dataset.listId);
    hideMenu();
}

function deleteCompleted() {
    window.electronAPI.deleteCompleted(menu.dataset.listId);
    hideMenu();
}