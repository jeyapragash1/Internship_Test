<?php

namespace App\Http\Controllers;

use App\Models\Todo;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Validation\ValidationException;

class TodoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        // Only fetch todos for the authenticated user
        $todos = auth()->user()->todos()->orderBy('created_at', 'desc')->get();
        return response()->json($todos);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'title' => ['required', 'string', 'min:3', 'max:255'],
                'description' => ['nullable', 'string', 'max:1000'],
                'completed' => ['boolean'],
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation Error',
                'errors' => $e->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY); // 422
        }

        // Assign the todo to the authenticated user
        $todo = auth()->user()->todos()->create($validatedData);

        return response()->json($todo, Response::HTTP_CREATED); // 201 Created
    }

    /**
     * Display the specified resource.
     *
     * @param  string  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(string $id)
    {
        // Find todo for the authenticated user
        $todo = auth()->user()->todos()->find($id);

        if (!$todo) {
            return response()->json(['message' => 'Todo not found'], Response::HTTP_NOT_FOUND); // 404
        }

        return response()->json($todo);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, string $id)
    {
        // Find todo for the authenticated user
        $todo = auth()->user()->todos()->find($id);

        if (!$todo) {
            return response()->json(['message' => 'Todo not found'], Response::HTTP_NOT_FOUND); // 404
        }

        try {
            $validatedData = $request->validate([
                'title' => ['sometimes', 'required', 'string', 'min:3', 'max:255'],
                'description' => ['nullable', 'string', 'max:1000'],
                'completed' => ['sometimes', 'boolean'],
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation Error',
                'errors' => $e->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY); // 422
        }

        $todo->update($validatedData);
        return response()->json($todo);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  string  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(string $id)
    {
        // Find todo for the authenticated user
        $todo = auth()->user()->todos()->find($id);

        if (!$todo) {
            return response()->json(['message' => 'Todo not found'], Response::HTTP_NOT_FOUND); // 404
        }

        $todo->delete();
        return response()->json(['message' => 'Todo deleted successfully'], Response::HTTP_NO_CONTENT); // 204
    }
}