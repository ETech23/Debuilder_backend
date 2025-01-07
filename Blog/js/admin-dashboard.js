const BACKEND_URL = 'http://localhost:3000';  // Set the backend URL

// Handle Blog Upload Form Submission
document.getElementById('uploadBlogForm').addEventListener('submit', async (e) => {
    e.preventDefault();  // Prevent default form submission

    // Get form input values
    const title = document.getElementById('title').value.trim();
    const content = tinymce.get('content').getContent();  // Get the content from TinyMCE editor
    const imageFile = document.getElementById('image').files[0];  // Get the uploaded image file

    if (!title || !content) {
        alert('Please fill in all fields.');
        return;
    }

    // Prepare the form data to include the image file
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (imageFile) {
        formData.append('image', imageFile);  // Append the image file to the form data
    }

    // Send the blog data to the backend API
    try {
        const response = await fetch(`${BACKEND_URL}/blogs`, {
            method: 'POST',
            body: formData,  // Send the form data as multipart/form-data
        });

        const data = await response.json();
        if (response.ok) {
            document.getElementById('message').innerHTML = `<div class="alert alert-success">Blog successfully uploaded!</div>`;
            // Optionally, reset the form
            document.getElementById('uploadBlogForm').reset();
            tinymce.get('content').setContent('');  // Reset TinyMCE content
        } else {
            document.getElementById('message').innerHTML = `<div class="alert alert-danger">${data.message || 'Error uploading blog'}</div>`;
        }
    } catch (error) {
        console.error('Error uploading blog:', error);
        document.getElementById('message').innerHTML = `<div class="alert alert-danger">An error occurred. Please try again later.</div>`;
    }
});
