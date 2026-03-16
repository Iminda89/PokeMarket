<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request; // Asegúrate de importar esto

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->statefulApi(); // Asegura que Sanctum gestione la sesión
        
        // ESTO EVITA EL ERROR 500:
        // Si el usuario no está autenticado, devuelve null (401) en vez de redirigir
        $middleware->redirectGuestsTo(fn () => null); 
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
