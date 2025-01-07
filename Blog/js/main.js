const BACKEND_URL = 'https://debuilder.vercel.app';  // Set the backend URL
let currentPage = 1;  // Default to the first page
let searchQuery = '';  // Track the search query
const blogsPerPage = 6;  // Number of blogs per page

// Fetch and display blog posts with pagination and search
async function fetchBlogs(page = 1, search = '') {
    try {
        const response = await fetch(`${BACKEND_URL}/blogs?page=${page}&limit=${blogsPerPage}&search=${search}`);
        const data = await response.json();
        displayBlogs(data.blogs);
        setupPagination(data.totalBlogs, page);  // Set up pagination controls
    } catch (error) {
        console.error('Error fetching blogs:', error);
    }
}

// Display blog posts on the homepage
function displayBlogs(blogs) {
    const blogContainer = document.getElementById('blogPosts');
    blogContainer.innerHTML = blogs.map(blog => `
        <div class="col-md-4">
            <div class="card mb-4">
                <div class="card-body">
                    <h5 class="card-title">${blog.title}</h5>
                    <p class="card-text">${blog.content.substring(0, 100)}...</p>
                    <a href="blog.html?id=${blog.id}" class="btn btn-primary">Read More</a>
                </div>
            </div>
        </div>
    `).join('');
}

// Handle search functionality
function searchBlogs() {
    searchQuery = document.getElementById('searchBar').value.trim();  // Get search input value
    currentPage = 1;  // Reset to the first page when search is triggered
    fetchBlogs(currentPage, searchQuery);  // Fetch blogs based on the search query
}

// Setup pagination controls
function setupPagination(totalBlogs, currentPage) {
    const totalPages = Math.ceil(totalBlogs / blogsPerPage);  // Calculate total pages
    const paginationControls = document.getElementById('paginationControls');
    
    let paginationHTML = '';
    if (currentPage > 1) {
        paginationHTML += `<button class="btn btn-sm btn-secondary" onclick="changePage(${currentPage - 1})">Previous</button>`;
    }
    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `
            <button class="btn btn-sm ${i === currentPage ? 'btn-primary' : 'btn-outline-secondary'}" 
                    onclick="changePage(${i})">${i}</button>
        `;
    }
    if (currentPage < totalPages) {
        paginationHTML += `<button class="btn btn-sm btn-secondary" onclick="changePage(${currentPage + 1})">Next</button>`;
    }

    paginationControls.innerHTML = paginationHTML;  // Update the pagination controls
}

// Handle page change for pagination
function changePage(page) {
    currentPage = page;  // Update current page
    fetchBlogs(currentPage, searchQuery);  // Fetch the blogs for the selected page
}

// Initialize blog fetching on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchBlogs(currentPage);  // Fetch the first page of blogs
});