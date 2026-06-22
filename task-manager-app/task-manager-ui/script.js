/**
 * Retrieves the current date to display on the page. Format is "Month Day, Year"
 */
function getDateDisplay() {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 
                        'October', 'November', 'December']
    const date = new Date();
    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    document.getElementById('calendar').textContent = month + " " + day + ", " + year;
}

getDateDisplay();