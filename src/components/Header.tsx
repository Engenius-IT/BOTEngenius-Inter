import React from 'react';
import { Bot, Database, Sparkles, CheckCircle2, LogOut, UserCheck, Menu, X } from 'lucide-react';

interface HeaderProps {
  knowledgeCount: number;
  articleCount: number;
  activeTab: string;
  user?: { name: string; email: string; role: string } | null;
  onLogout?: () => void;
  isMobileMenuOpen?: boolean;
  onToggleMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  knowledgeCount, 
  articleCount, 
  user,
  onLogout,
  isMobileMenuOpen = false,
  onToggleMobileMenu
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 px-3 sm:px-6 py-3 shadow-xs">
      <div className="flex items-center justify-between gap-2">
        {/* Brand & Mobile Menu Button */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          {/* Mobile Hamburger Toggle Button */}
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 transition-colors shrink-0 cursor-pointer"
              aria-label={isMobileMenuOpen ? "ปิดเมนู" : "เปิดเมนู"}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 text-red-500" /> : <Menu className="w-5 h-5" />}
            </button>
          )}

          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-600 shadow-md shadow-blue-500/20 flex items-center justify-center text-white shrink-0">
            <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight truncate">PHANX1 AI</h1>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="hidden xs:inline">Supabase</span> Live
              </span>
            </div>
            <p className="text-[11px] text-slate-500 truncate hidden sm:block">
              ระบบแชทบอทและการจัดการคลังความรู้อัจฉริยะ (RAG System)
            </p>
          </div>
        </div>

        {/* Status Pills & User Profile */}
        <div className="flex items-center gap-1.5 sm:gap-3 text-xs">
          {/* Active Training Tables Indicator - Desktop/Tablet */}
          <div className="hidden md:flex bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-slate-500 font-medium">คลังความรู้:</span>
            <span className="inline-flex items-center gap-1 text-slate-700 font-semibold bg-white border border-slate-200 px-2 py-0.5 rounded-md">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
              knowledge ({knowledgeCount})
            </span>
          </div>

          {/* Database Indicator - Desktop */}
          <div className="hidden xl:flex bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-3 py-1.5 items-center gap-1.5 font-medium">
            <Database className="w-4 h-4 text-slate-500" />
            <span>Supabase DB</span>
          </div>

          {/* User Account & Logout */}
          {user && (
            <div className="flex items-center gap-1.5 sm:gap-2 sm:pl-2 sm:border-l sm:border-slate-200">
              <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-xl text-blue-800 font-medium text-xs">
                <UserCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 shrink-0" />
                <span className="max-w-[80px] sm:max-w-[120px] truncate">{user.name}</span>
              </div>
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="p-1.5 sm:p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 rounded-xl transition-colors cursor-pointer"
                  title="ออกจากระบบ"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

