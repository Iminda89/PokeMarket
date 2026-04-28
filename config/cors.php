<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    */

    // 1. Añadimos todas las rutas que React necesita tocar
    'paths' => [
        'api/*', 
        'sanctum/csrf-cookie', 
        'login', 
        'register', 
        'logout', 
        'user-data'
    ],

    'allowed_methods' => ['*'],

    // 2. PROHIBIDO USAR '*': Pon las URLs exactas de tu servidor
    'allowed_origins' => [
        'http://localhost:8000', 
        'http://127.0.0.1:8000'
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    // 3. OBLIGATORIO EN TRUE para que funcione el Login y las Sesiones
    'supports_credentials' => true,

];