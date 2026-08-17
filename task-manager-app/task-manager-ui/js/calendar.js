const calendarForm = document.getElementById('calendar-form');
const calendarDialog = document.getElementById('calendar-dialog');
const calendarDialogHeader = calendarDialog.querySelector('.dialog-header');
const calendarMenu = document.getElementById('calendar-menu');
const calendarHeaderBar = calendarDialog.querySelector('.header-bar');

let currentCalendarId = null;
let isDraggingCalendar = false;
let calendarOffsetX = 0;
let calendarOffsetY = 0;

/** 
 * Open calendar dialog to create or edit a calendar
 * @param {any} id the id of the current calendar to edit, or null if it is a new calendar
 */
async function openCalendarDialog(id = null) {
    const input = document.getElementById('calendar-name');

    if (id != null) {
        calendarDialogHeader.textContent = `Edit_Calendar.txt`;
        const calendar = /**@type { Calendar }*/await window.electronAPI.getCalendarById(id) || null;
        input.value = calendar.CalendarName;
    }
    else {
        calendarDialogHeader.textContent = `New_Calendar.txt`;
        input.value = '';
    }

    currentCalendarId = id;
    calendarDialog.show();
}

/**
 * Close the calendar dialog for editing or creation
 */
function closeCalendarDialog() {
    calendarDialog.close();
}

/**
 * Handle the submission request to edit or create a calendar
 */
calendarForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(calendarForm);
    const calendarInfo = {
        name: formData.get('calendar-name'),
    }

    var isSuccess = null;
    if (currentCalendarId == null) {
        isSuccess = await window.electronAPI.createCalendar(calendarInfo);
    }
    else {
        isSuccess = await window.electronAPI.renameCalendar(calendarInfo.name, currentCalendarId);
    }
    
    if (isSuccess) {
        currentCalendarId = null;
        calendarForm.reset();
        closeCalendarDialog();
        loadPage();
    }
});

/** 
 * Open the calendar menu options for the selected calendar. Sets an event listener to check if the user
 * clicks outside the menu area
 */
function openCalendarMenu(e, calendarId) {
    const rect = e.currentTarget.getBoundingClientRect();
    const container = document.getElementById('calendars');
    calendarMenu.style.top = `${ rect.top }px`;
    calendarMenu.style.left = `${ rect.left - 165 }px`;
    calendarMenu.style.display = 'block';
    calendarMenu.dataset.CalendarId = calendarId;

    setTimeout(() => {
        document.addEventListener('click', calendarMenuListener);
    }, 0);
}

/**
 * Handles the calendar menu event listener to check if a user clicks outside the menu. If they do,
 * hide the menu
 */
function calendarMenuListener(e) {
    if (!calendarMenu.contains(e.target)) {
        hideCalendarMenu();
    }
}

/**
 * Hides the calendar menu
 */
function hideCalendarMenu() {
    calendarMenu.style.display = 'none';
    document.removeEventListener('click', calendarMenuListener);
}

/**
 * Open the calendar dialog for editing and send over the selected calendar's id
 */
function editCalendar() {
    hideCalendarMenu();
    openCalendarDialog(calendarMenu.dataset.CalendarId);
}

/**
 * Request to delete the selected calendar from the database
 */
function deleteCalendar() {
    hideCalendarMenu();
    window.electronAPI.deleteCalendar(calendarMenu.dataset.CalendarId);
    loadPage();
}

calendarHeaderBar.addEventListener('mousedown', (e) => {
    if (e.target.classList.contains('close-button')) return;
    
    isDraggingCalendar = true;

    const rect = calendarDialog.getBoundingClientRect();
    calendarOffsetX = e.clientX - rect.left;
    calendarOffsetY = e.clientY - rect.top;

    document.addEventListener('mousemove', dragCalendarDialog);
    document.addEventListener('mouseup', stopDraggingCalendarDialog);
});

function dragCalendarDialog(e) {
    if (!isDraggingCalendar) return;

    calendarDialog.style.left = `${e.clientX - calendarOffsetX}px`;
    calendarDialog.style.top = `${e.clientY - calendarOffsetY}px`;
}

function stopDraggingCalendarDialog() {
    isDraggingCalendar = false;
    document.removeEventListener('mousemove', dragCalendarDialog);
    document.removeEventListener('mouseup', stopDraggingCalendarDialog);
}