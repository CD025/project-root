let files = [];

function uploadFiles() {
    const input = document.getElementById('fileInput');
    for (const file of input.files) {
        files.push({
            name: file.name,
            type: file.type || 'unknown',
            lastModified: new Date(file.lastModified).toLocaleDateString(),
            size: (file.size / 1024).toFixed(2) + ' KB',
            collaborators: 1
        });
    }
    input.value = '';
    renderTable();
}

function renderTable() {
    const tableBody = document.querySelector('#fileTable tbody');
    tableBody.innerHTML = '';
    files.forEach((file, index) => {
        tableBody.innerHTML += `
            <tr>
                <td><input type="checkbox" data-index="${index}" /></td>
                <td>${file.name}</td>
                <td>${file.type}</td>
                <td>${file.lastModified}</td>
                <td>${file.size}</td>
                <td>
                    <span class="action-btn" onclick="deleteFile(${index})">🗑️</span>
                    <span class="action-btn" onclick="editFile(${index})">✏️</span>
                </td>
                <td>${file.collaborators} Collaborator(s)</td>
            </tr>
        `;
    });
}

function deleteFile(index) {
    files.splice(index, 1);
    renderTable();
}

function deleteSelected() {
    files = files.filter((_, index) => !document.querySelector(`input[data-index="${index}"]`).checked);
    renderTable();
}

function removeAllCollaborators() {
    files.forEach(file => file.collaborators = 0);
    renderTable();
}

function downloadAll() {
    const zip = new JSZip();
    files.forEach(file => {
        zip.file(file.name, `Sample content of ${file.name}`);
    });
    zip.generateAsync({ type: "blob" }).then(content => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(content);
        link.download = "files.zip";
        link.click();
    });
}

function selectAll(checkbox) {
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = checkbox.checked);
}

function editFile(index) {
    const newName = prompt("Enter new file name:", files[index].name);
    if (newName) {
        files[index].name = newName;
        renderTable();
    }
}

function refreshFiles() {
    alert('Files refreshed!');
}

renderTable();
