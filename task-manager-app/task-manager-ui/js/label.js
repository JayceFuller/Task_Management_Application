const labelForm = document.getElementById('label-form');
const labelDialog = document.getElementById('label-dialog');
const labelMenu = document.getElementById('label-menu');
const labelHeaderBar = labelDialog.querySelector('.header-bar');

let currentLabelId = null;
let isDraggingLabel = false;
let labelOffsetX = 0;
let labelOffsetY = 0;

/** 
 * Open label dialog to create or edit a label
 * @param {any} id the id of the current label to edit, or null if it is a new label
 */
async function openLabelDialog(id = null) {
    const input = document.getElementById('label-name');

    if (id != null) {
        const label = /**@type { label }*/await window.electronAPI.getLabelById(id) || null;
        input.value = label.LabelName;
    }
    else {
        input.value = '';
    }

    currentLabelId = id;
    labelDialog.show();
}

/**
 * Close the label dialog for editing or creation
 */
function closeLabelDialog() {
    labelDialog.close();
}

/**
 * Handle the submission request to edit or create a label
 */
labelForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(labelForm);
    const labelInfo = {
        name: formData.get('label-name'),
    }

    var isSuccess = null;
    if (currentLabelId == null) {
        isSuccess = await window.electronAPI.createLabel(labelInfo);
    }
    else {
        isSuccess = await window.electronAPI.renameLabel(labelInfo.name, currentLabelId);
    }
    
    if (isSuccess) {
        currentLabelId = null;
        labelForm.reset();
        closeLabelDialog();
        loadPage();
    }
});

/** 
 * Open the label menu options for the selected label. Sets an event listener to check if the user
 * clicks outside the menu area
 */
function openLabelMenu(e, labelId) {
    const rect = e.currentTarget.getBoundingClientRect();
    const container = document.getElementById('labels');
    labelMenu.style.top = `${ rect.top }px`;
    labelMenu.style.left = `${ rect.left - 165 }px`;
    labelMenu.style.display = 'block';
    labelMenu.dataset.labelId = labelId;

    setTimeout(() => {
        document.addEventListener('click', labelMenuListener);
    }, 0);
}

/**
 * Handles the label menu event listener to check if a user clicks outside the menu. If they do,
 * hide the menu
 */
function labelMenuListener(e) {
    if (!labelMenu.contains(e.target)) {
        hideLabelMenu();
    }
}

/**
 * Hides the label menu
 */
function hideLabelMenu() {
    labelMenu.style.display = 'none';
    document.removeEventListener('click', labelMenuListener);
}

/**
 * Open the label dialog for editing and send over the selected label's id
 */
function editLabel() {
    hideLabelMenu();
    openLabelDialog(labelMenu.dataset.labelId);
}

/**
 * Request to delete the selected label from the database
 */
function deleteLabel() {
    hideLabelMenu();
    window.electronAPI.deleteLabel(labelMenu.dataset.labelId);
}

labelHeaderBar.addEventListener('mousedown', (e) => {
    if (e.target.classList.contains('close-button')) return;
    
    isDraggingLabel = true;

    const rect = labelDialog.getBoundingClientRect();
    labelOffsetX = e.clientX - rect.left;
    labelOffsetY = e.clientY - rect.top;

    document.addEventListener('mousemove', dragLabelDialog);
    document.addEventListener('mouseup', stopDraggingLabelDialog);
});

function dragLabelDialog(e) {
    if (!isDraggingLabel) return;

    labelDialog.style.left = `${e.clientX - labelOffsetX}px`;
    labelDialog.style.top = `${e.clientY - labelOffsetY}px`;
}

function stopDraggingLabelDialog() {
    isDraggingLabel = false;
    document.removeEventListener('mousemove', dragLabelDialog);
    document.removeEventListener('mouseup', stopDraggingLabelDialog);
}