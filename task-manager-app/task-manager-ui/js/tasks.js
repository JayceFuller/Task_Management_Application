const err = document.getElementById('err');
const taskForm = document.getElementById('taskForm');
const dueInput = document.getElementById('due');
const allDayCheckbox = document.getElementById('all-day');

/** Create the initial page content */
document.addEventListener('DOMContentLoaded', () => {
    loadPage();
});

/** Load all tasks from the database and display in groupings by saved labels */
async function loadPage() {
    const listsArray = /** @type { List[] } */ await window.electronAPI.getLists() || [];
    const container = document.getElementById('lists');
    container.innerHTML = '';
    container.className = 'all-groups';

    await Promise.all(listsArray.map(async (list) => {
        const tasksArray = /** @type { Task[] } */ await window.electronAPI.getTasksByList(list) || [];

        const groupDiv = document.createElement('div');
        groupDiv.className = 'border-container group';
        const listHeader = document.createElement('div');
        listHeader.className = 'd-flex-row space-between';
        listHeader.innerHTML = `<h3>${ list.ListName } </h3> <button class="nobkg-button">&vellip;</button>`;
        groupDiv.appendChild(listHeader);

        const taskList = document.createElement('ul');
        tasksArray.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.className = 'group-item';
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.addEventListener('change', (event) => {
                completeTask(task);
            });
            const taskLink = document.createElement('a');
            //taskLink.href = `./task-detail.html?id=${ task.TaskId }`;
            //taskLink.onclick = openTaskDialog(task)
            taskLink.textContent = `${ task.TaskName }`
            
            taskItem.appendChild(checkbox);
            taskItem.appendChild(taskLink);
            taskList.appendChild(taskItem);
        });

        const completedTasks = document.createElement('ul');
        completedTasks.className = 'm0';
        const completedTasksArray = /** @type { Task[] } */ await window.electronAPI.getCompletedTasksByList(list);
        completedTasksArray.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.className = 'group-item strike-through';
            const taskLink = document.createElement('a');
            taskLink.textContent = `${ task.TaskName }`
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = true;
            checkbox.disabled = true;

            taskItem.appendChild(checkbox);
            taskItem.appendChild(taskLink);
            completedTasks.appendChild(taskItem);
        });
        const completeHeader = document.createElement('div');
        completeHeader.className = 'subheader';
        completeHeader.innerHTML = `Completed (${ completedTasksArray.length })`;

        groupDiv.appendChild(taskList);
        groupDiv.appendChild(completeHeader);
        groupDiv.appendChild(completedTasks);
        container.appendChild(groupDiv);
    }));
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