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
        console.log("Failed to load tasks by label");
    }
}

function openTaskForm() {
    document.getElementById("taskForm").style.display = "block";
}

function closeTaskForm() {
    document.getElementById("taskForm").style.display = "none";
}

document.getElementById('taskForm').addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const details = document.getElementById('details').value;
    const due = document.getElementById('due').value;
    const recurrence = document.getElementById('recurrence').value;
    const level = document.getElementById('level').value;
    const list = document.getElementById('list').value;

    const data = { name, details, due, list, level, list };
    window.API.createTask();
})