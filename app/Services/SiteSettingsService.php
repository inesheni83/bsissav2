<?php

namespace App\Services;

use App\Models\SiteSetting;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class SiteSettingsService
{
    /**
     * Get the site settings instance.
     */
    public function getSettings(): SiteSetting
    {
        return SiteSetting::getInstance();
    }

    /**
     * Update site settings.
     */
    public function updateSettings(array $data): SiteSetting
    {
        return DB::transaction(function () use ($data) {
            $settings = SiteSetting::getInstance();

            // Handle logo upload if present
            if (isset($data['logo']) && $data['logo'] instanceof UploadedFile) {
                // Delete old logo if exists
                if ($settings->logo && Storage::disk('public')->exists($settings->logo)) {
                    Storage::disk('public')->delete($settings->logo);
                }

                // Store new logo
                $logoPath = $data['logo']->store('site-settings', 'public');
                $data['logo'] = $logoPath;
            } else {
                // Remove logo from data if not uploading a new one
                unset($data['logo']);
            }

            $settings->update($data);

            return $settings->fresh();
        });
    }

    /**
     * Delete the site logo.
     */
    public function deleteLogo(): void
    {
        DB::transaction(function () {
            $settings = SiteSetting::getInstance();

            if ($settings->logo && Storage::disk('public')->exists($settings->logo)) {
                Storage::disk('public')->delete($settings->logo);
            }

            $settings->update(['logo' => null]);
        });
    }
}
