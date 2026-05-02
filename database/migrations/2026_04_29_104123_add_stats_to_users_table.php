<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Solo añadimos 'level' si NO existe
            if (!Schema::hasColumn('users', 'level')) {
                $table->integer('level')->default(1)->after('email');
            }
            // Solo añadimos 'xp' si NO existe
            if (!Schema::hasColumn('users', 'xp')) {
                $table->integer('xp')->default(0)->after('level');
            }
            // Solo añadimos 'balance' si NO existe
            if (!Schema::hasColumn('users', 'balance')) {
                $table->decimal('balance', 15, 2)->default(0.00)->after('xp');
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['level', 'xp', 'balance']);
        });
    }
};