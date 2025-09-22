// Professional Blog Application with PHP Backend API
// Two-column layout, shared data storage, professional implementation

console.log('🚀 Professional Blog Application - Loading...');

class ProfessionalBlogApp {
    constructor() {
        console.log('🏗️ Professional Blog App constructor called');

        this.posts = [];
        this.currentEditId = null;
        this.currentDeleteId = null;
        this.debugMode = true;

        // API Configuration
        this.API_BASE = window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '') + '/api.php';
        console.log('🌐 API Base URL:', this.API_BASE);

        // Admin authentication system
        this.admin = {
            login: null,
            email: null,
            isLoggedIn: false,
            credentials: null
        };

        this.initWithRetry();
    }

    initWithRetry(attempts = 3) {
        console.log(`🔄 Attempting initialization (attempt ${4-attempts})`);

        if (document.readyState === 'loading') {
            console.log('⏳ Waiting for DOM...');
            document.addEventListener('DOMContentLoaded', () => {
                console.log('✅ DOM loaded, initializing...');
                this.safeInit();
            });
        } else {
            console.log('✅ DOM ready, initializing immediately...');
            this.safeInit();
        }
    }

    async safeInit() {
        try {
            console.log('🚀 Starting professional initialization...');

            this.initializeEventListeners();

            // Load posts from API
            await this.loadPostsFromAPI();

            this.renderPosts();
            this.renderRecentPosts();
            this.updateAdminUI();
            this.updateStats();

            // Reinforce event listeners
            setTimeout(() => {
                this.reinforceEventListeners();
            }, 1000);

            console.log('🎉 Professional blog application initialized successfully!');
            this.runDiagnostics();

        } catch (error) {
            console.error('❌ Error during initialization:', error);
            setTimeout(() => {
                console.log('🔄 Retrying initialization...');
                this.safeInit();
            }, 2000);
        }
    }

    // ===== API COMMUNICATION METHODS =====

    async apiRequest(endpoint, method = 'GET', data = null) {
        try {
            const url = `${this.API_BASE}/${endpoint}`;
            console.log(`🌐 API ${method}:`, url);

            const options = {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            };

            if (data && (method === 'POST' || method === 'PUT' || method === 'DELETE')) {
                // Add admin credentials for protected endpoints
                if (this.admin.credentials) {
                    data.admin = this.admin.credentials;
                }
                options.body = JSON.stringify(data);
            }

            const response = await fetch(url, options);
            const result = await response.json();

            console.log(`📡 API Response [${response.status}]:`, result);

            if (!result.success) {
                throw new Error(result.error || 'API request failed');
            }

            return result;

        } catch (error) {
            console.error('❌ API Error:', error);
            this.showToast(`❌ Błąd API: ${error.message}`, 'error');
            throw error;
        }
    }

    async loadPostsFromAPI() {
        try {
            console.log('📡 Loading posts from API...');
            const result = await this.apiRequest('posts');
            this.posts = result.data || [];
            console.log(`✅ Loaded ${this.posts.length} posts from server`);
        } catch (error) {
            console.error('❌ Failed to load posts:', error);
            this.showToast('❌ Nie można załadować wpisów z serwera', 'error');
            this.posts = []; // Fallback to empty array
        }
    }

    async savePostToAPI(postData) {
        try {
            console.log('💾 Saving post to API:', postData);

            if (this.currentEditId) {
                // Update existing post
                postData.id = this.currentEditId;
                const result = await this.apiRequest('post', 'PUT', postData);

                // Update local data
                const postIndex = this.posts.findIndex(p => p.id === this.currentEditId);
                if (postIndex !== -1) {
                    this.posts[postIndex] = result.data;
                }

                this.showToast('✅ Wpis został zaktualizowany!', 'success');

            } else {
                // Create new post
                const result = await this.apiRequest('posts', 'POST', postData);

                // Add to local data
                this.posts.unshift(result.data);

                this.showToast('🎉 Nowy wpis został dodany!', 'success');
            }

            return true;

        } catch (error) {
            console.error('❌ Failed to save post:', error);
            return false;
        }
    }

    async deletePostFromAPI(postId) {
        try {
            console.log('🗑️ Deleting post from API:', postId);

            await this.apiRequest('post', 'DELETE', { id: postId });

            // Remove from local data
            this.posts = this.posts.filter(p => p.id !== postId);

            this.showToast('🗑️ Wpis został usunięty!', 'success');
            return true;

        } catch (error) {
            console.error('❌ Failed to delete post:', error);
            return false;
        }
    }

    async addCommentToAPI(postId, commentData) {
        try {
            console.log('💌 Adding comment to API:', { postId, commentData });

            const data = {
                postId: postId,
                authorName: commentData.name,
                authorEmail: commentData.email,
                content: commentData.content
            };

            const result = await this.apiRequest('comment', 'POST', data);

            // Update local data
            const post = this.posts.find(p => p.id === postId);
            if (post) {
                post.comments.push(result.data);
            }

            this.showToast('✅ Komentarz został dodany!', 'success');
            return true;

        } catch (error) {
            console.error('❌ Failed to add comment:', error);
            return false;
        }
    }

    runDiagnostics() {
        console.log('🔍 DIAGNOSTYKA:');
        console.log('📊 Posts loaded:', this.posts.length);
        console.log('🔐 Admin logged in:', this.admin.isLoggedIn);
        console.log('🌐 API Base URL:', this.API_BASE);
        console.log('👤 Admin data:', this.admin);

        // Check DOM elements
        const elements = {
            'loginBtn': document.getElementById('loginBtn'),
            'addPostBtn': document.getElementById('addPostBtn'),
            'postForm': document.getElementById('postForm'),
            'postsContainer': document.getElementById('postsContainer')
        };

        for (const [name, element] of Object.entries(elements)) {
            if (element) {
                console.log(`✅ ${name} found`);
            } else {
                console.warn(`⚠️ ${name} NOT found`);
            }
        }
    }

    // Event listeners setup
    initializeEventListeners() {
        console.log('🔗 Setting up event listeners...');

        try {
            this.setupAuthHandlers();
            this.setupPostHandlers();
            this.setupDeleteHandlers();
            this.setupKeyboardHandlers();

            console.log('✅ All event listeners set up');

        } catch (error) {
            console.error('❌ Error setting up event listeners:', error);
        }
    }

    reinforceEventListeners() {
        console.log('🔧 Reinforcing event listeners...');

        const addPostBtn = document.getElementById('addPostBtn');
        if (addPostBtn) {
            addPostBtn.removeEventListener('click', this.handleAddPostClick);

            this.handleAddPostClick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('🎯 ADD POST CLICKED via reinforced listener');
                this.showAddPostModal();
            };

            addPostBtn.addEventListener('click', this.handleAddPostClick);
            console.log('✅ Add post button reinforced');

            addPostBtn.onclick = (e) => {
                e.preventDefault();
                console.log('🎯 ADD POST CLICKED via onclick backup');
                this.showAddPostModal();
            };
        }
    }

    setupAuthHandlers() {
        const loginBtn = document.getElementById('loginBtn');
        const logoutBtn = document.getElementById('logoutBtn');

        if (loginBtn) {
            loginBtn.addEventListener('click', () => {
                console.log('🔐 Login button clicked');
                this.showLoginModal();
            });
            console.log('✅ Login button handler set');
        }

        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                console.log('🚪 Logout button clicked');
                this.logout();
            });
            console.log('✅ Logout button handler set');
        }

        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
            console.log('✅ Login form handler set');
        }

        ['loginClose', 'loginCancel'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('click', () => this.hideLoginModal());
        });

        const loginOverlay = document.getElementById('loginOverlay');
        if (loginOverlay) {
            loginOverlay.addEventListener('click', () => this.hideLoginModal());
        }
    }

    setupPostHandlers() {
        const addPostBtn = document.getElementById('addPostBtn');
        if (addPostBtn) {
            console.log('🎯 Found add post button, setting up handlers...');

            addPostBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('🎯 ADD POST CLICKED (addEventListener)');
                this.showAddPostModal();
            });

            addPostBtn.onclick = (e) => {
                e.preventDefault();
                console.log('🎯 ADD POST CLICKED (onclick backup)');
                this.showAddPostModal();
            };

            console.log('✅ Add post button handlers set (both addEventListener and onclick)');
        } else {
            console.warn('⚠️ Add post button not found');
        }

        const postForm = document.getElementById('postForm');
        if (postForm) {
            postForm.addEventListener('submit', (e) => {
                console.log('📝 Post form submitted');
                this.handlePostSubmit(e);
            });
            console.log('✅ Post form handler set');
        }

        ['modalClose', 'postCancel'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('click', () => {
                console.log(`❌ Closing post modal via ${id}`);
                this.hidePostModal();
            });
        });

        const modalOverlay = document.getElementById('modalOverlay');
        if (modalOverlay) {
            modalOverlay.addEventListener('click', () => {
                console.log('❌ Closing post modal via overlay');
                this.hidePostModal();
            });
        }
    }

    setupDeleteHandlers() {
        ['deleteConfirm', 'deleteClose', 'deleteCancel'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                if (id === 'deleteConfirm') {
                    el.addEventListener('click', () => this.confirmDelete());
                } else {
                    el.addEventListener('click', () => this.hideDeleteModal());
                }
            }
        });

        const deleteOverlay = document.getElementById('deleteOverlay');
        if (deleteOverlay) {
            deleteOverlay.addEventListener('click', () => this.hideDeleteModal());
        }
    }

    setupKeyboardHandlers() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                console.log('⌨️ ESC pressed, closing modals');
                this.hideAllModals();
            }
        });
    }

    // Authentication methods
    showLoginModal() {
        console.log('📝 Showing login modal');
        const loginModal = document.getElementById('loginModal');
        if (loginModal) {
            loginModal.classList.remove('hidden');
            const usernameInput = document.getElementById('loginUsername');
            if (usernameInput) usernameInput.focus();
            console.log('✅ Login modal shown');
        }
    }

    hideLoginModal() {
        console.log('❌ Hiding login modal');
        const loginModal = document.getElementById('loginModal');
        const loginForm = document.getElementById('loginForm');
        if (loginModal) loginModal.classList.add('hidden');
        if (loginForm) loginForm.reset();
    }

    async handleLogin(e) {
        e.preventDefault();
        console.log('🔑 Processing login...');

        const username = document.getElementById('loginUsername').value.trim();
        const password = document.getElementById('loginPassword').value.trim();

        console.log('👤 Login attempt for:', username);

        try {
            const credentials = { login: username, password: password };
            const result = await this.apiRequest('login', 'POST', credentials);

            if (result.success) {
                this.admin.isLoggedIn = true;
                this.admin.login = result.data.login;
                this.admin.email = result.data.email;
                this.admin.credentials = credentials; // Store for future API calls

                this.hideLoginModal();
                this.updateAdminUI();
                this.showToast('🎉 Pomyślnie zalogowano!', 'success');
                console.log('✅ Login successful');

                setTimeout(() => {
                    this.reinforceEventListeners();
                }, 500);
            }

        } catch (error) {
            this.showToast('❌ Nieprawidłowy login lub hasło!', 'error');
            console.log('❌ Login failed:', error);
        }
    }

    logout() {
        console.log('🚪 Logging out...');
        this.admin.isLoggedIn = false;
        this.admin.login = null;
        this.admin.email = null;
        this.admin.credentials = null;
        this.updateAdminUI();
        this.showToast('👋 Wylogowano pomyślnie', 'info');
    }

    updateAdminUI() {
        console.log('🎨 Updating admin UI, logged in:', this.admin.isLoggedIn);

        const elements = {
            loginBtn: document.getElementById('loginBtn'),
            adminStatus: document.getElementById('adminStatus'),
            adminPanel: document.getElementById('adminPanel'),
            adminActions: document.getElementById('adminActions')
        };

        if (this.admin.isLoggedIn) {
            if (elements.loginBtn) elements.loginBtn.classList.add('hidden');
            if (elements.adminStatus) elements.adminStatus.classList.remove('hidden');
            if (elements.adminPanel) elements.adminPanel.classList.remove('hidden');
            if (elements.adminActions) elements.adminActions.classList.remove('hidden');
            document.body.classList.add('admin-logged-in');

            console.log('👑 Admin UI enabled');

        } else {
            if (elements.loginBtn) elements.loginBtn.classList.remove('hidden');
            if (elements.adminStatus) elements.adminStatus.classList.add('hidden');
            if (elements.adminPanel) elements.adminPanel.classList.add('hidden');
            if (elements.adminActions) elements.adminActions.classList.add('hidden');
            document.body.classList.remove('admin-logged-in');
            console.log('👤 Admin UI disabled');
        }

        this.renderPosts();
    }

    // Post management methods
    showAddPostModal() {
        console.log('🎯 SHOW ADD POST MODAL called');
        console.log('🔐 Admin logged in:', this.admin.isLoggedIn);

        if (!this.admin.isLoggedIn) {
            this.showToast('🔐 Musisz być zalogowany jako administrator!', 'error');
            console.log('❌ Not logged in as admin');
            return;
        }

        this.currentEditId = null;

        const elements = {
            modalTitle: document.getElementById('modalTitle'),
            postForm: document.getElementById('postForm'),
            postModal: document.getElementById('postModal'),
            postTitle: document.getElementById('postTitle')
        };

        if (elements.modalTitle) elements.modalTitle.textContent = '📝 Dodaj nowy wpis';
        if (elements.postForm) elements.postForm.reset();
        if (elements.postModal) elements.postModal.classList.remove('hidden');
        if (elements.postTitle) setTimeout(() => elements.postTitle.focus(), 100);

        console.log('🎉 Add post modal opened successfully');
    }

    hidePostModal() {
        console.log('❌ Hiding post modal');
        const postModal = document.getElementById('postModal');
        const postForm = document.getElementById('postForm');

        if (postModal) postModal.classList.add('hidden');
        if (postForm) postForm.reset();
        this.currentEditId = null;
        console.log('✅ Post modal hidden');
    }

    async handlePostSubmit(e) {
        e.preventDefault();
        console.log('💾 HANDLE POST SUBMIT called');

        if (!this.admin.isLoggedIn) {
            this.showToast('❌ Brak uprawnień!', 'error');
            return;
        }

        const formData = this.getFormData();
        if (!formData) return;

        const success = await this.savePostToAPI(formData);
        if (!success) return;

        await this.refreshUI();
        console.log('🎉 Post submit completed successfully');
    }

    getFormData() {
        const title = document.getElementById('postTitle')?.value?.trim() || '';
        const imageUrl = document.getElementById('postImage')?.value?.trim() || '';
        const content = document.getElementById('postContent')?.value?.trim() || '';

        if (!title) {
            this.showToast('❌ Tytuł jest wymagany!', 'error');
            return null;
        }

        if (!content) {
            this.showToast('❌ Treść jest wymagana!', 'error');
            return null;
        }

        return { title, imageUrl, content };
    }

    async refreshUI() {
        console.log('🔄 Refreshing UI...');

        try {
            this.hidePostModal();
            await this.loadPostsFromAPI(); // Reload from server
            this.renderPosts();
            this.renderRecentPosts();
            await this.updateStats();
            console.log('✅ UI refreshed successfully');
        } catch (error) {
            console.error('❌ Error refreshing UI:', error);
        }
    }

    showEditPostModal(postId) {
        console.log('✏️ Showing edit post modal for post:', postId);

        if (!this.admin.isLoggedIn) {
            this.showToast('🔐 Musisz być zalogowany jako administrator!', 'error');
            return;
        }

        const post = this.posts.find(p => p.id === postId);
        if (!post) {
            console.log('❌ Post not found:', postId);
            return;
        }

        this.currentEditId = postId;

        const elements = {
            modalTitle: document.getElementById('modalTitle'),
            postTitle: document.getElementById('postTitle'),
            postImage: document.getElementById('postImage'),
            postContent: document.getElementById('postContent'),
            postModal: document.getElementById('postModal')
        };

        if (elements.modalTitle) elements.modalTitle.textContent = '✏️ Edytuj wpis';
        if (elements.postTitle) elements.postTitle.value = post.title;
        if (elements.postImage) elements.postImage.value = post.imageUrl || '';
        if (elements.postContent) elements.postContent.value = post.content;
        if (elements.postModal) elements.postModal.classList.remove('hidden');
        if (elements.postTitle) elements.postTitle.focus();

        console.log('✅ Edit modal shown for post:', post.title);
    }

    showDeleteModal(postId) {
        console.log('🗑️ Showing delete modal for post:', postId);

        if (!this.admin.isLoggedIn) {
            this.showToast('❌ Brak uprawnień!', 'error');
            return;
        }

        this.currentDeleteId = postId;
        const deleteModal = document.getElementById('deleteModal');
        if (deleteModal) {
            deleteModal.classList.remove('hidden');
        }
    }

    hideDeleteModal() {
        console.log('❌ Hiding delete modal');
        const deleteModal = document.getElementById('deleteModal');
        if (deleteModal) {
            deleteModal.classList.add('hidden');
        }
        this.currentDeleteId = null;
    }

    async confirmDelete() {
        console.log('🗑️ Confirming delete for post:', this.currentDeleteId);

        if (!this.currentDeleteId || !this.admin.isLoggedIn) return;

        const success = await this.deletePostFromAPI(this.currentDeleteId);
        if (success) {
            this.hideDeleteModal();
            this.renderPosts();
            this.renderRecentPosts();
            await this.updateStats();
        }
    }

    hideAllModals() {
        this.hideLoginModal();
        this.hidePostModal();
        this.hideDeleteModal();
    }

    // Rendering methods - TWO COLUMN LAYOUT
    renderPosts() {
        console.log('🎨 Rendering', this.posts.length, 'posts in two columns...');

        const container = document.getElementById('postsContainer');
        if (!container) {
            console.error('❌ Posts container not found');
            return;
        }

        if (this.posts.length === 0) {
            container.innerHTML = `
                <div class="no-posts">
                    <div class="no-posts__content">
                        <h2>📝 Brak wpisów</h2>
                        <p>Nie ma jeszcze żadnych wpisów na blogu.</p>
                        ${this.admin.isLoggedIn ? '<p><strong>Jako administrator możesz dodać pierwszy wpis!</strong></p>' : ''}
                        <div class="info-box">
                            <p><strong>💡 Informacja:</strong> Wpisy są przechowywane na serwerze i dostępne dla wszystkich użytkowników.</p>
                        </div>
                    </div>
                </div>
            `;
            return;
        }

        try {
            // Split posts into two columns
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

            this.attachPostEventListeners();
            console.log('✅ Posts rendered successfully in two columns');
        } catch (error) {
            console.error('❌ Error rendering posts:', error);
        }
    }

    renderPost(post) {
        const formattedContent = post.content.split('\\n\\n').map(paragraph => 
            `<p>${paragraph.replace(/\\n/g, '<br>')}</p>`
        ).join('');

        const adminActions = this.admin.isLoggedIn ? `
            <div class="post__actions">
                <button class="btn btn--admin btn--sm edit-post-btn" data-post-id="${post.id}">
                    ✏️ Edytuj
                </button>
                <button class="btn btn--danger btn--sm delete-post-btn" data-post-id="${post.id}">
                    🗑️ Usuń
                </button>
            </div>
        ` : '';

        const imageHtml = post.imageUrl ? `
            <img src="${post.imageUrl}" alt="${this.escapeHtml(post.title)}" class="post__image" 
                 onerror="this.style.display='none'; console.log('Image failed to load:', this.src);">
        ` : '';

        const serverIndicator = `
            <div class="server-indicator">
                <span>🌐 Wpis na serwerze</span>
            </div>
        `;

        return `
            <article class="post" id="post-${post.id}">
                <header class="post__header">
                    <div class="post__header-main">
                        <h2 class="post__title">${this.escapeHtml(post.title)}</h2>
                        <div class="post__meta">
                            <span>📅 ${this.formatDate(post.date)}</span>
                            <span>💬 ${post.comments.length} komentarzy</span>
                        </div>
                        ${serverIndicator}
                    </div>
                    ${adminActions}
                </header>

                ${imageHtml}

                <div class="post__content">
                    ${formattedContent}
                </div>

                <section class="comments">
                    <h3 class="comments__header">💬 Komentarze (${post.comments.length})</h3>

                    <div class="comments__list">
                        ${post.comments.map(comment => this.renderComment(comment)).join('')}
                    </div>

                    <div class="comment-form">
                        <h4>💌 Dodaj komentarz</h4>
                        <form class="comment-form-inner" data-post-id="${post.id}">
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="comment-name-${post.id}" class="form-label">Imię</label>
                                    <input type="text" id="comment-name-${post.id}" name="name" class="form-control" required>
                                </div>
                                <div class="form-group">
                                    <label for="comment-email-${post.id}" class="form-label">Email</label>
                                    <input type="email" id="comment-email-${post.id}" name="email" class="form-control" required>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="comment-content-${post.id}" class="form-label">Komentarz</label>
                                <textarea id="comment-content-${post.id}" name="content" class="form-control" rows="3" required></textarea>
                            </div>
                            <button type="submit" class="btn btn--primary">💌 Dodaj komentarz</button>
                        </form>
                    </div>
                </section>
            </article>
        `;
    }

    renderComment(comment) {
        const initials = comment.authorName.split(' ').map(name => name[0]).join('').toUpperCase();

        return `
            <div class="comment">
                <div class="comment__header">
                    <div class="comment__avatar">${initials}</div>
                    <div class="comment__meta">
                        <div class="comment__author">${this.escapeHtml(comment.authorName)}</div>
                        <div class="comment__date">${this.formatDate(comment.date)}</div>
                    </div>
                </div>
                <div class="comment__content">${this.escapeHtml(comment.content)}</div>
            </div>
        `;
    }

    renderRecentPosts() {
        const container = document.getElementById('recentPosts');
        if (!container) return;

        const recentPosts = this.posts.slice(0, 5);

        if (recentPosts.length === 0) {
            container.innerHTML = '<p>📝 Brak wpisów</p>';
            return;
        }

        container.innerHTML = recentPosts.map(post => `
            <div class="recent-post" onclick="document.getElementById('post-${post.id}')?.scrollIntoView({behavior: 'smooth'})">
                <div class="recent-post__title">${this.escapeHtml(post.title)}</div>
                <div class="recent-post__date">${this.formatDate(post.date)}</div>
            </div>
        `).join('');
    }

    attachPostEventListeners() {
        console.log('🔗 Attaching post event listeners...');

        document.querySelectorAll('.edit-post-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const postId = parseInt(btn.dataset.postId);
                console.log('✏️ Edit button clicked for post:', postId);
                this.showEditPostModal(postId);
            });
        });

        document.querySelectorAll('.delete-post-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const postId = parseInt(btn.dataset.postId);
                console.log('🗑️ Delete button clicked for post:', postId);
                this.showDeleteModal(postId);
            });
        });

        document.querySelectorAll('.comment-form-inner').forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const postId = parseInt(form.dataset.postId);
                console.log('💌 Comment form submitted for post:', postId);
                this.handleCommentSubmit(e, postId);
            });
        });

        console.log('✅ Post event listeners attached');
    }

    async handleCommentSubmit(e, postId) {
        e.preventDefault();
        console.log('💌 Processing comment for post:', postId);

        const form = e.target;
        const formData = new FormData(form);

        const name = formData.get('name')?.trim();
        const email = formData.get('email')?.trim();
        const content = formData.get('content')?.trim();

        if (!name || !email || !content) {
            this.showToast('❌ Wszystkie pola są wymagane!', 'error');
            return;
        }

        const success = await this.addCommentToAPI(postId, { name, email, content });
        if (success) {
            form.reset();
            this.renderPosts();
            await this.updateStats();
        }
    }

    async updateStats() {
        try {
            const result = await this.apiRequest('stats');

            const postsCount = document.getElementById('postsCount');
            const commentsCount = document.getElementById('commentsCount');

            if (postsCount) {
                postsCount.textContent = result.data.totalPosts;
            }

            if (commentsCount) {
                commentsCount.textContent = result.data.totalComments;
            }

        } catch (error) {
            console.error('❌ Failed to update stats:', error);
        }
    }

    // Utility methods
    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
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
        console.log('🍞 Toast:', type, '-', message);

        const container = document.getElementById('toastContainer');
        if (!container) {
            console.warn('⚠️ Toast container not found');
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
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 5000);
    }

    // Debug methods for console
    debugInfo() {
        console.log('🔍 DEBUG INFO:');
        console.log('📊 Posts:', this.posts.length);
        console.log('🔐 Admin logged in:', this.admin.isLoggedIn);
        console.log('🌐 API Base:', this.API_BASE);
        console.log('👤 Admin:', this.admin);
        return this;
    }

    async refreshFromServer() {
        console.log('🔄 Refreshing all data from server...');
        await this.loadPostsFromAPI();
        this.renderPosts();
        this.renderRecentPosts();
        await this.updateStats();
        this.showToast('✅ Dane odświeżone z serwera!', 'success');
        return this;
    }
}

// Professional initialization
console.log('🎯 Starting Professional Blog Application...');

let professionalBlogApp;

function initProfessionalBlogApp() {
    try {
        console.log('🚀 Attempting to initialize professional blog app...');
        professionalBlogApp = new ProfessionalBlogApp();
        window.ProfessionalBlogApp = ProfessionalBlogApp;
        window.blogApp = professionalBlogApp;

        // Debug methods available in console
        window.debugBlog = () => professionalBlogApp.debugInfo();
        window.refreshBlog = () => professionalBlogApp.refreshFromServer();

        console.log('🎉 Professional blog app initialized successfully!');
        console.log('💡 Debug commands: debugBlog(), refreshBlog()');

    } catch (error) {
        console.error('❌ Failed to initialize professional blog app:', error);
        setTimeout(initProfessionalBlogApp, 2000);
    }
}

// Multiple initialization attempts
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    console.log('📱 DOM ready, initializing immediately');
    initProfessionalBlogApp();
} else {
    console.log('⏳ Waiting for DOM to be ready');
    document.addEventListener('DOMContentLoaded', initProfessionalBlogApp);

    setTimeout(() => {
        if (!window.blogApp) {
            console.log('🔄 Backup initialization after 3s');
            initProfessionalBlogApp();
        }
    }, 3000);
}

console.log('✅ Professional Blog Application script loaded!');
