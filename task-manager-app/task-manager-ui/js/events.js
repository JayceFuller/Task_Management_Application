const eventForm = document.getElementById('event-form');
const eventDialog = document.getElementById('event-dialog');

document.addEventListener('DOMContentLoaded', () => {
    loadPage();
});

/**
 * Load the page contents
 */
async function loadPage() {
    const container = document.getElementById('labels');
    container.innerHTML = '';
    container.className = 'all-groups';

    const labelsArray = /**@type { Label[] }*/ await window.electronAPI.getLabels() || [];
    const labelElements = await Promise.all(labelsArray.map(async (label) => {
        return await createLabelElement(label);
    }));

    labelElements.forEach(el => container.appendChild(el));
}

/**
 * Create a label element to store events in
 * @param {Label} label the label for this grouping
 * @returns the group div to be displayed
 */
async function createLabelElement(label) {
    const eventsArray = /**@type { Event[] }*/ await window.electronAPI.getEventByLabel(label) || [];

    const groupDiv = document.createElement('div');
    groupDiv.className = 'border-container group';
    groupDiv.dataset.labelId = label.LabelId; 
    groupDiv.innerHTML = `
        <h3>${ label.LabelName } </h3>

        <ul class="event-list"></ul>
    `;

    const eventList = groupDiv.querySelector('.event-list')
    eventsArray.forEach(event => {
        const li = document.createElement('li');
        li.className = 'group-item';
        li.dataset.eventId = event.EventId;
        li.innerHTML = `${ event.EventName }`;
        eventList.appendChild(li);
    });
    
    return groupDiv;
}

/** Handle eventForm submission */
eventForm.addEventListener('submit', async (e) => {
    e.preventDefault();
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
        eventForm.reset();
        closeEventDialog();
        loadPage();
    }
});

/**
 * Open the event dialog for editing and creation
 */
async function openEventDialog() {
    const labelsArray = /**@type { Label[] }*/ await window.electronAPI.getLabels() || [];
    const labelsDropdown = document.getElementById('label-select');
    labelsDropdown.innerHTML = '';
    labelsArray.forEach(label => {
        const labelOption = document.createElement('option');
        labelOption.value = label.LabelId;
        labelOption.textContent = label.LabelName;
        labelsDropdown.appendChild(labelOption);
    });

    eventDialog.style.display = 'block';
}

/**
 * Close event dialog
 */
function closeEventDialog() {
    eventDialog.style.display = 'none';
}