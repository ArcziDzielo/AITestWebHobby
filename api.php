<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

class BlogAPI {
    private $dataDir;
    private $postsFile;
    private $settingsFile;

    public function __construct() {
        $this->dataDir = __DIR__ . '/data';
        $this->postsFile = $this->dataDir . '/posts.json';
        $this->settingsFile = $this->dataDir . '/settings.json';

        // Ensure data directory exists
        if (!is_dir($this->dataDir)) {
            mkdir($this->dataDir, 0755, true);
        }

        // Initialize files if they don't exist
        $this->initializeFiles();
    }

    private function initializeFiles() {
        if (!file_exists($this->postsFile)) {
            $defaultPosts = [
                [
                    'id' => 1,
                    'title' => '🎉 Witaj w Passion Hub!',
                    'content' => 'Gratulacje! Twój blog został pomyślnie zainstalowany z pełnym API backend.\n\nTeraz możesz:\n- Dodawać nowe wpisy jako administrator\n- Edytować istniejące wpisy\n- Usuwać niepotrzebne wpisy\n- Dodawać komentarze\n- Wszystko jest synchronizowane między użytkownikami\n\nTo jest prawdziwy profesjonalny blog z server-side storage!',
                    'imageUrl' => 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&h=400&fit=crop',
                    'date' => date('Y-m-d'),
                    'comments' => [
                        [
                            'id' => 1,
                            'authorName' => 'System',
                            'authorEmail' => 'system@blog.pl',
                            'content' => 'API zostało pomyślnie zainstalowane! Wszystkie funkcje są dostępne.',
                            'date' => date('Y-m-d')
                        ]
                    ]
                ],
                [
                    'id' => 2,
                    'title' => 'Jak korzystać z bloga',
                    'content' => 'Ten blog oferuje profesjonalną funkcjonalność:\n\n**Dla czytelników:**\n- Przeglądanie wpisów w dwukolumnowym układzie\n- Dodawanie komentarzy\n- Responsywny design na wszystkich urządzeniach\n\n**Dla administratora:**\n- Logowanie: admin / admin123\n- Dodawanie nowych wpisów\n- Edycja istniejących wpisów\n- Usuwanie wpisów\n- Zarządzanie komentarzami\n\n**Techniczne:**\n- Server-side storage (pliki JSON)\n- Real-time synchronizacja\n- RESTful API\n- Zabezpieczenia CORS\n- Responsive design',
                    'imageUrl' => 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=400&fit=crop',
                    'date' => date('Y-m-d', strtotime('-1 day')),
                    'comments' => []
                ],
                [
                    'id' => 3,
                    'title' => 'Dwukolumnowy układ wpisów',
                    'content' => 'Blog wykorzystuje nowoczesny dwukolumnowy układ wpisów, który automatycznie dostosowuje się do rozmiaru ekranu.\n\n**Desktop:** Wpisy w dwóch kolumnach obok siebie\n**Tablet:** Wpisy w jednej kolumnie\n**Mobile:** Zoptymalizowany układ mobilny\n\nTaki układ zapewnia lepsze wykorzystanie przestrzeni i czytelność na różnych urządzeniach.',
                    'imageUrl' => 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=600&h=400&fit=crop',
                    'date' => date('Y-m-d', strtotime('-2 days')),
                    'comments' => [
                        [
                            'id' => 2,
                            'authorName' => 'Test User',
                            'authorEmail' => 'test@example.com',
                            'content' => 'Świetny układ! Bardzo czytelny i nowoczesny.',
                            'date' => date('Y-m-d', strtotime('-1 day'))
                        ]
                    ]
                ]
            ];

            file_put_contents($this->postsFile, json_encode($defaultPosts, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        }

        if (!file_exists($this->settingsFile)) {
            $defaultSettings = [
                'nextPostId' => 4,
                'nextCommentId' => 4,
                'adminLogin' => 'admin',
                'adminPasswordHash' => password_hash('admin123', PASSWORD_DEFAULT),
                'adminEmail' => 'admin@blog.pl'
            ];

            file_put_contents($this->settingsFile, json_encode($defaultSettings, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        }
    }

    private function loadPosts() {
        if (!file_exists($this->postsFile)) {
            return [];
        }
        $content = file_get_contents($this->postsFile);
        return json_decode($content, true) ?: [];
    }

    private function savePosts($posts) {
        return file_put_contents($this->postsFile, json_encode($posts, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)) !== false;
    }

    private function loadSettings() {
        if (!file_exists($this->settingsFile)) {
            return [];
        }
        $content = file_get_contents($this->settingsFile);
        return json_decode($content, true) ?: [];
    }

    private function saveSettings($settings) {
        return file_put_contents($this->settingsFile, json_encode($settings, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)) !== false;
    }

    private function validateAdmin($credentials) {
        if (!isset($credentials['login']) || !isset($credentials['password'])) {
            return false;
        }

        $settings = $this->loadSettings();
        return $credentials['login'] === $settings['adminLogin'] && 
               password_verify($credentials['password'], $settings['adminPasswordHash']);
    }

    public function handleRequest() {
        $method = $_SERVER['REQUEST_METHOD'];
        $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

        // Extract endpoint from path - handle both /api/posts and /posts
        $pathParts = array_filter(explode('/', trim($path, '/')));
        $endpoint = end($pathParts);

        // If no endpoint, default based on method
        if (empty($endpoint) || $endpoint === 'api.php') {
            $endpoint = 'posts';
        }

        error_log("API Request: $method $path -> endpoint: $endpoint");

        try {
            switch ($endpoint) {
                case 'posts':
                    if ($method === 'GET') {
                        $this->getPosts();
                    } elseif ($method === 'POST') {
                        $this->createPost();
                    } else {
                        $this->sendError(405, 'Method not allowed');
                    }
                    break;

                case 'post':
                    if ($method === 'PUT') {
                        $this->updatePost();
                    } elseif ($method === 'DELETE') {
                        $this->deletePost();
                    } else {
                        $this->sendError(405, 'Method not allowed');
                    }
                    break;

                case 'comment':
                    if ($method === 'POST') {
                        $this->addComment();
                    } else {
                        $this->sendError(405, 'Method not allowed');
                    }
                    break;

                case 'login':
                    if ($method === 'POST') {
                        $this->login();
                    } else {
                        $this->sendError(405, 'Method not allowed');
                    }
                    break;

                case 'stats':
                    if ($method === 'GET') {
                        $this->getStats();
                    } else {
                        $this->sendError(405, 'Method not allowed');
                    }
                    break;

                default:
                    $this->sendError(404, 'Endpoint not found: ' . $endpoint);
            }
        } catch (Exception $e) {
            error_log("API Error: " . $e->getMessage());
            $this->sendError(500, 'Internal server error: ' . $e->getMessage());
        }
    }

    private function getPosts() {
        $posts = $this->loadPosts();
        // Sort by date descending (newest first)
        usort($posts, function($a, $b) {
            return strtotime($b['date']) - strtotime($a['date']);
        });

        $this->sendSuccess($posts);
    }

    private function createPost() {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!$this->validateAdmin($input['admin'] ?? [])) {
            $this->sendError(401, 'Unauthorized');
            return;
        }

        $requiredFields = ['title', 'content'];
        foreach ($requiredFields as $field) {
            if (empty($input[$field])) {
                $this->sendError(400, "Field '$field' is required");
                return;
            }
        }

        $posts = $this->loadPosts();
        $settings = $this->loadSettings();

        $newPost = [
            'id' => $settings['nextPostId'],
            'title' => trim($input['title']),
            'content' => trim($input['content']),
            'imageUrl' => trim($input['imageUrl'] ?? ''),
            'date' => date('Y-m-d'),
            'comments' => []
        ];

        array_unshift($posts, $newPost); // Add to beginning

        if ($this->savePosts($posts)) {
            $settings['nextPostId']++;
            $this->saveSettings($settings);
            $this->sendSuccess($newPost, 'Post created successfully');
        } else {
            $this->sendError(500, 'Failed to save post');
        }
    }

    private function updatePost() {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!$this->validateAdmin($input['admin'] ?? [])) {
            $this->sendError(401, 'Unauthorized');
            return;
        }

        if (empty($input['id'])) {
            $this->sendError(400, 'Post ID is required');
            return;
        }

        $posts = $this->loadPosts();
        $postIndex = null;

        foreach ($posts as $index => $post) {
            if ($post['id'] == $input['id']) {
                $postIndex = $index;
                break;
            }
        }

        if ($postIndex === null) {
            $this->sendError(404, 'Post not found');
            return;
        }

        // Update post fields
        if (isset($input['title'])) $posts[$postIndex]['title'] = trim($input['title']);
        if (isset($input['content'])) $posts[$postIndex]['content'] = trim($input['content']);
        if (isset($input['imageUrl'])) $posts[$postIndex]['imageUrl'] = trim($input['imageUrl']);

        if ($this->savePosts($posts)) {
            $this->sendSuccess($posts[$postIndex], 'Post updated successfully');
        } else {
            $this->sendError(500, 'Failed to update post');
        }
    }

    private function deletePost() {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!$this->validateAdmin($input['admin'] ?? [])) {
            $this->sendError(401, 'Unauthorized');
            return;
        }

        if (empty($input['id'])) {
            $this->sendError(400, 'Post ID is required');
            return;
        }

        $posts = $this->loadPosts();
        $originalCount = count($posts);

        $posts = array_filter($posts, function($post) use ($input) {
            return $post['id'] != $input['id'];
        });

        $posts = array_values($posts); // Re-index array

        if (count($posts) < $originalCount) {
            if ($this->savePosts($posts)) {
                $this->sendSuccess(null, 'Post deleted successfully');
            } else {
                $this->sendError(500, 'Failed to delete post');
            }
        } else {
            $this->sendError(404, 'Post not found');
        }
    }

    private function addComment() {
        $input = json_decode(file_get_contents('php://input'), true);

        $requiredFields = ['postId', 'authorName', 'authorEmail', 'content'];
        foreach ($requiredFields as $field) {
            if (empty($input[$field])) {
                $this->sendError(400, "Field '$field' is required");
                return;
            }
        }

        $posts = $this->loadPosts();
        $settings = $this->loadSettings();
        $postIndex = null;

        foreach ($posts as $index => $post) {
            if ($post['id'] == $input['postId']) {
                $postIndex = $index;
                break;
            }
        }

        if ($postIndex === null) {
            $this->sendError(404, 'Post not found');
            return;
        }

        $newComment = [
            'id' => $settings['nextCommentId'],
            'authorName' => trim($input['authorName']),
            'authorEmail' => trim($input['authorEmail']),
            'content' => trim($input['content']),
            'date' => date('Y-m-d')
        ];

        $posts[$postIndex]['comments'][] = $newComment;

        if ($this->savePosts($posts)) {
            $settings['nextCommentId']++;
            $this->saveSettings($settings);
            $this->sendSuccess($newComment, 'Comment added successfully');
        } else {
            $this->sendError(500, 'Failed to add comment');
        }
    }

    private function login() {
        $input = json_decode(file_get_contents('php://input'), true);

        if ($this->validateAdmin($input)) {
            $settings = $this->loadSettings();
            $this->sendSuccess([
                'login' => $settings['adminLogin'],
                'email' => $settings['adminEmail']
            ], 'Login successful');
        } else {
            $this->sendError(401, 'Invalid credentials');
        }
    }

    private function getStats() {
        $posts = $this->loadPosts();
        $totalComments = 0;

        foreach ($posts as $post) {
            $totalComments += count($post['comments'] ?? []);
        }

        $this->sendSuccess([
            'totalPosts' => count($posts),
            'totalComments' => $totalComments
        ]);
    }

    private function sendSuccess($data = null, $message = null) {
        $response = ['success' => true];
        if ($message) $response['message'] = $message;
        if ($data !== null) $response['data'] = $data;

        echo json_encode($response, JSON_UNESCAPED_UNICODE);
    }

    private function sendError($code, $message) {
        http_response_code($code);
        echo json_encode([
            'success' => false,
            'error' => $message
        ], JSON_UNESCAPED_UNICODE);
    }
}

// Initialize and handle request
try {
    $api = new BlogAPI();
    $api->handleRequest();
} catch (Exception $e) {
    error_log("Fatal API Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Internal server error'
    ], JSON_UNESCAPED_UNICODE);
}
?>