const eventForm = document.getElementById('event-form');
const eventDialog = document.getElementById('event-dialog');
const eventMenu = document.getElementById('event-menu');
const eventHeaderBar = eventDialog.querySelector('.header-bar');

let currentEventId = null;
let isDraggingEvent = false;
let eventOffsetX = 0;
let eventOffsetY = 0;

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
        <div class="container">
            <div class="d-flex-row space-between">
                <h3>${ label.LabelName }</h3>
                <button class="nobkg-button vellip-btn" title="Label options">⋮</button>
            </div>
        </div>

        <ul class="event-list"></ul>
    `;
    groupDiv.querySelector('.vellip-btn').addEventListener('click', (e) => openLabelMenu(e, label.LabelId));

    const eventList = groupDiv.querySelector('.event-list')
    eventsArray.forEach(event => {
        const li = document.createElement('li');
        li.className = 'group-item';
        li.dataset.eventId = event.EventId;
        li.innerHTML = `
            <div class="item-container">
                <div class="summary">
                    <span class="title">${ event.EventName }</span>
                    <button class="opt-btn" title="Event options">⋮</button>
                </div>

                ${ event.EventDesc ? `<p class="sub-text">${ event.EventDesc }</p>` : '' }
                <p class="fake-btn">&#128338; ${ formatDateTime(event.StartDate) } - ${ formatDateTime(event.EndDate) }</p>
            </div>
        `;

        const title = li.querySelector('.title');
        title.addEventListener('click', () => {
            const isOpen = li.classList.toggle('is-open');
            title.setAttribute('aria-expanded', isOpen.toString());
        });

        li.querySelector('.opt-btn').addEventListener('click', (e) => openEventMenu(e, event.EventId));
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

    var isSuccess = null;
    if (currentEventId == null) {
        isSuccess = await window.electronAPI.createEvent(eventInfo);
    }
    else {
        isSuccess = await window.electronAPI.updateEvent(eventInfo, currentEventId);
    }

    if (isSuccess) {
        eventForm.reset();
        closeEventDialog();
        loadPage();
    }
});

/**
 * Open the event dialog for editing and creation
 */
async function openEventDialog(id = null, labelId = null) {
    const labelsArray = /**@type { Label[] }*/ await window.electronAPI.getLabels() || [];
    const labelsDropdown = document.getElementById('label-select');
    labelsDropdown.innerHTML = '';
    labelsArray.forEach(label => {
        const labelOption = document.createElement('option');
        labelOption.value = label.LabelId;
        labelOption.textContent = label.LabelName;
        labelsDropdown.appendChild(labelOption);
    });

    const name = document.getElementById('event-name');
    const location = document.getElementById('location');
    const start = document.getElementById('start');
    const end = document.getElementById('end');
    const details = document.getElementById('details');
    const label = document.getElementById('label-select');

    if (id != null) {
        const event = /**@type { Event }*/await window.electronAPI.getEventById(id) || null;
        name.value = event.EventName;
        location.value = event.Location;
        start.value = event.StartDate;
        end.value = event.EndDate;
        details.value = event.EventDesc;
        label.value = event.LabelId;
    }
    else {
        name.value = '';
        location.value = '';
        start.value = '';
        end.value = '';

        if (labelId != null) {
            label.value = labelId;
        }
        else {
            label.value = '';
        }
    }

    currentEventId = id;
    eventDialog.show();
}

/**
 * Close event dialog
 */
function closeEventDialog() {
    eventDialog.close();
}

/**
 * Open the event menu options for the selected event. Sets an event listener to check if the user
 * clicks outside the menu area
 */
function openEventMenu(e, eventId) {
    const rect = e.currentTarget.getBoundingClientRect();
    const container = document.getElementById('lists');
    eventMenu.style.top = `${ rect.top }px`;
    eventMenu.style.left = `${ rect.left - 80 }px`;
    eventMenu.style.display = 'block';
    eventMenu.dataset.eventId = eventId;

    setTimeout(() => {
        document.addEventListener('click', eventMenuListener);
    }, 0);
}

/**
 * Handles the event menu event listener to check if a user clicks outside the menu. If they do,
 * hide the menu
 */
function eventMenuListener(event) {
    if (!eventMenu.contains(event.target)) {
        hideEventMenu();
    }
}

/**
 * Hide the event menu
 */
function hideEventMenu() {
    eventMenu.style.display = 'none';
    document.removeEventListener('click', eventMenuListener);
}

/**
 * Open the event dialog for editing and send over the selected event's id
 */
function editEvent() {
    hideEventMenu();
    openEventDialog(eventMenu.dataset.eventId, null);
}

/**
 * Request to delete the selected event from the database
 */
async function deleteEvent() {
    hideEventMenu();
    await window.electronAPI.deleteEvent(eventMenu.dataset.eventId);
    loadPage();
}


eventHeaderBar.addEventListener('mousedown', (e) => {
    if (e.target.classList.contains('close-button')) return;
    
    isDraggingEvent = true;

    const rect = eventDialog.getBoundingClientRect();
    eventOffsetX = e.clientX - rect.left;
    eventOffsetY = e.clientY - rect.top;

    document.addEventListener('mousemove', dragEventDialog);
    document.addEventListener('mouseup', stopDraggingEventDialog);
});

function dragEventDialog(e) {
    if (!isDraggingEvent) return;

    eventDialog.style.left = `${e.clientX - eventOffsetX}px`;
    eventDialog.style.top = `${e.clientY - eventOffsetY}px`;
}

function stopDraggingEventDialog() {
    isDraggingEvent = false;
    document.removeEventListener('mousemove', dragEventDialog);
    document.removeEventListener('mouseup', stopDraggingEventDialog);
}