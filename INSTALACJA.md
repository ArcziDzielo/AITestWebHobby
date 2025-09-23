# 🚀 QUICK SETUP - Blog z API

## ⚡ 3-minutowa instalacja:

### 1. HOSTING
Potrzebujesz hosting z PHP 7.4+ (darmowy wystarczy):
- InfinityFree.net
- 000webhost.com 
- AwardSpace.com
- Lub dowolny hosting PHP

### 2. UPLOAD
1. Rozpakuj wszystkie pliki
2. Wgraj przez FTP/File Manager do głównego katalogu
3. Sprawdź uprawnienia:
   ```
   chmod 755 .
   chmod 644 *.html *.css *.js *.php
   mkdir data && chmod 755 data/
   ```

### 3. TEST
1. Idź na swoją stronę
2. Powinieneś zobaczyć komunikat "Połączono z serwerem"
3. Zaloguj się: admin / admin123
4. Dodaj testowy wpis
5. Odśwież - wpis nadal jest = DZIAŁA! ✅

## 🔧 Rozwiązywanie problemów:

**"API nie jest dostępne":**
- Sprawdź czy api.php jest w tym samym folderze
- Sprawdź czy hosting obsługuje PHP
- Sprawdź uprawnienia foldera data/

**"500 Internal Server Error":**
- Sprawdź logi błędów PHP na hostingu
- Sprawdź czy folder data/ ma uprawnienia zapisu

**Inne problemy:**
- Otwórz konsolę (F12) i sprawdź błędy
- Spróbuj w innej przeglądarce

## ✅ Po udanej instalacji:
- Blog działa z pełną synchronizacją
- Wszyscy widzą te same wpisy
- Można dodawać/edytować/usuwać wpisy
- Komentarze działają
- Dwukolumnowy responsywny design

🎉 Gotowe! Masz profesjonalny blog!
