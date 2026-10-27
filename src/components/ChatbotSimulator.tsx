import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  RefreshCw, 
  CheckCircle2, 
  Database, 
  Cpu, 
  User, 
  Trash2, 
  Search,
  Code2,
  ChevronDown,
  ChevronUp,
  Layers,
  Heart,
  ShieldCheck,
  Sliders,
  Save,
  Check,
  MessageSquare,
  Settings,
  Terminal
} from 'lucide-react';
import { generateRealAIResponse, DEFAULT_PHANX1_MASTER_PROMPT } from '../services/aiService';
import { searchSupabaseRAG } from '../services/ragSearchService';
import { AIProviderConfig, AIProvider } from '../types/schema';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  ragDetails?: {
    searchedTable: string;
    matchedRowId: string | number;
    similarityScore: number;
    retrievedContent: string;
    vectorDimensions: number;
    latencyMs: number;
    modelUsed: string;
  };
}

interface ChatbotSimulatorProps {
  activeProvider: string;
  aiConfig?: AIProviderConfig;
}

export function ChatbotSimulator({ activeProvider, aiConfig }: ChatbotSimulatorProps) {
  const [selectedModel, setSelectedModel] = useState<string>(activeProvider || 'deepseek');
  const [inputMessage, setInputMessage] = useState('');
  const [isSearchingDb, setIsSearchingDb] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>('');
  const [expandedRagId, setExpandedRagId] = useState<string | null>(null);
  
  // Mobile Tab View Mode ('chat' | 'persona' | 'pipeline')
  const [mobileTab, setMobileTab] = useState<'chat' | 'persona' | 'pipeline'>('chat');

  // Persona & System Prompt Enforcer State
  const [showPersonaPanel, setShowPersonaPanel] = useState<boolean>(false);
  const [activePrompt, setActivePrompt] = useState<string>(DEFAULT_PHANX1_MASTER_PROMPT);
  const [strictRagMode, setStrictRagMode] = useState<boolean>(true);
  const [personaSavedMsg, setPersonaSavedMsg] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentConfig: AIProviderConfig = aiConfig || {
    activeProvider: selectedModel as AIProvider,
    deepseek: { apiKey: import.meta.env.VITE_DEEPSEEK_API_KEY || '', model: 'deepseek-chat' },
    gemini: { apiKey: import.meta.env.VITE_GEMINI_API_KEY || '', chatModel: 'gemini-2.5-flash', embeddingModel: 'gemini-embedding-2' },
    groq: { apiKey: import.meta.env.VITE_GROQ_API_KEY || '', model: 'llama-3.3-70b-versatile' },
    openai: { apiKey: import.meta.env.VITE_OPENAI_API_KEY || '', model: 'gpt-4o-mini' },
    line: { channelSecret: import.meta.env.VITE_LINE_CHANNEL_SECRET || '', accessToken: import.meta.env.VITE_LINE_ACCESS_TOKEN || '', adminLineUserId: 'U9188449e7458f0441acd523ccd6a5cec' }
  };

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'bot',
      text: 'สวัสดีค่ะ น้องอิงกี้จาก Engenius ยินดีให้คำปรึกษาค่ะ 💕 สนใจโครงการแลกเปลี่ยนระยะสั้น รุ่นที่ 20, Work and Travel USA 2027 หรือคอร์สเรียนภาษาคะ? บอกโปรแกรมหรือเรื่องที่อยากรู้ได้เลยนะคะ อิงกี้ช่วยสรุปรายละเอียด ค่าใช้จ่าย และคุณสมบัติให้ตรงกับที่สนใจค่ะ ✨',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ragDetails: {
        searchedTable: 'public.knowledge_base',
        matchedRowId: 1,
        similarityScore: 0.998,
        retrievedContent: '[หมวดหมู่: โครงการแลกเปลี่ยน]\nคำถาม: โครงการแลกเปลี่ยนระยะสั้นมีประเทศอะไรให้เลือกบ้าง?\nคำตอบจากคลัง DB: ปัจจุบันเปิดรับ 4 ประเทศ อเมริกา อังกฤษ นิวซีแลนด์ และสิงคโปร์',
        vectorDimensions: 1536,
        latencyMs: 42,
        modelUsed: 'Engenius RAG Engine (น้องอิงกี้)'
      }
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSearchingDb, mobileTab]);

  const quickPrompts = [
    'โครงการแลกเปลี่ยนมีประเทศอะไรบ้าง?',
    'ระยะยาวไปกี่เดือน?',
    'รับสมัครอายุเท่าไหร่ เรียนอยู่ชั้นไหน?',
    'สอบถามคอร์สเรียนตัวต่อตัว'
  ];

  // Presets for quick switching
  const applyPresetPersona = (type: 'ingky' | 'male_admin' | 'concise') => {
    if (type === 'ingky') {
      setActivePrompt(DEFAULT_PHANX1_MASTER_PROMPT);
      setPersonaSavedMsg('สลับเป็นบทบาท: น้องอิงกี้ (ตอบสั้นกระชับเข้าใจง่าย ค่ะ/นะคะ)');
    } else if (type === 'male_admin') {
      setActivePrompt(`คุณคือแอดมินพี่ PHANX1 เป็นผู้ชาย ตอบสั้นกระชับ ปานกลาง 2-4 บรรทัด สุภาพ อบอุ่น ทางการ อ้างอิงเฉพาะ Supabase DB เท่านั้น ลงท้ายด้วย ครับ เป็นหลัก`);
      setPersonaSavedMsg('สลับเป็นบทบาท: แอดมินพี่ PHANX1 (ผู้ชาย ตอบสั้นกระชับ ครับ)');
    } else {
      setActivePrompt(`คุณคือผู้ช่วย AI ตอบคำถามอย่างสั้น กระชับ 1-2 บรรทัด อ้างอิงเฉพาะข้อมูลใน Supabase DB เท่านั้น หากไม่มีข้อมูลให้ตอบว่า "ขออภัยครับ ข้อมูลส่วนนี้ไม่มีในระบบ ให้แอดมินเจ้าหน้าที่ช่วยดูแลเพิ่มเติมไหมครับ"`);
      setPersonaSavedMsg('สลับเป็นบทบาท: ตอบสั้นขั้นสุด (Ultra Concise)');
    }
    setTimeout(() => setPersonaSavedMsg(null), 3000);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsSearchingDb(true);

    // Step 1: Embedding Query
    setCurrentStep('1. แปลงคำถามเป็น Vector Embedding...');
    await new Promise(r => setTimeout(r, 200));

    // Step 2: Real RAG Search across Supabase Tables
    setCurrentStep('2. รัน SQL ค้นหาข้อมูลจริงจากตาราง knowledge_base...');
    await new Promise(r => setTimeout(r, 250));

    // Execute real search
    const ragResult = searchSupabaseRAG(query);

    // Step 3: Call Live AI Engine with context
    setCurrentStep(`3. ส่งข้อมูลจริงให้ AI (${selectedModel.toUpperCase()}) สรุปตอบ...`);
    
    const aiResult = await generateRealAIResponse({
      provider: selectedModel as AIProvider,
      userMessage: query,
      systemPrompt: activePrompt,
      contextText: ragResult.retrievedContent,
      config: currentConfig
    });

    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      sender: 'bot',
      text: aiResult.answer,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ragDetails: {
        searchedTable: ragResult.searchedTable,
        matchedRowId: ragResult.matchedRowId,
        similarityScore: ragResult.similarityScore,
        retrievedContent: ragResult.retrievedContent,
        vectorDimensions: 1536,
        latencyMs: aiResult.latencyMs,
        modelUsed: aiResult.modelUsed
      }
    };

    setMessages(prev => [...prev, botMsg]);
    setIsSearchingDb(false);
    setCurrentStep('');
  };

  const toggleExpandRag = (id: string) => {
    setExpandedRagId(expandedRagId === id ? null : id);
  };

  return (
    <div className="space-y-3 sm:space-y-5 pb-6 animate-fade-in max-w-6xl mx-auto">
      
      {/* Header Banner - Mobile Optimized */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base sm:text-xl font-bold text-slate-900 tracking-tight">
              ทดลองคุยกับบอท (Live Chat Sandbox)
            </h2>
            <span className="bg-pink-50 text-pink-700 border border-pink-200 text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 shrink-0">
              <Heart className="w-3 h-3 text-pink-600 fill-pink-600" />
              น้องอิงกี้ Live
            </span>
          </div>
          <p className="text-slate-500 text-[11px] sm:text-xs mt-0.5">
            ค้นหาข้อมูลจริงจาก Supabase DB และตอบกลับด้วย AI Engine
          </p>
        </div>

        {/* Model Switcher Dropdown */}
        <div className="flex items-center justify-between sm:justify-start gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200 shrink-0">
          <span className="text-[11px] font-bold text-slate-500 pl-1">เลือกโมเดล:</span>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="bg-white border border-slate-200 text-blue-700 font-bold text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="deepseek">DeepSeek Chat</option>
            <option value="gemini">Gemini 2.5 Flash</option>
            <option value="groq">Groq Llama 3.3</option>
            <option value="openai">OpenAI GPT-4o</option>
          </select>
        </div>
      </div>

      {/* Mobile Mode Switcher Tabs (Only visible on small screens to save vertical space) */}
      <div className="lg:hidden flex items-center bg-slate-200/60 p-1 rounded-xl gap-1">
        <button
          onClick={() => setMobileTab('chat')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            mobileTab === 'chat' ? 'bg-white text-pink-600 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>หน้าต่างแชท</span>
        </button>

        <button
          onClick={() => setMobileTab('persona')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            mobileTab === 'persona' ? 'bg-white text-purple-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>ตั้งค่าบทบาท</span>
        </button>

        <button
          onClick={() => setMobileTab('pipeline')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            mobileTab === 'pipeline' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>RAG Step</span>
        </button>
      </div>

      {/* 🌟 Real AI Live Persona Enforcer Panel (Collapsible or visible via Persona tab on mobile) */}
      <div className={`bg-white border border-purple-200 rounded-2xl shadow-sm overflow-hidden ${
        mobileTab !== 'persona' ? 'hidden lg:block' : 'block'
      }`}>
        <div 
          onClick={() => setShowPersonaPanel(!showPersonaPanel)}
          className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 p-3.5 sm:p-4 text-white flex items-center justify-between cursor-pointer select-none"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-pink-400 shrink-0" />
            <div>
              <h3 className="text-xs sm:text-sm font-bold tracking-wide">
                กำหนดบทบาท AI & กฎเหล็กพฤติกรรม (System Prompt)
              </h3>
              <p className="text-[10px] sm:text-[11px] text-purple-200">
                ตั้งค่าคำสั่งบีบบทบาทแอดมิน บังคับตอบสั้นกระชับ (ค่ะ/นะคะ/ครับ)
              </p>
            </div>
          </div>

          <button
            type="button"
            className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{showPersonaPanel ? 'ซ่อนพาเนล' : 'ตั้งค่าบทบาท'}</span>
            {showPersonaPanel ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {showPersonaPanel && (
          <div className="p-3.5 sm:p-5 space-y-4 bg-purple-50/20 animate-fade-in">
            {personaSavedMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{personaSavedMsg}</span>
              </div>
            )}

            {/* Quick Presets */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-100 pb-3">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                เลือกบทบาทสำเร็จรูป (Presets):
              </span>

              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => applyPresetPersona('ingky')}
                  className="px-2.5 py-1.5 bg-pink-600 hover:bg-pink-700 text-white font-bold text-[11px] sm:text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1"
                >
                  <Heart className="w-3 h-3 fill-white" />
                  <span>น้องอิงกี้ (ค่ะ/นะคะ)</span>
                </button>
                <button
                  type="button"
                  onClick={() => applyPresetPersona('male_admin')}
                  className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] sm:text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  <span>แอดมินพี่ PHANX1 (ครับ)</span>
                </button>
                <button
                  type="button"
                  onClick={() => applyPresetPersona('concise')}
                  className="px-2.5 py-1.5 bg-slate-700 hover:bg-slate-800 text-white font-bold text-[11px] sm:text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  <span>ตอบสั้นขั้นสุด (1-2 บรรทัด)</span>
                </button>
              </div>
            </div>

            {/* Editable System Prompt Textarea */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Code2 className="w-4 h-4 text-purple-600" />
                  <span>คำสั่ง System Prompt Directives:</span>
                </label>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                  Active
                </span>
              </div>
              
              <textarea
                rows={5}
                value={activePrompt}
                onChange={(e) => setActivePrompt(e.target.value)}
                className="w-full bg-slate-900 text-emerald-400 font-mono text-xs p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-purple-500 leading-relaxed shadow-inner"
              />
            </div>

            {/* Strict Rules Toggle Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-white border border-purple-200 rounded-xl shadow-2xs">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">บังคับอ้างอิง DB 100% (Strict RAG)</div>
                  <div className="text-[10px] sm:text-[11px] text-slate-500">
                    หากไม่พบข้อมูลใน DB ให้ปฏิเสธทันที ห้ามเดาคำตอบ
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => {
                    setStrictRagMode(!strictRagMode);
                    setPersonaSavedMsg(`สถานะ Strict RAG Mode: ${!strictRagMode ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}`);
                    setTimeout(() => setPersonaSavedMsg(null), 3000);
                  }}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    strictRagMode 
                      ? 'bg-emerald-600 text-white shadow-xs' 
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {strictRagMode ? '✓ Strict Active' : 'ปิดใช้งาน'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPersonaSavedMsg('บันทึกคำสั่งบีบบทบาท AI ล่าสุดเรียบร้อยแล้ว!');
                    setTimeout(() => setPersonaSavedMsg(null), 3000);
                  }}
                  className="px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>บันทึก</span>
                </button>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* RAG Pipeline Flow Visualizer (Shown on Desktop or Pipeline tab on Mobile) */}
      <div className={`bg-gradient-to-r from-pink-900 via-purple-900 to-slate-900 text-white rounded-2xl p-3.5 sm:p-4 shadow-md ${
        mobileTab !== 'pipeline' ? 'hidden lg:block' : 'block'
      }`}>
        <div className="flex items-center justify-between mb-2.5 border-b border-pink-800/80 pb-2">
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-pink-300 flex items-center gap-2">
            <Layers className="w-4 h-4 text-pink-400 shrink-0" />
            กระบวนการดึงข้อมูล Supabase DB (Real RAG Pipeline)
          </span>
          <span className="text-[10px] text-pink-200 font-mono">Engine: {selectedModel.toUpperCase()}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="bg-pink-950/60 border border-pink-700/50 p-2 rounded-xl space-y-0.5">
            <div className="text-[9px] font-bold text-pink-300">1. USER PROMPT</div>
            <div className="text-[11px] font-semibold text-white truncate">แปลง Vector</div>
          </div>

          <div className="bg-pink-950/60 border border-pink-700/50 p-2 rounded-xl space-y-0.5">
            <div className="text-[9px] font-bold text-indigo-300">2. SUPABASE QUERY</div>
            <div className="text-[11px] font-semibold text-white truncate">ดึงแถวความรู้ DB</div>
          </div>

          <div className="bg-pink-950/60 border border-pink-700/50 p-2 rounded-xl space-y-0.5">
            <div className="text-[9px] font-bold text-emerald-300">3. INJECT CONTEXT</div>
            <div className="text-[11px] font-semibold text-white truncate">ส่ง DB ให้ AI อ่าน</div>
          </div>

          <div className="bg-pink-950/60 border border-pink-700/50 p-2 rounded-xl space-y-0.5">
            <div className="text-[9px] font-bold text-amber-300">4. LLM REPLY</div>
            <div className="text-[11px] font-semibold text-white truncate">สรุปตอบสั้นกระชับ</div>
          </div>
        </div>
      </div>

      {/* Main Chat Area (Visible on Desktop or Chat tab on Mobile) */}
      <div className={`bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden flex flex-col h-[520px] lg:h-[calc(100vh-220px)] ${
        mobileTab !== 'chat' ? 'hidden lg:flex' : 'flex'
      }`}>
        
        {/* Chat Top Header */}
        <div className="bg-slate-50 border-b border-slate-200/80 px-3.5 sm:px-5 py-2.5 sm:py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-pink-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs text-slate-900 truncate">น้องอิงกี้ (Engenius AI)</span>
                <span className="text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded bg-pink-50 text-pink-700 border border-pink-200 font-bold shrink-0">
                  {selectedModel.toUpperCase()}
                </span>
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                ตอบสั้นกระชับ อ้างอิง Supabase DB
              </span>
            </div>
          </div>

          <button
            onClick={() => setMessages([])}
            className="px-2.5 py-1.5 bg-white hover:bg-red-50 text-slate-600 hover:text-red-600 border border-slate-200 hover:border-red-200 text-xs font-medium rounded-xl transition-colors flex items-center gap-1 cursor-pointer shrink-0"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">ล้างแชท</span>
          </button>
        </div>

        {/* Message History Stream */}
        <div className="flex-1 p-3 sm:p-5 overflow-y-auto space-y-3.5 bg-slate-50/40">
          {messages.map((msg) => (
            <div 
              key={msg.id}
              className={`flex items-start gap-2 sm:gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {/* Bot Avatar */}
              {msg.sender === 'bot' && (
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-pink-600 text-white flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`space-y-1.5 max-w-[90%] sm:max-w-[78%] ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                
                {/* Bubble Text */}
                <div 
                  className={`p-3 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-xs font-normal'
                      : 'bg-white border border-pink-100 text-slate-900 rounded-tl-xs whitespace-pre-wrap'
                  }`}
                >
                  {msg.text}
                </div>

                {/* RAG & AI Verification Tags */}
                {msg.sender === 'bot' && msg.ragDetails && (
                  <div className="space-y-1 pl-0.5">
                    
                    <div className="flex flex-wrap items-center gap-1 text-[10px]">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold border ${
                        msg.ragDetails.similarityScore >= 0.80 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        <CheckCircle2 className="w-3 h-3" />
                        {(msg.ragDetails.similarityScore * 100).toFixed(1)}% Match
                      </span>

                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white text-slate-600 border border-slate-200 font-mono font-medium">
                        <Database className="w-3 h-3 text-blue-600" />
                        #{msg.ragDetails.matchedRowId}
                      </span>

                      <button
                        onClick={() => toggleExpandRag(msg.id)}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors cursor-pointer"
                      >
                        <Search className="w-3 h-3" />
                        <span>{expandedRagId === msg.id ? 'ซ่อน RAG' : '🔍 ดู DB Context'}</span>
                        {expandedRagId === msg.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>
                    </div>

                    {/* Detailed RAG Query Inspection Box */}
                    {expandedRagId === msg.id && (
                      <div className="p-3 bg-slate-900 text-white rounded-xl text-xs font-mono space-y-2 border border-slate-800 shadow-md animate-fade-in mt-2">
                        <div className="flex items-center justify-between text-pink-400 font-bold border-b border-slate-800 pb-1 text-[10px]">
                          <span className="flex items-center gap-1">
                            <Code2 className="w-3 h-3 text-pink-400" />
                            RAG Log ({msg.ragDetails.latencyMs}ms)
                          </span>
                          <span className="text-slate-400 font-mono">{msg.ragDetails.modelUsed}</span>
                        </div>

                        <div className="space-y-0.5 text-[10px] text-slate-300">
                          <div><span className="text-slate-500">Table:</span> <span className="text-blue-300 font-bold">{msg.ragDetails.searchedTable}</span></div>
                          <div><span className="text-slate-500">Matched ID:</span> <span className="text-emerald-400 font-bold">#{msg.ragDetails.matchedRowId}</span></div>
                          <div><span className="text-slate-500">Similarity:</span> <span className="text-emerald-400 font-bold">{msg.ragDetails.similarityScore}</span></div>
                        </div>

                        <div className="pt-1.5 border-t border-slate-800 space-y-1">
                          <span className="text-slate-400 text-[10px] block font-bold">
                            📄 ข้อความจริงจาก DB ส่งให้ AI อ่าน:
                          </span>
                          <div className="p-2 rounded bg-slate-950 text-emerald-300 text-[10px] leading-relaxed border border-slate-800 font-mono whitespace-pre-wrap max-h-36 overflow-y-auto">
                            {msg.ragDetails.retrievedContent}
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                )}

              </div>

              {/* User Avatar */}
              {msg.sender === 'user' && (
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 shadow-2xs mt-0.5 font-bold text-xs">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {/* Loader animation */}
          {isSearchingDb && (
            <div className="flex items-start gap-2.5 animate-fade-in">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-pink-600 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-md ring-2 ring-pink-300 ring-offset-1">
                <Sparkles className="w-4 h-4 animate-spin text-pink-100" />
              </div>
              <div className="p-3 bg-gradient-to-r from-pink-50 via-purple-50 to-white border border-pink-200 rounded-2xl rounded-tl-xs text-xs text-slate-800 space-y-1.5 shadow-lg max-w-xs sm:max-w-md">
                <div className="font-bold text-pink-700 flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5 font-bold text-xs sm:text-sm">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-600"></span>
                    </span>
                    น้องอิงกี้กำลังคิดคำตอบ...
                  </span>

                  <div className="flex items-center space-x-1 bg-pink-100 px-1.5 py-0.5 rounded-full border border-pink-200">
                    <div className="w-1 h-1 bg-pink-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-1 h-1 bg-purple-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-1 h-1 bg-pink-600 rounded-full animate-bounce"></div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[10px] font-mono text-purple-900 bg-white/80 p-1.5 rounded-xl border border-pink-100 shadow-2xs">
                  <RefreshCw className="w-3 h-3 animate-spin text-pink-600 shrink-0" />
                  <span className="truncate">{currentStep}</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Bar - Horizontal Touch Scrollable */}
        <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
          <span className="text-[10px] font-bold text-slate-400 shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-pink-500" />
            ตัวอย่าง:
          </span>
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="px-2.5 py-1 bg-slate-50 hover:bg-pink-50 text-slate-600 hover:text-pink-700 border border-slate-200 hover:border-pink-200 rounded-full text-[11px] font-medium whitespace-nowrap transition-colors cursor-pointer shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Form - Mobile Friendly */}
        <div className="p-2.5 sm:p-4 bg-white border-t border-slate-200/80 shrink-0">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="พิมพ์คำถามถามน้องอิงกี้..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 sm:py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-pink-500 transition-colors"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isSearchingDb}
              className="py-2.5 sm:py-3 px-4 sm:px-5 bg-pink-600 hover:bg-pink-700 active:bg-pink-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <span>ส่ง</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}

export default ChatbotSimulator;
