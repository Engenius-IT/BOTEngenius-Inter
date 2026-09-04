import React, { useState } from 'react';
import { AIProviderConfig, AIProvider } from '../types/schema';
import { 
  Bot, 
  Cpu, 
  Key, 
  CheckCircle2, 
  Zap, 
  ShieldCheck, 
  Save, 
  Sparkles, 
  Radio, 
  Activity,
  Eye,
  EyeOff,
  Send,
  MessageSquareCode
} from 'lucide-react';
import { generateRealAIResponse } from '../services/aiService';

interface AISettingsManagerProps {
  aiConfig: AIProviderConfig;
  setAiConfig: React.Dispatch<React.SetStateAction<AIProviderConfig>>;
}

export const AISettingsManager: React.FC<AISettingsManagerProps> = ({ aiConfig, setAiConfig }) => {
  const [config, setConfig] = useState<AIProviderConfig>(aiConfig);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showKeys, setShowKeys] = useState<{ [key: string]: boolean }>({});
  
  const [testPrompt, setTestPrompt] = useState('สอบถามเรื่องทุนการศึกษาโครงการแลกเปลี่ยนปี 2026');
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const toggleShowKey = (keyName: string) => {
    setShowKeys(prev => ({ ...prev, [keyName]: !prev[keyName] }));
  };

  const handleProviderSelect = (provider: AIProvider) => {
    setConfig(prev => ({
      ...prev,
      activeProvider: provider
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setAiConfig(config);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const handleTestAICall = async () => {
    if (!testPrompt.trim()) return;
    setIsTesting(true);
    setTestResult(null);

    const result = await generateRealAIResponse({
      provider: config.activeProvider,
      userMessage: testPrompt,
      config: config
    });

    setTestResult(
      `[LIVE AI RESPONSE - ${result.modelUsed} (${result.latencyMs}ms)]\n` +
      `คำตอบสดจาก AI Server: ${result.answer}`
    );
    setIsTesting(false);
  };

  return (
    <div className="space-y-5 pb-8 animate-fade-in">
      
      {/* 1. Header Banner */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              ตั้งค่าโมเดล AI & สลับ API Keys (Real Live AI Engine)
            </h2>
            <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping" />
              Active: {config.activeProvider.toUpperCase()}
            </span>
          </div>
          <p className="text-slate-500 text-xs mt-0.5">
            เลือกเปลี่ยนโมเดล AI ตอบสด (DeepSeek, Gemini, Groq, OpenAI) และกรอก API Keys บันทึกลงระบบจริง
          </p>
        </div>

        {savedSuccess && (
          <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-2xs animate-fade-in shrink-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>บันทึกการตั้งค่าโมเดล & LINE API Keys เรียบร้อยแล้ว!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        
        {/* 2. Active Model Selection Cards */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Radio className="w-4 h-4 text-blue-600" />
                <span>เลือกโมเดล AI หลักสำหรับตอบลูกค้า (Active Chat Engine)</span>
              </h3>
              <p className="text-xs text-slate-500">คลิกที่การ์ดค่าย AI ที่ต้องการเปิดใช้งานในขณะนี้</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* DeepSeek Card */}
            <div 
              onClick={() => handleProviderSelect('deepseek')}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                config.activeProvider === 'deepseek'
                  ? 'bg-blue-50/80 border-blue-500 shadow-md shadow-blue-500/10'
                  : 'bg-slate-50/60 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-blue-600" />
                    DeepSeek AI
                  </span>
                  {config.activeProvider === 'deepseek' && (
                    <span className="text-[10px] font-mono font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full">
                      ACTIVE
                    </span>
                  )}
                </div>
                <div className="text-[11px] font-mono text-blue-700 font-semibold">
                  Model: {config.deepseek.model}
                </div>
                <p className="text-[11px] text-slate-500">
                  ตอบสดด้วย DeepSeek Server
                </p>
              </div>

              <div className="text-[10px] font-mono text-slate-400 truncate border-t border-slate-200/80 pt-2">
                Key: {config.deepseek.apiKey ? `${config.deepseek.apiKey.substring(0, 10)}...` : 'ไม่ได้ระบุ'}
              </div>
            </div>

            {/* Gemini AI Card */}
            <div 
              onClick={() => handleProviderSelect('gemini')}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                config.activeProvider === 'gemini'
                  ? 'bg-indigo-50/80 border-indigo-500 shadow-md shadow-indigo-500/10'
                  : 'bg-slate-50/60 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    Google Gemini
                  </span>
                  {config.activeProvider === 'gemini' && (
                    <span className="text-[10px] font-mono font-bold bg-indigo-600 text-white px-2 py-0.5 rounded-full">
                      ACTIVE
                    </span>
                  )}
                </div>
                <div className="text-[11px] font-mono text-indigo-700 font-semibold">
                  Chat: {config.gemini.chatModel}
                </div>
                <p className="text-[11px] text-slate-500">
                  Google Generative AI Live
                </p>
              </div>

              <div className="text-[10px] font-mono text-slate-400 truncate border-t border-slate-200/80 pt-2">
                Key: {config.gemini.apiKey ? `${config.gemini.apiKey.substring(0, 10)}...` : 'ไม่ได้ระบุ'}
              </div>
            </div>

            {/* Groq AI Card */}
            <div 
              onClick={() => handleProviderSelect('groq')}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                config.activeProvider === 'groq'
                  ? 'bg-emerald-50/80 border-emerald-500 shadow-md shadow-emerald-500/10'
                  : 'bg-slate-50/60 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-emerald-600" />
                    Groq Llama 3.3
                  </span>
                  {config.activeProvider === 'groq' && (
                    <span className="text-[10px] font-mono font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                      ACTIVE
                    </span>
                  )}
                </div>
                <div className="text-[11px] font-mono text-emerald-700 font-semibold">
                  Model: {config.groq.model}
                </div>
                <p className="text-[11px] text-slate-500">
                  Groq LPU Speed Live
                </p>
              </div>

              <div className="text-[10px] font-mono text-slate-400 truncate border-t border-slate-200/80 pt-2">
                Key: {config.groq.apiKey ? `${config.groq.apiKey.substring(0, 10)}...` : 'ไม่ได้ระบุ'}
              </div>
            </div>

            {/* OpenAI Card */}
            <div 
              onClick={() => handleProviderSelect('openai')}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                config.activeProvider === 'openai'
                  ? 'bg-purple-50/80 border-purple-500 shadow-md shadow-purple-500/10'
                  : 'bg-slate-50/60 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Bot className="w-4 h-4 text-purple-600" />
                    OpenAI GPT
                  </span>
                  {config.activeProvider === 'openai' && (
                    <span className="text-[10px] font-mono font-bold bg-purple-600 text-white px-2 py-0.5 rounded-full">
                      ACTIVE
                    </span>
                  )}
                </div>
                <div className="text-[11px] font-mono text-purple-700 font-semibold">
                  Model: {config.openai.model}
                </div>
                <p className="text-[11px] text-slate-500">
                  OpenAI GPT-4o Mini Live
                </p>
              </div>

              <div className="text-[10px] font-mono text-slate-400 truncate border-t border-slate-200/80 pt-2">
                Key: {config.openai.apiKey ? `${config.openai.apiKey.substring(0, 10)}...` : 'ไม่ได้ระบุ'}
              </div>
            </div>

          </div>
        </div>

        {/* 3. API Keys Editing Forms & Live Tester */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Left Column: AI Provider API Keys Inputs */}
          <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Key className="w-4 h-4 text-blue-600" />
              <span>กำหนดค่า API Keys & Models แต่ละค่าย</span>
            </h3>

            {/* DeepSeek API Settings */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
              <span className="text-xs font-bold text-blue-700 block">1. DeepSeek AI Configuration</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-500 block font-medium">DEEPSEEK_MODEL</label>
                  <input
                    type="text"
                    value={config.deepseek.model}
                    onChange={(e) => setConfig({
                      ...config,
                      deepseek: { ...config.deepseek, model: e.target.value }
                    })}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 block font-medium">DEEPSEEK_API_KEY</label>
                  <div className="relative">
                    <input
                      type={showKeys['deepseek'] ? 'text' : 'password'}
                      value={config.deepseek.apiKey}
                      onChange={(e) => setConfig({
                        ...config,
                        deepseek: { ...config.deepseek, apiKey: e.target.value }
                      })}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 pr-8 text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => toggleShowKey('deepseek')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showKeys['deepseek'] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Gemini API Settings */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
              <span className="text-xs font-bold text-indigo-700 block">2. Google Gemini & Vector Embedding</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-500 block font-medium">GEMINI_CHAT_MODEL</label>
                  <input
                    type="text"
                    value={config.gemini.chatModel}
                    onChange={(e) => setConfig({
                      ...config,
                      gemini: { ...config.gemini, chatModel: e.target.value }
                    })}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 block font-medium">GEMINI_API_KEY</label>
                  <div className="relative">
                    <input
                      type={showKeys['gemini'] ? 'text' : 'password'}
                      value={config.gemini.apiKey}
                      onChange={(e) => setConfig({
                        ...config,
                        gemini: { ...config.gemini, apiKey: e.target.value }
                      })}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 pr-8 text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => toggleShowKey('gemini')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showKeys['gemini'] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Groq API Settings */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
              <span className="text-xs font-bold text-emerald-700 block">3. Groq AI Configuration</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-500 block font-medium">GROQ_MODEL</label>
                  <input
                    type="text"
                    value={config.groq.model}
                    onChange={(e) => setConfig({
                      ...config,
                      groq: { ...config.groq, model: e.target.value }
                    })}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 block font-medium">GROQ_API_KEY</label>
                  <div className="relative">
                    <input
                      type={showKeys['groq'] ? 'text' : 'password'}
                      value={config.groq.apiKey}
                      onChange={(e) => setConfig({
                        ...config,
                        groq: { ...config.groq, apiKey: e.target.value }
                      })}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 pr-8 text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => toggleShowKey('groq')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showKeys['groq'] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* OpenAI Settings */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
              <span className="text-xs font-bold text-purple-700 block">4. OpenAI GPT Configuration</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-500 block font-medium">OPENAI_MODEL</label>
                  <input
                    type="text"
                    value={config.openai.model}
                    onChange={(e) => setConfig({
                      ...config,
                      openai: { ...config.openai, model: e.target.value }
                    })}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 block font-medium">OPENAI_API_KEY</label>
                  <div className="relative">
                    <input
                      type={showKeys['openai'] ? 'text' : 'password'}
                      value={config.openai.apiKey}
                      onChange={(e) => setConfig({
                        ...config,
                        openai: { ...config.openai, apiKey: e.target.value }
                      })}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 pr-8 text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => toggleShowKey('openai')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showKeys['openai'] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Fully Editable LINE Messaging API Credentials & Live Tester */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* Fully Editable LINE API Section */}
            <div className="bg-white border border-emerald-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <MessageSquareCode className="w-4.5 h-4.5 text-emerald-600" />
                  <span>LINE Official Messaging API Credentials</span>
                </h3>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md">
                  Editable ✏️
                </span>
              </div>

              <div className="space-y-3">
                {/* 1. LINE Channel Secret */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] text-slate-700 block font-bold">
                      1. LINE_CHANNEL_SECRET
                    </label>
                    <span className="text-[10px] text-slate-400">จาก Basic Settings</span>
                  </div>
                  <div className="relative">
                    <input
                      type={showKeys['lineSecret'] ? 'text' : 'password'}
                      value={config.line.channelSecret}
                      onChange={(e) => setConfig({
                        ...config,
                        line: { ...config.line, channelSecret: e.target.value }
                      })}
                      placeholder="ใส่ Channel Secret จาก LINE Developers Console..."
                      className="w-full bg-slate-50/80 border border-slate-200 rounded-xl p-2.5 pr-9 text-xs font-mono text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => toggleShowKey('lineSecret')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showKeys['lineSecret'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* 2. LINE Access Token */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] text-slate-700 block font-bold">
                      2. LINE_ACCESS_TOKEN (Long-lived)
                    </label>
                    <span className="text-[10px] text-slate-400">จาก Messaging API</span>
                  </div>
                  <div className="relative">
                    <textarea
                      rows={3}
                      value={config.line.accessToken}
                      onChange={(e) => setConfig({
                        ...config,
                        line: { ...config.line, accessToken: e.target.value }
                      })}
                      placeholder="วาง Channel Access Token รหัสยาวที่นี่..."
                      className="w-full bg-slate-50/80 border border-slate-200 rounded-xl p-2.5 text-xs font-mono text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all leading-normal"
                    />
                  </div>
                </div>

                {/* 3. Admin LINE User ID */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] text-slate-700 block font-bold">
                      3. LINE_ADMIN_USER_ID (รับแจ้งเตือนแอดมิน)
                    </label>
                    <span className="text-[10px] text-slate-400">ขึ้นต้นด้วย U...</span>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={config.line.adminLineUserId}
                      onChange={(e) => setConfig({
                        ...config,
                        line: { ...config.line, adminLineUserId: e.target.value }
                      })}
                      placeholder="เช่น U9188449e7458f0441acd523ccd6a5cec"
                      className="w-full bg-slate-50/80 border border-slate-200 rounded-xl p-2.5 text-xs font-mono text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* Live Model Call Tester */}
            <div className="bg-white border border-blue-200 rounded-2xl p-5 shadow-2xs space-y-3">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-600" />
                <span>ทดสอบการเชื่อมต่อโมเดล {config.activeProvider.toUpperCase()} แบบเรียลไทม์</span>
              </h4>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={testPrompt}
                  onChange={(e) => setTestPrompt(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={handleTestAICall}
                  disabled={isTesting}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Send className="w-3 h-3" />
                  <span>{isTesting ? 'กำลังเรียก AI สด...' : 'ทดสอบเรียก AI'}</span>
                </button>
              </div>

              {testResult && (
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-300 leading-relaxed whitespace-pre-wrap animate-fade-in">
                  {testResult}
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Save Changes Button Bar */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="py-3 px-8 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4.5 h-4.5" />
            <span>บันทึกการตั้งค่าโมเดล AI & LINE API Keys ทั้งหมด</span>
          </button>
        </div>

      </form>
    </div>
  );
};
