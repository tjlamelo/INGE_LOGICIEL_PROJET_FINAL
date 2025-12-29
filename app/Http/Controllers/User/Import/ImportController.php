<?php

namespace App\Http\Controllers\User\Import;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\User\Import\ImportUserService;
use Inertia\Inertia;

class ImportController extends Controller
{
    public function index()
    {
        return Inertia::render('User/ImportUser');
    }
public function upload(Request $request)
{
    $request->validate([
        'file' => 'required|mimes:csv,xlsx,xls|max:2048'
    ]);

    // Tu pourras appeler ton service ici
    // (new ImportUserService())->import($request->file('file'));

    return back()->with('success', 'Import terminé.');
}

}
