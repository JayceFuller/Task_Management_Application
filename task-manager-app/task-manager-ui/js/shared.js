/** Format a date to just its time */
function formatTime(dateInput) {
    const date = new Date(dateInput);
  
    const pad = (n) => String(n).padStart(2, '0');
  
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const year = date.getFullYear();
    const hours = date.getHours();
    const hoursFixed = pad(hours % 12 || 12);
    const minutes = pad(date.getMinutes());
    const ampm = hours >= 12 ? 'PM' : 'AM'
  
    return `${ hoursFixed }:${ minutes }${ ampm }`;
}

/** Format a date to condensed date and time */
function formatDateTime(dateInput) {
    const date = new Date(dateInput);
  
    const pad = (n) => String(n).padStart(2, '0');
  
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const year = date.getFullYear();
    const hours = date.getHours();
    const hoursFixed = pad(hours % 12 || 12);
    const minutes = pad(date.getMinutes());
    const ampm = hours >= 12 ? 'PM' : 'AM'
  
    return `${ month }/${ day }/${ year } ${ hoursFixed }:${ minutes }${ ampm }`;
}


/**
 * Request to swap a task's status to complete. If successful, reload the page
 */
function completeTask(task) {
    const success = window.electronAPI.completeTask(task.TaskId);
    if (success) {
        loadPage();
    }
}