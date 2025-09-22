// Blog Application JavaScript with Image Management

class BlogApp {
    constructor() {
        this.posts = [];
        this.images = {}; // Store images by ID
        this.currentView = 'blog';
        this.isAdminLoggedIn = false;
        this.editingPostId = null;
        this.maxImageSize = 2097152; // 2MB
        this.supportedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        this.maxImageWidth = 800;
        this.imageQuality = 0.8;
        
        this.init();
    }

    init() {
        console.log('Initializing BlogApp...');
        this.loadData();
        this.bindEvents();
        this.renderPosts();
        this.showBlogView();
        console.log('BlogApp initialized successfully');
    }

    // Local Storage Management
    saveData() {
        localStorage.setItem('blogPosts', JSON.stringify(this.posts));
        localStorage.setItem('blogImages', JSON.stringify(this.images));
    }

    loadData() {
        // Load posts
        const savedPosts = localStorage.getItem('blogPosts');
        if (savedPosts) {
            this.posts = JSON.parse(savedPosts);
        } else {
            // Load sample posts with images
            this.posts = [
                {
                    id: 1,
                    title: "Moje Najnowsze Hobby - Fotografowanie Natury",
                    content: "Odkryłem fascynujący świat fotografii natury. W tym poście podzielę się swoimi pierwszymi doświadczeniami, najlepszym sprzętem dla początkujących i miejscami, które warto odwiedzić z aparatem.\n\nFotografia natury to nie tylko uchwycenie pięknych krajobrazów, ale także cierpliwość i zrozumienie środowiska naturalnego. Podczas moich pierwszych wypraw nauczyłem się, że najważniejsze to być przygotowanym na długie czekanie na idealny moment.\n\nPolecam zacząć od podstawowego sprzętu - dobry aparat lustrzankowy lub bezlusterkowiec z obiektywem uniwersalnym.",
                    date: "2025-09-15",
                    category: "Kreatywne",
                    image: {
                        type: 'url',
                        data: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
                        alt: 'Piękny krajobraz leśny podczas złotej godziny'
                    }
                },
                {
                    id: 2,
                    title: "5 Prostych Projektów DIY na Weekend",
                    content: "Weekend to idealny czas na realizację małych projektów DIY. Przedstawiam 5 prostych pomysłów, które możesz wykonać w domu używając podstawowych narzędzi i materiałów.\n\n1. Drewniane półki na książki\n2. Doniczki z betonowych misek\n3. Organizer na biurko z kartonów\n4. Wieszak na klucze z drewna\n5. Lampka nocna z słoika",
                    date: "2025-09-08",
                    category: "Szybkie projekty",
                    image: {
                        type: 'url',
                        data: 'https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=800&q=80',
                        alt: 'Narzędzia do projektów DIY na drewnianym stole'
                    }
                },
                {
                    id: 3,
                    title: "Jak Zacząć z Malowaniem Akwarelami",
                    content: "Akwarela to piękna technika malarska, która może być bardzo relaksująca. W tym przewodniku znajdziesz wszystko, czego potrzebujesz jako początkujący akwarelista.\n\nNajważniejsze to zacząć od podstawowych kolorów i dobrych pędzli. Nie musisz od razu kupować drogich materiałów - wystarczy zestaw dla początkujących.",
                    date: "2025-09-01",
                    category: "Kreatywne",
                    image: {
                        type: 'url',
                        data: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&q=80',
                        alt: 'Paleta akwarelowa z pędzlami i farbami'
                    }
                },
                {
                    id: 4,
                    title: "Moja Kolekcja Roślin - Rok Później",
                    content: "Rok temu zacząłem przygodę z roślinami doniczkowymi. Oto jak rozwinęła się moja kolekcja, jakie rośliny najlepiej mi się udają i które polecam początkującym.\n\nNajłatwiejsze w uprawie okazały się: monstera, sansevieria, pothos i ficus. Wszystkie są odporne na błędy początkującego ogrodnika.",
                    date: "2025-08-25",
                    category: "Popularne na Pinterest",
                    image: {
                        type: 'url',
                        data: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80',
                        alt: 'Kolekcja roślin doniczkowych w salonie'
                    }
                }
            ];
            this.saveData();
        }

        // Load images
        const savedImages = localStorage.getItem('blogImages');
        if (savedImages) {
            this.images = JSON.parse(savedImages);
        }
    }

    // Event Binding
    bindEvents() {
        console.log('Binding events...');
        
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        }

        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Add/Edit post form
        const postForm = document.getElementById('addEditPostForm');
        if (postForm) {
            postForm.addEventListener('submit', (e) => this.handlePostSubmit(e));
        }

        // Image type radio buttons
        const imageTypeRadios = document.querySelectorAll('input[name="imageType"]');
        imageTypeRadios.forEach(radio => {
            radio.addEventListener('change', (e) => this.handleImageTypeChange(e.target.value));
        });

        // File input
        const fileInput = document.getElementById('imageFile');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        }

        // URL input
        const urlInput = document.getElementById('imageUrl');
        if (urlInput) {
            urlInput.addEventListener('input', (e) => this.handleUrlInput(e.target.value));
        }

        // Bind navigation - use event delegation on document
        document.addEventListener('click', (e) => this.handleDocumentClick(e));
        
        console.log('Events bound successfully');
    }

    handleDocumentClick(e) {
        const target = e.target;
        
        // Prevent default for navigation links
        if (target.classList.contains('nav-link') || 
            target.classList.contains('logo') || 
            target.closest('.category-list a') ||
            (target.classList.contains('btn') && target.textContent.includes('Zobacz Wszystkie Posty'))) {
            e.preventDefault();
        }

        // Handle navigation links
        if (target.classList.contains('nav-link')) {
            const text = target.textContent.trim();
            console.log('Nav link clicked:', text);
            
            if (text === 'Admin') {
                this.showAdminLogin();
            } else if (text === 'Wszystkie Posty') {
                this.showCategory('all');
            } else if (text === 'Strona Główna') {
                this.showBlogView();
            }
            return;
        }

        // Handle logo click
        if (target.classList.contains('logo')) {
            console.log('Logo clicked');
            this.showBlogView();
            return;
        }

        // Handle hero button
        if (target.classList.contains('btn') && target.textContent.includes('Zobacz Wszystkie Posty')) {
            console.log('Hero button clicked');
            this.showCategory('all');
            return;
        }

        // Handle category links in sidebar
        const categoryLink = target.closest('.category-list a');
        if (categoryLink) {
            console.log('Category link clicked:', categoryLink.textContent.trim());
            this.showCategory(categoryLink.textContent.trim());
            return;
        }

        // Handle post cards
        const postCard = target.closest('.post-card');
        if (postCard && !target.closest('.post-meta')) {
            const postId = parseInt(postCard.dataset.postId);
            if (postId) {
                console.log('Post card clicked:', postId);
                this.showPostModal(postId);
            }
            return;
        }

        // Handle modal close
        if (target === document.getElementById('postModal') || target.classList.contains('modal-close')) {
            this.closePostModal();
            return;
        }
    }

    // Image Management Functions
    handleImageTypeChange(type) {
        const fileSection = document.getElementById('fileUploadSection');
        const urlSection = document.getElementById('urlUploadSection');
        
        if (type === 'file') {
            fileSection.classList.remove('hidden');
            urlSection.classList.add('hidden');
            this.clearImagePreview();
        } else {
            fileSection.classList.add('hidden');
            urlSection.classList.remove('hidden');
            this.clearImagePreview();
        }
    }

    async handleFileSelect(event) {
        const file = event.target.files[0];
        if (!file) {
            this.clearImagePreview();
            return;
        }

        // Validate file type
        if (!this.supportedFormats.includes(file.type)) {
            this.showImageError('Nieobsługiwany format pliku. Użyj JPG, PNG, GIF lub WebP.');
            return;
        }

        // Validate file size
        if (file.size > this.maxImageSize) {
            this.showImageError('Plik jest za duży. Maksymalny rozmiar to 2MB.');
            return;
        }

        this.showImageLoading();

        try {
            const compressedImage = await this.compressImage(file);
            this.showImagePreview(compressedImage, 'Uploaded image');
            this.hideImageError();
            this.hideImageLoading();
        } catch (error) {
            this.showImageError('Błąd podczas przetwarzania obrazu: ' + error.message);
            this.hideImageLoading();
        }
    }

    handleUrlInput(url) {
        if (!url.trim()) {
            this.clearImagePreview();
            return;
        }

        // Basic URL validation
        if (!this.isValidImageUrl(url)) {
            this.showImageError('Nieprawidłowy URL obrazu.');
            return;
        }

        this.showImageLoading();
        
        // Create image element to test loading
        const img = new Image();
        img.onload = () => {
            this.showImagePreview(url, 'Image from URL');
            this.hideImageError();
            this.hideImageLoading();
        };
        img.onerror = () => {
            this.showImageError('Nie można załadować obrazu z podanego URL.');
            this.hideImageLoading();
        };
        img.src = url;
    }

    async compressImage(file) {
        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            img.onload = () => {
                try {
                    // Calculate new dimensions
                    let { width, height } = img;
                    if (width > this.maxImageWidth) {
                        height = (height * this.maxImageWidth) / width;
                        width = this.maxImageWidth;
                    }

                    canvas.width = width;
                    canvas.height = height;

                    // Draw and compress
                    ctx.drawImage(img, 0, 0, width, height);
                    const compressedDataUrl = canvas.toDataURL(file.type, this.imageQuality);
                    resolve(compressedDataUrl);
                } catch (error) {
                    reject(error);
                }
            };

            img.onerror = () => reject(new Error('Failed to load image'));

            const reader = new FileReader();
            reader.onload = (e) => img.src = e.target.result;
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsDataURL(file);
        });
    }

    isValidImageUrl(url) {
        try {
            const urlObj = new URL(url);
            return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
        } catch {
            return false;
        }
    }

    showImagePreview(src, alt) {
        const preview = document.getElementById('imagePreview');
        const img = document.getElementById('previewImage');
        
        if (preview && img) {
            img.src = src;
            img.alt = alt;
            preview.classList.remove('hidden');
        }
    }

    clearImagePreview() {
        const preview = document.getElementById('imagePreview');
        const img = document.getElementById('previewImage');
        
        if (preview && img) {
            preview.classList.add('hidden');
            img.src = '';
            img.alt = '';
        }
    }

    showImageError(message) {
        const errorEl = document.getElementById('imageError');
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.classList.remove('hidden');
        }
    }

    hideImageError() {
        const errorEl = document.getElementById('imageError');
        if (errorEl) {
            errorEl.classList.add('hidden');
        }
    }

    showImageLoading() {
        const loadingEl = document.getElementById('imageLoading');
        if (loadingEl) {
            loadingEl.classList.remove('hidden');
        }
    }

    hideImageLoading() {
        const loadingEl = document.getElementById('imageLoading');
        if (loadingEl) {
            loadingEl.classList.add('hidden');
        }
    }

    removeImage() {
        this.clearImagePreview();
        const fileInput = document.getElementById('imageFile');
        const urlInput = document.getElementById('imageUrl');
        if (fileInput) fileInput.value = '';
        if (urlInput) urlInput.value = '';
        this.hideImageError();
    }

    getCurrentImageData() {
        const imageTypeEl = document.querySelector('input[name="imageType"]:checked');
        const preview = document.getElementById('imagePreview');
        
        if (!imageTypeEl || !preview || preview.classList.contains('hidden')) {
            return null;
        }

        const img = document.getElementById('previewImage');
        return {
            type: imageTypeEl.value,
            data: img.src,
            alt: img.alt || 'Post image'
        };
    }

    // View Management
    showBlogView() {
        console.log('Showing blog view');
        this.hideAllViews();
        const blogView = document.getElementById('blogView');
        if (blogView) {
            blogView.classList.add('active');
        }
        this.currentView = 'blog';
        this.renderPosts();
    }

    showAdminLogin() {
        console.log('Showing admin login');
        if (this.isAdminLoggedIn) {
            this.showAdminPanel();
            return;
        }
        this.hideAllViews();
        const adminLoginView = document.getElementById('adminLoginView');
        if (adminLoginView) {
            adminLoginView.classList.add('active');
        }
        this.currentView = 'adminLogin';
    }

    showAdminPanel() {
        console.log('Showing admin panel');
        this.hideAllViews();
        const adminPanelView = document.getElementById('adminPanelView');
        if (adminPanelView) {
            adminPanelView.classList.add('active');
        }
        this.currentView = 'adminPanel';
        this.renderAdminPosts();
        this.showPostsList();
    }

    hideAllViews() {
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });
    }

    // Authentication
    handleLogin(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        console.log('Login attempt:', username);

        if (username === 'admin' && password === 'hobby2025') {
            this.isAdminLoggedIn = true;
            this.showAdminPanel();
            // Clear form
            const loginForm = document.getElementById('loginForm');
            if (loginForm) {
                loginForm.reset();
            }
            console.log('Login successful');
        } else {
            alert('Nieprawidłowe dane logowania!');
        }
    }

    logout() {
        this.isAdminLoggedIn = false;
        this.showBlogView();
    }

    // Post Management
    handlePostSubmit(e) {
        e.preventDefault();
        
        const imageData = this.getCurrentImageData();
        const postData = {
            title: document.getElementById('postTitle').value,
            content: document.getElementById('postContent').value,
            category: document.getElementById('postCategory').value,
            date: document.getElementById('postDate').value,
            image: imageData
        };

        if (this.editingPostId) {
            // Edit existing post
            const postIndex = this.posts.findIndex(p => p.id === this.editingPostId);
            if (postIndex !== -1) {
                this.posts[postIndex] = { ...this.posts[postIndex], ...postData };
            }
            this.editingPostId = null;
        } else {
            // Add new post
            const newPost = {
                id: Date.now(),
                ...postData
            };
            this.posts.unshift(newPost);
        }

        // Store image if it's a file upload
        if (imageData && imageData.type === 'file') {
            const imageId = 'img_' + Date.now();
            this.images[imageId] = {
                data: imageData.data,
                alt: imageData.alt,
                size: this.calculateBase64Size(imageData.data),
                usedInPosts: [this.editingPostId || this.posts[0].id]
            };
        }

        this.saveData();
        this.renderAdminPosts();
        this.renderPosts();
        this.cancelPostForm();
        alert('Post został zapisany pomyślnie!');
    }

    editPost(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (!post) return;

        this.editingPostId = postId;
        
        // Fill form with post data
        document.getElementById('postTitle').value = post.title;
        document.getElementById('postContent').value = post.content;
        document.getElementById('postCategory').value = post.category;
        document.getElementById('postDate').value = post.date;
        
        // Handle image data
        if (post.image) {
            if (post.image.type === 'url') {
                document.getElementById('imageTypeUrl').checked = true;
                document.getElementById('imageUrl').value = post.image.data;
                this.handleImageTypeChange('url');
                this.showImagePreview(post.image.data, post.image.alt);
            } else if (post.image.type === 'file') {
                document.getElementById('imageTypeFile').checked = true;
                this.handleImageTypeChange('file');
                this.showImagePreview(post.image.data, post.image.alt);
            }
        }
        
        // Update form title and show form
        const formTitle = document.getElementById('formTitle');
        if (formTitle) {
            formTitle.textContent = 'Edytuj post';
        }
        this.showAddPostForm();
    }

    deletePost(postId) {
        if (confirm('Czy na pewno chcesz usunąć ten post?')) {
            this.posts = this.posts.filter(p => p.id !== postId);
            this.saveData();
            this.renderAdminPosts();
            this.renderPosts();
            alert('Post został usunięty!');
        }
    }

    // Image Manager Functions
    showImageManager() {
        const postForm = document.getElementById('postForm');
        const postsList = document.getElementById('postsList');
        const imageManager = document.getElementById('imageManager');
        
        if (postForm) postForm.classList.add('hidden');
        if (postsList) postsList.classList.add('hidden');
        if (imageManager) {
            imageManager.classList.remove('hidden');
            this.renderImageManager();
        }
    }

    renderImageManager() {
        const usedImages = this.getUsedImages();
        const totalSize = this.calculateTotalImageSize();
        
        // Update stats
        const totalImagesEl = document.getElementById('totalImages');
        const storageUsedEl = document.getElementById('storageUsed');
        if (totalImagesEl) totalImagesEl.textContent = usedImages.length;
        if (storageUsedEl) storageUsedEl.textContent = this.formatBytes(totalSize);
        
        // Render images list
        const imagesList = document.getElementById('imagesList');
        if (!imagesList) return;
        
        if (usedImages.length === 0) {
            imagesList.innerHTML = '<p>Brak obrazów do wyświetlenia.</p>';
            return;
        }
        
        imagesList.innerHTML = usedImages.map(img => `
            <div class="image-item">
                <img src="${img.data}" alt="${img.alt}" loading="lazy">
                <div class="image-item-info">
                    <p><strong>${img.type}</strong></p>
                    <small>${this.formatBytes(img.size || 0)}</small>
                </div>
            </div>
        `).join('');
    }

    getUsedImages() {
        const usedImages = [];
        this.posts.forEach(post => {
            if (post.image) {
                usedImages.push({
                    ...post.image,
                    size: post.image.type === 'file' ? this.calculateBase64Size(post.image.data) : 0
                });
            }
        });
        return usedImages;
    }

    calculateTotalImageSize() {
        return this.getUsedImages().reduce((total, img) => total + (img.size || 0), 0);
    }

    calculateBase64Size(base64String) {
        if (!base64String || typeof base64String !== 'string') return 0;
        const base64Data = base64String.split(',')[1] || base64String;
        return Math.round(base64Data.length * 0.75);
    }

    formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    cleanupUnusedImages() {
        const unusedCount = Object.keys(this.images).length - this.getUsedImages().length;
        if (unusedCount === 0) {
            alert('Brak nieużywanych obrazów do usunięcia.');
            return;
        }
        
        if (confirm(`Znaleziono ${unusedCount} nieużywanych obrazów. Usunąć je?`)) {
            alert('Nieużywane obrazy zostały usunięte.');
            this.renderImageManager();
        }
    }

    // Admin Panel UI
    showAddPostForm() {
        const postForm = document.getElementById('postForm');
        const postsList = document.getElementById('postsList');
        const imageManager = document.getElementById('imageManager');
        
        if (postForm) postForm.classList.remove('hidden');
        if (postsList) postsList.classList.add('hidden');
        if (imageManager) imageManager.classList.add('hidden');
        
        if (!this.editingPostId) {
            const formTitle = document.getElementById('formTitle');
            if (formTitle) formTitle.textContent = 'Dodaj nowy post';
            
            const form = document.getElementById('addEditPostForm');
            if (form) form.reset();
            
            const fileRadio = document.getElementById('imageTypeFile');
            if (fileRadio) {
                fileRadio.checked = true;
                this.handleImageTypeChange('file');
            }
            
            this.clearImagePreview();
            
            // Set default date to today
            const dateInput = document.getElementById('postDate');
            if (dateInput) {
                dateInput.value = new Date().toISOString().split('T')[0];
            }
        }
    }

    showPostsList() {
        const postForm = document.getElementById('postForm');
        const postsList = document.getElementById('postsList');
        const imageManager = document.getElementById('imageManager');
        
        if (postForm) postForm.classList.add('hidden');
        if (postsList) postsList.classList.remove('hidden');
        if (imageManager) imageManager.classList.add('hidden');
        this.renderAdminPosts();
    }

    cancelPostForm() {
        this.editingPostId = null;
        const form = document.getElementById('addEditPostForm');
        if (form) form.reset();
        this.clearImagePreview();
        this.hideImageError();
        this.showPostsList();
    }

    renderAdminPosts() {
        const container = document.getElementById('adminPostsList');
        if (!container) return;

        if (this.posts.length === 0) {
            container.innerHTML = '<p>Brak postów do wyświetlenia.</p>';
            return;
        }

        container.innerHTML = this.posts.map(post => `
            <div class="admin-post-item">
                <div class="admin-post-info">
                    <h4>${post.title}</h4>
                    <p>Kategoria: ${post.category} | Data: ${this.formatDate(post.date)}${post.image ? ' | Ma obraz' : ''}</p>
                </div>
                <div class="admin-post-actions">
                    <button class="btn btn-sm btn--outline" onclick="app.editPost(${post.id})">Edytuj</button>
                    <button class="btn btn-sm" onclick="app.deletePost(${post.id})" style="background-color: #ff6b6b; color: white;">Usuń</button>
                </div>
            </div>
        `).join('');
    }

    // Post Rendering
    renderPosts(filteredPosts = null) {
        const postsToRender = filteredPosts || this.posts;
        this.renderFeaturedPosts(postsToRender.slice(0, 3));
        this.renderLatestPosts(postsToRender);
    }

    renderFeaturedPosts(posts) {
        const container = document.getElementById('featuredPosts');
        if (!container) return;

        if (posts.length === 0) {
            container.innerHTML = '<p>Brak postów do wyświetlenia.</p>';
            return;
        }

        container.innerHTML = posts.map(post => this.createPostCard(post, true)).join('');
    }

    renderLatestPosts(posts) {
        const container = document.getElementById('latestPosts');
        if (!container) return;

        if (posts.length === 0) {
            container.innerHTML = '<p>Brak postów do wyświetlenia.</p>';
            return;
        }

        container.innerHTML = posts.map(post => this.createPostCard(post)).join('');
    }

    createPostCard(post, isFeatured = false) {
        const excerpt = this.truncateText(post.content, 120);
        const imageHtml = post.image ? 
            `<img src="${post.image.data}" alt="${post.image.alt}" loading="lazy">` :
            `<div class="post-image-placeholder">📷 Brak obrazu</div>`;
        
        return `
            <div class="post-card" data-post-id="${post.id}">
                <div class="post-image">
                    ${imageHtml}
                </div>
                <div class="post-content">
                    <h3 class="post-title">${post.title}</h3>
                    <p class="post-excerpt">${excerpt}</p>
                    <div class="post-meta">
                        <span class="post-category">${post.category}</span>
                        <span class="post-date">${this.formatDate(post.date)}</span>
                    </div>
                </div>
            </div>
        `;
    }

    // Post Modal
    showPostModal(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (!post) return;

        const modal = document.getElementById('postModal');
        const modalContent = document.getElementById('postModalContent');
        if (!modal || !modalContent) return;

        const imageHtml = post.image ? 
            `<div class="post-image" style="height: 300px; margin-bottom: 20px;">
                <img src="${post.image.data}" alt="${post.image.alt}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>` :
            `<div class="post-image" style="height: 250px; margin-bottom: 20px; background: linear-gradient(135deg, var(--color-yellow-light), var(--color-yellow-lighter)); display: flex; align-items: center; justify-content: center; color: var(--color-text-secondary);">
                📷 Brak obrazu
            </div>`;

        modalContent.innerHTML = `
            ${imageHtml}
            <h1 style="margin-bottom: 10px; color: var(--color-text-dark);">${post.title}</h1>
            <div class="post-meta" style="margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid var(--color-card-border);">
                <span class="post-category">${post.category}</span>
                <span class="post-date">${this.formatDate(post.date)}</span>
            </div>
            <div style="line-height: 1.8; color: var(--color-text);">
                ${this.formatPostContent(post.content)}
            </div>
        `;

        modal.classList.remove('hidden');
    }

    closePostModal() {
        const modal = document.getElementById('postModal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    // Search and Filter
    handleSearch(query) {
        if (!query.trim()) {
            this.renderPosts();
            return;
        }

        const filteredPosts = this.posts.filter(post =>
            post.title.toLowerCase().includes(query.toLowerCase()) ||
            post.content.toLowerCase().includes(query.toLowerCase()) ||
            post.category.toLowerCase().includes(query.toLowerCase())
        );

        this.renderPosts(filteredPosts);
    }

    showCategory(category) {
        console.log('Showing category:', category);
        if (category === 'all') {
            this.renderPosts();
            return;
        }

        const filteredPosts = this.posts.filter(post => post.category === category);
        this.renderPosts(filteredPosts);
    }

    // Utility Functions
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('pl-PL', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength) + '...';
    }

    formatPostContent(content) {
        return content.split('\n').map(paragraph => 
            paragraph.trim() ? `<p>${paragraph}</p>` : ''
        ).join('');
    }
}

// Global functions for HTML onclick events
let app;

function showBlogView() {
    console.log('Global showBlogView called');
    if (app) app.showBlogView();
}

function showAdminLogin() {
    console.log('Global showAdminLogin called');
    if (app) app.showAdminLogin();
}

function showAddPostForm() {
    console.log('Global showAddPostForm called');
    if (app) app.showAddPostForm();
}

function showPostsList() {
    console.log('Global showPostsList called');
    if (app) app.showPostsList();
}

function showImageManager() {
    console.log('Global showImageManager called');
    if (app) app.showImageManager();
}

function cancelPostForm() {
    console.log('Global cancelPostForm called');
    if (app) app.cancelPostForm();
}

function logout() {
    console.log('Global logout called');
    if (app) app.logout();
}

function showCategory(category) {
    console.log('Global showCategory called:', category);
    if (app) app.showCategory(category);
}

function closePostModal() {
    console.log('Global closePostModal called');
    if (app) app.closePostModal();
}

function removeImage() {
    console.log('Global removeImage called');
    if (app) app.removeImage();
}

function cleanupUnusedImages() {
    console.log('Global cleanupUnusedImages called');
    if (app) app.cleanupUnusedImages();
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing app...');
    app = new BlogApp();
    
    // Make app globally available for debugging
    window.blogApp = app;
});

// Handle escape key for modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && app) {
        app.closePostModal();
    }
});