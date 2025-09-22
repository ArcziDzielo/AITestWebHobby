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
                    'title' => '5 powodów, dlaczego majsterkowanie zmienia życie',
                    'content' => 'Majsterkowanie to nie tylko hobby – to prawdziwa pasja, która odmienia nasze podejście do życia. Po pierwsze, rozwija naszą kreatywność i umiejętność rozwiązywania problemów. Każdy projekt DIY to nowe wyzwanie, które mobilizuje nas do myślenia poza schematami.\n\nPo drugie, majsterkowanie daje niesamowitą satysfakcję z tworzenia czegoś własnymi rękami. Nie ma lepszego uczucia niż patrzenie na gotowy projekt i świadomość, że to Ty go stworzyłeś od podstaw. Po trzecie, to doskonały sposób na relaks i odprężenie po ciężkim dniu pracy.\n\nCzwartym powodem jest aspekt ekonomiczny – naprawiając i tworząc samodzielnie, oszczędzamy znaczne kwoty. Wreszcie, majsterkowanie łączy pokolenia – możemy uczyć się od starszych i przekazywać wiedzę młodszym.',
                    'imageUrl' => 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&h=400&fit=crop',
                    'date' => '2024-03-15',
                    'comments' => [
                        [
                            'id' => 1,
                            'authorName' => 'Anna Kowalska',
                            'authorEmail' => 'anna@example.com',
                            'content' => 'Świetny wpis! Całkowicie się zgadzam - majsterkowanie to najlepsza terapia po pracy.',
                            'date' => '2024-03-16'
                        ]
                    ]
                ],
                [
                    'id' => 2,
                    'title' => 'Jak zacząć przygodę z DIY - poradnik dla początkujących',
                    'content' => 'Rozpoczynanie przygody z majsterkowaniem może wydawać się przytłaczające, ale tak naprawdę wystarczy kilka prostych kroków. Pierwszym z nich jest zdefiniowanie swoich zainteresowań – czy wolisz pracę z drewnem, metalem, tkaniną, czy może elektronikę?\n\nNastępnie warto zacząć od prostych projektów, które nie wymagają drogich narzędzi. Świetnym początkiem może być renowacja starych mebli, tworzenie dekoracji do domu lub proste naprawy. Ważne, żeby nie zniechęcić się pierwszymi niepowodzeniami – każdy majsterkowicz przeszedł przez fazę uczenia się.\n\nKluczowe jest również zbudowanie podstawowego zestawu narzędzi. Nie musisz od razu kupować wszystkiego – zacznij od podstaw i stopniowo rozszerzaj swoje wyposażenie. Pamiętaj, że najważniejsza jest praktyka i cierpliwość.',
                    'imageUrl' => 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop',
                    'date' => '2024-03-12',
                    'comments' => []
                ],
                [
                    'id' => 3,
                    'title' => 'Narzędzia, które każdy majsterkowicz powinien mieć',
                    'content' => 'Dobry majsterkowicz to ten, który ma odpowiednie narzędzia. W każdym domu powinna znaleźć się podstawowa skrzynka z narzędziami, która pozwoli na wykonanie większości domowych napraw i projektów DIY.\n\nDo podstawowego zestawu należą: młotek, zestaw śrubokrętów (płaskie i krzyżakowe), klucze imbusowe, poziomica, miara, żółta taśma, szczypce uniwersalne i nóż do tapet. Te narzędzia pozwolą Ci na 80% domowych prac.\n\nW miarę rozwoju umiejętności warto zainwestować w wiertarkę udarową, szlifierkę kątową, pilarkę elektryczną i profesjonalne narzędzia pomiarowe. Pamiętaj, że jakość ma znaczenie – lepiej mieć mniej narzędzi, ale dobrych, niż dużo tanich, które szybko się zepsują.',
                    'imageUrl' => 'https://images.unsplash.com/photo-1609781739569-437112c4b74f?w=600&h=400&fit=crop',
                    'date' => '2024-03-10',
                    'comments' => [
                        [
                            'id' => 2,
                            'authorName' => 'Piotr Nowak',
                            'authorEmail' => 'piotr@example.com',
                            'content' => 'Świetny przegląd! Ja bym dodał jeszcze dobrą latarkę - bez światła ciężko cokolwiek robić.',
                            'date' => '2024-03-11'
                        ],
                        [
                            'id' => 3,
                            'authorName' => 'Marta Wiśniewska', 
                            'authorEmail' => 'marta@example.com',
                            'content' => 'Zgadzam się co do jakości narzędzi. Lepiej raz dobrze kupić niż wielokrotnie wymieniać.',
                            'date' => '2024-03-12'
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
        $content = file_get_contents($this->postsFile);
        return json_decode($content, true) ?: [];
    }

    private function savePosts($posts) {
        return file_put_contents($this->postsFile, json_encode($posts, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)) !== false;
    }

    private function loadSettings() {
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
        $pathParts = explode('/', trim($path, '/'));

        // Extract endpoint from path
        $endpoint = end($pathParts);

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
                    $this->sendError(404, 'Endpoint not found');
            }
        } catch (Exception $e) {
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
            $totalComments += count($post['comments']);
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
$api = new BlogAPI();
$api->handleRequest();
?>