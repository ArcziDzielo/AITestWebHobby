<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

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
                    'title' => 'Dwukolumnowy układ wpisów',
                    'content' => 'Blog wykorzystuje nowoczesny dwukolumnowy układ wpisów, który automatycznie dostosowuje się do rozmiaru ekranu.\n\n**Desktop:** Wpisy w dwóch kolumnach obok siebie\n**Tablet:** Wpisy w jednej kolumnie\n**Mobile:** Zoptymalizowany układ mobilny\n\nTaki układ zapewnia lepsze wykorzystanie przestrzeni i czytelność na różnych urządzeniach.',
                    'imageUrl' => 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=600&h=400&fit=crop',
                    'date' => date('Y-m-d', strtotime('-1 day')),
                    'comments' => []
                ]
            ];

            file_put_contents($this->postsFile, json_encode($defaultPosts, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        }

        if (!file_exists($this->settingsFile)) {
            $defaultSettings = [
                'nextPostId' => 3,
                'nextCommentId' => 2,
                'adminLogin' => 'admin',
                'adminPasswordHash' => password_hash('admin123', PASSWORD_DEFAULT),
                'adminEmail' => 'admin@blog.pl'
            ];

            file_put_contents($this->settingsFile, json_encode($defaultSettings, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        }
    }

    private function loadPosts() {
        if (!file_exists($this->postsFile)) return [];
        $content = file_get_contents($this->postsFile);
        return json_decode($content, true) ?: [];
    }

    private function savePosts($posts) {
        return file_put_contents($this->postsFile, json_encode($posts, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)) !== false;
    }

    private function loadSettings() {
        if (!file_exists($this->settingsFile)) return [];
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

    private function parseEndpoint() {
        // Multiple ways to determine endpoint - handle different server configurations
        $endpoint = '';

        // Method 1: Check query parameters (for direct calls like api.php?endpoint=posts)
        if (isset($_GET['endpoint'])) {
            $endpoint = $_GET['endpoint'];
        }
        // Method 2: Parse REQUEST_URI
        elseif (isset($_SERVER['REQUEST_URI'])) {
            $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
            $pathParts = array_filter(explode('/', trim($uri, '/')));

            // Look for endpoint after 'api.php' or as last segment
            $foundApi = false;
            foreach ($pathParts as $part) {
                if ($foundApi) {
                    $endpoint = $part;
                    break;
                } elseif ($part === 'api.php' || $part === 'api') {
                    $foundApi = true;
                } else {
                    $endpoint = $part; // Keep updating until we find the right one
                }
            }
        }
        // Method 3: Check PATH_INFO
        elseif (isset($_SERVER['PATH_INFO'])) {
            $endpoint = trim($_SERVER['PATH_INFO'], '/');
        }

        // Default to 'posts' if no specific endpoint found
        if (empty($endpoint) || $endpoint === 'api.php' || $endpoint === 'api') {
            $endpoint = 'posts';
        }

        return $endpoint;
    }

    public function handleRequest() {
        $method = $_SERVER['REQUEST_METHOD'];
        $endpoint = $this->parseEndpoint();

        // Log for debugging
        error_log("BlogAPI: Method=$method, Endpoint=$endpoint, URI=" . ($_SERVER['REQUEST_URI'] ?? 'N/A'));

        try {
            // Route to appropriate handler
            switch ($endpoint) {
                case 'posts':
                    $this->handlePosts($method);
                    break;

                case 'post':
                    $this->handlePost($method);
                    break;

                case 'comment':
                    $this->handleComment($method);
                    break;

                case 'login':
                    $this->handleLogin($method);
                    break;

                case 'stats':
                    $this->handleStats($method);
                    break;

                default:
                    // If no matching endpoint, try to handle as posts (fallback)
                    if ($method === 'GET') {
                        $this->handlePosts($method);
                    } else {
                        $this->sendError(404, "Unknown endpoint: $endpoint");
                    }
            }
        } catch (Exception $e) {
            error_log("API Error: " . $e->getMessage());
            $this->sendError(500, 'Internal server error: ' . $e->getMessage());
        }
    }

    private function handlePosts($method) {
        if ($method === 'GET') {
            $this->getPosts();
        } elseif ($method === 'POST') {
            $this->createPost();
        } else {
            $this->sendError(405, "Method $method not allowed for posts endpoint");
        }
    }

    private function handlePost($method) {
        if ($method === 'PUT') {
            $this->updatePost();
        } elseif ($method === 'DELETE') {
            $this->deletePost();
        } else {
            $this->sendError(405, "Method $method not allowed for post endpoint");
        }
    }

    private function handleComment($method) {
        if ($method === 'POST') {
            $this->addComment();
        } else {
            $this->sendError(405, "Method $method not allowed for comment endpoint");
        }
    }

    private function handleLogin($method) {
        if ($method === 'POST') {
            $this->login();
        } else {
            $this->sendError(405, "Method $method not allowed for login endpoint");
        }
    }

    private function handleStats($method) {
        if ($method === 'GET') {
            $this->getStats();
        } else {
            $this->sendError(405, "Method $method not allowed for stats endpoint");
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
            $this->sendError(401, 'Unauthorized - admin credentials required');
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
            $this->sendError(401, 'Unauthorized - admin credentials required');
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
            $this->sendError(401, 'Unauthorized - admin credentials required');
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
            'error' => $message,
            'code' => $code
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
        'error' => 'Internal server error',
        'debug' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
?>