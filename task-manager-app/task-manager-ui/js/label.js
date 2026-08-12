const labelForm = document.getElementById('label-form');
const labelDialog = document.getElementById('label-dialog');
let currentLabelId = null;

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
    labelDialog.style.display = 'block';
}

/**
 * Close the label dialog for editing or creation
 */
function closeLabelDialog() {
    labelDialog.style.display = 'none';
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
 * Open the label menu options for the selected label. Sets an event labelener to check if the user
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
        document.addEventlabelener('click', labelMenuListener);
    }, 0);
}

/**
 * Handles the label menu event labelener to check if a user clicks outside the menu. If they do,
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

/**
 * Request to delete all completed tasks for the selected label from the database
 */
function deleteCompleted() {
    hideLabelMenu();
    window.electronAPI.deleteCompleted(labelMenu.dataset.labelId);
}