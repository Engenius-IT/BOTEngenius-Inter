import React, { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { LoginModal } from './components/LoginModal';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardOverview } from './components/DashboardOverview';
import { SupabaseKnowledgeMetrics } from './components/SupabaseKnowledgeMetrics';
import { AITrainingCenter } from './components/AITrainingCenter';
import { AISettingsManager } from './components/AISettingsManager';
import { ChatbotSimulator } from './components/ChatbotSimulator';
import { AIPersonaManager } from './components/AIPersonaManager';
import { ChatMessagesConsole } from './components/ChatMessagesConsole';

import { 
  initialKnowledgeBase, 
  initialKnowledgeArticles, 
  initialChatMessages, 
  initialBroadcastLogs, 
  initialAdmins,
  initialAIConfig
} from './data/mockData';
import { KnowledgeBaseItem } from './types/schema';
import { BarChart3, GraduationCap, Bot, Cpu, Menu, MessageSquare } from 'lucide-react';

export function App() {
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(() => {
    try {
      const savedUser = localStorage.getItem('phanx1_user_session');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [activeTab, setActiveTabState] = useState<string>(() => {
    return localStorage.getItem('phanx1_active_tab') || 'overview';
  });

  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
    localStorage.setItem('phanx1_active_tab', tab);
    setIsMobileMenuOpen(false);
  };

  // Shared Application State
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeBaseItem[]>(initialKnowledgeBase);
  const [knowledgeArticles] = useState(initialKnowledgeArticles);
  const [chatMessages, setChatMessages] = useState(initialChatMessages);
  const [broadcastLogs] = useState(initialBroadcastLogs);
  const [admins] = useState(initialAdmins);
  const [aiConfig, setAiConfig] = useState(initialAIConfig);

  const handleLoginSuccess = (userData: { name: string; email: string; role: string }) => {
    setUser(userData);
    try {
      localStorage.setItem('phanx1_user_session', JSON.stringify(userData));
    } catch (e) {
      console.error('Failed to save user session:', e);
    }
    setIsLoginModalOpen(false);
    setActiveTab('overview');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('phanx1_user_session');
    localStorage.removeItem('phanx1_active_tab');
  };

  // If user is not logged in, show the Clean White Landing Page Index
  if (!user) {
    return (
      <>
        <LandingPage onOpenLogin={() => setIsLoginModalOpen(true)} />
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      </>
    );
  }

  // Once logged in, render the Clean Unified Admin Dashboard
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white pb-16 lg:pb-0 lg:h-screen lg:overflow-hidden">
      {/* Top Header */}
      <Header 
        knowledgeCount={knowledgeBase.length}
        articleCount={knowledgeArticles.length}
        activeTab={activeTab}
        user={user}
        onLogout={handleLogout}
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      {/* Mobile Menu Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer Sidebar Content */}
          <div className="relative flex-1 max-w-xs w-full bg-white h-full shadow-2xl z-50 flex flex-col overflow-y-auto pt-2">
            <Sidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              knowledgeCount={knowledgeBase.length + knowledgeArticles.length}
              messageCount={chatMessages.length}
              broadcastCount={broadcastLogs.length}
              adminCount={admins.length}
              activeProvider={aiConfig.activeProvider}
              onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Body Layout with Desktop Sidebar */}
      <div className="flex-1 flex flex-col lg:flex-row p-3 sm:p-4 md:p-6 gap-4 sm:gap-6 max-w-[1700px] w-full mx-auto min-h-0 lg:overflow-hidden">
        {/* Desktop Sidebar (hidden on mobile) */}
        <div className="hidden lg:block shrink-0 h-full overflow-y-auto">
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            knowledgeCount={knowledgeBase.length + knowledgeArticles.length}
            messageCount={chatMessages.length}
            broadcastCount={broadcastLogs.length}
            adminCount={admins.length}
            activeProvider={aiConfig.activeProvider}
          />
        </div>

        {/* Content Viewport - Internal Scrollable */}
        <main className="flex-1 min-w-0 h-full lg:overflow-y-auto pr-1">
          {activeTab === 'overview' && (
            <DashboardOverview
              knowledgeCount={knowledgeBase.length + knowledgeArticles.length}
              messageCount={chatMessages.length}
              activeProvider={aiConfig.activeProvider}
            />
          )}

          {activeTab === 'live-chats' && (
            <ChatMessagesConsole
              chatMessages={chatMessages}
              setChatMessages={setChatMessages}
              knowledgeBase={knowledgeBase}
              knowledgeArticles={knowledgeArticles}
            />
          )}

          {activeTab === 'metrics' && (
            <SupabaseKnowledgeMetrics
              knowledgeCount={knowledgeBase.length + knowledgeArticles.length}
            />
          )}

          {activeTab === 'ai-training' && (
            <AITrainingCenter
              knowledgeBase={knowledgeBase}
              setKnowledgeBase={setKnowledgeBase}
            />
          )}

          {activeTab === 'simulator' && (
            <ChatbotSimulator
              activeProvider={aiConfig.activeProvider}
              aiConfig={aiConfig}
            />
          )}

          {activeTab === 'persona' && (
            <AIPersonaManager
              aiConfig={aiConfig}
            />
          )}

          {activeTab === 'settings' && (
            <AISettingsManager
              aiConfig={aiConfig}
              setAiConfig={setAiConfig}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (Visible only on < lg) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 flex items-center justify-around shadow-lg">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium cursor-pointer ${
            activeTab === 'overview' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <BarChart3 className="w-5 h-5 mb-0.5" />
          <span>รายงาน</span>
        </button>

        <button
          onClick={() => setActiveTab('ai-training')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium cursor-pointer ${
            activeTab === 'ai-training' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <GraduationCap className="w-5 h-5 mb-0.5" />
          <span>เทรน AI</span>
        </button>

        <button
          onClick={() => setActiveTab('simulator')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium cursor-pointer ${
            activeTab === 'simulator' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Bot className="w-5 h-5 mb-0.5" />
          <span>จำลองแชท</span>
        </button>

        <button
          onClick={() => setActiveTab('live-chats')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium cursor-pointer ${
            activeTab === 'live-chats' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <MessageSquare className="w-5 h-5 mb-0.5" />
          <span>แชทสด</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium cursor-pointer ${
            activeTab === 'settings' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Cpu className="w-5 h-5 mb-0.5" />
          <span>ตั้งค่า AI</span>
        </button>
      </div>
    </div>
  );
}

export default App;

