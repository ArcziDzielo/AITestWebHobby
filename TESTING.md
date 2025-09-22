# 🧪 INSTRUKCJE TESTOWANIA - PROFESJONALNY BLOG

## ✅ LISTA KONTROLNA TESTÓW

### 📋 Test 1: Podstawowa funkcjonalność
- [ ] Strona ładuje się poprawnie
- [ ] Widoczne są przykładowe wpisy w dwóch kolumnach
- [ ] Sidebar z ostatnimi wpisami działa
- [ ] Nie ma błędów w konsoli JavaScript

### 📋 Test 2: API Connection
- [ ] API endpoint odpowiada: `yourdomain.com/api/posts`
- [ ] Zwraca JSON z wpisami
- [ ] Statystyki się aktualizują

### 📋 Test 3: Administrator - Logowanie
- [ ] Przycisk "Panel Administratora" jest widoczny
- [ ] Modal logowania otwiera się
- [ ] Logowanie z admin/admin123 działa
- [ ] Panel administratora pojawia się po zalogowaniu
- [ ] Przycisk "Dodaj nowy wpis" jest widoczny

### 📋 Test 4: Dodawanie wpisów
- [ ] Modal dodawania wpisu otwiera się
- [ ] Formularz można wypełnić
- [ ] Wpis zostaje zapisany po przesłaniu
- [ ] Nowy wpis pojawia się na liście
- [ ] Sidebar aktualizuje się z nowym wpisem

### 📋 Test 5: Trwałość danych
- [ ] Po odświeżeniu strony wpis nadal jest
- [ ] Po dodaniu wpisu w jednej karcie, pojawia się w drugiej po odświeżeniu
- [ ] Statystyki są prawidłowe

### 📋 Test 6: Edycja wpisów
- [ ] Przycisk "Edytuj" działa (dla admina)
- [ ] Modal edycji otwiera się z danymi wpisu
- [ ] Zmiany zostają zapisane
- [ ] Edytowany wpis aktualizuje się na stronie

### 📋 Test 7: Usuwanie wpisów
- [ ] Przycisk "Usuń" działa (dla admina)
- [ ] Modal potwierdzenia pojawia się
- [ ] Wpis zostaje usunięty z serwera
- [ ] Lista wpisów aktualizuje się

### 📋 Test 8: Komentarze
- [ ] Formularz komentarza jest widoczny
- [ ] Można dodać komentarz (bez logowania)
- [ ] Komentarz pojawia się po dodaniu
- [ ] Komentarze zachowują się po odświeżeniu

### 📋 Test 9: Responsywność
- [ ] Strona działa na desktopie
- [ ] Strona działa na tablecie (dwukolumnowy → jednokolumnowy)
- [ ] Strona działa na telefonie
- [ ] Wszystkie elementy są klikalne na mobile

### 📋 Test 10: Performance
- [ ] Strona ładuje się szybko (< 3 sekundy)
- [ ] Obrazy ładują się poprawnie
- [ ] Brak błędów 404/500
- [ ] API odpowiada szybko

---

## 🔍 SZCZEGÓŁOWE TESTY KROK PO KROK

### TEST SYNCHRONIZACJI MIĘDZY UŻYTKOWNIKAMI

**Cel:** Sprawdzić czy dane są współdzielone

**Kroki:**
1. **Otwórz** stronę w Chrome
2. **Otwórz** tę samą stronę w Firefox (lub incognito)
3. **W Chrome:** zaloguj się jako admin
4. **W Chrome:** dodaj wpis "TEST SYNC"
5. **W Firefox:** odśwież stronę
6. **Sprawdź:** czy wpis "TEST SYNC" pojawia się w Firefox

**✅ Oczekiwany rezultat:** Wpis jest widoczny w obu przeglądarkach

### TEST API ENDPOINTS

**Cel:** Sprawdzić czy wszystkie endpointy API działają

**Kroki:**
1. **Otwórz** DevTools (F12) → Network
2. **Odśwież** stronę
3. **Sprawdź** request do `/api/posts` - powinien zwrócić 200 OK
4. **Zaloguj** się jako admin
5. **Sprawdź** request do `/api/login` - powinien zwrócić 200 OK
6. **Dodaj** wpis
7. **Sprawdź** request do `/api/posts` (POST) - powinien zwrócić 200 OK
8. **Usuń** wpis
9. **Sprawdź** request do `/api/post` (DELETE) - powinien zwrócić 200 OK

**✅ Oczekiwany rezultat:** Wszystkie requesty zwracają 200 OK

### TEST BEZPIECZEŃSTWA

**Cel:** Sprawdzić zabezpieczenia

**Kroki:**
1. **Bez logowania** spróbuj dodać wpis
2. **Sprawdź:** czy pojawia się komunikat "Musisz być zalogowany"
3. **Spróbuj** dodać wpis z nieprawidłowymi danymi (pusty tytuł)
4. **Sprawdź:** czy walidacja działa
5. **Spróbuj** zalogować się z błędnymi danymi
6. **Sprawdź:** czy logowanie zostaje odrzucone

**✅ Oczekiwany rezultat:** Wszystkie zabezpieczenia działają

---

## 🐛 ROZWIĄZYWANIE PROBLEMÓW TESTOWYCH

### Problem: Wpisy nie ładują się
**Diagnoza:**
1. Otwórz DevTools → Console
2. Szukaj błędów czerwonym kolorem
3. Sprawdź Network → czy API request się wykonuje

**Rozwiązania:**
- Sprawdź uprawnienia pliku `api.php` (755)
- Sprawdź czy folder `data/` istnieje (755)
- Sprawdź czy hosting obsługuje PHP

### Problem: CORS Error
**Diagnoza:**
```
Access to fetch at 'api.php' from origin 'domain.com' has been blocked by CORS policy
```

**Rozwiązania:**
- Sprawdź czy `.htaccess` jest wgrany
- Dodaj nagłówki ręcznie w `api.php`:
```php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
```

### Problem: 500 Internal Server Error
**Diagnoza:**
- Sprawdź logi błędów PHP na hostingu
- Sprawdź czy wszystkie pliki są poprawnie wgrane

**Rozwiązania:**
- Sprawdź składnię PHP w `api.php`
- Sprawdź uprawnienia plików
- Sprawdź czy hosting ma PHP 7.4+

---

## 📊 EXPECTED RESULTS

### ✅ Poprawne działanie:
1. **Ładowanie:** 3-4 wpisy ładują się w dwóch kolumnach
2. **API:** Wszystkie requesty zwracają status 200
3. **Logowanie:** Admin może się zalogować
4. **CRUD:** Wpisy można dodawać, edytować, usuwać
5. **Komentarze:** Można dodawać komentarze
6. **Synchronizacja:** Zmiany są widoczne dla wszystkich
7. **Responsywność:** Działa na wszystkich urządzeniach

### ⚠️ Znane ograniczenia:
1. **Storage:** Dane w plikach JSON (nie baza danych)
2. **Concurrent access:** Możliwe konflikty przy równoczesnej edycji
3. **File locks:** Brak zaawansowanego lockingu plików
4. **Backup:** Brak automatycznego backupu
5. **CDN:** Obrazy nie są przechowywane lokalnie

---

## 🎯 TEST CHECKLIST SUMMARY

Po zakończeniu wszystkich testów powinieneś mieć:

✅ **Wszystkie testy przeszły** - blog działa profesjonalnie  
✅ **Dane są współdzielone** - wszyscy widzą te same wpisy  
✅ **API działa** - wszystkie endpointy odpowiadają  
✅ **Bezpieczeństwo** - tylko admin może zarządzać wpisami  
✅ **Responsywność** - działa na wszystkich urządzeniach  

**🎉 Jeśli wszystkie testy przeszły - masz profesjonalny blog gotowy do użycia!**
