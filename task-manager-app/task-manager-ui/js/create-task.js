document.getElementById('task-form').addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const details = document.getElementById('details').value;
    const due = document.getElementById('due').value;
    const level = document.getElementById('level').value;
    const group =document.getElementById('group').value;

    const data = { name, details, due, level, group };
    window.API.createTask();
})