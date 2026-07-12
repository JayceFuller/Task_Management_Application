const err = document.getElementById('err');
const taskForm = document.getElementById('taskForm');
const listForm = document.getElementById('listForm');

/** Create the initial page content */
document.addEventListener('DOMContentLoaded', () => {
    loadPage();
});

/** Load all tasks from the database and display in groupings by saved labels */
async function loadPage() {
    const lists = await window.electronAPI.getLists();
    const listsArray = Array.isArray(lists) ? lists : (lists.data || []);
    const container = document.getElementById('lists');
    container.innerHTML = '';

    await Promise.all(listsArray.map(async (list) => {
        const tasks = await window.electronAPI.getTaskByList(list);
        const tasksArray =  Array.isArray(tasks) ? tasks : (tasks.data || []);

        const groupDiv = document.createElement('div');
        groupDiv.className = 'border-container display-group';
        groupDiv.innerHTML = `<h3>${ list.ListName } </h3>`;

        const taskList = document.createElement('ul');
        tasksArray.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.className = 'group-item';
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.addEventListener('change', (event) => {
                window.electronAPI.completeTask(task);
                checkbox.checked = true;
                checkbox.disabled = true;
            });
            const taskName = document.createTextNode(` ${task.TaskName}`);
            
            taskItem.appendChild(checkbox);
            taskItem.appendChild(taskName);
            taskList.appendChild(taskItem);
        });
        groupDiv.appendChild(taskList);
        container.appendChild(groupDiv);
    }));
}

/** Open task creation dialog */
async function openTaskDialog() {
    document.getElementById('taskDialog').style.display = 'block';
    const lists = await window.electronAPI.getLists();
    const listsArray = Array.isArray(lists) ? lists : (lists.data || []);
    const listDropdown = document.getElementById('listSelect');

    listsArray.forEach(list => {
        const listOption = document.createElement('option');
        listOption.value = list.ListId;
        listOption.textContent = list.ListName;
        listDropdown.appendChild(listOption);
    })
}

/** Close task creation dialog */
function closeTaskDialog() {
    document.getElementById('taskDialog').style.display = 'none';
}

/** Handle taskForm submission */
taskForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(taskForm)
    const taskInfo = {
        name: formData.get('task-name'),
        details: formData.get('details'),
        due: formData.get('due'),
        recurrence: formData.get('recurrence'),
        level: formData.get('level'),
        list: formData.get('list')
    };

    const isSuccess = await window.electronAPI.createTask(taskInfo);
    if (isSuccess) {
        err.style.display = 'none';
        taskForm.reset();
        closeTaskDialog();
        loadPage();
    }
    else {
        err.textContent = 'Save failed, please check inputs for errors and try again';
        err.style.display = 'block';
    }
})


/** Open list creation dialog */
function openListDialog() {
    document.getElementById('listDialog').style.display = 'block';
}

/** Close list creation dialog */
function closeListDialog() {
    document.getElementById('listDialog').style.display = 'none';
}

/** Handle listForm submission */
listForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(listForm);
    const listInfo = {
        name: formData.get('list-name'),
    }

    const isSuccess = await window.electronAPI.createList(listInfo);
    if (isSuccess) {
        err.style.display = 'none';
        listForm.reset();
        closeListDialog();
        loadPage();
    }
    else {
        err.textContent = 'Save failed, please check inputs for errors and try again';
        err.style.display = 'block';
    }
})