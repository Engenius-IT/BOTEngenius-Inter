import React, { useState } from 'react';
import { 
  Database, 
  PlusCircle, 
  Upload, 
  CheckCircle2, 
  RefreshCw, 
  Trash2, 
  Edit3, 
  Search, 
  Sparkles, 
  FileText, 
  Save,
  Tag,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Sliders,
  Code2,
  Heart,
  ChevronUp,
  ChevronDown,
  Check,
  Plus,
  BookOpen,
  Settings
} from 'lucide-react';
import { KnowledgeBaseItem } from '../types/schema';
import { initialKnowledgeBase, generateMockVector } from '../data/mockData';
import { DEFAULT_PHANX1_MASTER_PROMPT } from '../services/aiService';

interface AITrainingCenterProps {
  knowledgeBase: KnowledgeBaseItem[];
  setKnowledgeBase?: React.Dispatch<React.SetStateAction<KnowledgeBaseItem[]>>;
}

export function AITrainingCenter({ knowledgeBase: propKnowledge, setKnowledgeBase }: AITrainingCenterProps) {
  // Mobile Tab State ('training' | 'table' | 'persona')
  const [mobileTab, setMobileTab] = useState<'training' | 'table' | 'persona'>('training');

  // Knowledge Base State
  const [items, setItems] = useState<KnowledgeBaseItem[]>(propKnowledge && propKnowledge.length > 0 ? propKnowledge : initialKnowledgeBase);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Persona & System Prompt State
  const [showPersonaPanel, setShowPersonaPanel] = useState<boolean>(false);
  const [activePrompt, setActivePrompt] = useState<string>(DEFAULT_PHANX1_MASTER_PROMPT);
  const [strictRagMode, setStrictRagMode] = useState<boolean>(true);
  const [personaSavedMsg, setPersonaSavedMsg] = useState<string | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Q&A Form State
  const [category, setCategory] = useState('โครงการแลกเปลี่ยน');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [keywords, setKeywords] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  // File Upload State
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [extractedContent, setExtractedContent] = useState<string | null>(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);

  // Notifications
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [isReindexing, setIsReindexing] = useState(false);

  const categories = [
    'โครงการแลกเปลี่ยน', 'คุณสมบัติผู้สมัคร', 'การเตรียมตัว', 
    'คอร์สเรียน', 'การชำระเงิน', 'ทั่วไป', 'วีซ่าและเอกสาร', 
    'หอพักโฮสต์แฟมิลี่', 'ทุนการศึกษาและส่วนลด', 'การเตรียมตัวเดินทาง', 
    'คอร์สเรียนออนไลน์', 'ประกันสุขภาพการเดินทาง', 'ระเบียบการโรงเรียน', 'ประสบการณ์รุ่นพี่'
  ];

  // Presets for quick switching
  const applyPresetPersona = (type: 'ingky' | 'male_admin' | 'concise') => {
    if (type === 'ingky') {
      setActivePrompt(DEFAULT_PHANX1_MASTER_PROMPT);
      setPersonaSavedMsg('สลับเป็นบทบาท: น้องอิงกี้ จาก Engenius (ผู้หญิง สุภาพ อบอุ่น ค่ะ/นะคะ)');
    } else if (type === 'male_admin') {
      setActivePrompt(`คุณคือแอดมินพี่ PHANX1 เป็นผู้ชาย ตอบด้วยความสุภาพ อบอุ่น ทางการ อ้างอิงเฉพาะ Supabase DB เท่านั้น ลงท้ายด้วย ครับ เป็นหลัก`);
      setPersonaSavedMsg('สลับเป็นบทบาท: แอดมินพี่ PHANX1 (ผู้ชาย ทางการ ครับ)');
    } else {
      setActivePrompt(`คุณคือผู้ช่วย AI ตอบคำถามอย่างสั้น กระชับ อ้างอิงเฉพาะข้อมูลใน Supabase DB เท่านั้น หากไม่มีข้อมูลให้ตอบว่า "ขออภัยครับ ข้อมูลส่วนนี้ไม่มีในระบบ ให้แอดมินเจ้าหน้าที่ช่วยดูแลเพิ่มเติมไหมครับ"`);
      setPersonaSavedMsg('สลับเป็นบทบาท: ตอบสั้นกระชับ (Concise Official)');
    }
    setTimeout(() => setPersonaSavedMsg(null), 3000);
  };

  // Handle Add or Update Q&A Record
  const handleSaveQA = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;

    if (editingId !== null) {
      // Update existing item
      const updated = items.map(item => {
        if (item.id === editingId) {
          return {
            ...item,
            category,
            question,
            answer,
            keywords,
            vector_array: generateMockVector(`${question} ${answer} ${keywords}`)
          };
        }
        return item;
      });
      setItems(updated);
      if (setKnowledgeBase) setKnowledgeBase(updated);
      setSavedMessage(`อัปเดตข้อมูลความรู้ #${editingId} เรียบร้อยแล้ว`);
      setEditingId(null);
    } else {
      // Create new item
      const newId = items.length > 0 ? Math.max(...items.map(i => Number(i.id) || 0)) + 1 : 1;
      const newItem: KnowledgeBaseItem = {
        id: newId,
        category,
        question,
        answer,
        keywords,
        vector_array: generateMockVector(`${question} ${answer} ${keywords}`),
        sourceTable: 'knowledge_base'
      };
      const updated = [newItem, ...items];
      setItems(updated);
      if (setKnowledgeBase) setKnowledgeBase(updated);
      setSavedMessage(`เทรนข้อมูลความรู้ใหม่ #${newId} เข้าสู่ Supabase DB เรียบร้อยแล้ว`);
    }

    // Reset Form
    setQuestion('');
    setAnswer('');
    setKeywords('');
    setTimeout(() => setSavedMessage(null), 3000);
  };

  // Handle Edit Item
  const handleEdit = (item: KnowledgeBaseItem) => {
    setEditingId(Number(item.id));
    setCategory(item.category);
    setQuestion(item.question);
    setAnswer(item.answer);
    setKeywords(item.keywords);
    setMobileTab('training');
    window.scrollTo({ top: 150, behavior: 'smooth' });
  };

  // Handle Delete Item
  const handleDelete = (id: number | string) => {
    if (confirm('คุณต้องการลบชุดความรู้นี้ออกจากคลัง Supabase DB ใช่หรือไม่?')) {
      const updated = items.filter(item => item.id !== id);
      setItems(updated);
      if (setKnowledgeBase) setKnowledgeBase(updated);
      setSavedMessage('ลบชุดความรู้เรียบร้อยแล้ว');
      setTimeout(() => setSavedMessage(null), 3000);
    }
  };

  // Handle File Upload Simulation
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setIsProcessingFile(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setTimeout(() => {
        setExtractedContent(text || 'รายละเอียดความรู้ที่สกัดได้จากไฟล์เอกสาร');
        setIsProcessingFile(false);
      }, 600);
    };
    reader.readAsText(file);
  };

  // Save Extracted File Content to DB
  const handleSaveFileToDB = () => {
    if (!extractedContent || !uploadedFileName) return;

    const newId = items.length > 0 ? Math.max(...items.map(i => Number(i.id) || 0)) + 1 : 1;
    const newItem: KnowledgeBaseItem = {
      id: newId,
      category: 'เอกสารอัปโหลด',
      question: `ความรู้สกัดจากไฟล์: ${uploadedFileName}`,
      answer: extractedContent.substring(0, 400),
      keywords: uploadedFileName.replace('.', ', '),
      vector_array: generateMockVector(extractedContent),
      sourceTable: 'knowledge_base'
    };

    const updated = [newItem, ...items];
    setItems(updated);
    if (setKnowledgeBase) setKnowledgeBase(updated);
    setSavedMessage(`นำเข้าเนื้อหาจากไฟล์ "${uploadedFileName}" แปลง Vector เก็บลง Supabase DB สำเร็จ!`);
    
    setUploadedFileName(null);
    setExtractedContent(null);
    setTimeout(() => setSavedMessage(null), 3000);
  };

  // Re-index All Vectors
  const handleReindexAll = () => {
    setIsReindexing(true);
    setTimeout(() => {
      setIsReindexing(false);
      setSavedMessage('ทำการ Re-index Vector (pgvector) และคำนวณ HNSW Index เรียบร้อยแล้ว');
      setTimeout(() => setSavedMessage(null), 3500);
    }, 1200);
  };

  // Filter Items
  const filteredItems = items.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.keywords.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calculate Pagination Slices
  const totalPages = Math.ceil(filteredItems.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, filteredItems.length);
  const currentPaginatedItems = filteredItems.slice(startIndex, endIndex);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="space-y-3 sm:space-y-5 pb-8 animate-fade-in max-w-6xl mx-auto">
      
      {/* 1. Header Banner - Mobile Responsive */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base sm:text-xl font-bold text-slate-900 tracking-tight">
              ศูนย์เทรนความรู้ AI (RAG Training)
            </h2>
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 shrink-0">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              Supabase RAG
            </span>
          </div>
          <p className="text-slate-500 text-[11px] sm:text-xs mt-0.5">
            เพิ่ม Q&A หรืออัปโหลดไฟล์เพื่อสร้าง Vector DB ให้ AI ตอบสดทันที
          </p>
        </div>

        <button
          onClick={handleReindexAll}
          disabled={isReindexing}
          className="w-full sm:w-auto px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isReindexing ? 'animate-spin' : ''}`} />
          <span>{isReindexing ? 'กำลัง Re-index...' : 'Re-index Vector ทั้งหมด'}</span>
        </button>
      </div>

      {/* Mobile Navigation Tabs */}
      <div className="lg:hidden flex items-center bg-slate-200/60 p-1 rounded-xl gap-1">
        <button
          onClick={() => setMobileTab('training')}
          className={`flex-1 py-2 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            mobileTab === 'training' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>เทรนความรู้ใหม่</span>
        </button>

        <button
          onClick={() => setMobileTab('table')}
          className={`flex-1 py-2 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            mobileTab === 'table' ? 'bg-white text-purple-600 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>คลังความรู้ ({items.length})</span>
        </button>

        <button
          onClick={() => setMobileTab('persona')}
          className={`flex-1 py-2 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            mobileTab === 'persona' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>บทบาท AI</span>
        </button>
      </div>

      {savedMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-2xs animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{savedMessage}</span>
        </div>
      )}

      {/* 🌟 Real AI Live Persona Enforcer Panel */}
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
                ตั้งค่าคำสั่ง System Prompt บีบบทบาทแอดมิน และควบคุมกฎความปลอดภัย RAG
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
                เลือกชุดบทบาทสำเร็จรูป (Presets):
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
                  <span>กระชับเป็นทางการ</span>
                </button>
              </div>
            </div>

            {/* Editable System Prompt Textarea */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Code2 className="w-4 h-4 text-purple-600" />
                  <span>ข้อความคำสั่ง System Prompt Directives:</span>
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
                  <div className="text-xs font-bold text-slate-900">บังคับใช้อ้างอิง Supabase DB 100% (Strict RAG)</div>
                  <div className="text-[10px] sm:text-[11px] text-slate-500">
                    หากไม่พบข้อมูลใน DB ให้ปฏิเสธด้วยประโยคสำเร็จรูปทันที ห้ามเดาคำตอบ
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => {
                    setStrictRagMode(!strictRagMode);
                    setPersonaSavedMsg(`อัปเดตสถานะ Strict RAG Mode: ${!strictRagMode ? 'เปิดใช้งานบังคับ DB 100%' : 'ปิดใช้งาน'}`);
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
                    setPersonaSavedMsg('บันทึกคำสั่งบีบบทบาท AI (System Prompt) ล่าสุดเรียบร้อยแล้ว!');
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

      {/* 2. Top Metric Cards - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-0.5">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400">ชุดความรู้ใน Supabase DB</span>
          <div className="text-xl sm:text-2xl font-extrabold text-blue-600">{items.length.toLocaleString()} ข้อความรู้</div>
          <p className="text-[10px] text-slate-500">พร้อมใช้งานในการตอบแชทบอท</p>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-0.5">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400">Vector Dimensions</span>
          <div className="text-xl sm:text-2xl font-extrabold text-purple-600">1,536 Dimensions</div>
          <p className="text-[10px] text-slate-500">มิติเวกเตอร์ pgvector ความละเอียดสูง</p>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-0.5">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400">สถานะความพร้อม RAG</span>
          <div className="text-xl sm:text-2xl font-extrabold text-emerald-600 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>100% Synced</span>
          </div>
          <p className="text-[10px] text-slate-500">พร้อมดึงข้อมูลตอบอัตโนมัติ</p>
        </div>
      </div>

      {/* 3. Main Form Section: Add Q&A & Upload File (Visible on Desktop or Training Tab) */}
      <div className={`grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 ${
        mobileTab !== 'training' ? 'hidden lg:grid' : 'grid'
      }`}>
        
        {/* Left: Add Q&A Form */}
        <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{editingId !== null ? `แก้ไขชุดความรู้ #${editingId}` : 'เทรนเพิ่มความรู้ใหม่ (Add Q&A Knowledge)'}</span>
            </h3>
            {editingId !== null && (
              <button
                onClick={() => { setEditingId(null); setQuestion(''); setAnswer(''); setKeywords(''); }}
                className="text-[11px] font-semibold text-slate-500 hover:text-slate-800"
              >
                ยกเลิก
              </button>
            )}
          </div>

          <form onSubmit={handleSaveQA} className="space-y-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">หมวดหมู่ความรู้ (Category)</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                {categories.map((cat, idx) => (
                  <option key={idx} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">หัวข้อ/คำถามหลักที่ลูกค้าถาม (Question)</label>
              <input
                type="text"
                placeholder="เช่น โครงการแลกเปลี่ยนระยะยาวไปช่วงไหนของปี?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">คำตอบดิบสำหรับอ้างอิงตอบสด (Answer Context)</label>
              <textarea
                rows={4}
                placeholder="กรอกรายละเอียดข้อมูลจริงที่ต้องการให้ AI จดจำและดึงไปตอบ..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 leading-relaxed"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">คีย์เวิร์ดกำกับ (Keywords แยกด้วยจุลภาค ,)</label>
              <input
                type="text"
                placeholder="เช่น แลกเปลี่ยนระยะยาว, 10 เดือน, 1 ปีการศึกษา"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{editingId !== null ? 'บันทึกการแก้ไขชุดความรู้' : 'บันทึกเข้า Supabase DB & สร้าง Vector ทันที'}</span>
            </button>
          </form>
        </div>

        {/* Right: Upload Knowledge File */}
        <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3.5 flex flex-col justify-between">
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Upload className="w-4 h-4 text-purple-600 shrink-0" />
              <span>อัปโหลดไฟล์เอกสาร (File Upload)</span>
            </h3>

            <div className="mt-3 border-2 border-dashed border-slate-200 hover:border-purple-400 bg-slate-50/70 rounded-2xl p-4 sm:p-6 text-center transition-colors">
              <FileText className="w-7 h-7 sm:w-8 sm:h-8 text-purple-500 mx-auto mb-1.5" />
              <div className="text-xs font-bold text-slate-800">ลากไฟล์เอกสารมาวางที่นี่</div>
              <p className="text-[10px] text-slate-400 mt-0.5 mb-2.5">รองรับไฟล์ .TXT, .CSV, .PDF หรือ .JSON</p>

              <label className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer inline-flex items-center gap-1.5 transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>เลือกไฟล์จากเครื่อง</span>
                <input
                  type="file"
                  accept=".txt,.csv,.json,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {isProcessingFile && (
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-xs text-purple-800 font-semibold flex items-center gap-2 animate-fade-in mt-3">
                <RefreshCw className="w-4 h-4 animate-spin text-purple-600 shrink-0" />
                <span>กำลังสกัดข้อความจากไฟล์ "{uploadedFileName}"...</span>
              </div>
            )}

            {extractedContent && (
              <div className="mt-3 p-3 bg-slate-900 text-white rounded-xl text-xs font-mono space-y-2 border border-slate-800 animate-fade-in">
                <div className="text-purple-300 font-bold flex items-center justify-between text-[10px] sm:text-[11px]">
                  <span>📄 พรีวิวเนื้อหาไฟล์:</span>
                  <span className="text-[10px] text-slate-400 truncate max-w-[120px]">{uploadedFileName}</span>
                </div>
                <div className="p-2 bg-slate-950 rounded text-emerald-300 text-[10px] sm:text-[11px] leading-relaxed max-h-32 overflow-y-auto">
                  {extractedContent}
                </div>
                <button
                  type="button"
                  onClick={handleSaveFileToDB}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer mt-2"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>สร้าง Vector ลง Supabase DB</span>
                </button>
              </div>
            )}
          </div>

          <div className="p-2.5 sm:p-3 bg-slate-50 rounded-xl border border-slate-200 text-[10px] text-slate-500 space-y-1 mt-3">
            <span className="font-bold text-slate-700 block">💡 เคล็ดลับการเทรนความรู้:</span>
            <p>• การเขียนคำตอบเป็นประโยคที่ชัดเจนจะช่วยให้ AI สรุปคำตอบได้เป็นธรรมชาติ</p>
            <p>• กรอกคีย์เวิร์ดกำกับ เช่น ชื่อประเทศ, ปี ค.ศ., เงื่อนไข เพื่อเพิ่มคะแนน Vector Matching</p>
          </div>
        </div>

      </div>

      {/* 4. Knowledge Base Items Table with Pagination (Visible on Desktop or Table Tab) */}
      <div className={`bg-white border border-slate-200/80 rounded-2xl shadow-2xs p-3.5 sm:p-5 space-y-3.5 ${
        mobileTab !== 'table' ? 'hidden lg:block' : 'block'
      }`}>
        
        {/* Table Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 shrink-0" />
            <h3 className="text-xs sm:text-sm font-bold text-slate-900">
              ตารางรายการความรู้ Supabase DB ({filteredItems.length.toLocaleString()} รายการ)
            </h3>
          </div>

          <div className="flex flex-col xs:flex-row flex-wrap items-stretch sm:items-center gap-2">
            {/* Page Size Selector */}
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 font-semibold focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value={10}>10 รายการ/หน้า</option>
              <option value={20}>20 รายการ/หน้า</option>
              <option value={50}>50 รายการ/หน้า</option>
            </select>

            {/* Category Filter Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 font-semibold focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="all">ทุกหมวดหมู่ ({items.length.toLocaleString()})</option>
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </select>

            {/* Search Input */}
            <div className="relative flex-1 min-w-[140px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="ค้นหาในคลัง..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Info Badge for Paginated View */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-1 px-1">
          <span>
            แสดงรายการที่ <strong className="text-slate-900">{startIndex + 1} - {endIndex}</strong> จากทั้งหมด <strong className="text-blue-600">{filteredItems.length.toLocaleString()}</strong> รายการ
          </span>
          <span className="text-[10px] text-slate-400">
            (ใช้ Pagination เพื่อประสิทธิภาพบนมือถือ)
          </span>
        </div>

        {/* Knowledge Records Paginated List */}
        <div className="space-y-2.5">
          {currentPaginatedItems.map((item) => (
            <div 
              key={item.id}
              className="p-3 sm:p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-blue-300 transition-all shadow-2xs space-y-2 group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1.5 min-w-0">
                  <span className="text-[10px] sm:text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full shrink-0">
                    #{item.id} {item.category}
                  </span>
                  <span className="text-xs font-bold text-slate-900 break-words">
                    {item.question}
                  </span>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 hover:border-blue-400 text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
                    title="แก้ไขความรู้นี้"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 hover:border-red-300 text-slate-600 hover:text-red-600 transition-colors cursor-pointer"
                    title="ลบออกจาก DB"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="text-xs text-slate-700 leading-relaxed bg-white p-2.5 sm:p-3 rounded-lg border border-slate-200/70 font-mono whitespace-pre-wrap">
                {item.answer}
              </div>

              {item.keywords && (
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 flex-wrap">
                  <Tag className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="font-semibold text-slate-500">Keywords:</span>
                  <span className="font-mono break-all">{item.keywords}</span>
                </div>
              )}
            </div>
          ))}

          {filteredItems.length === 0 && (
            <div className="text-center py-8 text-slate-400 text-xs">
              ไม่พบข้อมูลความรู้ที่ค้นหา
            </div>
          )}
        </div>

        {/* 5. Pagination Footer Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="text-xs text-slate-500 text-center sm:text-left">
            หน้า <strong className="text-slate-900">{currentPage}</strong> จาก <strong className="text-slate-900">{totalPages.toLocaleString()}</strong> หน้า
          </div>

          <div className="flex items-center justify-center gap-1.5">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden xs:inline">ก่อนหน้า</span>
            </button>

            {/* Quick Page Jump Buttons */}
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum = currentPage;
                if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                if (pageNum <= 0 || pageNum > totalPages) return null;

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white border border-slate-200 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
            >
              <span className="hidden xs:inline">ถัดไป</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}

export default AITrainingCenter;
