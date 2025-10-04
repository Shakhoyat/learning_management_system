<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/test', function () {
    return response()->json([
        'status' => 'success',
        'message' => 'API is working!',
        'timestamp' => now()
    ]);
});

Route::post('/test-login', function (Request $request) {
    return response()->json([
        'status' => 'success',
        'message' => 'Test login endpoint reached',
        'data' => $request->all()
    ]);
});
