function openEventForm() {
    document.getElementById("eventForm").style.display = "block";
}

function closeEventForm() {
    document.getElementById("eventForm").style.display = "none";
}

document.getElementById('task-form').addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const details = document.getElementById('details').value;
    const location = document.getElementById('location').value;
    const start = document.getElementById('start').value;
    const end = document.getElementById('end').value;
    const recurrence = document.getElementById('recurrence').value;
    const group =document.getElementById('group').value;

    const data = { name, details, location, start, end, recurrence, group };
    window.API.createEvent();
})