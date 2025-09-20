<?php

use App\Http\Controllers\TodoController;
use App\Http\Controllers\AuthController; // <-- Import AuthController
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Public routes (no authentication required)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Authenticated routes (requires Sanctum token)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) { // This route is already here, just ensure it's inside the group
        return $request->user();
    });
    Route::post('/logout', [AuthController::class, 'logout']); // Logout protected
    Route::apiResource('todos', TodoController::class); // Your existing todo routes are now protected
});