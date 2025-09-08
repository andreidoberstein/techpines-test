<?php

return [
  'paths' => ['api/*', 'sanctum/csrf-cookie', 'oauth/*'],
  'allowed_methods' => ['*'],
  'allowed_origins' => [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:8081',
    'http://localhost:8080',
    'https://techpines-test-8pwjok9ur-andreivupts-projects.vercel.app',
    'https://techpines-test.vercel.app'
  ],
  'allowed_headers' => ['*'],
  'exposed_headers' => [],
  'max_age' => 0,
  'supports_credentials' => false, // usando Bearer token (não cookies)
];
