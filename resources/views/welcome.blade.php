<!DOCTYPE html>
<html lang="eu">
<head>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Pokémon Market</title>
    @viteReactRefresh
    @vite(['resources/js/app.jsx'])
</head>
<body>
    <div id="root"></div>
</body>
</html>