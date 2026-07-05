const err = document.getElementById('err');
const taskForm = document.getElementById('taskForm')

/**
 * Load all tasks from the database and display in groupings by saved labels
 */
async function loadTasks() {
    try {
        const labels = await window.electronAPI.getLabels();
        const container = document.getElementById("lists");
        container.innerHTML = "";

        await Promise.all(labels.map(async (label) => {
            const tasks = await window.electronAPI.getTaskByLabel(label);

            const groupDiv = document.createElement("div");
            groupDiv.className = "task-group";
            groupDiv.innerHTML = `<h3>{ label } </h3>`;

            const taskList = document.createElement("ul");
            tasks.forEach(task => {
                const taskItem = document.createElement("li");
                taskItem.textContent = task.name;
                taskItem.appendChild(taskList);
            });
            groupDiv.appendChild(taskList);
            container.appendChild(groupDiv);
        }))
    }
    catch (err) {
        console.log("Failed to load tasks");
    }
}

/** Open task creation dialog */
function openTaskDialog() {
    document.getElementById("taskDialog").style.display = "block";
}

/** Close task creation dialog */
function closeTaskDialog() {
    document.getElementById("taskDialog").style.display = "none";
}

/** Handle taskForm submission */
taskForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(taskForm)
    const taskInfo = {
        name: formData.get('name'),
        details: formData.get('details'),
        due: formData.get('due'),
        recurrence: formData.get('recurrence'),
        level: formData.get('level'),
        list: formData.get('list')
    }

    const isSuccess = await window.electronAPI.createTask(taskInfo);
    if (isSuccess) {
        err.style.display = 'none';
        taskForm.reset();
        closeTaskDialog();
        loadTasks();
    }
    else {
        err.textContent = 'Save failed, please check inputs for errors and try again';
        err.style.display = 'block';
    }
})