<?php

namespace App\Http\Controllers\TransactionalEmail;

use App\Http\Controllers\Controller;
use App\Services\TransactionalEmailTemplateService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TransactionalEmailTemplateController extends Controller
{
    public function __construct(private TransactionalEmailTemplateService $templateService)
    {
    }

    public function index(): Response
    {
        $templates = $this->templateService
            ->getTemplates()
            ->map(function ($template) {
                return [
                    'id' => $template->id,
                    'template_key' => $template->template_key,
                    'subject' => $template->subject,
                    'body' => $template->body,
                ];
            })
            ->values();

        return Inertia::render('admin/transactionalEmails/index', [
            'templates' => $templates,
            'templateMeta' => $this->templateService->getTemplateMeta(),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'templates' => 'required|array',
            'templates.*.template_key' => 'required|string|in:order_confirmation,status_update,delivery_confirmation',
            'templates.*.subject' => 'required|string|max:255',
            'templates.*.body' => 'required|string',
        ]);

        $this->templateService->updateTemplates($validated['templates']);

        return redirect()
            ->back()
            ->with('success', 'Templates mis a jour avec succes.');
    }
}
