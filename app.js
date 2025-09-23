// Professional Blog Application - SIMPLIFIED FIXED VERSION
console.log('🚀 Professional Blog Application - Loading...');

class ProfessionalBlogApp {
    constructor() {
        console.log('🏗️ Professional Blog App constructor');

        this.posts = [];
        this.admin = {
            isLoggedIn: false,
            credentials: null
        };

        // API Configuration - try relative path first
        this.API_BASE = './api.php';
        console.log('🌐 API Base URL:', this.API_BASE);

        this.init();
    }

    async init() {
        console.log('🚀 Initializing...');
        try {
            this.setupEventListeners();
            await this.loadPosts();
            this.renderPosts();
            this.renderRecentPosts();
            this.updateStats();
            console.log('🎉 App initialized successfully!');
        } catch (error) {
            console.error('❌ Initialization error:', error);
            this.showFallbackContent();
        }
    }

    setupEventListeners() {
        // Login button
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            loginBtn.addEventListener('click', () => this.showLoginModal());
        }

        // Add post button
        const addPostBtn = document.getElementById('addPostBtn');
        if (addPostBtn) {
            addPostBtn.addEventListener('click', () => this.showAddPostModal());
        }

        // Modal close buttons
        document.querySelectorAll('.modal__close, .modal__overlay').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (e.target === btn) {
                    this.hideAllModals();
                }
            });
        });

        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        console.log('✅ Event listeners set up');
    }

    async loadPosts() {
        try {
            console.log('📡 Loading posts...');
            const response = await fetch(this.API_BASE + '/posts');
            if (response.ok) {
                const result = await response.json();
                this.posts = result.data || [];
                console.log(`✅ Loaded ${this.posts.length} posts`);
            } else {
                throw new Error(`HTTP ${response.status}`);
            }
        } catch (error) {
            console.error('❌ API Error:', error);
            // Fallback to example posts
            this.posts = [
                {
                    id: 1,
                    title: "Przykładowy wpis",
                    content: "To jest przykładowy wpis, ponieważ nie można połączyć się z API.",
                    date: "2024-03-15",
                    comments: []
                }
            ];
        }
    }

    renderPosts() {
        const container = document.getElementById('postsContainer');
        if (!container) return;

        if (this.posts.length === 0) {
            container.innerHTML = '<div class="no-posts"><h2>📝 Brak wpisów</h2></div>';
            return;
        }

        // Two column layout
        const leftColumn = [];
        const rightColumn = [];

        this.posts.forEach((post, index) => {
            if (index % 2 === 0) {
                leftColumn.push(post);
            } else {
                rightColumn.push(post);
            }
        });

        container.innerHTML = `
            <div class="posts-grid">
                <div class="posts-column posts-column--left">
                    ${leftColumn.map(post => this.renderPost(post)).join('')}
                </div>
                <div class="posts-column posts-column--right">
                    ${rightColumn.map(post => this.renderPost(post)).join('')}
                </div>
            </div>
        `;

        console.log('✅ Posts rendered in two columns');
    }

    renderPost(post) {
        const adminActions = this.admin.isLoggedIn ? `
            <div class="post__actions">
                <button class="btn btn--admin btn--sm" onclick="blogApp.editPost(${post.id})">✏️ Edytuj</button>
                <button class="btn btn--danger btn--sm" onclick="blogApp.deletePost(${post.id})">🗑️ Usuń</button>
            </div>
        ` : '';

        const imageHtml = post.imageUrl ? `
            <img src="${post.imageUrl}" alt="${post.title}" class="post__image" onerror="this.style.display='none';">
        ` : '';

        return `
            <article class="post">
                <header class="post__header">
                    <div class="post__header-main">
                        <h2 class="post__title">${post.title}</h2>
                        <div class="post__meta">
                            <span>📅 ${this.formatDate(post.date)}</span>
                            <span>💬 ${post.comments?.length || 0} komentarzy</span>
                        </div>
                        <div class="server-indicator">
                            <span>🌐 Wpis na serwerze</span>
                        </div>
                    </div>
                    ${adminActions}
                </header>

                ${imageHtml}

                <div class="post__content">
                    ${post.content.split('\\n\\n').map(p => `<p>${p}</p>`).join('')}
                </div>
            </article>
        `;
    }

    renderRecentPosts() {
        const container = document.getElementById('recentPosts');
        if (!container) return;

        const recent = this.posts.slice(0, 5);
        container.innerHTML = recent.map(post => `
            <div class="recent-post">
                <div class="recent-post__title">${post.title}</div>
                <div class="recent-post__date">${this.formatDate(post.date)}</div>
            </div>
        `).join('');
    }

    updateStats() {
        const postsCount = document.getElementById('postsCount');
        const commentsCount = document.getElementById('commentsCount');

        if (postsCount) postsCount.textContent = this.posts.length;
        if (commentsCount) {
            const total = this.posts.reduce((sum, post) => sum + (post.comments?.length || 0), 0);
            commentsCount.textContent = total;
        }
    }

    showLoginModal() {
        const modal = document.getElementById('loginModal');
        if (modal) {
            modal.classList.remove('hidden');
            const input = document.getElementById('loginUsername');
            if (input) input.focus();
        }
    }

    showAddPostModal() {
        if (!this.admin.isLoggedIn) {
            this.showToast('🔐 Musisz być zalogowany jako administrator!', 'error');
            return;
        }

        const modal = document.getElementById('postModal');
        if (modal) modal.classList.remove('hidden');
    }

    hideAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.add('hidden');
        });
    }

    async handleLogin(e) {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value.trim();
        const password = document.getElementById('loginPassword').value.trim();

        if (username === 'admin' && password === 'admin123') {
            this.admin.isLoggedIn = true;
            this.admin.credentials = { login: username, password: password };
            this.hideAllModals();
            this.updateAdminUI();
            this.showToast('🎉 Pomyślnie zalogowano!', 'success');
        } else {
            this.showToast('❌ Nieprawidłowy login lub hasło!', 'error');
        }
    }

    updateAdminUI() {
        const loginBtn = document.getElementById('loginBtn');
        const adminStatus = document.getElementById('adminStatus');
        const adminPanel = document.getElementById('adminPanel');
        const adminActions = document.getElementById('adminActions');

        if (this.admin.isLoggedIn) {
            if (loginBtn) loginBtn.classList.add('hidden');
            if (adminStatus) adminStatus.classList.remove('hidden');
            if (adminPanel) adminPanel.classList.remove('hidden');
            if (adminActions) adminActions.classList.remove('hidden');
            document.body.classList.add('admin-logged-in');
        } else {
            if (loginBtn) loginBtn.classList.remove('hidden');
            if (adminStatus) adminStatus.classList.add('hidden');
            if (adminPanel) adminPanel.classList.add('hidden');
            if (adminActions) adminActions.classList.add('hidden');
            document.body.classList.remove('admin-logged-in');
        }

        this.renderPosts(); // Re-render to show/hide admin buttons
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('pl-PL', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    showToast(message, type = 'info') {
        console.log(`🍞 Toast [${type}]:`, message);

        const container = document.getElementById('toastContainer');
        if (!container) {
            alert(message);
            return;
        }

        const toast = document.createElement('div');
        toast.className = `toast toast--${type}`;
        toast.textContent = message;
        container.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 5000);
    }

    showFallbackContent() {
        console.log('📱 Showing fallback content');
        const container = document.getElementById('postsContainer');
        if (container) {
            container.innerHTML = `
                <div class="no-posts">
                    <div class="no-posts__content">
                        <h2>🔧 Tryb Offline</h2>
                        <p>Blog działa w trybie offline. Aby uzyskać pełną funkcjonalność:</p>
                        <ol style="text-align: left; margin: 1rem 0;">
                            <li>Wgraj pliki na hosting PHP</li>
                            <li>Upewnij się że api.php działa</li>
                            <li>Sprawdź uprawnienia folderu data/</li>
                        </ol>
                        <div class="info-box">
                            <p><strong>💡 Status:</strong> Frontend działa, ale API nie jest dostępne.</p>
                        </div>
                    </div>
                </div>
            `;
        }
    }
}

// Initialize the app
let blogApp;

function initApp() {
    try {
        blogApp = new ProfessionalBlogApp();
        window.blogApp = blogApp;
        console.log('🎉 Blog app ready!');
    } catch (error) {
        console.error('❌ Failed to initialize:', error);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

console.log('✅ Professional Blog script loaded!');
