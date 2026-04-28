<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {


        // 1. Habilita el soporte para SPA (React) con sesiones y cookies
        $middleware->statefulApi();

        // Añade esto para asegurar que la cookie XSRF-TOKEN sea legible por Axios
        $middleware->encryptCookies(except: [
            'XSRF-TOKEN',
        ]);

        // 2. Registra tus middlewares personalizados
        $middleware->alias([
            'admin' => \App\Http\Middleware\AdminMiddleware::class,
        ]);

        // 3. Configura el comportamiento de invitados (Evita redirecciones 302 en la API)
        $middleware->redirectGuestsTo(function (Request $request) {
            // Si es una petición de API o espera JSON, devolvemos 401 en lugar de redirigir a /login
            if ($request->is('api/*') || $request->expectsJson()) {
                return null; 
            }
            return '/login'; 
        });

        // 4. Configuración extra de cookies (Opcional pero recomendada para el error 419)
        $middleware->validateCsrfTokens(except: [
            'login',
            'register',
            'logout',
            'api/listings/*/buy',
            'api/listings',
            'api/admin/users/*',
            'api/admin/cards',
            'api/admin/sets',
            'api/cards/*/collection',
            'api/user/avatar',
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();