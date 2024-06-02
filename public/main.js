document.getElementById('uploadForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const fileInput = document.getElementById('fileInput');
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
    });

    const result = await response.json();
    const messageElement = document.getElementById('message');
    if (response.ok) {
        messageElement.textContent = `File uploaded successfully! Code: ${result.code}`;
    } else {
        messageElement.textContent = `Error: ${result.message}`;
    }
});

document.getElementById('downloadForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const code = document.getElementById('codeInput').value;

    const response = await fetch(`/api/download/${code}`);

    if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = '';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    } else {
        const result = await response.json();
        const messageElement = document.getElementById('message');
        messageElement.textContent = `Error: ${result.message}`;
    }
});