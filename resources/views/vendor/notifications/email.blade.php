<x-mail::message>
<x-slot:header>
    <x-mail::header :url="config('app.url')">
        <h1 style="color: #3b4cca; margin: 0; font-family: 'Helvetica', sans-serif; letter-spacing: 2px; font-weight: bold;">
            POKEMARKET
        </h1>
    </x-mail::header>
</x-slot:header>

{{-- Greeting --}}
@if (! empty($greeting))
# {{ $greeting }}
@endif

{{-- Intro Lines --}}
@foreach ($introLines as $line)
{{ $line }}
@endforeach

{{-- Action Button --}}
@isset($actionText)
<x-mail::button :url="$actionUrl" color="primary">
{{ $actionText }}
</x-mail::button>
@endisset

{{-- Outro Lines --}}
@foreach ($outroLines as $line)
{{ $line }}
@endforeach

{{-- Salutation --}}
Agur t'erdi,<br>
**PokeMarket taldea**

{{-- Subcopy --}}
@isset($actionText)
<x-slot:subcopy>
Botoia sakatzeko arazoren bat baduzu, kopiatu eta itsatsi beheko esteka zure nabigatzailean:
<span class="break-all">[{{ $actionUrl }}]({{ $actionUrl }})</span>
</x-slot:subcopy>
@endisset
</x-mail::message>