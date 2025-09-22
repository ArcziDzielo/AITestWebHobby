# Data Directory

This directory is created automatically by the API and contains:

- `posts.json` - Blog posts storage
- `settings.json` - Admin settings storage

## File Structure

```json
posts.json:
[
  {
    "id": 1,
    "title": "Post title",
    "content": "Post content",
    "imageUrl": "https://...",
    "date": "2024-03-15",
    "comments": [...]
  }
]

settings.json:
{
  "nextPostId": 4,
  "nextCommentId": 10,
  "adminLogin": "admin",
  "adminPasswordHash": "$2y$10$...",
  "adminEmail": "admin@blog.pl"
}
```

## Permissions

Make sure this directory has write permissions:
```bash
chmod 755 data/
chmod 666 data/*.json
```
