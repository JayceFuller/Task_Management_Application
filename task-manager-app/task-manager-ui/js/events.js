const err = document.getElementById('err');
const eventForm = document.getElementById('eventForm');
const labelForm = document.getElementById('labelForm');

/** Create the initial page content */
document.addEventListener('DOMContentLoaded', () => {
    loadPage();
});

/** Load all events from the database and display by label */
async function loadPage() {
    const labels = await window.electronAPI.getLabels();
    const labelsArray = Array.isArray(labels) ? labels : (labels.data || []);
    const container = document.getElementById('labels');
    container.innerHTML = '';

    await Promise.all(labelsArray.map(async (label) => {
        const events = await window.electronAPI.getEventByLabel(label);
        const eventsArray = Array.isArray(events) ? events : (events.data || []);

        const groupDiv = document.createElement('div');
        groupDiv.className = 'border-container display-group';
        groupDiv.innerHTML = `<h3>${ label.LabelName } </h3>`;

        const eventList = document.createElement('ul');
        eventsArray.forEach(event => {
            const eventItem = document.createElement('li');
            eventItem.className = 'group-item';
            const eventName = document.createTextNode(` ${event.EventName}`);

            eventItem.appendChild(eventName);
            eventList.appendChild(eventItem);
        });
        groupDiv.appendChild(eventList);
        container.appendChild(groupDiv);
    }));
}

/** Handle eventForm submission */
eventForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(eventForm);
    const eventInfo = {
        name: formData.get('event-name'),
        details: formData.get('details'),
        location: formData.get('location'),
        start: formData.get('start'),
        end: formData.get('end'),
        recurrence: formData.get('recurrence'),
        label: formData.get('label')
    };

    const isSuccess = await window.electronAPI.createEvent(eventInfo);
    if (isSuccess) {
        err.style.display = 'none';
        labelForm.reset();
        closeEventDialog();
        loadPage();
    }
    else {
        err.textContent = 'Save failed, please check inputs for errors and try again';
        err.style.display = 'block';
    }
});

/** Open event creation dialog */
async function openEventDialog() {
    document.getElementById('eventDialog').style.display = 'block';
    const labels = await window.electronAPI.getLabels();
    const labelsArray = Array.isArray(labels) ? labels : (labels.data || []);
    const labelsDropdown = document.getElementById('labelSelect');

    labelsArray.forEach(label => {
        const labelOption = document.createElement('option');
        labelOption.value = label.LabelId;
        labelOption.textContent = label.LabelName;
        labelsDropdown.appendChild(labelOption);
    })
}

/** Close event creation dialog */
function closeEventDialog() {
    document.getElementById('eventDialog').style.display = 'none';
}

/** Open label creation dialog */
function openLabelDialog() {
    document.getElementById('labelDialog').style.display = 'block';
}

/** Close label creation dialog */
function closeLabelDialog() {
    document.getElementById('labelDialog').style.display = 'none';
}

/** Handle label form submission */
labelForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(labelForm);
    const labelInfo = {
        name: formData.get('label-name')
    }

    const isSuccess = await window.electronAPI.createLabel(labelInfo);
    if (isSuccess) {
        err.style.display = 'none';
        labelForm.reset();
        closeLabelDialog();
        loadPage();
    }
    else {
        err.textContent = 'Save failed, please check inputs for errors and try again';
        err.style.display = 'block';
    }
})