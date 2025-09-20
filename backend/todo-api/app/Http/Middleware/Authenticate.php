<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;
use Illuminate\Http\Response; // Import Response class for HTTP status codes
use Illuminate\Auth\AuthenticationException; // Import AuthenticationException

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     */
    protected function redirectTo(Request $request): ?string
    {
        // If the request is not expecting JSON, then we defer to the default web redirection.
        // However, for API routes (which our auth:sanctum middleware uses), we *always*
        // want a JSON response, not a redirect.
        if (! $request->expectsJson()) {
            // This branch is typically for web routes.
            return route('login'); // This would be the name of your web login route.
                                // Since we don't have one, this is what causes the 'Route [login] not defined' error.
        }

        // For API requests, we explicitly return null here, which will cause Laravel's
        // global exception handler to catch the AuthenticationException and convert
        // it to a 401 Unauthorized JSON response.
        return null;

        // Alternative (more explicit) for API, though the above is standard:
        // if ($request->is('api/*')) { // Check if the request path starts with 'api/'
        //     throw new AuthenticationException('Unauthenticated.', ['api'], null);
        // }
        // return null; // Fallback for other non-API requests
    }

    // For API requests, when authentication fails, we want to return a 401 JSON response
    // rather than redirecting. Laravel's default exception handler does this if an
    // AuthenticationException is thrown and the request expects JSON.
    // We'll override the unauthenticated method to ensure this explicitly.
    protected function unauthenticated($request, array $guards)
    {
        if ($request->expectsJson() || $request->is('api/*')) {
            abort(response()->json(['message' => 'Unauthenticated.'], Response::HTTP_UNAUTHORIZED)); // 401
        }

        parent::unauthenticated($request, $guards);
    }
}