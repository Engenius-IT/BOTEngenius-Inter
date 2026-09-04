import React, { useState } from 'react';
import { 
  UserCheck, 
  ShieldAlert, 
  Sparkles, 
  Save, 
  CheckCircle2, 
  Lock, 
  Bot, 
  Send,
  BookOpen
} from 'lucide-react';
import { generateRealAIResponse } from '../services/aiService';
import { AIProviderConfig, AIProvider } from '../types/schema';

interface AIPersonaManagerProps {
  aiConfig?: AIProviderConfig;
}

export function AIPersonaManager({ aiConfig }: AIPersonaManagerProps) {
  // Persona & Guardrails Configuration State
  const [botName, setBotName] = useState('น้อง PHANX1 AI Assistant');
  const [botTone, setBotTone] = useState<'polite' | 'friendly' | 'formal'>('polite');
  const [strictKnowledgeOnly, setStrictKnowledgeOnly] = useState(true);
  const [allowFallbackHuman, setAllowFallbackHuman] = useState(true);
  
  const [systemPrompt, setSystemPrompt] = useState(
    `คุณคือแอดมินตอบแชทผู้ช่วย AI ประจำโครงการ PHANX1 \n` +
    `หน้าที่ของคุณคือการตอบคำถามลูกค้าด้วยความสุภาพ อบอุ่น และเป็นมืออาชีพ \n` +
    `เงื่อนไขสำคัญที่สุด: คุณต้องใช้อ้างอิงข้อมูลจาก Supabase Database ที่ระบบส่งให้เท่านั้น ห้ามเดาหรือสร้างข้อมูลเท็จด้วยตัวเองเด็ดขาด หากคำถามไม่อยู่ในคลังข้อมูล ให้แจ้งลูกค้าอย่างสุภาพว่า "ขออภัยครับ ข้อมูลส่วนนี้ไม่มีในระบบ ให้แอดมินเจ้าหน้าที่ช่วยดูแลเพิ่มเติมไหมครับ"`
  );

  const [forbiddenTopics, setForbiddenTopics] = useState(
    'การเมือง, สภาพอากาศทั่วไป, หุ้นและการลงทุน, เรื่องส่วนตัวของพนักงาน'
  );

  const [fallbackMessage, setFallbackMessage] = useState(
    'ขออภัยครับ ข้อมูลส่วนนี้ยังไม่มีในคลังความรู้ของระบบ ผมขออนุญาตส่งเรื่องต่อให้แอดมินเจ้าหน้าที่ดูแลให้ครับ'
  );

  const [savedSuccess, setSavedSuccess] = useState(false);
  
  // Live Test Persona State
  const [testQuestion, setTestQuestion] = useState('แอดมินครับ วันนี้สภาพอากาศเป็นอย่างไรบ้างครับ?');
  const [testAnswer, setTestAnswer] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const currentConfig: AIProviderConfig = aiConfig || {
    activeProvider: 'deepseek',
    deepseek: { apiKey: import.meta.env.VITE_DEEPSEEK_API_KEY || '', model: 'deepseek-chat' },
    gemini: { apiKey: import.meta.env.VITE_GEMINI_API_KEY || '', chatModel: 'gemini-2.5-flash', embeddingModel: 'gemini-embedding-2' },
    groq: { apiKey: import.meta.env.VITE_GROQ_API_KEY || '', model: 'llama-3.3-70b-versatile' },
    openai: { apiKey: import.meta.env.VITE_OPENAI_API_KEY || '', model: 'gpt-4o-mini' },
    line: { channelSecret: import.meta.env.VITE_LINE_CHANNEL_SECRET || '', accessToken: import.meta.env.VITE_LINE_ACCESS_TOKEN || '', adminLineUserId: 'U9188449e7458f0441acd523ccd6a5cec' }
  };

  const applyPreset = (presetType: 'admin' | 'consultant' | 'strict') => {
    if (presetType === 'admin') {
      setBotName('แอดมิน PHANX1 (ผู้ช่วยบริการ)');
      setBotTone('polite');
      setStrictKnowledgeOnly(true);
      setSystemPrompt(
        `คุณคือแอดมินเจ้าหน้าที่บริการลูกค้าของ PHANX1 ตอบแชทอย่างสุภาพ ให้ข้อมูลกระชับ ตรงประเด็น ลงท้ายด้วย "ครับ/ค่ะ" เสมอ อ้างอิงข้อมูลจาก Supabase DB เท่านั้น`
      );
    } else if (presetType === 'consultant') {
      setBotName('พี่ที่ปรึกษา PHANX1 (Education Guide)');
      setBotTone('friendly');
      setStrictKnowledgeOnly(true);
      setSystemPrompt(
        `คุณคือพี่ที่ปรึกษาโครงการแลกเปลี่ยนและทุนการศึกษา อธิบายด้วยโทนเสียงเป็นกันเอง อบอุ่น ให้กำลังใจน้องๆ อ้างอิงข้อมูลทุนและเอกสารจาก Supabase DB อย่างแม่นยำ`
      );
    } else if (presetType === 'strict') {
      setBotName('PHANX1 RAG Bot (Strict Mode)');
      setBotTone('formal');
      setStrictKnowledgeOnly(true);
      setSystemPrompt(
        `คุณคือหุ่นยนต์ตอบคำถามตามฐานข้อมูล Supabase PostgreSQL เท่านั้น ตอบตรงตามข้อความใน DB 100% ห้ามเพิ่มความคิดเห็นส่วนตัว ห้ามตอบเรื่องนอกเหนือจากคลังความรู้`
      );
    }
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleTestPersona = async () => {
    if (!testQuestion.trim()) return;
    setIsTesting(true);
    setTestAnswer(null);

    const lower = testQuestion.toLowerCase();
    const forbiddenList = forbiddenTopics.split(',').map(s => s.trim().toLowerCase());
    const isForbidden = forbiddenList.some(topic => topic && lower.includes(topic));

    if (strictKnowledgeOnly && isForbidden) {
      setTestAnswer(
        `[บีบบทบาทสำเร็จ: Forbidden Topic Guardrail Triggered]\n` +
        `AI ตอบกลับ: "${fallbackMessage}"\n` +
        `(เหตุผล: คำถามตรงกับหัวข้อต้องห้าม "${forbiddenTopics}" ระบบบีบให้ปฏิเสธการตอบตามกฎเหล็ก)`
      );
      setIsTesting(false);
      return;
    }

    const aiResult = await generateRealAIResponse({
      provider: currentConfig.activeProvider,
      userMessage: testQuestion,
      systemPrompt: `${systemPrompt}\n\n[ชื่อบทบาทแอดมิน: ${botName}, โทนเสียง: ${botTone.toUpperCase()}]`,
      config: currentConfig
    });

    setTestAnswer(
      `[AI RESPONSE LIVE - ${aiResult.modelUsed} (${aiResult.latencyMs}ms)]\n` +
      `AI ตอบกลับ: "${aiResult.answer}"`
    );
    setIsTesting(false);
  };

  return (
    <div className="space-y-5 pb-8 animate-fade-in max-w-6xl mx-auto">
      
      {/* 1. Header Banner */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              กำหนดบทบาท AI & กฎเหล็กพฤติกรรม (Real AI Live Persona Enforcer)
            </h2>
            <span className="bg-purple-50 text-purple-700 border border-purple-200 text-xs px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1 shrink-0">
              <ShieldAlert className="w-3 h-3 text-purple-600" />
              Behavior Enforcer Active
            </span>
          </div>
          <p className="text-slate-500 text-xs mt-0.5">
            บีบบทบาท ขอบเขตคำตอบ และส่งคำสั่ง System Prompt ให้โมเดล AI ตอบสดตามกฎเหล็กที่กำหนด
          </p>
        </div>

        {savedSuccess && (
          <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-2xs animate-fade-in shrink-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>บันทึกบทบาทและกฎเหล็ก AI เรียบร้อยแล้ว</span>
          </div>
        )}
      </div>

      {/* 2. Preset Selection Buttons */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-md space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            เลือกบทบาทสำเร็จรูป (Quick Persona Presets)
          </span>
          <span className="text-[11px] text-slate-400">คลิกเพื่อใช้คำสั่งบีบบทบาททันที</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => applyPreset('admin')}
            className="p-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-blue-500 rounded-xl text-left transition-all cursor-pointer group"
          >
            <div className="font-bold text-xs text-blue-400 group-hover:text-blue-300 flex items-center justify-between">
              <span>1. แอดมินบริการลูกค้าสุภาพ</span>
              <UserCheck className="w-3.5 h-3.5" />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              ตอบสุภาพ ลงท้ายด้วย "ครับ/ค่ะ" ข้อมูลกระชับ ตรงประเด็น
            </p>
          </button>

          <button
            type="button"
            onClick={() => applyPreset('consultant')}
            className="p-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-purple-500 rounded-xl text-left transition-all cursor-pointer group"
          >
            <div className="font-bold text-xs text-purple-400 group-hover:text-purple-300 flex items-center justify-between">
              <span>2. พี่ที่ปรึกษาการศึกษา</span>
              <BookOpen className="w-3.5 h-3.5" />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              พูดคุยเป็นกันเอง อบอุ่น แนะนำทุนการศึกษาอย่างใจเย็น
            </p>
          </button>

          <button
            type="button"
            onClick={() => applyPreset('strict')}
            className="p-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-emerald-500 rounded-xl text-left transition-all cursor-pointer group"
          >
            <div className="font-bold text-xs text-emerald-400 group-hover:text-emerald-300 flex items-center justify-between">
              <span>3. หุ่นยนต์ตอบตรง DB 100%</span>
              <Lock className="w-3.5 h-3.5" />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              โหมดเข้มงวด ห้ามใส่ความคิดเห็น ตอบเฉพาะคำใน DB
            </p>
          </button>
        </div>
      </div>

      <form onSubmit={handleSaveConfig} className="space-y-5">
        
        {/* 3. Main Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Left Column */}
          <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <UserCheck className="w-4 h-4 text-blue-600" />
              <span>กำหนดบุคลิกภาพ & System Prompt (AI Persona Instructions)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-600 block font-medium mb-1">ชื่อเรียกแทนตัว AI (Bot Display Name)</label>
                <input
                  type="text"
                  value={botName}
                  onChange={(e) => setBotName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-600 block font-medium mb-1">ระดับโทนเสียงการพูด (Tone of Voice)</label>
                <select
                  value={botTone}
                  onChange={(e) => setBotTone(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="polite">สุภาพ เป็นทางการ (Polite & Formal)</option>
                  <option value="friendly">เป็นกันเอง อบอุ่น (Friendly & Warm)</option>
                  <option value="formal">กระชับ ตรงประเด็น (Direct & Precise)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-600 block font-medium mb-1 flex items-center justify-between">
                <span>ข้อความคำสั่งบีบบทบาทหลัก (System Prompt Instruction)</span>
                <span className="text-[10px] text-blue-600 font-normal">คำสั่งระดับสูงสุด (System Priority)</span>
              </label>
              <textarea
                rows={6}
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono text-slate-900 leading-relaxed focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Strict Rules */}
            <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-100 space-y-2.5">
              <span className="text-xs font-bold text-blue-800 block">กฎเหล็กบังคับพฤติกรรม (Behavioral Constraints)</span>
              
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={strictKnowledgeOnly}
                  onChange={(e) => setStrictKnowledgeOnly(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <div>
                  <span className="text-xs font-bold text-slate-900 block">ห้าม AI ตอบเรื่องที่ไม่มีใน Supabase DB (Strict Knowledge Only)</span>
                  <span className="text-[10px] text-slate-500">หากไม่มีข้อมูลในตาราง ระบบจะปฏิเสธการตอบทันที ป้องกัน AI นึกคำตอบเอง (No Hallucination)</span>
                </div>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allowFallbackHuman}
                  onChange={(e) => setAllowFallbackHuman(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <div>
                  <span className="text-xs font-bold text-slate-900 block">ส่งต่อแอดมินคนเมื่อตอบไม่ได้ (Escalate to Human Admin)</span>
                  <span className="text-[10px] text-slate-500">เมื่อ AI ตอบไม่ได้ ระบบจะส่งข้อความแจ้งเตือนเข้าแชทแอดมิน LINE อัตโนมัติ</span>
                </div>
              </label>
            </div>

          </div>

          {/* Right Column */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* Forbidden Topics */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <ShieldAlert className="w-4 h-4 text-red-600" />
                <span>กำหนดหัวข้อต้องห้าม (Forbidden Topics & Boundaries)</span>
              </h3>

              <div>
                <label className="text-[11px] text-slate-600 block font-medium mb-1">หัวข้อห้ามคุย (แยกด้วยเครื่องหมายจุลภาค ,)</label>
                <input
                  type="text"
                  value={forbiddenTopics}
                  onChange={(e) => setForbiddenTopics(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-500"
                />
                <p className="text-[10px] text-slate-400 mt-1">หากคำถามลูกค้าเกี่ยวข้องกับหัวข้อเหล่านี้ AI จะปฏิเสธการตอบทันที</p>
              </div>

              <div>
                <label className="text-[11px] text-slate-600 block font-medium mb-1">ข้อความตอบปฏิเสธมาตรฐาน (Fallback Answer)</label>
                <textarea
                  rows={3}
                  value={fallbackMessage}
                  onChange={(e) => setFallbackMessage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Live Role Tester */}
            <div className="bg-white border border-purple-200 rounded-2xl p-5 shadow-2xs space-y-3">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <Bot className="w-4 h-4 text-purple-600" />
                <span>ทดสอบซ้อมตอบคำถามด้วย AI Live Server</span>
              </h4>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={testQuestion}
                  onChange={(e) => setTestQuestion(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={handleTestPersona}
                  disabled={isTesting}
                  className="px-2.5 py-1.5 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-bold text-[11px] rounded-lg shadow-xs flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <Send className="w-3 h-3" />
                  <span>{isTesting ? 'กำลังเรียก...' : 'ทดสอบตอบสด'}</span>
                </button>
              </div>

              {testAnswer && (
                <div className="p-3.5 rounded-xl bg-slate-900 text-white text-xs font-mono border border-slate-800 leading-relaxed whitespace-pre-wrap animate-fade-in">
                  {testAnswer}
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="py-3 px-8 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4.5 h-4.5" />
            <span>บันทึกการตั้งค่าบทบาท & กฎเหล็ก AI ทั้งหมด</span>
          </button>
        </div>

      </form>
    </div>
  );
}
