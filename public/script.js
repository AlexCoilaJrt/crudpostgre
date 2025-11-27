const productForm = document.getElementById('productForm');
const productList = document.getElementById('productList');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const productIdInput = document.getElementById('productId');
const formTitle = document.querySelector('.form-section h2');

let isEditing = false;

// Fetch and display products
async function fetchProducts() {
    try {
        const response = await fetch('/products');
        if (!response.ok) throw new Error('Failed to fetch products');

        const products = await response.json();
        renderProducts(products);
    } catch (error) {
        console.error('Error:', error);
        productList.innerHTML = `<div class="empty-state">
            <p>Could not load products. Make sure the database is connected.</p>
        </div>`;
    }
}

// Render products to the DOM
function renderProducts(products) {
    if (products.length === 0) {
        productList.innerHTML = `<div class="empty-state">
            <p>No products found. Add one above!</p>
        </div>`;
        return;
    }

    productList.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-info">
                <h3>${escapeHtml(product.name)}</h3>
                <div class="price">$${parseFloat(product.price).toFixed(2)}</div>
            </div>
            <div class="card-actions">
                <button onclick="editProduct(${product.id}, '${escapeHtml(product.name)}', ${product.price})" class="edit-btn">Edit</button>
                <button onclick="deleteProduct(${product.id})" class="delete-btn">Delete</button>
            </div>
        </div>
    `).join('');
}

// Add or Update product
productForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(productForm);
    const product = {
        name: formData.get('name'),
        price: parseFloat(formData.get('price'))
    };

    const url = isEditing ? `/products/${productIdInput.value}` : '/products';
    const method = isEditing ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product)
        });

        if (!response.ok) throw new Error(`Failed to ${isEditing ? 'update' : 'create'} product`);

        resetForm();
        fetchProducts(); // Refresh list
    } catch (error) {
        console.error('Error:', error);
        alert(`Failed to ${isEditing ? 'update' : 'add'} product`);
    }
});

// Edit product mode
window.editProduct = (id, name, price) => {
    isEditing = true;
    productIdInput.value = id;
    document.getElementById('name').value = name;
    document.getElementById('price').value = price;

    submitBtn.textContent = 'Update Product';
    formTitle.textContent = 'Edit Product';
    cancelBtn.style.display = 'block';

    // Scroll to form
    document.querySelector('.container').scrollIntoView({ behavior: 'smooth' });
};

// Cancel edit
cancelBtn.addEventListener('click', resetForm);

function resetForm() {
    isEditing = false;
    productForm.reset();
    productIdInput.value = '';
    submitBtn.textContent = 'Add Product';
    formTitle.textContent = 'Add New Product';
    cancelBtn.style.display = 'none';
}

// Delete product
window.deleteProduct = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
        const response = await fetch(`/products/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to delete product');

        fetchProducts(); // Refresh list

        // If we were editing this product, reset the form
        if (isEditing && productIdInput.value == id) {
            resetForm();
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to delete product');
    }
};

// Utility to prevent XSS
function escapeHtml(unsafe) {
    if (typeof unsafe !== 'string') return unsafe;
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Initial load
fetchProducts();
