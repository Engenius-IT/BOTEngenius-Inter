import React, { useState } from 'react';
import { 
  BarChart3, 
  MessageSquare, 
  Clock, 
  Zap, 
  Database, 
  CheckCircle2, 
  ArrowUpRight, 
  Activity, 
  Bot, 
  PieChart, 
  Calendar,
  RefreshCw,
  MessageCircle,
  Award
} from 'lucide-react';

interface DashboardOverviewProps {
  knowledgeCount: number;
  messageCount: number;
  activeProvider: string;
}

export function DashboardOverview({ knowledgeCount, messageCount, activeProvider }: DashboardOverviewProps) {
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('week');

  // Stats summary metrics
  const stats = [
    {
      title: 'ข้อความที่บอทช่วยตอบสะสม',
      value: (374 + messageCount).toLocaleString(),
      unit: 'ข้อความ',
      change: '+18.4%',
      isPositive: true,
      icon: MessageSquare,
      iconBg: 'bg-blue-50 text-blue-600 border-blue-100',
      description: 'ตอบอัตโนมัติผ่าน LINE & Web Chat'
    },
    {
      title: 'อัตราการตอบสำเร็จ (Auto-Reply)',
      value: '98.6%',
      unit: 'ของคำถามทั้งหมด',
      change: '+2.1%',
      isPositive: true,
      icon: Zap,
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      description: 'ตรงตามคลังความรู้ Supabase'
    },
    {
      title: 'เวลาที่ประหยัดให้แอดมิน',
      value: '148',
      unit: 'ชั่วโมง',
      change: '+12.5%',
      isPositive: true,
      icon: Clock,
      iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-100',
      description: 'คิดเฉลี่ย 2 นาทีต่อการตอบ 1 ครั้ง'
    },
    {
      title: 'คลังความรู้ในฐานข้อมูล',
      value: (2141 + knowledgeCount).toLocaleString(),
      unit: 'รายการ',
      change: 'ซิงค์สด',
      isPositive: true,
      icon: Database,
      iconBg: 'bg-purple-50 text-purple-600 border-purple-100',
      description: 'Supabase PostgreSQL DB'
    }
  ];

  // Weekly Chat Volume Data
  const weeklyData = [
    { day: 'จันทร์', count: 420, botSuccess: 412, heightPercent: 65 },
    { day: 'อังคาร', count: 580, botSuccess: 572, heightPercent: 88 },
    { day: 'พุธ', count: 640, botSuccess: 630, heightPercent: 95 },
    { day: 'พฤหัสบดี', count: 510, botSuccess: 502, heightPercent: 78 },
    { day: 'ศุกร์', count: 690, botSuccess: 681, heightPercent: 100 },
    { day: 'เสาร์', count: 320, botSuccess: 316, heightPercent: 48 },
    { day: 'อาทิตย์', count: 280, botSuccess: 277, heightPercent: 42 }
  ];

  // AI Model Performance Distribution
  const aiDistribution = [
    { name: 'DeepSeek Chat', share: 55, color: 'bg-blue-600', count: '1,890 ครั้ง' },
    { name: 'Google Gemini 2.5', share: 25, color: 'bg-indigo-600', count: '860 ครั้ง' },
    { name: 'Groq Llama 3.3', share: 12, color: 'bg-emerald-600', count: '412 ครั้ง' },
    { name: 'OpenAI GPT-4o', share: 8, color: 'bg-purple-600', count: '278 ครั้ง' }
  ];

  // Top Asked Question Categories
  const topTopics = [
    { category: 'ทุนการศึกษาและส่วนลดค่าใช้จ่าย', count: 1240, percentage: 42 },
    { category: 'เอกสารและขั้นตอนการสมัคร', count: 850, percentage: 29 },
    { category: 'กำหนดการเปิดรับสมัครและสัมภาษณ์', count: 510, percentage: 17 },
    { category: 'ช่องทางการชำระเงินและโอนเงิน', count: 350, percentage: 12 }
  ];

  // Recent Auto-replied Chat Logs Snapshot
  const recentLogs = [
    {
      id: 1,
      user: 'คุณศิริพร (LINE)',
      message: 'สอบถามเรื่องทุนการศึกษาโครงการแลกเปลี่ยนค่ะ',
      botAnswer: 'ทางโครงการมีทุนสนับสนุนการศึกษาให้เลือกทั้งแบบทุนเต็มจำนวนและทุนส่วนลด...',
      matchScore: '99.2%',
      model: 'DeepSeek Chat',
      time: '2 นาทีที่แล้ว',
      channel: 'LINE OA'
    },
    {
      id: 2,
      user: 'คุณภานุเดช (Web)',
      message: 'ต้องใช้เอกสารอะไรบ้างในการสมัครเข้าร่วม?',
      botAnswer: 'เอกสารประกอบด้วย สำเนาบัตรประชาชน, Transcript เกรดเฉลี่ยสะสม...',
      matchScore: '98.7%',
      model: 'Gemini 2.5',
      time: '8 นาทีที่แล้ว',
      channel: 'Web Chat'
    },
    {
      id: 3,
      user: 'คุณกิตติศักดิ์ (LINE)',
      message: 'ติดต่อเจ้าหน้าที่วันไหนได้บ้างครับ?',
      botAnswer: 'สามารถติดต่อเจ้าหน้าที่ในวันและเวลาทำการ จันทร์-ศุกร์ 08:30-17:00 น. ...',
      matchScore: '97.5%',
      model: 'Groq Llama',
      time: '15 นาทีที่แล้ว',
      channel: 'LINE OA'
    }
  ];

  return (
    <div className="space-y-5 pb-8 animate-fade-in">
      
      {/* 1. Dashboard Header Banner */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              รายงานสรุปผลการทำงานของบอท
            </h2>
            <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping" />
              Live Analytics
            </span>
          </div>
          <p className="text-slate-500 text-xs mt-0.5">
            สรุปสถิติจำนวนแชทที่บอทช่วยตอบ ประสิทธิภาพการประมวลผล และคลังความรู้ Supabase
          </p>
        </div>

        {/* Time Filter Controls */}
        <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200 shrink-0 self-start sm:self-auto">
          <button
            onClick={() => setTimeRange('today')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              timeRange === 'today' ? 'bg-white text-blue-700 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            วันนี้
          </button>
          <button
            onClick={() => setTimeRange('week')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              timeRange === 'week' ? 'bg-white text-blue-700 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            7 วันล่าสุด
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              timeRange === 'month' ? 'bg-white text-blue-700 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            เดือนนี้
          </button>
        </div>
      </div>

      {/* 2. Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs hover:shadow-sm transition-all">
              <div className="flex items-start justify-between mb-2.5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${item.iconBg}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`inline-flex items-center text-[11px] font-bold px-2 py-0.5 rounded-md ${
                  item.isPositive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'
                }`}>
                  {item.isPositive ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : null}
                  {item.change}
                </span>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium mb-0.5">{item.title}</p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    {item.value}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">{item.unit}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5 border-t border-slate-100 pt-1.5 truncate">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Main Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Chart: Weekly Response Volume Trend */}
        <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                  <span>ปริมาณการช่วยตอบแชทรายวัน</span>
                </h3>
                <p className="text-xs text-slate-500">สถิติข้อความที่บอทตอบสำเร็จเทียบกับคำถามทั้งหมด</p>
              </div>
              <div className="flex items-center gap-3 text-xs font-medium shrink-0">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-xs bg-blue-600" />
                  บอทตอบสำเร็จ (98.6%)
                </span>
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-xs bg-slate-200" />
                  แอดมินรับช่วงต่อ
                </span>
              </div>
            </div>

            {/* Bar Chart Visualization */}
            <div className="h-52 flex items-end justify-between gap-3 pt-4 px-2">
              {weeklyData.map((bar, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                  
                  {/* Tooltip on Hover */}
                  <div className="absolute -top-10 bg-slate-900 text-white text-[10px] py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md z-10">
                    {bar.day}: {bar.count} ข้อความ
                  </div>

                  {/* Vertical Bar Column */}
                  <div className="w-full max-w-[36px] bg-slate-100 rounded-t-md overflow-hidden flex flex-col justify-end transition-all h-full">
                    <div 
                      className="w-full bg-blue-600 group-hover:bg-blue-700 transition-all rounded-t-md relative"
                      style={{ height: `${bar.heightPercent}%` }}
                    >
                      <div className="absolute top-1 left-0 right-0 text-center text-[9px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        {bar.count}
                      </div>
                    </div>
                  </div>

                  <span className="text-[11px] font-medium text-slate-600">{bar.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Summary Pill */}
          <div className="mt-4 p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between text-xs text-slate-600">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>บอทช่วยตอบอัตโนมัติสัปดาห์นี้: <strong className="text-slate-900">3,440 ข้อความ</strong></span>
            </span>
            <span className="text-blue-600 font-semibold text-xs">อัตราแม่นยำ 98.6%</span>
          </div>
        </div>

        {/* Right Chart: AI Model Distribution & Channels */}
        <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="mb-3 pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <PieChart className="w-4 h-4 text-indigo-600" />
                <span>สัดส่วนโมเดล AI ที่ใช้ตอบ</span>
              </h3>
              <p className="text-xs text-slate-500">จำนวนครั้งที่ AI แต่ละตัวถูกใช้งาน</p>
            </div>

            {/* Model Breakdown Bars */}
            <div className="space-y-3">
              {aiDistribution.map((item, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">{item.name}</span>
                    <span className="font-mono text-slate-500 text-[11px] font-medium">{item.share}% ({item.count})</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.share}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Channel Comparison */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              สัดส่วนช่องทางรับแชท (Channels)
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-2.5 bg-emerald-50/60 border border-emerald-200/80 rounded-xl text-center">
                <span className="text-[11px] font-bold text-emerald-800 block">LINE Official</span>
                <span className="text-base font-extrabold text-emerald-700">82%</span>
                <span className="text-[10px] text-emerald-600 block mt-0.5">LINE API</span>
              </div>
              <div className="p-2.5 bg-blue-50/60 border border-blue-200/80 rounded-xl text-center">
                <span className="text-[11px] font-bold text-blue-800 block">Web Widget</span>
                <span className="text-base font-extrabold text-blue-700">18%</span>
                <span className="text-[10px] text-blue-600 block mt-0.5">Live Chat</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 4. Top Asked Question Categories & Real-time Log Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Top Categories */}
        <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs">
          <div className="mb-4 pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-amber-500" />
              <span>หัวข้อคำถามที่ถามบ่อยที่สุด</span>
            </h3>
            <p className="text-xs text-slate-500">จัดกลุ่มบทความความรู้จาก Supabase Database</p>
          </div>

          <div className="space-y-2.5">
            {topTopics.map((topic, i) => (
              <div key={i} className="p-2.5 bg-slate-50 border border-slate-200/70 rounded-xl flex items-center justify-between gap-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-md bg-white border border-slate-200 flex items-center justify-center text-slate-700 shrink-0 text-xs font-bold">
                    #{i + 1}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{topic.category}</h4>
                    <p className="text-[10px] text-slate-500">{topic.count.toLocaleString()} ครั้งที่ถูกถาม</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-white border border-slate-200 text-slate-800 rounded-md text-xs font-bold shrink-0">
                  {topic.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Real-time Response Log Stream */}
        <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-600" />
                <span>ประวัติการตอบแชทของบอทล่าสุด</span>
              </h3>
              <p className="text-xs text-slate-500">รายการข้อความที่บอทตอบแทนทีมงานแบบเรียลไทม์</p>
            </div>
            <span className="text-[11px] text-blue-600 font-semibold flex items-center gap-1">
              <RefreshCw className="w-3 h-3 animate-spin" />
              Live
            </span>
          </div>

          <div className="space-y-2.5">
            {recentLogs.map((log) => (
              <div key={log.id} className="p-3 bg-slate-50/80 border border-slate-200/80 rounded-xl space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{log.user}</span>
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-semibold">
                      {log.channel}
                    </span>
                  </div>
                  <span className="text-slate-400 text-[10px]">{log.time}</span>
                </div>

                <p className="text-xs text-slate-600 truncate">
                  <strong className="text-slate-800">ถาม:</strong> "{log.message}"
                </p>

                <div className="p-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 flex items-start gap-2">
                  <Bot className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span className="line-clamp-1 text-[11px]">{log.botAnswer}</span>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
                  <span className="text-emerald-700 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Match score: {log.matchScore}
                  </span>
                  <span className="font-mono text-slate-600">Engine: {log.model}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
