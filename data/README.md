# Data Directory

Ten folder jest automatycznie tworzony przez API i zawiera:

- `posts.json` - Wszystkie wpisy bloga
- `settings.json` - Ustawienia administratora

## Uprawnienia

Folder `data/` musi mieć uprawnienia zapisu (755).
API automatycznie utworzy ten folder przy pierwszym uruchomieniu.

## Backup

Regularnie rób kopie zapasowe plików:
- `data/posts.json` - Twoje wpisy
- `data/settings.json` - Ustawienia

## Bezpieczeństwo

Pliki w tym folderze są zabezpieczone przez .htaccess
przed bezpośrednim dostępem z przeglądarki.
