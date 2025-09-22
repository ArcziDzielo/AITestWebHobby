// Blog Application - ULTRA FIXED + PERSISTENT STORAGE VERSION
// Dodane trwałe przechowywanie danych w localStorage

console.log('🎯 ULTRA FIXED + PERSISTENT STORAGE - Loading blog application...');

class BlogApp {
  constructor() {
    console.log('🏗️ BlogApp constructor called');

    this.posts = [];
    this.currentEditId = null;
    this.currentDeleteId = null;
    this.postIdCounter = 1;
    this.commentIdCounter = 1;
    this.debugMode = true;

    // Admin authentication system
    this.admin = {
      login: "admin",
      password: "admin123", 
      email: "admin@blog.pl",
      isLoggedIn: false
    };

    // Storage keys
    this.STORAGE_KEYS = {
      POSTS: 'passionhub_posts',
      ADMIN: 'passionhub_admin',
      COUNTERS: 'passionhub_counters'
    };

    console.log('💾 Persistent storage enabled with localStorage');

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

      // Najpierw załaduj dane z localStorage
      this.loadFromStorage();

      // Jeśli nie ma danych, użyj przykładowych
      if (this.posts.length === 0) {
        this.initializeDefaultData();
      }

      this.initializeEventListeners();
      this.renderPosts();
      this.renderRecentPosts();
      this.updateAdminUI();
      this.updateStats();

      // Dodaj dodatkowy event listener po 1 sekundzie
      setTimeout(() => {
        this.reinforceEventListeners();
      }, 1000);

      console.log('🎉 Blog application initialized successfully!');
      this.runDiagnostics();

    } catch (error) {
      console.error('❌ Error during initialization:', error);
      setTimeout(() => {
        console.log('🔄 Retrying initialization...');
        this.safeInit();
      }, 2000);
    }
  }

  // ===== PERSISTENT STORAGE METHODS =====

  saveToStorage() {
    try {
      console.log('💾 Saving data to localStorage...');

      // Zapisz posty
      localStorage.setItem(this.STORAGE_KEYS.POSTS, JSON.stringify(this.posts));

      // Zapisz ustawienia admina (bez hasła w localStorage dla bezpieczeństwa)
      const adminToSave = {
        login: this.admin.login,
        email: this.admin.email
        // hasło nie jest zapisywane do localStorage
      };
      localStorage.setItem(this.STORAGE_KEYS.ADMIN, JSON.stringify(adminToSave));

      // Zapisz liczniki
      const counters = {
        postIdCounter: this.postIdCounter,
        commentIdCounter: this.commentIdCounter
      };
      localStorage.setItem(this.STORAGE_KEYS.COUNTERS, JSON.stringify(counters));

      console.log('✅ Data saved to localStorage');
      console.log(`📊 Saved ${this.posts.length} posts`);

    } catch (error) {
      console.error('❌ Error saving to localStorage:', error);
      this.showToast('⚠️ Błąd zapisywania danych', 'error');
    }
  }

  loadFromStorage() {
    try {
      console.log('📂 Loading data from localStorage...');

      // Załaduj posty
      const savedPosts = localStorage.getItem(this.STORAGE_KEYS.POSTS);
      if (savedPosts) {
        this.posts = JSON.parse(savedPosts);
        console.log(`📄 Loaded ${this.posts.length} posts from storage`);
      }

      // Załaduj ustawienia admina
      const savedAdmin = localStorage.getItem(this.STORAGE_KEYS.ADMIN);
      if (savedAdmin) {
        const adminData = JSON.parse(savedAdmin);
        this.admin.login = adminData.login || this.admin.login;
        this.admin.email = adminData.email || this.admin.email;
        console.log('👤 Loaded admin settings from storage');
      }

      // Załaduj liczniki
      const savedCounters = localStorage.getItem(this.STORAGE_KEYS.COUNTERS);
      if (savedCounters) {
        const counters = JSON.parse(savedCounters);
        this.postIdCounter = counters.postIdCounter || this.postIdCounter;
        this.commentIdCounter = counters.commentIdCounter || this.commentIdCounter;
        console.log('🔢 Loaded counters from storage');
      }

      // Ustaw liczniki na podstawie istniejących danych jeśli nie ma zapisanych
      if (this.posts.length > 0) {
        const maxPostId = Math.max(...this.posts.map(p => p.id));
        const maxCommentId = Math.max(...this.posts.flatMap(p => p.comments.map(c => c.id)));
        this.postIdCounter = Math.max(this.postIdCounter, maxPostId + 1);
        this.commentIdCounter = Math.max(this.commentIdCounter, maxCommentId + 1);
      }

      console.log('✅ Data loaded from localStorage');

    } catch (error) {
      console.error('❌ Error loading from localStorage:', error);
      console.log('📝 Will use default data instead');
    }
  }

  clearStorage() {
    try {
      console.log('🗑️ Clearing localStorage...');
      localStorage.removeItem(this.STORAGE_KEYS.POSTS);
      localStorage.removeItem(this.STORAGE_KEYS.ADMIN);
      localStorage.removeItem(this.STORAGE_KEYS.COUNTERS);
      console.log('✅ localStorage cleared');
    } catch (error) {
      console.error('❌ Error clearing localStorage:', error);
    }
  }

  // ===== INITIALIZATION METHODS =====

  initializeDefaultData() {
    console.log('📄 Loading default sample data...');

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

    this.postIdCounter = 4;
    this.commentIdCounter = 4;

    console.log('✅ Default data loaded:', this.posts.length, 'posts');

    // Zapisz domyślne dane do localStorage
    this.saveToStorage();
  }

  runDiagnostics() {
    console.log('🔍 DIAGNOSTYKA:');
    console.log('📊 Posts loaded:', this.posts.length);
    console.log('🔐 Admin logged in:', this.admin.isLoggedIn);
    console.log('🆔 Next post ID:', this.postIdCounter);
    console.log('💾 Storage check:');

    // Sprawdź localStorage
    try {
      const postsInStorage = localStorage.getItem(this.STORAGE_KEYS.POSTS);
      console.log('📂 Posts in localStorage:', postsInStorage ? JSON.parse(postsInStorage).length : 0);
    } catch (e) {
      console.log('❌ localStorage error:', e.message);
    }

    // Sprawdź DOM
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

  // Event listeners setup (unchanged from previous version)
  initializeEventListeners() {
    console.log('🔗 Setting up event listeners...');

    try {
      this.setupAuthHandlers();
      this.setupAdminHandlers();
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

  setupAdminHandlers() {
    const adminSettingsForm = document.getElementById('adminSettingsForm');
    if (adminSettingsForm) {
      adminSettingsForm.addEventListener('submit', (e) => this.handleAdminSettings(e));
      console.log('✅ Admin settings handler set');
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

  // Authentication methods (unchanged)
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
      if (elements.loginBtn) elements.loginBtn.classList.add('hidden');
      if (elements.adminStatus) elements.adminStatus.classList.remove('hidden');
      if (elements.adminPanel) elements.adminPanel.classList.remove('hidden');
      if (elements.adminActions) elements.adminActions.classList.remove('hidden');
      document.body.classList.add('admin-logged-in');

      this.updateAdminSettingsForm();
      console.log('👑 Admin UI enabled');

      const addPostBtn = document.getElementById('addPostBtn');
      if (addPostBtn) {
        console.log('✅ Add post button should now be visible');
      }

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

    // Zapisz nowe ustawienia do localStorage
    this.saveToStorage();

    this.showToast('✅ Ustawienia zostały zapisane!', 'success');
    console.log('✅ Admin settings saved:', this.admin);
  }

  // Post management - UPDATED WITH PERSISTENT STORAGE
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

    const formData = this.getFormData();
    if (!formData) return;

    console.log('📝 Form data:', formData);

    const success = this.savePost(formData);
    if (!success) return;

    // KLUCZOWE: Zapisz do localStorage po każdej zmianie
    this.saveToStorage();

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
        console.log('➕ Adding new post');
        const newPost = {
          id: this.postIdCounter++,
          title: formData.title,
          imageUrl: formData.imageUrl,
          content: formData.content,
          date: now,
          comments: []
        };

        this.posts.unshift(newPost);

        this.showToast('🎉 Nowy wpis został dodany i zapisany!', 'success');
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

      // KLUCZOWE: Zapisz po usunięciu
      this.saveToStorage();

      this.hideDeleteModal();
      this.renderPosts();
      this.renderRecentPosts();
      this.updateStats();
      this.showToast('🗑️ Wpis został usunięty i zmiany zapisane!', 'success');
      console.log('✅ Post deleted:', deletedPost.title);
    }
  }

  hideAllModals() {
    this.hideLoginModal();
    this.hidePostModal();
    this.hideDeleteModal();
  }

  // Rendering methods (mostly unchanged)
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
          <div style="margin-top: 20px; padding: 15px; background: #fef3c7; border-radius: 8px; border: 2px solid #fbbf24;">
            <p><strong>💡 Informacja:</strong> Twoje wpisy są zapisywane w przeglądarce i będą dostępne po odświeżeniu strony.</p>
          </div>
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

    const persistenceIndicator = `
      <div style="margin-top: 10px; font-size: 0.75rem; color: #6b7280; display: flex; align-items: center; gap: 5px;">
        💾 <span>Wpis zapisany lokalnie</span>
      </div>
    `;

    return `
      <article class="post" id="post-${post.id}">
        <header class="post__header">
          <div>
            <h2 class="post__title">${this.escapeHtml(post.title)}</h2>
            <div class="post__meta">
              <span>📅 ${this.formatDate(post.date)}</span>
              <span>💬 ${post.comments.length} komentarzy</span>
            </div>
            ${persistenceIndicator}
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

    // KLUCZOWE: Zapisz po dodaniu komentarza
    this.saveToStorage();

    this.renderPosts();
    this.updateStats();
    this.simulateEmailNotification(newComment, post);
    this.showToast('✅ Komentarz został dodany i zapisany!', 'success');
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

  // Utility methods (unchanged)
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
    }, 5000); // Zwiększony czas wyświetlania do 5 sekund
  }

  // ===== DEBUGGING AND ADMIN UTILITIES =====

  // Metody pomocnicze dla debugowania (dostępne z konsoli)
  debugInfo() {
    console.log('🔍 DEBUG INFO:');
    console.log('📊 Posts:', this.posts.length);
    console.log('🔐 Admin logged in:', this.admin.isLoggedIn);
    console.log('💾 LocalStorage data:', {
      posts: localStorage.getItem(this.STORAGE_KEYS.POSTS) ? JSON.parse(localStorage.getItem(this.STORAGE_KEYS.POSTS)).length : 0,
      admin: !!localStorage.getItem(this.STORAGE_KEYS.ADMIN),
      counters: !!localStorage.getItem(this.STORAGE_KEYS.COUNTERS)
    });
    return this;
  }

  clearAllData() {
    if (confirm('Czy na pewno chcesz usunąć wszystkie dane? Ta operacja jest nieodwracalna!')) {
      this.posts = [];
      this.postIdCounter = 1;
      this.commentIdCounter = 1;
      this.clearStorage();
      this.renderPosts();
      this.renderRecentPosts();
      this.updateStats();
      this.showToast('🗑️ Wszystkie dane zostały usunięte!', 'info');
      console.log('🗑️ All data cleared');
    }
    return this;
  }

  exportData() {
    const data = {
      posts: this.posts,
      admin: { login: this.admin.login, email: this.admin.email },
      counters: { postIdCounter: this.postIdCounter, commentIdCounter: this.commentIdCounter },
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `passion-hub-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    this.showToast('📥 Backup został pobrany!', 'success');
    console.log('📥 Data exported');
    return this;
  }
}

// Inicjalizacja z dodatkowymi zabezpieczeniami
console.log('🎯 Starting ULTRA FIXED + PERSISTENT STORAGE blog application...');

let blogApp;

function initBlogApp() {
  try {
    console.log('🚀 Attempting to initialize blog app...');
    blogApp = new BlogApp();
    window.BlogApp = BlogApp;
    window.blogApp = blogApp;

    // Udostępnij metody debugowania w konsoli
    window.debugBlog = () => blogApp.debugInfo();
    window.clearBlogData = () => blogApp.clearAllData();
    window.exportBlogData = () => blogApp.exportData();

    console.log('🎉 Blog app initialized successfully!');
    console.log('💡 Debug commands: debugBlog(), clearBlogData(), exportBlogData()');

  } catch (error) {
    console.error('❌ Failed to initialize blog app:', error);
    setTimeout(initBlogApp, 2000);
  }
}

// Wielokrotne próby inicjalizacji
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  console.log('📱 DOM ready, initializing immediately');
  initBlogApp();
} else {
  console.log('⏳ Waiting for DOM to be ready');
  document.addEventListener('DOMContentLoaded', initBlogApp);

  setTimeout(() => {
    if (!window.blogApp) {
      console.log('🔄 Backup initialization after 3s');
      initBlogApp();
    }
  }, 3000);
}

console.log('✅ ULTRA FIXED + PERSISTENT STORAGE blog script loaded!');
