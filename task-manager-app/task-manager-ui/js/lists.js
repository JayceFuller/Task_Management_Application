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