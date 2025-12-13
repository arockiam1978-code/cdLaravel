<?php

namespace App\Http\Controllers;

use App\Models\Slider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\Encoders\JpegEncoder;

class SliderController extends Controller
{
    // LIST ALL
    public function index()
    {
        return response()->json(Slider::all());
    }

    // CREATE
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'nullable|string',
            'image' => 'required|image|mimes:jpg,jpeg,png'
        ]);

        $path = $this->processImage($request->file('image'));

        $slider = Slider::create([
            'title' => $request->title,
            'image' => $path,
        ]);

        return response()->json([
            'message' => 'Slider created successfully',
            'data' => $slider
        ], 201);
    }

    // SHOW
    public function show($id)
    {
        return Slider::findOrFail($id);
    }

    // UPDATE
    public function update(Request $request, $id)
    {
        $slider = Slider::findOrFail($id);

        $request->validate([
            'title' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpg,jpeg,png'
        ]);

        if ($request->hasFile('image')) {
            Storage::delete($slider->image);
            $slider->image = $this->processImage($request->file('image'));
        }

        $slider->title = $request->title;
        $slider->save();

        return response()->json([
            'message' => 'Slider updated successfully',
            'data' => $slider
        ]);
    }

    // DELETE
    public function destroy($id)
    {
        $slider = Slider::findOrFail($id);

        Storage::delete($slider->image);
        $slider->delete();

        return response()->json(['message' => 'Slider deleted']);
    }

    // IMAGE PROCESSING
    private function processImage($file)
    {

        $manager = new ImageManager(new Driver());

        $image = $manager->read($file)
            ->resize(1300, 525)
            ->encode(new JpegEncoder(quality:90));

        $filename = 'sliders/' . uniqid() . '.jpg';

        Storage::put($filename, (string) $image);

        return $filename;
    }
}
