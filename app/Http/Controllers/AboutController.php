<?php

namespace App\Http\Controllers;

use App\Services\SiteSettingsService;
use Inertia\Inertia;
use Inertia\Response;

class AboutController extends Controller
{
    public function __construct(
        private SiteSettingsService $siteSettingsService
    ) {
    }

    public function index(): Response
    {
        $siteSettings = $this->siteSettingsService->getSettings();

        return Inertia::render('about', [
            'siteSettings' => [
                'site_name' => $siteSettings->site_name,
                'contact_email' => $siteSettings->contact_email,
                'contact_phone' => $siteSettings->contact_phone,
                'physical_address' => $siteSettings->physical_address,
                'facebook_url' => $siteSettings->facebook_url,
                'instagram_url' => $siteSettings->instagram_url,
                'twitter_url' => $siteSettings->twitter_url,
                'linkedin_url' => $siteSettings->linkedin_url,
                'youtube_url' => $siteSettings->youtube_url,
            ],
        ]);
    }
}
