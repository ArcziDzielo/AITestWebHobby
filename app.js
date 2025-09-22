// Blog Application - ULTRA FIXED VERSION
// Dodatkowe zabezpieczenia dla problemu z zapisywaniem wpisów

console.log('🎯 ULTRA FIXED VERSION - Loading blog application...');

class BlogApp {
  constructor() {
    console.log('🏗️ BlogApp constructor called');

    this.posts = [];
    this.currentEditId = null;
    this.currentDeleteId = null;
    this.postIdCounter = 1;
    this.commentIdCounter = 1;
    this.debugMode = true; // Włącz tryb debug

    // Admin authentication system
    this.admin = {
      login: "admin",
      password: "admin123",
      email: "admin@blog.pl",
      isLoggedIn: false
    };

    console.log('💾 Admin config:', this.admin);

    // Bezpieczna inicjalizacja
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

  safeInit() {
    try {
      console.log('🚀 Starting safe initialization...');

      this.initializeData();
      this.initializeEventListeners();
      this.renderPosts();
      this.renderRecentPosts();
      this.updateAdminUI();
      this.updateStats();

      // Dodaj dodatkowy event listener po 1 sekundzie dla pewności
      setTimeout(() => {
        this.reinforceEventListeners();
      }, 1000);

      console.log('🎉 Blog application initialized successfully!');

      // Wyświetl diagnostykę
      this.runDiagnostics();

    } catch (error) {
      console.error('❌ Error during initialization:', error);
      // Spróbuj ponownie za 2 sekundy
      setTimeout(() => {
        console.log('🔄 Retrying initialization...');
        this.safeInit();
      }, 2000);
    }
  }

  runDiagnostics() {
    console.log('🔍 DIAGNOSTYKA:');
    console.log('📊 Posts loaded:', this.posts.length);
    console.log('🔐 Admin logged in:', this.admin.isLoggedIn);
    console.log('🆔 Next post ID:', this.postIdCounter);

    // Sprawdź kluczowe elementy DOM
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

  reinforceEventListeners() {
    console.log('🔧 Reinforcing event listeners...');

    // Dodatkowy listener dla przycisku dodawania postów
    const addPostBtn = document.getElementById('addPostBtn');
    if (addPostBtn) {
      // Usuń stary listener (gdyby był)
      addPostBtn.removeEventListener('click', this.handleAddPostClick);

      // Dodaj nowy listener
      this.handleAddPostClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('🎯 ADD POST CLICKED via reinforced listener');
        this.showAddPostModal();
      };

      addPostBtn.addEventListener('click', this.handleAddPostClick);
      console.log('✅ Add post button reinforced');

      // Dodaj onclick jako backup
      addPostBtn.onclick = (e) => {
        e.preventDefault();
        console.log('🎯 ADD POST CLICKED via onclick backup');
        this.showAddPostModal();
      };
    }
  }

  initializeData() {
    console.log('📄 Loading sample data...');

    this.posts = [
      {
        id: 1,
        title: "5 powodów, dlaczego majsterkowanie zmienia życie",
        content: "Majsterkowanie to nie tylko hobby – to prawdziwa pasja, która odmienia nasze podejście do życia. Po pierwsze, rozwija naszą kreatywność i umiejętność rozwiązywania problemów. Każdy projekt DIY to nowe wyzwanie, które mobilizuje nas do myślenia poza schematami.\n\nPo drugie, majsterkowanie daje niesamowitą satysfakcję z tworzenia czegoś własnymi rękami. Nie ma lepszego uczucia niż patrzenie na gotowy projekt i świadomość, że to Ty go stworzyłeś od podstaw. Po trzecie, to doskonały sposób na relaks i odprężenie po ciężkim dniu pracy.\n\nCzwartym powodem jest aspekt ekonomiczny – naprawiając i tworząc samodzielnie, oszczędzamy znaczne kwoty. Wreszcie, majsterkowanie łączy pokolenia – możemy uczyć się od starszych i przekazywać wiedzę młodszym.",
        imageUrl: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&h=400&fit=crop",
        date: "2024-03-15",
        comments: [
          {
            id: 1,
            authorName: "Anna Kowalska",
            authorEmail: "anna@example.com",
            content: "Świetny wpis! Całkowicie się zgadzam - majsterkowanie to najlepsza terapia po pracy.",
            date: "2024-03-16"
          }
        ]
      },
      {
        id: 2,
        title: "Jak zacząć przygodę z DIY - poradnik dla początkujących",
        content: "Rozpoczynanie przygody z majsterkowaniem może wydawać się przytłaczające, ale tak naprawdę wystarczy kilka prostych kroków. Pierwszym z nich jest zdefiniowanie swoich zainteresowań – czy wolisz pracę z drewnem, metalem, tkaniną, czy może elektronikę?\n\nNastępnie warto zacząć od prostych projektów, które nie wymagają drogich narzędzi. Świetnym początkiem może być renowacja starych mebli, tworzenie dekoracji do domu lub proste naprawy. Ważne, żeby nie zniechęcić się pierwszymi niepowodzeniami – każdy majsterkowicz przeszedł przez fazę uczenia się.\n\nKluczowe jest również zbudowanie podstawowego zestawu narzędzi. Nie musisz od razu kupować wszystkiego – zacznij od podstaw i stopniowo rozszerzaj swoje wyposażenie. Pamiętaj, że najważniejsza jest praktyka i cierpliwość.",
        imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop",
        date: "2024-03-12",
        comments: []
      },
      {
        id: 3,
        title: "Narzędzia, które każdy majsterkowicz powinien mieć",
        content: "Dobry majsterkowicz to ten, który ma odpowiednie narzędzia. W każdym domu powinna znaleźć się podstawowa skrzynka z narzędziami, która pozwoli na wykonanie większości domowych napraw i projektów DIY.\n\nDo podstawowego zestawu należą: młotek, zestaw śrubokrętów (płaskie i krzyżakowe), klucze imbusowe, poziomica, miara, żółta taśma, szczypce uniwersalne i nóż do tapet. Te narzędzia pozwolą Ci na 80% domowych prac.\n\nW miarę rozwoju umiejętności warto zainwestować w wiertarkę udarową, szlifierkę kątową, pilarkę elektryczną i profesjonalne narzędzia pomiarowe. Pamiętaj, że jakość ma znaczenie – lepiej mieć mniej narzędzi, ale dobrych, niż dużo tanich, które szybko się zepsują.",
        imageUrl: "https://images.unsplash.com/photo-1609781739569-437112c4b74f?w=600&h=400&fit=crop",
        date: "2024-03-10",
        comments: [
          {
            id: 2,
            authorName: "Piotr Nowak",
            authorEmail: "piotr@example.com",
            content: "Świetny przegląd! Ja bym dodał jeszcze dobrą latarkę - bez światła ciężko cokolwiek robić.",
            date: "2024-03-11"
          },
          {
            id: 3,
            authorName: "Marta Wiśniewska", 
            authorEmail: "marta@example.com",
            content: "Zgadzam się co do jakości narzędzi. Lepiej raz dobrze kupić niż wielokrotnie wymieniać.",
            date: "2024-03-12"
          }
        ]
      }
    ];

    // Ustaw liczniki
    this.postIdCounter = Math.max(...this.posts.map(p => p.id)) + 1;
    this.commentIdCounter = Math.max(
      ...this.posts.flatMap(p => p.comments.map(c => c.id))
    ) + 1;

    console.log('✅ Sample data loaded:', this.posts.length, 'posts');
    console.log('🆔 Next post ID will be:', this.postIdCounter);
  }

  initializeEventListeners() {
    console.log('🔗 Setting up event listeners...');

    try {
      // Login/Logout handlers
      this.setupAuthHandlers();

      // Admin settings
      this.setupAdminHandlers();

      // Post management
      this.setupPostHandlers();

      // Delete confirmation
      this.setupDeleteHandlers();

      // ESC key
      this.setupKeyboardHandlers();

      console.log('✅ All event listeners set up');

    } catch (error) {
      console.error('❌ Error setting up event listeners:', error);
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

    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => this.handleLogin(e));
      console.log('✅ Login form handler set');
    }

    // Login modal close handlers
    ['loginClose', 'loginCancel'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('click', () => this.hideLoginModal());
    });

    const loginOverlay = document.getElementById('loginOverlay');
    if (loginOverlay) {
      loginOverlay.addEventListener('click', () => this.hideLoginModal());
    }
  }

  setupAdminHandlers() {
    const adminSettingsForm = document.getElementById('adminSettingsForm');
    if (adminSettingsForm) {
      adminSettingsForm.addEventListener('submit', (e) => this.handleAdminSettings(e));
      console.log('✅ Admin settings handler set');
    }
  }

  setupPostHandlers() {
    // GŁÓWNY HANDLER dla dodawania postów - WZMOCNIONY
    const addPostBtn = document.getElementById('addPostBtn');
    if (addPostBtn) {
      console.log('🎯 Found add post button, setting up handlers...');

      // Handler 1: addEventListener
      addPostBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('🎯 ADD POST CLICKED (addEventListener)');
        this.showAddPostModal();
      });

      // Handler 2: onclick jako backup
      addPostBtn.onclick = (e) => {
        e.preventDefault();
        console.log('🎯 ADD POST CLICKED (onclick backup)');
        this.showAddPostModal();
      };

      console.log('✅ Add post button handlers set (both addEventListener and onclick)');
    } else {
      console.warn('⚠️ Add post button not found');
    }

    // Post form
    const postForm = document.getElementById('postForm');
    if (postForm) {
      postForm.addEventListener('submit', (e) => {
        console.log('📝 Post form submitted');
        this.handlePostSubmit(e);
      });
      console.log('✅ Post form handler set');
    }

    // Post modal close handlers
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

  handleLogin(e) {
    e.preventDefault();
    console.log('🔑 Processing login...');

    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    console.log('👤 Login attempt for:', username);

    if (username === this.admin.login && password === this.admin.password) {
      this.admin.isLoggedIn = true;
      this.hideLoginModal();
      this.updateAdminUI();
      this.showToast('🎉 Pomyślnie zalogowano!', 'success');
      console.log('✅ Login successful');

      // Ponownie ustaw event listenery po zalogowaniu
      setTimeout(() => {
        this.reinforceEventListeners();
      }, 500);

    } else {
      this.showToast('❌ Nieprawidłowy login lub hasło!', 'error');
      console.log('❌ Login failed');
    }
  }

  logout() {
    console.log('🚪 Logging out...');
    this.admin.isLoggedIn = false;
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
      // Show admin elements
      if (elements.loginBtn) elements.loginBtn.classList.add('hidden');
      if (elements.adminStatus) elements.adminStatus.classList.remove('hidden');
      if (elements.adminPanel) elements.adminPanel.classList.remove('hidden');
      if (elements.adminActions) elements.adminActions.classList.remove('hidden');
      document.body.classList.add('admin-logged-in');

      // Update admin settings form
      this.updateAdminSettingsForm();
      console.log('👑 Admin UI enabled');

      // Upewnij się, że przycisk dodawania jest widoczny
      const addPostBtn = document.getElementById('addPostBtn');
      if (addPostBtn) {
        console.log('✅ Add post button should now be visible');
      }

    } else {
      // Hide admin elements
      if (elements.loginBtn) elements.loginBtn.classList.remove('hidden');
      if (elements.adminStatus) elements.adminStatus.classList.add('hidden');
      if (elements.adminPanel) elements.adminPanel.classList.add('hidden');
      if (elements.adminActions) elements.adminActions.classList.add('hidden');
      document.body.classList.remove('admin-logged-in');
      console.log('👤 Admin UI disabled');
    }

    // Re-render posts to show/hide admin buttons
    this.renderPosts();
  }

  updateAdminSettingsForm() {
    const fields = {
      adminLogin: document.getElementById('adminLogin'),
      adminPassword: document.getElementById('adminPassword'),
      adminEmail: document.getElementById('adminEmail')
    };

    if (fields.adminLogin) fields.adminLogin.value = this.admin.login;
    if (fields.adminPassword) fields.adminPassword.value = this.admin.password;
    if (fields.adminEmail) fields.adminEmail.value = this.admin.email;
  }

  handleAdminSettings(e) {
    e.preventDefault();
    console.log('⚙️ Saving admin settings...');

    const newLogin = document.getElementById('adminLogin').value.trim();
    const newPassword = document.getElementById('adminPassword').value.trim();
    const newEmail = document.getElementById('adminEmail').value.trim();

    if (!newLogin || !newPassword || !newEmail) {
      this.showToast('❌ Wszystkie pola są wymagane!', 'error');
      return;
    }

    this.admin.login = newLogin;
    this.admin.password = newPassword;
    this.admin.email = newEmail;

    this.showToast('✅ Ustawienia zostały zapisane!', 'success');
    console.log('✅ Admin settings saved:', this.admin);
  }

  // Post management - SUPER WZMOCNIONE
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

    console.log('🔍 Modal elements check:');
    Object.entries(elements).forEach(([name, el]) => {
      console.log(`${el ? '✅' : '❌'} ${name}`);
    });

    if (elements.modalTitle) elements.modalTitle.textContent = '📝 Dodaj nowy wpis';
    if (elements.postForm) {
      elements.postForm.reset();
      console.log('✅ Form reset');
    }

    if (elements.postModal) {
      elements.postModal.classList.remove('hidden');
      console.log('✅ Modal shown');
    } else {
      console.error('❌ Post modal not found!');
      this.showToast('❌ Błąd: Nie można otworzyć formularza', 'error');
      return;
    }

    if (elements.postTitle) {
      setTimeout(() => elements.postTitle.focus(), 100);
    }

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

  handlePostSubmit(e) {
    e.preventDefault();
    console.log('💾 HANDLE POST SUBMIT called');
    console.log('🔐 Admin logged in:', this.admin.isLoggedIn);
    console.log('✏️ Current edit ID:', this.currentEditId);

    if (!this.admin.isLoggedIn) {
      this.showToast('❌ Brak uprawnień!', 'error');
      console.log('❌ No admin permissions');
      return;
    }

    // Pobierz dane z formularza
    const formData = this.getFormData();
    if (!formData) return;

    console.log('📝 Form data:', formData);

    // Zapisz post
    const success = this.savePost(formData);
    if (!success) return;

    // Odśwież interfejs
    this.refreshUI();

    console.log('🎉 Post submit completed successfully');
  }

  getFormData() {
    const title = document.getElementById('postTitle')?.value?.trim() || '';
    const imageUrl = document.getElementById('postImage')?.value?.trim() || '';
    const content = document.getElementById('postContent')?.value?.trim() || '';

    console.log('📊 Raw form data:');
    console.log('  Title:', title);
    console.log('  Image URL:', imageUrl || 'none');
    console.log('  Content length:', content.length);

    if (!title) {
      this.showToast('❌ Tytuł jest wymagany!', 'error');
      console.log('❌ Title validation failed');
      return null;
    }

    if (!content) {
      this.showToast('❌ Treść jest wymagana!', 'error');
      console.log('❌ Content validation failed');
      return null;
    }

    return { title, imageUrl, content };
  }

  savePost(formData) {
    try {
      const now = new Date().toISOString().split('T')[0];

      if (this.currentEditId) {
        // Edit existing post
        console.log('✏️ Editing post:', this.currentEditId);
        const postIndex = this.posts.findIndex(p => p.id === this.currentEditId);

        if (postIndex === -1) {
          console.error('❌ Post not found for editing:', this.currentEditId);
          this.showToast('❌ Błąd: Wpis nie został znaleziony', 'error');
          return false;
        }

        this.posts[postIndex] = {
          ...this.posts[postIndex],
          title: formData.title,
          imageUrl: formData.imageUrl,
          content: formData.content
        };

        this.showToast('✅ Wpis został zaktualizowany!', 'success');
        console.log('✅ Post updated successfully:', this.posts[postIndex]);

      } else {
        // Add new post
        console.log('➕ Adding new post');
        const newPost = {
          id: this.postIdCounter++,
          title: formData.title,
          imageUrl: formData.imageUrl,
          content: formData.content,
          date: now,
          comments: []
        };

        // Dodaj na początek listy
        this.posts.unshift(newPost);

        this.showToast('🎉 Nowy wpis został dodany!', 'success');
        console.log('✅ New post added successfully:', newPost);
        console.log('📊 Total posts now:', this.posts.length);
      }

      return true;

    } catch (error) {
      console.error('❌ Error saving post:', error);
      this.showToast('❌ Błąd podczas zapisywania wpisu', 'error');
      return false;
    }
  }

  refreshUI() {
    console.log('🔄 Refreshing UI...');

    try {
      this.hidePostModal();
      this.renderPosts();
      this.renderRecentPosts();
      this.updateStats();
      console.log('✅ UI refreshed successfully');
    } catch (error) {
      console.error('❌ Error refreshing UI:', error);
    }
  }

  // Rendering methods
  renderPosts() {
    console.log('🎨 Rendering', this.posts.length, 'posts...');

    const container = document.getElementById('postsContainer');
    if (!container) {
      console.error('❌ Posts container not found');
      return;
    }

    if (this.posts.length === 0) {
      container.innerHTML = `
        <div class="post">
          <h2>📝 Brak wpisów</h2>
          <p>Nie ma jeszcze żadnych wpisów na blogu.</p>
          ${this.admin.isLoggedIn ? '<p><strong>Jako administrator możesz dodać pierwszy wpis!</strong></p>' : ''}
        </div>
      `;
      console.log('✅ Empty state rendered');
      return;
    }

    try {
      container.innerHTML = this.posts.map(post => this.renderPost(post)).join('');
      this.attachPostEventListeners();
      console.log('✅ Posts rendered successfully');
    } catch (error) {
      console.error('❌ Error rendering posts:', error);
    }
  }

  renderPost(post) {
    const formattedContent = post.content.split('\n\n').map(paragraph => 
      `<p>${paragraph.replace(/\n/g, '<br>')}</p>`
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

    return `
      <article class="post" id="post-${post.id}">
        <header class="post__header">
          <div>
            <h2 class="post__title">${this.escapeHtml(post.title)}</h2>
            <div class="post__meta">
              <span>📅 ${this.formatDate(post.date)}</span>
              <span>💬 ${post.comments.length} komentarzy</span>
            </div>
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
              <div class="form-group">
                <label for="comment-name-${post.id}" class="form-label">Imię</label>
                <input type="text" id="comment-name-${post.id}" name="name" class="form-control" required>
              </div>
              <div class="form-group">
                <label for="comment-email-${post.id}" class="form-label">Email</label>
                <input type="email" id="comment-email-${post.id}" name="email" class="form-control" required>
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

    // Edit post buttons
    document.querySelectorAll('.edit-post-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const postId = parseInt(btn.dataset.postId);
        console.log('✏️ Edit button clicked for post:', postId);
        this.showEditPostModal(postId);
      });
    });

    // Delete post buttons
    document.querySelectorAll('.delete-post-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const postId = parseInt(btn.dataset.postId);
        console.log('🗑️ Delete button clicked for post:', postId);
        this.showDeleteModal(postId);
      });
    });

    // Comment forms
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

  confirmDelete() {
    console.log('🗑️ Confirming delete for post:', this.currentDeleteId);

    if (!this.currentDeleteId || !this.admin.isLoggedIn) return;

    const postIndex = this.posts.findIndex(p => p.id === this.currentDeleteId);
    if (postIndex !== -1) {
      const deletedPost = this.posts[postIndex];
      this.posts.splice(postIndex, 1);
      this.hideDeleteModal();
      this.renderPosts();
      this.renderRecentPosts();
      this.updateStats();
      this.showToast('🗑️ Wpis został usunięty!', 'success');
      console.log('✅ Post deleted:', deletedPost.title);
    }
  }

  hideAllModals() {
    this.hideLoginModal();
    this.hidePostModal();
    this.hideDeleteModal();
  }

  handleCommentSubmit(e, postId) {
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

    const post = this.posts.find(p => p.id === postId);
    if (!post) {
      console.log('❌ Post not found for comment:', postId);
      return;
    }

    const newComment = {
      id: this.commentIdCounter++,
      authorName: name,
      authorEmail: email,
      content: content,
      date: new Date().toISOString().split('T')[0]
    };

    post.comments.push(newComment);
    form.reset();

    this.renderPosts();
    this.updateStats();
    this.simulateEmailNotification(newComment, post);
    this.showToast('✅ Komentarz został dodany!', 'success');
    console.log('✅ Comment added successfully:', newComment.authorName);
  }

  simulateEmailNotification(comment, post) {
    console.log('📧 === EMAIL NOTIFICATION ===');
    console.log('📧 Do:', this.admin.email);
    console.log('📧 Temat: Nowy komentarz w wpisie "' + post.title + '"');
    console.log('📧 Od:', comment.authorName + ' (' + comment.authorEmail + ')');
    console.log('📧 Treść:', comment.content);
    console.log('📧 ===========================');

    setTimeout(() => {
      this.showToast('📧 Powiadomienie wysłane na: ' + this.admin.email, 'info');
    }, 1000);
  }

  updateStats() {
    const postsCount = document.getElementById('postsCount');
    const commentsCount = document.getElementById('commentsCount');

    if (postsCount) {
      postsCount.textContent = this.posts.length;
    }

    if (commentsCount) {
      const totalComments = this.posts.reduce((sum, post) => sum + post.comments.length, 0);
      commentsCount.textContent = totalComments;
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
      // Alternatywnie wyświetl alert
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
    }, 4000);
  }
}

// ULTRA bezpieczna inicjalizacja
console.log('🎯 Starting ULTRA FIXED blog application...');

// Multiple initialization attempts
let blogApp;

function initBlogApp() {
  try {
    console.log('🚀 Attempting to initialize blog app...');
    blogApp = new BlogApp();
    window.BlogApp = BlogApp;
    window.blogApp = blogApp;
    console.log('🎉 Blog app initialized successfully!');
  } catch (error) {
    console.error('❌ Failed to initialize blog app:', error);
    setTimeout(initBlogApp, 2000);
  }
}

// Try immediate initialization
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  console.log('📱 DOM ready, initializing immediately');
  initBlogApp();
} else {
  console.log('⏳ Waiting for DOM to be ready');
  document.addEventListener('DOMContentLoaded', initBlogApp);

  // Backup initialization after 3 seconds
  setTimeout(() => {
    if (!window.blogApp) {
      console.log('🔄 Backup initialization after 3s');
      initBlogApp();
    }
  }, 3000);
}

console.log('✅ ULTRA FIXED blog script loaded!');
