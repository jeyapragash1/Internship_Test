<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines which domains are allowed to access your
    | application via HTTP requests from a web browser. A "proxy" configuration
    | is also provided for development environments.
    |
    */

    // IMPORTANT: Ensure 'sanctum/csrf-cookie' is in the paths array
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'], // Allow all methods (GET, POST, PUT, DELETE, etc.)

    // IMPORTANT: Set this to your frontend URL
    // If you're running React on localhost:5173, use that.
    // For production, this should be your actual frontend domain.
    'allowed_origins' => ['http://localhost:5173'],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'], // Allow all headers

    'exposed_headers' => [],

    'max_age' => 0,

    // IMPORTANT: This MUST be true for credentials (like cookies) to be sent across origins
    'supports_credentials' => true,

];