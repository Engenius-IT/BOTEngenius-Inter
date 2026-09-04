import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Smile, 
  Paperclip, 
  Plus, 
  Send, 
  ChevronLeft, 
  ChevronDown, 
  CheckCheck, 
  User, 
  Bot, 
  Volume2, 
  MessageSquare, 
  Sparkles, 
  RefreshCw,
  Filter,
  Check,
  Smartphone,
  ExternalLink,
  ShieldCheck,
  Clock,
  Play,
  PauseCircle
} from 'lucide-react';
import { ChatMessage, KnowledgeBaseItem, KnowledgeArticleItem } from '../types/schema';
import { generateMockVector, computeCosineSimilarity } from '../data/mockData';

interface ChatMessagesConsoleProps {
  chatMessages: ChatMessage[];
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  knowledgeBase: KnowledgeBaseItem[];
  knowledgeArticles: KnowledgeArticleItem[];
}

interface ChatUser {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  status?: string;
  unreadCount?: number;
  isOnline?: boolean;
  isPaused?: boolean;
  pausedUntil?: number | null;
  pauseDurationHours?: number | null;
}

export const ChatMessagesConsole: React.FC<ChatMessagesConsoleProps> = ({
  chatMessages,
  setChatMessages,
  knowledgeBase,
  knowledgeArticles
}) => {
  // Mock User List matching LINE OA Manager UI
  const [users, setUsers] = useState<ChatUser[]>([
    {
      id: 'U9188449e7458f0441acd523ccd6a5cec',
      name: 'คุณศิริพร (LINE OA)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      lastMessage: 'สอบถามข้อมูลเพิ่มเติมค่ะ',
      time: '17.38 น.',
      status: 'ดำเนินการ',
      unreadCount: 1,
      isOnline: true
    },
    {
      id: 'U_SUDIE_002',
      name: 'SUDIE',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      lastMessage: 'สวัสดีค่ะ สนใจ โครงการ Au pair ค่ะ',
      time: 'พุธ',
      isOnline: true
    },
    {
      id: 'U_EUFA_003',
      name: 'Eufa',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      lastMessage: 'สอบถามข้อมูลเพิ่มเติม',
      time: 'อังคาร',
      isOnline: true
    },
    {
      id: 'U_PORPIA_004',
      name: 'Porpia',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
      lastMessage: 'สอบถามข้อมูลเพิ่มเติม',
      time: 'อังคาร',
      status: 'ดำเนินการ',
      isOnline: false
    },
    {
      id: 'U_PITCHAYAPA_005',
      name: 'พิชญาภา',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      lastMessage: 'สอบถามข้อมูลเพิ่มเติม',
      time: 'อังคาร',
      isOnline: true
    },
    {
      id: 'U_GLA_006',
      name: 'Gla',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      lastMessage: 'สอบถามข้อมูลเพิ่มเติม',
      time: 'อังคาร',
      isOnline: false
    },
    {
      id: 'U_MMMM_007',
      name: 'Mmmm',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      lastMessage: 'สอบถามข้อมูลเพิ่มเติม',
      time: 'อังคาร',
      isOnline: false
    }
  ]);

  const [selectedUserId, setSelectedUserId] = useState<string>('U9188449e7458f0441acd523ccd6a5cec');
  const [searchQuery, setSearchQuery] = useState('');
  const [inputMessage, setInputMessage] = useState('');
  const [isAdminHandover, setIsAdminHandover] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [now, setNow] = useState<number>(Date.now());

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Live timer ticker for remaining pause time
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format remaining pause time in Thai
  const getRemainingPauseTime = (pausedUntil?: number | null) => {
    if (!pausedUntil) return null;
    const diff = pausedUntil - now;
    if (diff <= 0) return null;
    const totalSeconds = Math.floor(diff / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours} ชม. ${minutes} นาที ${seconds} วิ`;
    } else if (minutes > 0) {
      return `${minutes} นาที ${seconds} วิ`;
    } else {
      return `${seconds} วินาที`;
    }
  };

  // Selected User Object
  const selectedUser = users.find(u => u.id === selectedUserId) || users[0];

  // Scroll to bottom on message change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, selectedUserId]);

  // Live Sync with Backend Server (http://localhost:3001/api/line/messages)
  useEffect(() => {
    const fetchLiveMessages = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/line/messages');
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            // Update real users if returned from LINE Webhook API
            if (Array.isArray(data.users) && data.users.length > 0) {
              setUsers(data.users);
              if (!selectedUserId && data.users[0]?.id) {
                setSelectedUserId(data.users[0].id);
              }
            }
            if (Array.isArray(data.messages) && data.messages.length > 0) {
              setChatMessages(data.messages);
            }
          }
        }
      } catch (e) {
        // Fallback silently if offline
      }
    };

    fetchLiveMessages();
    const interval = setInterval(fetchLiveMessages, 2000);
    return () => clearInterval(interval);
  }, [setChatMessages, selectedUserId]);

  // Handle Resume Bot Manual Command
  const handleResumeBot = async (userId: string) => {
    try {
      const res = await fetch('http://localhost:3001/api/line/resume-bot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ line_user_id: userId })
      });
      if (res.ok) {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, isPaused: false, pausedUntil: null, pauseDurationHours: null } : u));
      }
    } catch (e) {
      console.error('Error resuming bot', e);
    }
  };

  // Handle Send Message (Admin or Simulation)
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || isSending) return;

    const textToSend = inputMessage.trim();
    setInputMessage('');
    setIsSending(true);

    // Try posting to real backend
    try {
      const res = await fetch('http://localhost:3001/api/line/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToSend,
          line_user_id: selectedUser.id,
          sender: isAdminHandover ? 'admin' : 'user'
        })
      });

      if (res.ok) {
        setIsSending(false);
        return;
      }
    } catch (e) {
      console.log('Using local fallback');
    }

    // Local fallback message insertion
    const newMsg: ChatMessage = {
      id: Date.now(),
      sender: isAdminHandover ? 'admin' : 'user',
      platform: 'line',
      message: textToSend,
      line_user_id: selectedUser.id,
      created_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, newMsg]);
    setIsSending(false);

    // Trigger local AI bot response if not handover
    if (!isAdminHandover) {
      setTimeout(() => {
        const botReply: ChatMessage = {
          id: Date.now() + 1,
          sender: 'bot',
          platform: 'line',
          message: 'โครงการแลกเปลี่ยนระยะสั้นเปิดรับสมัครสำหรับ 4 ประเทศ ได้แก่ สหรัฐอเมริกา สหราชอาณาจักร นิวซีแลนด์ และสิงคโปร์ค่ะ 💕 แต่ละประเทศจะมีรูปแบบการเรียนรู้และวัฒนธรรมที่แตกต่างกันไปนะคะ คุณลูกค้าสนใจประเทศไหนเป็นพิเศษไหมคะ? น้อง AI จะได้แนะนำรายละเอียดเพิ่มเติมให้ค่ะ 😊',
          line_user_id: selectedUser.id,
          created_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          matchedScore: 0.995,
          matchedCategory: 'โครงการแลกเปลี่ยน'
        };
        setChatMessages(prev => [...prev, botReply]);
      }, 700);
    }
  };

  // Filtered Users List
  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-[#f0f2f5] border border-slate-300 rounded-2xl shadow-lg overflow-hidden animate-fade-in max-w-7xl mx-auto flex flex-col h-full min-h-[580px] lg:h-[calc(100vh-110px)]">
      
      {/* LINE OA Manager Main Layout (Split View) */}
      <div className="flex-1 flex min-h-0 relative">

        {/* ---------------- LEFT PANEL: USER CHAT LIST ---------------- */}
        <div className={`w-full lg:w-80 sm:w-80 bg-[#f7f7f8] border-r border-slate-200 flex flex-col shrink-0 ${
          selectedUserId ? 'hidden lg:flex' : 'flex'
        }`}>
          
          {/* Top Filter Bar */}
          <div className="p-3 border-b border-slate-200/90 flex items-center justify-between gap-2 bg-white">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer">
              <span className="text-slate-400">≡</span>
              <span>ทั้งหมด</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>

            <div className="relative flex-1 max-w-[180px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="ค้นหา"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-md pl-8 pr-2 py-1 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* User List Items */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-200/60 bg-white">
            {filteredUsers.map((user) => {
              const isSelected = user.id === selectedUserId;
              const remainingText = getRemainingPauseTime(user.pausedUntil);

              return (
                <div
                  key={user.id}
                  onClick={() => setSelectedUserId(user.id)}
                  className={`p-3 flex items-center gap-3 cursor-pointer transition-colors ${
                    isSelected ? 'bg-[#ebebeb] border-l-4 border-slate-700' : 'hover:bg-slate-50'
                  }`}
                >
                  {/* User Avatar */}
                  <div className="relative shrink-0">
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className="w-11 h-11 rounded-full object-cover border border-slate-200"
                    />
                    {user.isOnline && (
                      <span className="w-3 h-3 rounded-full bg-[#06C755] border-2 border-white absolute bottom-0 right-0" />
                    )}
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{user.name}</h4>
                      <span className="text-[10px] text-slate-400 shrink-0">{user.time}</span>
                    </div>

                    <p className="text-[11px] text-slate-500 truncate leading-snug">
                      {user.lastMessage}
                    </p>

                    <div className="mt-1 flex flex-wrap items-center gap-1">
                      {remainingText ? (
                        <span className="text-[9px] bg-amber-100 text-amber-800 border border-amber-300 px-1.5 py-0.5 rounded-md font-bold flex items-center gap-1 animate-pulse">
                          <Clock className="w-3 h-3 text-amber-700" />
                          <span>ปิดบอท {user.pauseDurationHours || 1} ชม. ({remainingText})</span>
                        </span>
                      ) : user.status ? (
                        <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.2 rounded font-medium">
                          {user.status}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Left Footer Info */}
          <div className="p-2.5 bg-slate-100 border-t border-slate-200 text-[10px] text-slate-500 text-center">
            LINE OA Web Live Monitoring Console
          </div>
        </div>


        {/* ---------------- RIGHT PANEL: ACTIVE CHAT THREAD ---------------- */}
        <div className={`flex-1 bg-white flex flex-col min-w-0 ${
          !selectedUserId ? 'hidden lg:flex' : 'flex'
        }`}>
          
          {/* Active Chat Header Bar */}
          <div className="p-3 bg-white border-b border-slate-200 flex items-center justify-between shadow-2xs shrink-0">
            
            {/* User Profile Info & Mobile Back Button */}
            <div className="flex items-center gap-2.5 min-w-0">
              {/* Back Button on Mobile */}
              <button
                onClick={() => setSelectedUserId('')}
                className="lg:hidden p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg shrink-0"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <img 
                src={selectedUser.avatar} 
                alt={selectedUser.name} 
                className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
              />

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate">{selectedUser.name}</h3>
                  <Volume2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </div>
                <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
                  LINE Official User Connected
                </span>
              </div>
            </div>

            {/* Mode Switcher & Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Handover Toggle */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAdminHandover(false)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    !isAdminHandover ? 'bg-[#06C755] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>น้องอิงกี้ AI</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsAdminHandover(true)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isAdminHandover ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>แอดมินตอบสด</span>
                </button>
              </div>

              <div className="hidden sm:flex items-center gap-1">
                <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg" title="ค้นหาข้อความ">
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

          {/* Active Bot Pause Banner */}
          {selectedUser.pausedUntil && getRemainingPauseTime(selectedUser.pausedUntil) ? (
            <div className="bg-amber-500/10 border-b border-amber-300/80 px-4 py-2.5 flex items-center justify-between gap-2 text-xs text-amber-900 font-semibold animate-pulse shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="truncate">
                  ปิดบอทอัตโนมัติ ({selectedUser.pauseDurationHours || 1} ชั่วโมง) — เหลืออีก{' '}
                  <strong className="text-amber-800 font-extrabold underline">
                    {getRemainingPauseTime(selectedUser.pausedUntil)}
                  </strong>{' '}
                  จึงจะเปิดบอท
                </span>
              </div>
              <button
                onClick={() => handleResumeBot(selectedUser.id)}
                className="px-3 py-1 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>เปิดบอททันที</span>
              </button>
            </div>
          ) : null}


          {/* ---------------- CHAT STREAM BODY ---------------- */}
          <div className="flex-1 p-3 sm:p-5 overflow-y-auto space-y-4 bg-[#f2f4f7] font-sans">
            
            {/* Top Interactive Flex Card Preview (Simulating LINE Rich Card) */}
            <div className="max-w-xs mx-auto bg-white border border-slate-200 rounded-2xl p-4 shadow-sm text-center space-y-3">
              <div className="text-xs font-bold text-slate-800">
                โครงการแลกเปลี่ยนระยะสั้น รุ่นที่ 12
              </div>
              <div className="text-[11px] text-slate-500 space-y-1 bg-slate-50 p-2.5 rounded-xl text-left border border-slate-100">
                <div>• ประเทศ: <strong>อเมริกา, อังกฤษ, นิวซีแลนด์, สิงคโปร์</strong></div>
                <div>• อายุรับสมัคร: <strong>10 - 22 ปี</strong></div>
                <div className="mt-2 text-center bg-emerald-50 text-emerald-700 font-bold text-xs py-1 rounded-lg border border-emerald-200 flex items-center justify-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>เปิดรับสมัครแล้ววันนี้!</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 pt-1">
                <a 
                  href="https://ingenius.co.th" 
                  target="_blank" 
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1"
                >
                  <span>ดูเว็บไซต์</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <button 
                  type="button"
                  onClick={() => setIsAdminHandover(true)}
                  className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition-colors"
                >
                  แอดมิน
                </button>
              </div>
            </div>

            {/* Date Separator */}
            <div className="text-center my-3">
              <span className="bg-slate-200/80 text-slate-600 text-[10px] font-semibold px-3 py-1 rounded-full shadow-2xs">
                เมื่อวาน ▾
              </span>
            </div>

            {/* Chat Messages List */}
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'justify-start' : 'justify-end'}`}
              >
                {/* User Avatar (on left for incoming user messages) */}
                {msg.sender === 'user' && (
                  <img
                    src={selectedUser.avatar}
                    alt={selectedUser.name}
                    className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0 mt-1"
                  />
                )}

                {/* Message Bubble Column */}
                <div className={`space-y-1 max-w-[85%] sm:max-w-[70%] ${msg.sender === 'user' ? 'items-start' : 'items-end'}`}>
                  
                  {/* Bubble Content */}
                  <div
                    className={`p-3 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-2xs ${
                      msg.sender === 'user'
                        ? 'bg-[#ffffff] border border-slate-200 text-slate-900 rounded-tl-xs'
                        : 'bg-[#709cfc] text-white rounded-tr-xs font-normal'
                    }`}
                  >
                    {msg.message}
                  </div>

                  {/* Read Status & Timestamp */}
                  <div className={`flex items-center gap-1.5 text-[10px] text-slate-400 px-1 ${
                    msg.sender === 'user' ? 'justify-start' : 'justify-end'
                  }`}>
                    <span>อ่านแล้ว</span>
                    <span>{msg.created_at ? msg.created_at.substring(11, 16) : '11.36 น.'}</span>
                  </div>

                </div>

                {/* Admin/Bot Avatar (on right) */}
                {msg.sender !== 'user' && (
                  <div className="w-8 h-8 rounded-full bg-[#06C755] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-1 shadow-2xs">
                    {msg.sender === 'bot' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>
                )}
              </div>
            ))}

            <div ref={chatEndRef} />
          </div>


          {/* ---------------- BOTTOM INPUT TOOLBAR (LINE OA STYLE) ---------------- */}
          <div className="p-3 bg-white border-t border-slate-200 shrink-0 space-y-2">
            
            {/* Placeholder directive text */}
            <div className="text-[10px] text-slate-400 px-1">
              Enter: ส่ง, Shift + Enter: ขึ้นบรรทัดใหม่
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              
              {/* Tool Icons (Smile, Attachment, Plus) */}
              <div className="flex items-center gap-1 text-slate-400 shrink-0">
                <button type="button" className="p-1.5 hover:bg-slate-100 hover:text-slate-700 rounded-lg">
                  <Smile className="w-4 h-4" />
                </button>
                <button type="button" className="p-1.5 hover:bg-slate-100 hover:text-slate-700 rounded-lg">
                  <Paperclip className="w-4 h-4" />
                </button>
                <button type="button" className="p-1.5 hover:bg-slate-100 hover:text-slate-700 rounded-lg">
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Text Input */}
              <input
                type="text"
                placeholder={isAdminHandover ? "พิมพ์ข้อความตอบในนามแอดมินเจ้าหน้าที่..." : "พิมพ์ข้อความทดสอบคุยกับบอท..."}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
              />

              {/* LINE Official Green Send Button */}
              <button
                type="submit"
                disabled={!inputMessage.trim() || isSending}
                className="px-4 py-2 bg-[#06C755] hover:bg-[#05b34c] active:bg-[#049a41] disabled:opacity-40 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1 cursor-pointer shrink-0"
              >
                <span>ส่ง</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </form>

          </div>

        </div>

      </div>
    </div>
  );
};

export default ChatMessagesConsole;

