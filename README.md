# 🐕 Passion Hub - Blog o Hobby

Profesjonalna strona internetowa - blog o hobby z systemem administracyjnym w żółtych odcieniach.

## 🔧 NAPRAWIONY PROBLEM Z DODAWANIEM WPISÓW!

⚠️ **Ta wersja zawiera poprawki dla problemu z dodawaniem nowych wpisów przez administratora.**

## 📋 Funkcje

✅ **System administracyjny** - bezpieczne logowanie i zarządzanie  
✅ **Zarządzanie wpisami** - dodawanie, edycja, usuwanie (tylko admin) **[NAPRAWIONE]**  
✅ **System komentarzy** - dla wszystkich użytkowników  
✅ **Powiadomienia email** - symulowane powiadomienia o komentarzach  
✅ **Responsywny design** - działa na wszystkich urządzeniach  
✅ **Żółta kolorystyka** - ciepłe, przyjazne kolory  
✅ **Header z grafiką** - słodkie pieski w tle  
✅ **Logi debugowania** - szczegółowe informacje w konsoli przeglądarki  

## 🔐 Dane administratora

- **Login:** `admin`
- **Hasło:** `admin123`  
- **Email:** `admin@blog.pl`

## 🚀 Szybka instalacja na GitHub Pages

### Krok 1: Utwórz repozytorium GitHub
1. Idź na [github.com](https://github.com) i zaloguj się
2. Kliknij **"New"** aby utworzyć nowe repozytorium
3. Nazwij je: `hobby-blog`
4. ✅ Zaznacz **"Public"**  
5. ✅ Zaznacz **"Add a README file"**
6. Kliknij **"Create repository"**

### Krok 2: Wgraj pliki
1. **Kliknij "Add file" → "Upload files"**
2. **Przeciągnij wszystkie pliki** z tego pakietu na stronę
3. **Wpisz commit message:** "Dodanie plików bloga"
4. **Kliknij "Commit changes"**

### Krok 3: Włącz GitHub Pages
1. **Idź do "Settings"** (zakładka na górze)
2. **Znajdź sekcję "Pages"** (w menu po lewej)
3. **Source:** wybierz **"Deploy from a branch"**
4. **Branch:** wybierz **"main"** i **"/ (root)"**
5. **Kliknij "Save"**

### Krok 4: Sprawdź stronę
- Po kilku minutach GitHub pokaże link do Twojej strony
- Link będzie w formacie: `https://TwojaNamena.github.io/hobby-blog/`

## 🌐 Dodanie własnej domeny (opcjonalne)

Jeśli chcesz użyć domeny `1lo.hobby`:

1. **Kup domenę** na home.pl lub innym serwisie
2. **W panelu domeny dodaj rekordy DNS:**
   ```
   CNAME  www  TwojaNamena.github.io
   A      @    185.199.108.153
   A      @    185.199.109.153
   A      @    185.199.110.153
   A      @    185.199.111.153
   ```
3. **W GitHub:** Settings → Pages → Custom domain: `1lo.hobby`
4. **Poczekaj 24-48h** na propagację DNS

## 🔧 Jak używać

### Logowanie jako administrator:
1. Kliknij **"Zaloguj jako Administrator"**
2. Wpisz: `admin` / `admin123`
3. Po zalogowaniu zobaczysz żółty panel administracyjny

### Dodawanie wpisów:
1. **Po zalogowaniu** w panelu bocznym pojawi się przycisk **"Dodaj nowy wpis"**
2. Kliknij go i wypełnij formularz
3. **Tytuł i treść są wymagane**, zdjęcie opcjonalne

### Komentarze:
- Każdy może dodawać komentarze
- Administrator otrzymuje powiadomienia email (symulowane)

## 🐛 Debugowanie

Jeśli coś nie działa:

1. **Otwórz konsolę przeglądarki** (F12 → Console)
2. **Sprawdź komunikaty** - powinny być takie:
   ```
   🚀 Blog App initializing...
   📄 Sample data loaded: 3 posts
   ✅ Add Post button found, attaching listener
   ✅ Blog App initialized successfully
   ```
3. **Jeśli są błędy**, sprawdź czy wszystkie pliki zostały wgrane
4. **Wyczyść cache** przeglądarki (Ctrl+Shift+Del)

## 📞 Problemy?

- Sprawdź czy repozytorium jest **publiczne**
- Plik musi nazywać się **`index.html`** (nie `index.htm`)  
- Odczekaj kilka minut po włączeniu GitHub Pages
- Sprawdź [status GitHub](https://githubstatus.com)

---

**🎉 Powodzenia z Twoim blogiem! Problem z dodawaniem wpisów został naprawiony.**
