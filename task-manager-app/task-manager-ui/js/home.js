/**
 * Retrieves the current date to display on the page. Format is "Month Day, Year"
 */
function getDateDisplay() {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 
                        'October', 'November', 'December']
    const weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const date = new Date();
    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    const weekday = weekdayNames[date.getDay()];

    document.getElementById('date').textContent = weekday + " " + month + " " + day + ", " + year;
}

getDateDisplay();

/** Opens the week view page */
function openWeekView() {
    window.location.href = "week-view.html";
}