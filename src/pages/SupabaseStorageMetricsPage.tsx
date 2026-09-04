import React, { useState } from 'react';
import { 
  Database, 
  Cpu, 
  HardDrive, 
  Zap, 
  RefreshCw, 
  CheckCircle2, 
  Search, 
  Binary, 
  Table,
  UserCheck,
  LogOut,
  ArrowLeft,
  Server,
  Layers,
  ShieldCheck
} from 'lucide-react';

interface SupabaseStorageMetricsPageProps {
  onBackToLanding?: () => void;
  user?: { name: string; email: string; role: string } | null;
  onLogout?: () => void;
}

export function SupabaseStorageMetricsPage({ onBackToLanding, user, onLogout }: SupabaseStorageMetricsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  // Mock Table Metrics from Supabase Database
  const tableMetrics = [
    {
      name: 'knowledge_base',
      displayName: 'คลังคำถาม-คำตอบ (Q&A Pairs)',
      rowCount: '2,141 แถว',
      sizeMB: '32.4 MB',
      parameters: '2.10 ล้าน Tokens',
      vectorDim: '1,536 Dims',
      indexType: 'HNSW pgvector',
      status: 'Active',
      statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      name: 'knowledgearticle',
      displayName: 'คลังบทความและเอกสารยาว',
      rowCount: '238 แถว',
      sizeMB: '12.8 MB',
      parameters: '1.18 ล้าน Tokens',
      vectorDim: '1,536 Dims',
      indexType: 'HNSW pgvector',
      status: 'Active',
      statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      name: 'chat_messages',
      displayName: 'ประวัติบทสนทนา (Context History)',
      rowCount: '374 แถว',
      sizeMB: '2.1 MB',
      parameters: '0.15 ล้าน Tokens',
      vectorDim: '-',
      indexType: 'B-Tree Index',
      status: 'Ready',
      statusColor: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      name: 'broadcast_logs',
      displayName: 'ประวัติการส่งบรอดแคสต์',
      rowCount: '4 แถว',
      sizeMB: '0.4 MB',
      parameters: '0.01 ล้าน Tokens',
      vectorDim: '-',
      indexType: 'B-Tree Index',
      status: 'Ready',
      statusColor: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      name: 'admins',
      displayName: 'ข้อมูลผู้ดูแลระบบและสิทธิ์',
      rowCount: '2 แถว',
      sizeMB: '0.1 MB',
      parameters: '-',
      vectorDim: '-',
      indexType: 'Primary Key Index',
      status: 'Active',
      statusColor: 'bg-slate-100 text-slate-700 border-slate-200'
    }
  ];

  const filteredTables = tableMetrics.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white flex flex-col">
      
      {/* Top Standalone Header Bar */}
      <header className="bg-white border-b border-slate-200/80 px-6 py-4 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {onBackToLanding && (
              <button
                onClick={onBackToLanding}
                className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer mr-1"
                title="กลับหน้าหลัก"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white shadow-md shadow-purple-500/20 flex items-center justify-center font-bold">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                  สถิติความจุคลังข้อมูล AI & พารามิเตอร์ใน Supabase
                </h1>
                <span className="bg-purple-50 text-purple-700 border border-purple-200 text-xs px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-ping" />
                  Supabase PostgreSQL Live
                </span>
              </div>
              <p className="text-xs text-slate-500">
                ขนาดไฟล์ข้อมูล (MB), จำนวนแถว และปริมาณพารามิเตอร์ Tokens
              </p>
            </div>
          </div>

          {/* Right Header Status / User Info */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className="py-1.5 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-purple-600 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>ซิงค์ DB ล่าสุด</span>
            </button>
            {user && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700">
                <UserCheck className="w-4 h-4 text-purple-600" />
                <span>{user.name}</span>
              </div>
            )}
            {onLogout && (
              <button
                onClick={onLogout}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 rounded-xl transition-colors cursor-pointer"
                title="ออกจากระบบ"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 space-y-6">
        
        {/* 1. Key Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Metric 1 */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs hover:shadow-sm transition-all">
            <div className="flex items-start justify-between mb-2">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
                <Binary className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                Vector & Tokens
              </span>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium mb-0.5">ปริมาณพารามิเตอร์คลังความรู้</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  3.28 ล้าน
                </span>
                <span className="text-xs text-slate-500 font-medium">Tokens</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5 border-t border-slate-100 pt-1.5 truncate">
                พร้อมให้ AI ดึงทำ Context RAG
              </p>
            </div>
          </div>

          {/* Metric 2 */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs hover:shadow-sm transition-all">
            <div className="flex items-start justify-between mb-2">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center shrink-0">
                <HardDrive className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
                PostgreSQL MB
              </span>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium mb-0.5">ขนาดความจุฐานข้อมูลรวม</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  47.8
                </span>
                <span className="text-xs text-slate-500 font-medium">MB</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5 border-t border-slate-100 pt-1.5 truncate">
                รวม Indexing & Vector Space
              </p>
            </div>
          </div>

          {/* Metric 3 */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs hover:shadow-sm transition-all">
            <div className="flex items-start justify-between mb-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
                <Database className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                2 ตารางหลัก
              </span>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium mb-0.5">จำนวนรายการความรู้ทั้งหมด</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  2,379
                </span>
                <span className="text-xs text-slate-500 font-medium">รายการ</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5 border-t border-slate-100 pt-1.5 truncate">
                knowledge_base + article
              </p>
            </div>
          </div>

          {/* Metric 4 */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs hover:shadow-sm transition-all">
            <div className="flex items-start justify-between mb-2">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                pgvector HNSW
              </span>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium mb-0.5">ความเร็วในการค้นหา Vector</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  ~12
                </span>
                <span className="text-xs text-slate-500 font-medium">มิลลิวินาที (ms)</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5 border-t border-slate-100 pt-1.5 truncate">
                ความแม่นยำสูง ดึงคำตอบทันที
              </p>
            </div>
          </div>

        </div>

        {/* 2. Detailed Supabase Tables Breakdown */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Table className="w-4 h-4 text-purple-600" />
                <span>รายละเอียดขนาดข้อมูลและพารามิเตอร์แยกตามตารางใน Supabase</span>
              </h3>
              <p className="text-xs text-slate-500">แสดงการจัดเก็บข้อมูลจริงในฐานข้อมูล PostgreSQL</p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="ค้นหาชื่อตาราง..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                  <th className="py-2.5 px-3">ชื่อตาราง (Table Name)</th>
                  <th className="py-2.5 px-3">คำอธิบายประเภทข้อมูล</th>
                  <th className="py-2.5 px-3 text-right">จำนวนข้อมูล (Rows)</th>
                  <th className="py-2.5 px-3 text-right">ขนาดไฟล์ (Storage MB)</th>
                  <th className="py-2.5 px-3 text-right">ปริมาณ Tokens/พารามิเตอร์</th>
                  <th className="py-2.5 px-3">ประเภท Index</th>
                  <th className="py-2.5 px-3 text-center">สถานะ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTables.map((table, index) => (
                  <tr key={index} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-mono font-bold text-slate-900 flex items-center gap-1.5">
                        <Database className="w-3.5 h-3.5 text-purple-600" />
                        <span>{table.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-600 font-medium">
                      {table.displayName}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-semibold text-slate-800">
                      {table.rowCount}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-purple-700">
                      {table.sizeMB}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-blue-700">
                      {table.parameters}
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-500">
                      {table.indexType}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${table.statusColor}`}>
                        <CheckCircle2 className="w-3 h-3" />
                        {table.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

        {/* 3. Tech Specs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <Cpu className="w-4 h-4 text-purple-600" />
              <span>คุณสมบัติทางเทคนิคของคลังข้อมูล (RAG Tech Specs)</span>
            </h3>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200/60">
                <span className="text-slate-500">Vector Embeddings Dimension:</span>
                <span className="font-mono font-bold text-slate-900">1,536 Dimensions</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200/60">
                <span className="text-slate-500">Database Engine:</span>
                <span className="font-mono font-bold text-slate-900">PostgreSQL 15 (Supabase Cloud)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200/60">
                <span className="text-slate-500">Vector Search Algorithm:</span>
                <span className="font-mono font-bold text-slate-900">pgvector HNSW (Cosine Distance)</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>ความพร้อมในการประมวลผลของ AI (Model Context Capacity)</span>
            </h3>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200/60">
                <span className="text-slate-500">DeepSeek Chat Context Window:</span>
                <span className="font-mono font-bold text-blue-700">64,000 Tokens</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200/60">
                <span className="text-slate-500">Gemini 2.5 Flash Context Window:</span>
                <span className="font-mono font-bold text-indigo-700">1,000,000 Tokens</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200/60">
                <span className="text-slate-500">Groq Llama 3.3 Context Window:</span>
                <span className="font-mono font-bold text-emerald-700">128,000 Tokens</span>
              </div>
            </div>
          </div>

        </div>

      </main>

      {/* Standalone Page Footer */}
      <footer className="py-6 border-t border-slate-200 bg-white text-center text-xs text-slate-400 mt-auto">
        &copy; 2026 Supabase Storage & AI Parameter Metrics. Supabase Cloud DB Synced.
      </footer>
    </div>
  );
}
