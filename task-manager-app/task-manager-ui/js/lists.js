const listForm = document.getElementById('listForm');

/** Open list creation dialog */
function openListDialog() {
    document.getElementById('listDialog').style.display = 'block';
}

/** Close list creation dialog */
function closeListDialog() {
    document.getElementById('listDialog').style.display = 'none';
}

/** Handle listForm submission */
listForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(listForm);
    const listInfo = {
        name: formData.get('list-name'),
    }

    const isSuccess = await window.electronAPI.createList(listInfo);
    if (isSuccess) {
        err.style.display = 'none';
        listForm.reset();
        closeListDialog();
        loadPage();
    }
    else {
        err.textContent = 'Save failed, please check inputs for errors and try again';
        err.style.display = 'block';
    }
})

/** Handles list renaming ability */
function editList() {
    console.log(menu.dataset.listId);
    hideMenu();
}

/** Requests to delete a list from the database */
function deleteList() {
    window.electronAPI.deleteList(menu.dataset.listId);
    hideMenu();
}

/** Requests to delete all completed tasks for a list from the database */
function deleteCompleted() {
    window.electronAPI.deleteCompleted(menu.dataset.listId);
    hideMenu();
}