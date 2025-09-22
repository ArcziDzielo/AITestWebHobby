// Blog Application JavaScript

class BlogApp {
    constructor() {
        this.posts = [];
        this.currentView = 'blog';
        this.isAdminLoggedIn = false;
        this.editingPostId = null;
        
        this.init();
    }

    init() {
        this.loadPosts();
        this.bindEvents();
        this.renderPosts();
        this.showBlogView();
    }

    // Local Storage Management
    savePosts() {
        localStorage.setItem('blogPosts', JSON.stringify(this.posts));
    }

    loadPosts() {
        const savedPosts = localStorage.getItem('blogPosts');
        if (savedPosts) {
            this.posts = JSON.parse(savedPosts);
        } else {
            // Load sample posts if none exist
            this.posts = [
                {
                    id: 1,
                    title: "Moje Najnowsze Hobby - Fotografowanie Natury",
                    content: "Odkryłem fascynujący świat fotografii natury. W tym poście podzielę się swoimi pierwszymi doświadczeniami, najlepszym sprzętem dla początkujących i miejscami, które warto odwiedzić z aparatem.\n\nFotografia natury to nie tylko uchwycenie pięknych krajobrazów, ale także cierpliwość i zrozumienie środowiska naturalnego. Podczas moich pierwszych wypraw nauczyłem się, że najważniejsze to być przygotowanym na długie czekanie na idealny moment.\n\nPolecam zacząć od podstawowego sprzętu - dobry aparat lustrzankowy lub bezlusterkowiec z obiektywem uniwersalnym. Nie trzeba od razu inwestować w drogie obiektywy specjalistyczne.",
                    date: "2025-09-15",
                    category: "Kreatywne",
                    image: "nature-photo.jpg"
                },
                {
                    id: 2,
                    title: "5 Prostych Projektów DIY na Weekend",
                    content: "Weekend to idealny czas na realizację małych projektów DIY. Przedstawiam 5 prostych pomysłów, które możesz wykonać w domu używając podstawowych narzędzi i materiałów.\n\n1. Drewniane półki na książki\n2. Organizery na biurko z kartonów\n3. Dekoracyjne świeczniki z szklanych słoików\n4. Wieszaki na ubrania ze starych drabin\n5. Doniczki z cementu\n\nKażdy z tych projektów można ukończyć w ciągu kilku godzin i nie wymagają one zaawansowanych umiejętności rękodzielniczych.",
                    date: "2025-09-08",
                    category: "Szybkie projekty",
                    image: "diy-projects.jpg"
                },
                {
                    id: 3,
                    title: "Jak Zacząć z Malowaniem Akwarelami",
                    content: "Akwarela to piękna technika malarska, która może być bardzo relaksująca. W tym przewodniku znajdziesz wszystko, czego potrzebujesz jako początkujący akwarelista.\n\nPodstawowy zestaw akwarelowy powinien zawierać:\n- Farby akwarelowe (12 podstawowych kolorów)\n- Pędzle o różnych rozmiarach\n- Papier akwarelowy (gramatura min. 300g)\n- Słoik z wodą\n- Ściereczka do czyszczenia pędzli\n\nNajważniejszą techniką do opanowania jest kontrola ilości wody. Akwarela żyje wodą - to ona decyduje o intensywności kolorów i efektach, które możemy uzyskać.",
                    date: "2025-09-01",
                    category: "Kreatywne",
                    image: "watercolor.jpg"
                },
                {
                    id: 4,
                    title: "Moja Kolekcja Roślin - Rok Później",
                    content: "Rok temu zacząłem przygodę z roślinami doniczkowymi. Oto jak rozwinęła się moja kolekcja, jakie rośliny najlepiej mi się udają i które polecam początkującym.\n\nMoja kolekcja zaczęła się od jednej monstery, a dziś mam już ponad 30 różnych gatunków. Nauczyłem się, że każda roślina ma swoje potrzeby i nie ma uniwersalnego przepisu na sukces.\n\nDla początkujących polecam:\n- Pothos (łatwa w uprawie)\n- Sansevieria (bardzo odporna)\n- Ficus benjamina (szybko rośnie)\n- Tradescantia (pięknie się rozprzestrzenia)\n\nNajważniejsze to nie przesadzić z podlewaniem - większość roślin ginie z powodu zbyt częstego podlewania, a nie z braku wody.",
                    date: "2025-08-25",
                    category: "Popularne na Pinterest",
                    image: "plants.jpg"
                }
            ];
            this.savePosts();
        }
    }

    // Event Binding
    bindEvents() {
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

        // Navigation event delegation
        document.addEventListener('click', (e) => {
            const target = e.target;
            
            // Handle navigation links
            if (target.classList.contains('nav-link')) {
                e.preventDefault();
                const text = target.textContent.trim();
                
                if (text === 'Admin') {
                    this.showAdminLogin();
                } else if (text === 'Wszystkie Posty') {
                    this.showCategory('all');
                }
            }

            // Handle logo click
            if (target.classList.contains('logo')) {
                e.preventDefault();
                this.showBlogView();
            }

            // Handle hero button
            if (target.classList.contains('btn-primary') && target.textContent.includes('Zobacz Wszystkie Posty')) {
                e.preventDefault();
                this.showCategory('all');
            }

            // Handle category links
            if (target.closest('.category-list')) {
                e.preventDefault();
                const categoryText = target.textContent.trim();
                this.showCategory(categoryText);
            }

            // Handle post cards
            if (target.closest('.post-card')) {
                const postCard = target.closest('.post-card');
                const postId = parseInt(postCard.dataset.postId);
                if (postId) {
                    this.showPostModal(postId);
                }
            }

            // Handle modal close
            if (target === document.getElementById('postModal') || target.classList.contains('modal-close')) {
                this.closePostModal();
            }
        });
    }

    // View Management
    showBlogView() {
        this.hideAllViews();
        document.getElementById('blogView').classList.add('active');
        this.currentView = 'blog';
        this.renderPosts();
    }

    showAdminLogin() {
        if (this.isAdminLoggedIn) {
            this.showAdminPanel();
            return;
        }
        this.hideAllViews();
        document.getElementById('adminLoginView').classList.add('active');
        this.currentView = 'adminLogin';
    }

    showAdminPanel() {
        this.hideAllViews();
        document.getElementById('adminPanelView').classList.add('active');
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

        if (username === 'admin' && password === 'hobby2025') {
            this.isAdminLoggedIn = true;
            this.showAdminPanel();
            // Clear form
            document.getElementById('loginForm').reset();
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
        
        const postData = {
            title: document.getElementById('postTitle').value,
            content: document.getElementById('postContent').value,
            category: document.getElementById('postCategory').value,
            image: document.getElementById('postImage').value || 'default.jpg',
            date: document.getElementById('postDate').value
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

        this.savePosts();
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
        document.getElementById('postImage').value = post.image;
        document.getElementById('postDate').value = post.date;
        
        // Update form title and show form
        document.getElementById('formTitle').textContent = 'Edytuj post';
        this.showAddPostForm();
    }

    deletePost(postId) {
        if (confirm('Czy na pewno chcesz usunąć ten post?')) {
            this.posts = this.posts.filter(p => p.id !== postId);
            this.savePosts();
            this.renderAdminPosts();
            this.renderPosts();
            alert('Post został usunięty!');
        }
    }

    // Admin Panel UI
    showAddPostForm() {
        document.getElementById('postForm').classList.remove('hidden');
        document.getElementById('postsList').classList.add('hidden');
        
        if (!this.editingPostId) {
            document.getElementById('formTitle').textContent = 'Dodaj nowy post';
            document.getElementById('addEditPostForm').reset();
            // Set default date to today
            document.getElementById('postDate').value = new Date().toISOString().split('T')[0];
        }
    }

    showPostsList() {
        document.getElementById('postForm').classList.add('hidden');
        document.getElementById('postsList').classList.remove('hidden');
        this.renderAdminPosts();
    }

    cancelPostForm() {
        this.editingPostId = null;
        document.getElementById('addEditPostForm').reset();
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
                    <p>Kategoria: ${post.category} | Data: ${this.formatDate(post.date)}</p>
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
        return `
            <div class="post-card" data-post-id="${post.id}">
                <div class="post-image">
                    📷 ${post.image}
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

        modalContent.innerHTML = `
            <div class="post-image" style="height: 250px; margin-bottom: 20px;">
                📷 ${post.image}
            </div>
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
        document.getElementById('postModal').classList.add('hidden');
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
    if (app) app.showBlogView();
}

function showAdminLogin() {
    if (app) app.showAdminLogin();
}

function showAddPostForm() {
    if (app) app.showAddPostForm();
}

function showPostsList() {
    if (app) app.showPostsList();
}

function cancelPostForm() {
    if (app) app.cancelPostForm();
}

function logout() {
    if (app) app.logout();
}

function showCategory(category) {
    if (app) app.showCategory(category);
}

function closePostModal() {
    if (app) app.closePostModal();
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    app = new BlogApp();
});

// Handle escape key for modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && app) {
        app.closePostModal();
    }
});