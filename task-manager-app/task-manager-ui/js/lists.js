const listForm = document.getElementById('list-form');
const listMenu = document.getElementById('list-menu');
const listDialog = document.getElementById('list-dialog');
const listDialogHeader = listDialog.querySelector('.dialog-header');
const listHeaderBar = listDialog.querySelector('.header-bar');

let currentListId = null;
let isDraggingList = false;
let listOffsetX = 0;
let listOffsetY = 0;

/** 
 * Open list dialog to create or edit a list
 * @param {any} id the id of the current list to edit, or null if it is a new list
 */
async function openListDialog(id = null) {
    const input = document.getElementById('list-name');

    if (id != null) {
        listDialogHeader.textContent = `Edit_List.txt`;
        const list = /**@type { List }*/await window.electronAPI.getListById(id) || null;
        input.value = list.ListName;
    }
    else {
        listDialogHeader.textContent = `New_List.txt`;
        input.value = '';
    }

    currentListId = id;
    listDialog.show();
}

/**
 * Close the list dialog for editing or creation
 */
function closeListDialog() {
    listDialog.close();
}

/**
 * Handle the submission request to edit or create a list
 */
listForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(listForm);
    const listInfo = {
        name: formData.get('list-name'),
    }

    var isSuccess = null;
    if (currentListId == null) {
        isSuccess = await window.electronAPI.createList(listInfo);
    }
    else {
        isSuccess = await window.electronAPI.renameList(listInfo.name, currentListId);
    }
    
    if (isSuccess) {
        currentListId = null;
        listForm.reset();
        closeListDialog();
        loadPage();
    }
});

/** 
 * Open the list menu options for the selected list. Sets an event listener to check if the user
 * clicks outside the menu area
 */
function openListMenu(e, listId) {
    const rect = e.currentTarget.getBoundingClientRect();
    const container = document.getElementById('lists');
    listMenu.style.top = `${ rect.top }px`;
    listMenu.style.left = `${ rect.left - 165 }px`;
    listMenu.style.display = 'block';
    listMenu.dataset.listId = listId;

    setTimeout(() => {
        document.addEventListener('click', listMenuListener);
    }, 0);
}

/**
 * Handles the list menu event listener to check if a user clicks outside the menu. If they do,
 * hide the menu
 */
function listMenuListener(e) {
    if (!listMenu.contains(e.target)) {
        hideListMenu();
    }
}

/**
 * Hides the list menu
 */
function hideListMenu() {
    listMenu.style.display = 'none';
    document.removeEventListener('click', listMenuListener);
}

/**
 * Open the list dialog for editing and send over the selected list's id
 */
function editList() {
    hideListMenu();
    openListDialog(listMenu.dataset.listId);
}

/**
 * Request to delete the selected list from the database
 */
async function deleteList() {
    hideListMenu();
    window.electronAPI.deleteList(listMenu.dataset.listId);
    loadPage();
}

/**
 * Request to delete all completed tasks for the selected list from the database
 */
async function deleteCompleted() {
    hideListMenu();
    window.electronAPI.deleteCompleted(listMenu.dataset.listId);
    loadPage();
}


listHeaderBar.addEventListener('mousedown', (e) => {
    if (e.target.classList.contains('close-button')) return;
    
    isDraggingList = true;

    const rect = listDialog.getBoundingClientRect();
    listOffsetX = e.clientX - rect.left;
    listOffsetY = e.clientY - rect.top;

    document.addEventListener('mousemove', dragListDialog);
    document.addEventListener('mouseup', stopDraggingListDialog);
});

function dragListDialog(e) {
    if (!isDraggingList) return;

    listDialog.style.left = `${e.clientX - listOffsetX}px`;
    listDialog.style.top = `${e.clientY - listOffsetY}px`;
}

function stopDraggingListDialog() {
    isDraggingList = false;
    document.removeEventListener('mousemove', dragListDialog);
    document.removeEventListener('mouseup', stopDraggingListDialog);
}