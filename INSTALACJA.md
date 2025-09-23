# 🚀 PASSION HUB - KOMPLETNY BLOG Z API

## ⚡ SZYBKA INSTALACJA (3 minuty)

### 1. PRZYGOTUJ HOSTING
Potrzebujesz hosting z PHP 7.4+:
- **Darmowe:** InfinityFree.net, 000webhost.com, AwardSpace.com
- **Płatne:** home.pl, LH.pl, KEI.pl
- **Localhost:** XAMPP, WAMP, MAMP

### 2. WGRAJ PLIKI
1. **Rozpakuj** wszystkie pliki z tego archiwum
2. **Wgraj** przez FTP lub File Manager do głównego katalogu:
   - `public_html/` (najczęściej)
   - `www/` lub `htdocs/`
3. **Sprawdź** czy wszystkie pliki są w katalogu głównym

### 3. USTAW UPRAWNIENIA
```bash
chmod 755 .                    # Katalog główny
chmod 644 *.html *.css *.js *.php   # Pliki
mkdir data && chmod 755 data/  # Folder danych (automatycznie)
```

### 4. PRZETESTUJ
1. **Idź** na swoją stronę (np. twojadomena.com)
2. **Powinieneś** zobaczyć komunikat: "🌐 Połączono z serwerem"
3. **Zaloguj** się jako admin: `admin` / `admin123`
4. **Dodaj** testowy wpis
5. **Odśwież** stronę → wpis nadal jest = ✅ DZIAŁA!

---

## 🔧 ROZWIĄZYWANIE PROBLEMÓW

### "API nie jest dostępne"
- Sprawdź czy `api.php` jest w tym samym folderze co `index.html`
- Sprawdź czy hosting obsługuje PHP 7.4+
- Sprawdź logi błędów PHP na hostingu

### "500 Internal Server Error" 
- Sprawdź uprawnienia plików
- Sprawdź czy folder `data/` może być utworzony
- Sprawdź logi błędów serwera

### "Strona się nie ładuje"
- Sprawdź czy `index.html` jest w głównym katalogu
- Spróbuj wejść na: `twojadomena.com/index.html`
- Sprawdź czy hosting jest aktywny

### "Nie mogę się zalogować"
- Domyślny login: `admin`
- Domyślne hasło: `admin123`
- Aby zmienić hasło, edytuj `api.php`

---

## ✅ CO OTRZYMUJESZ

### 🌐 **Pełna funkcjonalność:**
- ✅ Dodawanie/edytowanie/usuwanie wpisów
- ✅ Komentarze dla wszystkich użytkowników  
- ✅ Server-side storage - dane współdzielone
- ✅ Real-time synchronizacja między użytkownikami
- ✅ Dwukolumnowy responsywny design
- ✅ Panel administratora z statystykami

### 🔒 **Bezpieczeństwo:**
- ✅ Hashowane hasła administratora
- ✅ Walidacja danych wejściowych
- ✅ CORS headers dla API
- ✅ Zabezpieczenia przed XSS

### 📱 **Responsive design:**
- ✅ Desktop: dwukolumnowy układ
- ✅ Tablet: jednokolumnowy układ  
- ✅ Mobile: zoptymalizowany układ

---

## 🎯 PO INSTALACJI

1. **Zmień hasło administratora** w pliku `api.php`
2. **Dodaj swoje wpisy** zamiast przykładowych
3. **Dostosuj kolory** w pliku `style.css`
4. **Zmień tytuł i logo** w `index.html`

---

## 📞 WSPARCIE

Jeśli masz problemy:
1. Sprawdź konsolę przeglądarki (F12 → Console)
2. Sprawdź logi błędów na hostingu
3. Spróbuj w trybie incognito
4. Sprawdź czy wszystkie pliki zostały wgrane

---

**🎉 GOTOWE! Masz profesjonalny blog z pełną synchronizacją!**

Wszyscy użytkownicy będą widzieć te same wpisy w czasie rzeczywistym.
