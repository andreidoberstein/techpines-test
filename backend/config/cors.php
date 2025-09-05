<?php

return [
  'paths' => ['api/*', 'sanctum/csrf-cookie', 'oauth/*'],
  'allowed_methods' => ['*'],
  'allowed_origins' => [
    'http://localhost:5173', // Vite
    'http://127.0.0.1:5173',
    'http://localhost:8081'
  ],
  'allowed_headers' => ['*'],
  'exposed_headers' => [],
  'max_age' => 0,
  'supports_credentials' => false, // usando Bearer token (não cookies)
];
