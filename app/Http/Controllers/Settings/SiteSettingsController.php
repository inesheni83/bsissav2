<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Services\SiteSettingsService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SiteSettingsController extends Controller
{
    public function __construct(
        private SiteSettingsService $siteSettingsService
    ) {}

    /**
     * Display site settings page.
     */
    public function index(): Response
    {
        $settings = $this->siteSettingsService->getSettings();

        return Inertia::render('admin/settings/siteSettings', [
            'settings' => [
                'id' => $settings->id,
                'site_name' => $settings->site_name,
                'logo' => $settings->logo,
                'contact_email' => $settings->contact_email,
                'contact_phone' => $settings->contact_phone,
                'physical_address' => $settings->physical_address,
                'facebook_url' => $settings->facebook_url,
                'instagram_url' => $settings->instagram_url,
                'twitter_url' => $settings->twitter_url,
                'linkedin_url' => $settings->linkedin_url,
                'youtube_url' => $settings->youtube_url,
            ],
        ]);
    }

    /**
     * Update site settings.
     */
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'site_name' => 'required|string|max:255',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'contact_email' => 'nullable|email|max:255',
            'contact_phone' => 'nullable|string|max:50',
            'physical_address' => 'nullable|string|max:500',
            'facebook_url' => 'nullable|url|max:255',
            'instagram_url' => 'nullable|url|max:255',
            'twitter_url' => 'nullable|url|max:255',
            'linkedin_url' => 'nullable|url|max:255',
            'youtube_url' => 'nullable|url|max:255',
        ]);

        $this->siteSettingsService->updateSettings($validated);

        return redirect()
            ->back()
            ->with('success', 'Paramètres du site mis à jour avec succès.');
    }

    /**
     * Delete site logo.
     */
    public function deleteLogo(): RedirectResponse
    {
        $this->siteSettingsService->deleteLogo();

        return redirect()
            ->back()
            ->with('success', 'Logo supprimé avec succès.');
    }
}
