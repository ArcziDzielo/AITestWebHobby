// Professional Blog Application - FIXED API CALLS
console.log('🚀 Professional Blog Application - API Fixed Version Loading...');

class ProfessionalBlogApp {
    constructor() {
        console.log('🏗️ Professional Blog App constructor called');

        this.posts = [];
        this.currentEditId = null;
        this.currentDeleteId = null;
        this.apiAvailable = false;

        this.admin = {
            login: null,
            email: null,
            isLoggedIn: false,
            credentials: null
        };

        // API Configuration - simpler approach for better compatibility
        this.API_BASE = './api.php';
        console.log('🌐 API Base URL:', this.API_BASE);

        this.initWithAPIDetection();
    }

    async initWithAPIDetection() {
        console.log('🔍 Detecting API availability...');

        try {
            // Simple test - just call api.php directly
            console.log(`🧪 Testing API endpoint: ${this.API_BASE}`);
            const response = await fetch(this.API_BASE, {
                method: 'GET',
                headers: { 'Accept': 'application/json' }
            });

            console.log('📡 API Response Status:', response.status);

            if (response.ok) {
                this.apiAvailable = true;
                console.log(`✅ API found and working`);
                await this.initWithAPI();
            } else {
                console.log(`⚠️ API returned ${response.status}, trying offline mode`);
                await this.initOffline();
            }
        } catch (error) {
            console.log(`❌ API not available:`, error);
            await this.initOffline();
        }
    }

    async initWithAPI() {
        console.log('🚀 Initializing with API support...');
        try {
            this.setupEventListeners();
            await this.loadPostsFromAPI();
            this.renderPosts();
            this.renderRecentPosts();
            await this.updateStatsFromAPI();

            console.log('🎉 App initialized with API support!');
            this.showToast('🌐 Połączono z serwerem - pełna funkcjonalność dostępna!', 'success');
        } catch (error) {
            console.error('❌ API initialization error:', error);
            this.showToast('⚠️ Błąd połączenia z serwerem - przełączanie na tryb offline', 'error');
            await this.initOffline();
        }
    }

    async initOffline() {
        console.log('📱 Initializing offline mode...');
        this.setupEventListeners();
        this.loadSamplePosts();
        this.renderPosts();
        this.renderRecentPosts();
        this.updateStats();

        this.showOfflineNotice();
        console.log('📱 App initialized in offline mode');
    }

    // FIXED API REQUEST METHOD - simplified and more robust
    async apiRequest(endpoint, method = 'GET', data = null) {
        if (!this.apiAvailable) {
            throw new Error('API not available - offline mode');
        }

        try {
            // Simplified URL construction - let PHP handle routing
            let url = this.API_BASE;
            if (endpoint && endpoint !== 'posts') {
                url += `?endpoint=${endpoint}`;
            }

            console.log(`🌐 API ${method}:`, url);

            const options = {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            };

            if (data && (method === 'POST' || method === 'PUT' || method === 'DELETE')) {
                if (this.admin.credentials) {
                    data.admin = this.admin.credentials;
                }
                options.body = JSON.stringify(data);
                console.log('📤 Sending data:', data);
            }

            const response = await fetch(url, options);
            console.log(`📡 Response status: ${response.status}`);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ API Error Response:', errorText);
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            console.log(`📡 API Response:`, result);

            if (!result.success && result.error) {
                throw new Error(result.error);
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
            console.error('❌ Failed to load posts from API:', error);
            this.loadSamplePosts();
        }
    }

    loadSamplePosts() {
        console.log('📱 Loading sample posts (offline mode)');
        this.posts = [
            {
                id: 1,
                title: "Przykładowy wpis - Tryb Offline",
                content: "To jest przykładowy wpis, ponieważ API nie jest dostępne.\n\nW trybie offline możesz:\n- Przeglądać przykładowe wpisy\n- Testować interfejs\n- Zalogować się (admin/admin123)\n\nAby uzyskać pełną funkcjonalność, wgraj pliki na serwer PHP z działającym api.php",
                imageUrl: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&h=400&fit=crop",
                date: "2024-03-15",
                comments: [
                    {
                        id: 1,
                        authorName: "Demo User",
                        content: "To jest przykładowy komentarz w trybie offline.",
                        date: "2024-03-16"
                    }
                ]
            }
        ];
    }

    async savePostToAPI(postData) {
        if (!this.apiAvailable) {
            this.showToast('❌ API nie jest dostępne - nie można zapisać wpisu', 'error');
            return false;
        }

        try {
            console.log('💾 Saving post to API:', postData);

            if (this.currentEditId) {
                postData.id = this.currentEditId;
                const result = await this.apiRequest('post', 'PUT', postData);

                const postIndex = this.posts.findIndex(p => p.id === this.currentEditId);
                if (postIndex !== -1) {
                    this.posts[postIndex] = result.data;
                }

                this.showToast('✅ Wpis został zaktualizowany!', 'success');

            } else {
                const result = await this.apiRequest('posts', 'POST', postData);
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
        if (!this.apiAvailable) {
            this.showToast('❌ API nie jest dostępne - nie można usunąć wpisu', 'error');
            return false;
        }

        try {
            console.log('🗑️ Deleting post from API:', postId);

            await this.apiRequest('post', 'DELETE', { id: postId });
            this.posts = this.posts.filter(p => p.id !== postId);

            this.showToast('🗑️ Wpis został usunięty!', 'success');
            return true;

        } catch (error) {
            console.error('❌ Failed to delete post:', error);
            return false;
        }
    }

    async addCommentToAPI(postId, commentData) {
        if (!this.apiAvailable) {
            this.showToast('❌ API nie jest dostępne - nie można dodać komentarza', 'error');
            return false;
        }

        try {
            console.log('💌 Adding comment to API:', { postId, commentData });

            const data = {
                postId: postId,
                authorName: commentData.name,
                authorEmail: commentData.email,
                content: commentData.content
            };

            const result = await this.apiRequest('comment', 'POST', data);

            const post = this.posts.find(p => p.id === postId);
            if (post) {
                post.comments = post.comments || [];
                post.comments.push(result.data);
            }

            this.showToast('✅ Komentarz został dodany!', 'success');
            return true;

        } catch (error) {
            console.error('❌ Failed to add comment:', error);
            return false;
        }
    }

    setupEventListeners() {
        console.log('🔗 Setting up event listeners...');

        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            loginBtn.addEventListener('click', () => this.showLoginModal());
        }

        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }

        const addPostBtn = document.getElementById('addPostBtn');
        if (addPostBtn) {
            addPostBtn.addEventListener('click', () => this.showAddPostModal());
        }

        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        const postForm = document.getElementById('postForm');
        if (postForm) {
            postForm.addEventListener('submit', (e) => this.handlePostSubmit(e));
        }

        this.setupModalHandlers();
        console.log('✅ Event listeners set up');
    }

    setupModalHandlers() {
        document.querySelectorAll('.modal__close').forEach(btn => {
            btn.addEventListener('click', () => this.hideAllModals());
        });

        document.querySelectorAll('.modal__overlay').forEach(overlay => {
            overlay.addEventListener('click', () => this.hideAllModals());
        });

        const loginCancel = document.getElementById('loginCancel');
        const postCancel = document.getElementById('postCancel');
        const deleteCancel = document.getElementById('deleteCancel');

        if (loginCancel) loginCancel.addEventListener('click', () => this.hideLoginModal());
        if (postCancel) postCancel.addEventListener('click', () => this.hidePostModal());
        if (deleteCancel) deleteCancel.addEventListener('click', () => this.hideDeleteModal());

        const deleteConfirm = document.getElementById('deleteConfirm');
        if (deleteConfirm) {
            deleteConfirm.addEventListener('click', () => this.confirmDelete());
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideAllModals();
            }
        });
    }

    showLoginModal() {
        const loginModal = document.getElementById('loginModal');
        if (loginModal) {
            loginModal.classList.remove('hidden');
            const usernameInput = document.getElementById('loginUsername');
            if (usernameInput) usernameInput.focus();
        }
    }

    hideLoginModal() {
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

        if (this.apiAvailable) {
            try {
                const credentials = { login: username, password: password };
                const result = await this.apiRequest('login', 'POST', credentials);

                if (result.success) {
                    this.admin.isLoggedIn = true;
                    this.admin.login = result.data.login;
                    this.admin.email = result.data.email;
                    this.admin.credentials = credentials;

                    this.hideLoginModal();
                    this.updateAdminUI();
                    this.showToast('🎉 Pomyślnie zalogowano przez API!', 'success');
                    console.log('✅ API login successful');
                }
            } catch (error) {
                this.showToast('❌ Nieprawidłowy login lub hasło!', 'error');
                console.log('❌ API login failed:', error);
            }
        } else {
            if (username === 'admin' && password === 'admin123') {
                this.admin.isLoggedIn = true;
                this.admin.login = username;
                this.admin.credentials = { login: username, password: password };

                this.hideLoginModal();
                this.updateAdminUI();
                this.showToast('🎉 Zalogowano w trybie offline!', 'success');
            } else {
                this.showToast('❌ Nieprawidłowy login lub hasło!', 'error');
            }
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
        } else {
            if (elements.loginBtn) elements.loginBtn.classList.remove('hidden');
            if (elements.adminStatus) elements.adminStatus.classList.add('hidden');
            if (elements.adminPanel) elements.adminPanel.classList.add('hidden');
            if (elements.adminActions) elements.adminActions.classList.add('hidden');
            document.body.classList.remove('admin-logged-in');
        }

        this.renderPosts();
    }

    showAddPostModal() {
        if (!this.admin.isLoggedIn) {
            this.showToast('🔐 Musisz być zalogowany jako administrator!', 'error');
            return;
        }

        if (!this.apiAvailable) {
            this.showToast('❌ Dodawanie wpisów wymaga połączenia z API', 'error');
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
    }

    hidePostModal() {
        const postModal = document.getElementById('postModal');
        const postForm = document.getElementById('postForm');

        if (postModal) postModal.classList.add('hidden');
        if (postForm) postForm.reset();
        this.currentEditId = null;
    }

    async handlePostSubmit(e) {
        e.preventDefault();
        console.log('💾 HANDLE POST SUBMIT called');

        if (!this.admin.isLoggedIn) {
            this.showToast('❌ Brak uprawnień!', 'error');
            return;
        }

        if (!this.apiAvailable) {
            this.showToast('❌ Zapisywanie wymaga połączenia z API', 'error');
            return;
        }

        const formData = this.getFormData();
        if (!formData) return;

        const success = await this.savePostToAPI(formData);
        if (!success) return;

        await this.refreshUI();
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
        this.hidePostModal();
        if (this.apiAvailable) {
            await this.loadPostsFromAPI();
            await this.updateStatsFromAPI();
        }
        this.renderPosts();
        this.renderRecentPosts();
        this.updateStats();
    }

    showEditPostModal(postId) {
        if (!this.admin.isLoggedIn || !this.apiAvailable) {
            this.showToast('❌ Edycja wymaga zalogowania i połączenia z API', 'error');
            return;
        }

        const post = this.posts.find(p => p.id === postId);
        if (!post) return;

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
    }

    showDeleteModal(postId) {
        if (!this.admin.isLoggedIn || !this.apiAvailable) {
            this.showToast('❌ Usuwanie wymaga zalogowania i połączenia z API', 'error');
            return;
        }

        this.currentDeleteId = postId;
        const deleteModal = document.getElementById('deleteModal');
        if (deleteModal) {
            deleteModal.classList.remove('hidden');
        }
    }

    hideDeleteModal() {
        const deleteModal = document.getElementById('deleteModal');
        if (deleteModal) {
            deleteModal.classList.add('hidden');
        }
        this.currentDeleteId = null;
    }

    async confirmDelete() {
        if (!this.currentDeleteId || !this.admin.isLoggedIn) return;

        const success = await this.deletePostFromAPI(this.currentDeleteId);
        if (success) {
            this.hideDeleteModal();
            this.renderPosts();
            this.renderRecentPosts();
            if (this.apiAvailable) {
                await this.updateStatsFromAPI();
            } else {
                this.updateStats();
            }
        }
    }

    hideAllModals() {
        this.hideLoginModal();
        this.hidePostModal();  
        this.hideDeleteModal();
    }

    renderPosts() {
        const container = document.getElementById('postsContainer');
        if (!container) return;

        // Remove loading content
        const loading = document.getElementById('loadingContent');
        if (loading) loading.style.display = 'none';

        if (this.posts.length === 0) {
            container.innerHTML = `
                <div class="no-posts">
                    <div class="no-posts__content">
                        <h2>📝 Brak wpisów</h2>
                        <p>Nie ma jeszcze żadnych wpisów na blogu.</p>
                        ${this.admin.isLoggedIn && this.apiAvailable ? '<p><strong>Jako administrator możesz dodać pierwszy wpis!</strong></p>' : ''}
                        ${!this.apiAvailable ? '<div style="margin-top: 1rem; padding: 1rem; background: #fef3c7; border: 1px solid #fbbf24; border-radius: 0.5rem; color: #92400e;"><p style="margin: 0; font-size: 0.875rem;"><strong>💡 Tryb Offline:</strong> Aby dodawać wpisy, wgraj pliki na serwer PHP z api.php</p></div>' : ''}
                    </div>
                </div>
            `;
            return;
        }

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
    }

    renderPost(post) {
        const adminActions = (this.admin.isLoggedIn && this.apiAvailable) ? `
            <div class="post__actions">
                <button class="btn btn--admin btn--sm edit-post-btn" data-post-id="${post.id}">
                    ✏️ Edytuj
                </button>
                <button class="btn btn--danger btn--sm delete-post-btn" data-post-id="${post.id}">
                    🗑️ Usuń
                </button>
            </div>
        ` : '';

        const formattedContent = post.content.split('\\n\\n').map(paragraph => 
            `<p>${paragraph.replace(/\\n/g, '<br>')}</p>`
        ).join('');

        const imageHtml = post.imageUrl ? `
            <img src="${post.imageUrl}" alt="${this.escapeHtml(post.title)}" class="post__image" 
                 onerror="this.style.display='none';">
        ` : '';

        const statusIndicator = this.apiAvailable ? 
            '<div class="server-indicator"><span>🌐 Wpis na serwerze</span></div>' :
            '<div class="server-indicator" style="background: #fef3c7; color: #92400e; border-color: #fbbf24;"><span>📱 Tryb offline</span></div>';

        return `
            <article class="post" id="post-${post.id}">
                <header class="post__header">
                    <div class="post__header-main">
                        <h2 class="post__title">${this.escapeHtml(post.title)}</h2>
                        <div class="post__meta">
                            <span>📅 ${this.formatDate(post.date)}</span>
                            <span>💬 ${post.comments?.length || 0} komentarzy</span>
                        </div>
                        ${statusIndicator}
                    </div>
                    ${adminActions}
                </header>

                ${imageHtml}

                <div class="post__content">
                    ${formattedContent}
                </div>

                <section class="comments">
                    <h3 class="comments__header">💬 Komentarze (${post.comments?.length || 0})</h3>

                    <div class="comments__list">
                        ${(post.comments || []).map(comment => this.renderComment(comment)).join('')}
                    </div>

                    <div class="comment-form">
                        <h4>💌 Dodaj komentarz</h4>
                        ${this.apiAvailable ? `
                            <form class="comment-form-inner" data-post-id="${post.id}">
                                <div class="form-row">
                                    <div class="form-group">
                                        <label class="form-label">Imię</label>
                                        <input type="text" name="name" class="form-control" required>
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">Email</label>
                                        <input type="email" name="email" class="form-control" required>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Komentarz</label>
                                    <textarea name="content" class="form-control" rows="3" required></textarea>
                                </div>
                                <button type="submit" class="btn btn--primary">💌 Dodaj komentarz</button>
                            </form>
                        ` : `
                            <div style="padding: 1rem; background: #fef3c7; border: 1px solid #fbbf24; border-radius: 0.5rem; color: #92400e;">
                                <p style="margin: 0; font-size: 0.875rem;">💡 Dodawanie komentarzy wymaga połączenia z serwerem</p>
                            </div>
                        `}
                    </div>
                </section>
            </article>
        `;
    }

    renderComment(comment) {
        const initials = (comment.authorName || 'U').split(' ').map(name => name[0]).join('').toUpperCase();

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
        document.querySelectorAll('.edit-post-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const postId = parseInt(btn.dataset.postId);
                this.showEditPostModal(postId);
            });
        });

        document.querySelectorAll('.delete-post-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const postId = parseInt(btn.dataset.postId);
                this.showDeleteModal(postId);
            });
        });

        document.querySelectorAll('.comment-form-inner').forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const postId = parseInt(form.dataset.postId);
                this.handleCommentSubmit(e, postId);
            });
        });
    }

    async handleCommentSubmit(e, postId) {
        e.preventDefault();

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
            if (this.apiAvailable) {
                await this.updateStatsFromAPI();
            } else {
                this.updateStats();
            }
        }
    }

    async updateStatsFromAPI() {
        if (!this.apiAvailable) return;

        try {
            const result = await this.apiRequest('stats');

            const postsCount = document.getElementById('postsCount');
            const commentsCount = document.getElementById('commentsCount');

            if (postsCount) postsCount.textContent = result.data.totalPosts;
            if (commentsCount) commentsCount.textContent = result.data.totalComments;

        } catch (error) {
            console.error('❌ Failed to update stats:', error);
            this.updateStats();
        }
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

    showOfflineNotice() {
        const notice = document.createElement('div');
        notice.style.cssText = `
            position: fixed; top: 20px; left: 20px; right: 20px; 
            background: linear-gradient(135deg, #fef3c7, #fde68a); 
            border: 2px solid #fbbf24; border-radius: 1rem; padding: 1rem; 
            box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); z-index: 1000; 
            color: #92400e;
        `;

        notice.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem; font-weight: 600; margin-bottom: 0.5rem;">
                📱 <span>Tryb Offline</span>
            </div>
            <p style="margin: 0; font-size: 0.875rem;">
                API nie jest dostępne. Funkcje dodawania/edycji/usuwania wpisów są wyłączone. 
                <strong>Aby uzyskać pełną funkcjonalność, wgraj pliki na hosting PHP.</strong>
            </p>
            <button onclick="this.parentElement.remove()" style="position: absolute; top: 0.5rem; right: 0.5rem; background: none; border: none; font-size: 1.25rem; cursor: pointer; color: #92400e;">&times;</button>
        `;

        document.body.appendChild(notice);

        setTimeout(() => notice.remove(), 10000);
    }

    escapeHtml(unsafe) {
        return (unsafe || '')
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
        console.log(`🍞 Toast [${type}]:`, message);

        const container = document.getElementById('toastContainer');
        if (!container) {
            console.warn('⚠️ Toast container not found');
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

    debugInfo() {
        console.log('🔍 DEBUG INFO:');
        console.log('📊 Posts:', this.posts.length);
        console.log('🌐 API Available:', this.apiAvailable);
        console.log('🔐 Admin logged in:', this.admin.isLoggedIn);
        console.log('📡 API Base:', this.API_BASE);
        return this;
    }

    async refreshFromServer() {
        if (!this.apiAvailable) {
            this.showToast('❌ API nie jest dostępne', 'error');
            return this;
        }

        console.log('🔄 Refreshing all data from server...');
        await this.loadPostsFromAPI();
        this.renderPosts();
        this.renderRecentPosts();
        await this.updateStatsFromAPI();
        this.showToast('✅ Dane odświeżone z serwera!', 'success');
        return this;
    }
}

// Initialize the application
let professionalBlogApp;

function initProfessionalBlogApp() {
    try {
        console.log('🚀 Attempting to initialize professional blog app...');
        professionalBlogApp = new ProfessionalBlogApp();
        window.blogApp = professionalBlogApp;

        window.debugBlog = () => professionalBlogApp.debugInfo();
        window.refreshBlog = () => professionalBlogApp.refreshFromServer();

        console.log('🎉 Professional blog app initialized!');
        console.log('💡 Debug commands: debugBlog(), refreshBlog()');

    } catch (error) {
        console.error('❌ Failed to initialize professional blog app:', error);
    }
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    console.log('📱 DOM ready, initializing immediately');
    initProfessionalBlogApp();
} else {
    console.log('⏳ Waiting for DOM to be ready');
    document.addEventListener('DOMContentLoaded', initProfessionalBlogApp);
}

console.log('✅ Professional Blog Application script loaded - API Fixed!');
