import { PropsWithChildren } from "react";
import { Coffee, Sparkles } from "lucide-react";

interface AuthLayoutProps {
    title?: string;
    description?: string;
}

export default function AuthSplitLayout({
    children,
    title,
    description,
}: PropsWithChildren<AuthLayoutProps>){

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-amber-50/30 to-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-200/40 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-amber-200/40 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-emerald-100/30 to-amber-100/30 rounded-full blur-2xl"></div>
      </div>

      {/* Pattern Background */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}></div>

      <div className="relative w-full max-w-md z-10">
        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Header with decorative border */}
          <div className="px-8 py-8 border-b-4 border-amber-400 bg-gradient-to-br from-slate-50 to-white">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 bg-amber-100 rounded-xl animate-in zoom-in duration-500 delay-200">
                <Coffee className="h-6 w-6 text-amber-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 animate-in slide-in-from-left duration-500 delay-100" style={{ fontFamily: '"Playfair Display", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}>
                {title}
              </h2>
            </div>
            <p className="text-sm text-slate-600 ml-14 animate-in fade-in duration-500 delay-300">
              {description}
            </p>
          </div>

          {/* Form Container */}
          <div className="p-8 animate-in fade-in duration-700 delay-200">
            {children}
          </div>

          {/* Decorative bottom */}
          <div className="h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400"></div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-slate-600 text-sm flex items-center justify-center gap-1">
          <Sparkles className="h-3 w-3 text-amber-500" />
          <p>&copy; 2025 Bsissa. Tous droits réservés.</p>
          <Sparkles className="h-3 w-3 text-amber-500" />
        </div>
      </div>
    </div>
  );
}
