const Store = require("electron-store").default;
const storage = new Store();

/**
 * Gets the window's starting size. If no stored size preference is found, default is used
 * @returns the size to make the starting window
 */
function getWindowSettings() {
    const default_bounds = [500, 550];
    const size = storage.get("win-size");

    if (size) return size;
    else {
        storage.set("win-size", default_bounds);
        return default_bounds;
    }
}

/** Saves the user's last window size to store user preferences 
 * @param bounds the current bounds of the window after resize
 */
function saveBounds(bounds) {
    storage.set("win-size", bounds);
}

module.exports = {
    getWindowSettings: getWindowSettings,
    saveBounds: saveBounds
}