import React, { useState } from 'react';
import { 
  Bot, 
  LogIn, 
  Database, 
  Cpu, 
  MessageSquareText, 
  Radio, 
  Users, 
  ShieldCheck, 
  Zap, 
  Search, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  Server, 
  Activity, 
  Clock, 
  Layers, 
  FileText,
  Send,
  HelpCircle,
  BarChart3,
  ChevronRight
} from 'lucide-react';

interface LandingPageProps {
  onOpenLogin: () => void;
}

export function LandingPage({ onOpenLogin }: LandingPageProps) {
  const [activeTabDemo, setActiveTabDemo] = useState<'sample1' | 'sample2' | 'sample3'>('sample1');

  const demoSamples = {
    sample1: {
      question: "สอบถามเรื่องทุนการศึกษาโครงการแลกเปลี่ยนหน่อยครับ",
      answer: "สวัสดีครับ ทางโครงการมีทุนสนับสนุนการศึกษาให้เลือกทั้งแบบทุนเต็มจำนวน และทุนส่วนลดพิเศษสำหรับผู้ผ่านการคัดเลือกครับ โดยทุนจะพิจารณาจากเกรดเฉลี่ยสะสมและผลการสอบสัมภาษณ์ คุณสมบัติเบื้องต้นคือมีอายุระหว่าง 15-18 ปีครับ",
      confidence: "98.5%",
      source: "Supabase Knowledge Base (Row ID: 276)",
      model: "DeepSeek Chat RAG Engine",
      latency: "0.42s"
    },
    sample2: {
      question: "ต้องเตรียมเอกสารอะไรบ้างในการสมัคร?",
      answer: "เอกสารที่ต้องใช้ประกอบด้วย: 1. สำเนาบัตรประชาชน 2. ใบแสดงผลการเรียน (Transcript) 3. รูปถ่ายขนาด 1.5 นิ้ว จำนวน 2 รูป และ 4. ใบสมัครโครงการที่กรอกข้อมูลครบถ้วนครับ",
      confidence: "99.1%",
      source: "Supabase Knowledge Base (Row ID: 142)",
      model: "Gemini 2.5 Flash RAG Engine",
      latency: "0.38s"
    },
    sample3: {
      question: "ติดต่อสอบถามเพิ่มเติมกับเจ้าหน้าที่ได้ช่องทางไหน?",
      answer: "สามารถติดต่อเจ้าหน้าที่ผ่านช่องทาง LINE Official Account ได้ตลอด 24 ชั่วโมง หรือโทรติดต่อศูนย์บริการในวันและเวลาทำการ จันทร์-ศุกร์ 08:30 - 17:00 น. ครับ",
      confidence: "97.8%",
      source: "Supabase Knowledge Base (Row ID: 89)",
      model: "Groq Llama 3.3 Versatile",
      latency: "0.29s"
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      
      {/* 1. Header Bar */}
      <header className="h-20 border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-40 px-4 md:px-8 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-slate-900 tracking-tight">PHANX1</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
                AI Platform
              </span>
            </div>
            <p className="text-xs text-slate-500">ระบบแชทบอทตอบคำถามอัจฉริยะองค์กร</p>
          </div>
        </div>

        {/* Navigation links & Login Button Only */}
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-blue-600 transition-colors">ฟีเจอร์การทำงาน</a>
            <a href="#rag-system" className="hover:text-blue-600 transition-colors">คลังความรู้อัจฉริยะ</a>
            <a href="#models" className="hover:text-blue-600 transition-colors">รองรับ Multi-AI</a>
            <a href="#demo" className="hover:text-blue-600 transition-colors">ตัวอย่างการตอบ</a>
          </nav>

          {/* SINGLE LOGIN BUTTON (ไม่มีปุ่มสมัครสมาชิก) */}
          <button
            onClick={onOpenLogin}
            className="py-2.5 px-5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-sm rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>เข้าสู่ระบบ</span>
          </button>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative py-16 md:py-24 px-4 md:px-8 max-w-7xl mx-auto w-full text-center overflow-hidden">
        {/* Decorative Light Background Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-blue-200/40 via-indigo-100/40 to-sky-200/40 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-blue-200 shadow-xs mb-6 text-xs font-semibold text-blue-700 animate-fade-in">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span>เชื่อมต่อ Supabase Database & LINE Messaging API สมบูรณ์แบบ</span>
        </div>

        <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto mb-6">
          ยกระดับระบบบริการลูกค้าด้วย <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 bg-clip-text text-transparent">
            AI Chatbot อัจฉริยะ ตอบไว 24 ชั่วโมง
          </span>
        </h1>

        <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
          ค้นหาและตอบคำถามอัตโนมัติจากคลังความรู้ Supabase กว่า 2,000+ รายการได้อย่างแม่นยำ พร้อมระบบเลือกสลับโมเดล AI (DeepSeek, Gemini, Groq, OpenAI) ได้ทันที
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onOpenLogin}
            className="py-3 px-7 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>เข้าสู่ระบบจัดการบอท</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <a
            href="#demo"
            className="py-3 px-6 bg-white hover:bg-slate-100 text-slate-700 font-medium text-base rounded-xl border border-slate-200 shadow-xs transition-all flex items-center gap-2"
          >
            <Activity className="w-4 h-4 text-slate-500" />
            <span>ดูตัวอย่างการทำงาน</span>
          </a>
        </div>

        {/* Feature Badges Bar */}
        <div className="mt-12 pt-8 border-t border-slate-200/80 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">2,760+ ข้อมูล</div>
              <div className="text-xs text-slate-500">ซิงค์จาก Supabase DB</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">&lt; 0.5 วินาที</div>
              <div className="text-xs text-slate-500">ความเร็วตอบสนองเฉลี่ย</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">4 โมเดลหลัก</div>
              <div className="text-xs text-slate-500">DeepSeek, Gemini, Groq, OpenAI</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
            <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">99.9% Uptime</div>
              <div className="text-xs text-slate-500">เสถียรและปลอดภัย</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Live Demo Interactive Showcase */}
      <section id="demo" className="py-16 bg-white border-y border-slate-200/80 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold mb-3">
              <Activity className="w-3.5 h-3.5" />
              <span>Live Demonstration</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
              ตัวอย่างการประมวลผลและการตอบคำถามของบอท
            </h2>
            <p className="text-slate-500 text-sm mt-2">
              ทดสอบลองดูว่าบอทค้นหาข้อมูลจาก Supabase และส่งคำตอบหาลูกค้าอย่างไร
            </p>
          </div>

          {/* Interactive Card */}
          <div className="white-card rounded-2xl border border-slate-200 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
            
            {/* Left Controls */}
            <div className="lg:col-span-4 bg-slate-50/80 p-6 border-r border-slate-200/80 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                เลือกคำถามทดสอบ
              </h3>
              
              <button
                onClick={() => setActiveTabDemo('sample1')}
                className={`w-full text-left p-3.5 rounded-xl border text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${
                  activeTabDemo === 'sample1'
                    ? 'bg-white border-blue-500 text-blue-700 shadow-xs'
                    : 'bg-white/50 border-slate-200 text-slate-700 hover:bg-white'
                }`}
              >
                <span>สอบถามทุนการศึกษา</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => setActiveTabDemo('sample2')}
                className={`w-full text-left p-3.5 rounded-xl border text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${
                  activeTabDemo === 'sample2'
                    ? 'bg-white border-blue-500 text-blue-700 shadow-xs'
                    : 'bg-white/50 border-slate-200 text-slate-700 hover:bg-white'
                }`}
              >
                <span>เอกสารการสมัคร</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => setActiveTabDemo('sample3')}
                className={`w-full text-left p-3.5 rounded-xl border text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${
                  activeTabDemo === 'sample3'
                    ? 'bg-white border-blue-500 text-blue-700 shadow-xs'
                    : 'bg-white/50 border-slate-200 text-slate-700 hover:bg-white'
                }`}
              >
                <span>ช่องทางติดต่อเจ้าหน้าที่</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <div className="pt-4 mt-4 border-t border-slate-200/80 space-y-2 text-xs text-slate-500">
                <div className="flex items-center justify-between">
                  <span>สถานะระบบ:</span>
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    พร้อมใช้งาน
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>ฐานข้อมูล:</span>
                  <span className="text-slate-800 font-medium">Supabase PostgreSQL</span>
                </div>
              </div>
            </div>

            {/* Right Chat Mockup */}
            <div className="lg:col-span-8 p-6 bg-white flex flex-col justify-between">
              <div className="space-y-4">
                {/* User Message */}
                <div className="flex items-start gap-3 justify-end">
                  <div className="bg-blue-600 text-white rounded-2xl rounded-tr-xs py-3 px-4 text-sm max-w-lg shadow-2xs">
                    {demoSamples[activeTabDemo].question}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold shrink-0">
                    User
                  </div>
                </div>

                {/* Bot Answer */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="space-y-2 max-w-xl">
                    <div className="bg-slate-100 text-slate-800 rounded-2xl rounded-tl-xs py-3 px-4 text-sm border border-slate-200/70 leading-relaxed shadow-2xs">
                      {demoSamples[activeTabDemo].answer}
                    </div>

                    {/* Metadata Pill */}
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 pl-1">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                        <CheckCircle2 className="w-3 h-3" />
                        Match: {demoSamples[activeTabDemo].confidence}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                        <Database className="w-3 h-3 text-slate-400" />
                        {demoSamples[activeTabDemo].source}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100 font-medium">
                        <Cpu className="w-3 h-3" />
                        {demoSamples[activeTabDemo].model}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bot status bar */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  ความเร็วในการประมวลผล: <strong className="text-slate-700">{demoSamples[activeTabDemo].latency}</strong>
                </span>
                <span className="text-blue-600 font-medium">LINE Messaging API Webhook Ready</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Core Features Section (โชว์บอททำงานอะไรได้บ้าง) */}
      <section id="features" className="py-20 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>คุณสมบัติและความสามารถหลัก</span>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            โชว์บอททำงานอะไรได้บ้างในระบบนี้
          </h2>
          <p className="text-slate-500 text-base mt-2">
            ครอบคลุมทุกการทำงานตั้งแต่คลังความรู้ การตอบแชท ไปจนถึงการวิเคราะห์ข้อมูล
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Feature 1 */}
          <div className="white-card white-card-hover p-6 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              1. ค้นหาคำตอบจาก Supabase (RAG)
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              ดึงคำตอบจากตาราง <code className="bg-slate-100 text-blue-600 px-1.5 py-0.5 rounded font-mono text-xs">knowledge_base</code> กว่า 2,140+ รายการเพื่อนำมาประมวลผลคำตอบที่แม่นยำที่สุด
            </p>
          </div>

          {/* Feature 2 */}
          <div className="white-card white-card-hover p-6 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              2. สลับโมเดล AI ได้อิสระ (Multi-AI)
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              รองรับทั้ง DeepSeek, Gemini 2.5 Flash, Groq Llama 3.3 และ OpenAI GPT-4o สามารถสลับใช้งานได้ทันทีจากแดชบอร์ด
            </p>
          </div>

          {/* Feature 3 */}
          <div className="white-card white-card-hover p-6 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5">
              <MessageSquareText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              3. เชื่อมต่อ LINE Official Account
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              ตรวจสอบ Signature Validation และตอบกลับลูกค้าผ่าน LINE Webhook อัตโนมัติ 24 ชั่วโมง โดยไม่ต้องใช้คนเฝ้า
            </p>
          </div>

          {/* Feature 4 */}
          <div className="white-card white-card-hover p-6 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-5">
              <Radio className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              4. บรอดแคสต์ข่าวสาร (Broadcast)
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              ส่งข้อความแจ้งเตือน ข่าวสาร หรือโปรโมชันหาผู้ใช้งานบน LINE เป็นกลุ่มหรือทั้งหมด พร้อมบันทึกประวัติ <code className="bg-slate-100 text-amber-600 px-1.5 py-0.5 rounded font-mono text-xs">broadcast_logs</code>
            </p>
          </div>

          {/* Feature 5 */}
          <div className="white-card white-card-hover p-6 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-5">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              5. เทรนนิ่งคลังความรู้ (AI Training)
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              เพิ่ม แก้ไข หรือนำเข้าข้อมูล QA และบทความความรู้เข้าสู่ฐานข้อมูลได้โดยตรง เพื่อเทรนบอทให้ตอบคำถามใหม่ๆ ได้เสมอ
            </p>
          </div>

          {/* Feature 6 */}
          <div className="white-card white-card-hover p-6 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-5">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              6. ดูประวัติและวิเคราะห์ผลแชท
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              เก็บบันทึกบทสนทนา <code className="bg-slate-100 text-rose-600 px-1.5 py-0.5 rounded font-mono text-xs">chat_messages</code> แยกตามผู้ใช้ พร้อมตรวจดูประสิทธิภาพย้อนหลังได้ทุกเมื่อ
            </p>
          </div>

        </div>
      </section>

      {/* 5. Supported AI Models Showcase Section */}
      <section id="models" className="py-16 bg-slate-100/70 border-y border-slate-200/80 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold mb-3">
              <Cpu className="w-3.5 h-3.5" />
              <span>Multi-AI Engines</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
              ขุมพลัง AI ที่รองรับในระบบ
            </h2>
            <p className="text-slate-500 text-sm mt-2">
              เลือกเปลี่ยนโมเดล AI ในการตอบคำถามได้ตามความประหยัดและความเร็วที่ต้องการ
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs text-center">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3 font-bold text-sm">
                DS
              </div>
              <h3 className="font-bold text-slate-900 text-base">DeepSeek</h3>
              <p className="text-xs text-blue-600 font-medium mt-0.5">deepseek-chat</p>
              <p className="text-xs text-slate-500 mt-2">
                ประมวลผลภาษาไทยได้แม่นยำสูง ต้นทุนต่ำ เหมาะกับงานตอบแชททั่วไป
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs text-center">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3 font-bold text-sm">
                GM
              </div>
              <h3 className="font-bold text-slate-900 text-base">Google Gemini</h3>
              <p className="text-xs text-indigo-600 font-medium mt-0.5">gemini-2.5-flash</p>
              <p className="text-xs text-slate-500 mt-2">
                ความเร็วตอบสนองไวมาก พร้อมระบบทำ Vector Embeddings
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs text-center">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3 font-bold text-sm">
                GQ
              </div>
              <h3 className="font-bold text-slate-900 text-base">Groq Llama</h3>
              <p className="text-xs text-emerald-600 font-medium mt-0.5">llama-3.3-70b</p>
              <p className="text-xs text-slate-500 mt-2">
                ตอบเร็วที่สุด ด้วยชิปประมวลผล LPU ความเร็วสูงพิเศษ
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs text-center">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-3 font-bold text-sm">
                OA
              </div>
              <h3 className="font-bold text-slate-900 text-base">OpenAI</h3>
              <p className="text-xs text-purple-600 font-medium mt-0.5">gpt-4o-mini</p>
              <p className="text-xs text-slate-500 mt-2">
                ความเสถียรมาตรฐานสากล รองรับคำตอบที่ซับซ้อนได้ดีเยี่ยม
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 6. Call to Action Banner */}
      <section className="py-16 px-4 md:px-8 max-w-5xl mx-auto w-full">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 md:p-12 text-white shadow-xl text-center relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight">
              พร้อมเริ่มต้นใช้งานระบบจัดการบอทแล้วหรือยัง?
            </h2>
            <p className="text-blue-100 text-sm md:text-base max-w-xl mx-auto">
              เข้าสู่ระบบเพื่อจัดการคลังความรู้ ตั้งค่าโมเดล AI ดูประวัติการตอบ และส่งบรอดแคสต์ได้ทันที
            </p>
            <div className="pt-2">
              <button
                onClick={onOpenLogin}
                className="py-3 px-8 bg-white hover:bg-slate-100 text-blue-700 font-bold text-base rounded-xl shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <LogIn className="w-5 h-5" />
                <span>เข้าสู่ระบบผู้ดูแลระบบ</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="mt-auto py-8 bg-white border-t border-slate-200 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-blue-600" />
            <span className="font-semibold text-slate-700">PHANX1 AI Platform</span>
            <span>- System Ready for Production</span>
          </div>
          <div>
            &copy; 2026 PHANX1 AI Platform. All rights reserved. (Supabase PostgreSQL Integrated)
          </div>
        </div>
      </footer>

    </div>
  );
}
