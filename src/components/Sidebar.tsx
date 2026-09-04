import React from 'react';
import { 
  BarChart3,
  Database,
  Cpu,
  Bot,
  UserCheck,
  Sparkles,
  GraduationCap,
  MessageSquare
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  knowledgeCount: number;
  messageCount: number;
  broadcastCount: number;
  adminCount: number;
  activeProvider: string;
  onCloseMobileMenu?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  activeProvider,
  onCloseMobileMenu
}) => {
  const menuItems = [
    {
      id: 'overview',
      label: 'รายงานสรุปผลบอท',
      sublabel: 'Overview & Analytics',
      icon: BarChart3,
      badgeText: 'หน้ารายงานหลัก',
      description: 'สถิติการตอบแชท & กราฟสรุปผล'
    },
    {
      id: 'live-chats',
      label: 'กล่องข้อความแชทสด (LINE Live)',
      sublabel: 'Live Realtime Chat Console',
      icon: MessageSquare,
      badgeText: 'ดูแชทสด LINE',
      description: 'เฝ้าดูแชทสดเรียลไทม์ & แอดมินตอบกลับ'
    },
    {
      id: 'metrics',
      label: 'ความจุคลังข้อมูล Supabase',
      sublabel: 'Storage & Parameters',
      icon: Database,
      badgeText: '3.28M Tokens',
      description: 'ขนาดไฟล์ MB & พารามิเตอร์ AI'
    },
    {
      id: 'ai-training',
      label: 'ศูนย์เทรนความรู้ AI',
      sublabel: 'RAG Training Center',
      icon: GraduationCap,
      badgeText: 'เพิ่ม Q&A / ไฟล์',
      description: 'เทรนชุดความรู้ใหม่เข้า Supabase DB'
    },
    {
      id: 'simulator',
      label: 'จำลองการคุยกับบอท',
      sublabel: 'Live Chatbot Sandbox',
      icon: Bot,
      badgeText: 'ทดสอบสด',
      description: 'ทดลองส่งข้อความโต้ตอบแชทบอท'
    },
    {
      id: 'persona',
      label: 'กำหนดบทบาท AI & กฎเหล็ก',
      sublabel: 'System Prompt & Rules',
      icon: UserCheck,
      badgeText: 'ควบคุมพฤติกรรม',
      description: 'บีบบทบาท & กำหนดหัวข้อต้องห้าม'
    },
    {
      id: 'settings',
      label: 'ตั้งค่า AI & เปลี่ยน Key/โมเดล',
      sublabel: 'AI Model & Provider Config',
      icon: Cpu,
      badgeText: activeProvider.toUpperCase(),
      description: 'สลับค่าย AI & จัดการ API Keys'
    }
  ];

  return (
    <aside className="w-full lg:w-72 bg-white border-b lg:border-b-0 lg:border-r border-slate-200/80 p-4 lg:p-5 flex flex-col justify-between shrink-0">
      <div className="space-y-6">
        
        {/* Brand identity */}
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black shadow-md">
            P1
          </div>
          <div>
            <h1 className="font-bold text-slate-900 text-sm tracking-tight flex items-center gap-1.5">
              <span>PHANX1 AI Platform</span>
              <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded-md font-extrabold">v2.5</span>
            </h1>
            <p className="text-[11px] text-slate-500 font-medium">แผงควบคุมระบบตอบแชท AI</p>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1.5">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
            เมนูระบบหลัก (Main Navigation)
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (onCloseMobileMenu) onCloseMobileMenu();
                }}
                className={`w-full text-left p-3 rounded-xl transition-all duration-200 flex items-start gap-3 group cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'hover:bg-slate-100/80 text-slate-700 hover:text-slate-900'
                }`}
              >
                <div className={`p-2 rounded-lg shrink-0 ${
                  isActive 
                    ? 'bg-white/20 text-white' 
                    : 'bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className={`font-bold text-xs truncate ${isActive ? 'text-white' : 'text-slate-900'}`}>
                      {item.label}
                    </span>
                    {item.badgeText && (
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md shrink-0 ${
                        isActive 
                          ? 'bg-white/20 text-white border border-white/30' 
                          : item.id === 'ai-training'
                            ? 'bg-purple-50 text-purple-700 border border-purple-200 font-extrabold'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {item.badgeText}
                      </span>
                    )}
                  </div>
                  <p className={`text-[10px] truncate mt-0.5 ${isActive ? 'text-blue-100' : 'text-slate-500'}`}>
                    {item.description}
                  </p>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-slate-100 px-2 mt-4">
        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Supabase DB Connected
          </span>
          <span className="font-mono text-[10px]">v2.5.0</span>
        </div>
      </div>
    </aside>
  );
};
