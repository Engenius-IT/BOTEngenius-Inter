import React, { useState } from 'react';
import { BroadcastLog } from '../types/schema';
import { Send, Users, CheckCircle2, Clock, AlertTriangle, Plus, Sparkles, MessageSquare } from 'lucide-react';

interface BroadcastCenterProps {
  broadcastLogs: BroadcastLog[];
  setBroadcastLogs: React.Dispatch<React.SetStateAction<BroadcastLog[]>>;
}

export const BroadcastCenter: React.FC<BroadcastCenterProps> = ({ broadcastLogs, setBroadcastLogs }) => {
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [targetGroup, setTargetGroup] = useState('ผู้สนใจแลกเปลี่ยนทั้งหมด');
  const [recipientCount, setRecipientCount] = useState(1250);
  const [isSending, setIsSending] = useState(false);

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;

    setIsSending(true);

    setTimeout(() => {
      const newLog: BroadcastLog = {
        id: Date.now(),
        sender_id: 1,
        sender_name: "ผู้ดูแลระบบหลัก (Superadmin)",
        message: broadcastMessage,
        target_group: targetGroup,
        recipient_count: recipientCount,
        status: "success",
        created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
      };

      setBroadcastLogs(prev => [newLog, ...prev]);
      setBroadcastMessage('');
      setIsSending(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-5 rounded-2xl border border-gray-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Send className="w-5 h-5 text-purple-400" />
            ระบบจัดการบรอดแคสต์ข้อความ (broadcast_logs)
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            ส่งข้อความประชาสัมพันธ์ ข่าวสาร และโปรโมชั่นไปยังผู้ใช้งาน LINE ในแต่ละกลุ่มเป้าหมาย
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Compose Broadcast Form */}
        <div className="lg:col-span-5 glass-panel p-5 rounded-2xl border border-gray-800 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-gray-800 pb-3">
            <Plus className="w-4 h-4 text-purple-400" />
            สร้างข้อความบรอดแคสต์ใหม่
          </h3>

          <form onSubmit={handleSendBroadcast} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-300 block mb-1">กลุ่มเป้าหมาย (Target Group)</label>
              <select
                value={targetGroup}
                onChange={(e) => setTargetGroup(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl p-2.5 text-xs text-white"
              >
                <option value="ผู้สนใจแลกเปลี่ยนทั้งหมด">ผู้สนใจแลกเปลี่ยนทั้งหมด (1,420 ราย)</option>
                <option value="กลุ่มนักเรียน ม.2-ม.5">กลุ่มนักเรียน ม.2-ม.5 (850 ราย)</option>
                <option value="ผู้สอบวัดระดับภาษาแล้ว">ผู้สอบวัดระดับภาษาแล้ว (310 ราย)</option>
                <option value="ผู้สนใจคอร์สตัวต่อตัว">ผู้สนใจคอร์สตัวต่อตัว (540 ราย)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-300 block mb-1">ข้อความบรอดแคสต์</label>
              <textarea
                rows={5}
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                placeholder="พิมพ์ข้อความบรอดแคสต์ประชาสัมพันธ์ เช่น 📢 ประกาศเปิดรับสมัครรอบพิเศษ..."
                className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                required
              />
            </div>

            {/* Live Message Preview */}
            {broadcastMessage && (
              <div className="p-3 bg-gray-950 rounded-xl border border-purple-500/30 space-y-1">
                <span className="text-[10px] font-mono text-purple-400 font-bold">ตัวอย่างข้อความบน LINE:</span>
                <p className="text-xs text-gray-200 leading-relaxed font-sans">
                  {broadcastMessage}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSending}
              className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2"
            >
              {isSending ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                  กำลังส่งข้อความบรอดแคสต์...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  ยืนยันการส่งบรอดแคสต์
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right: Broadcast Logs Table */}
        <div className="lg:col-span-7 glass-panel p-5 rounded-2xl border border-gray-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              ประวัติการส่งบรอดแคสต์ ({broadcastLogs.length} รายการ)
            </h3>
            <span className="text-xs text-gray-500 font-mono">TABLE: broadcast_logs</span>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {broadcastLogs.map((log) => (
              <div key={log.id} className="glass-card p-4 rounded-xl border border-gray-800 hover:border-purple-500/30 transition-all space-y-2">
                <div className="flex items-center justify-between text-xs border-b border-gray-800/80 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-purple-300">{log.sender_name}</span>
                    <span className="text-gray-500">→</span>
                    <span className="bg-gray-800 text-gray-300 px-2 py-0.5 rounded text-[11px]">
                      {log.target_group}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-emerald-400 font-mono text-[11px] bg-emerald-500/10 px-2 py-0.5 rounded">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {log.status} ({log.recipient_count} ราย)
                  </span>
                </div>

                <p className="text-xs text-gray-200 leading-relaxed font-sans bg-gray-950/60 p-3 rounded-lg border border-gray-800/60">
                  {log.message}
                </p>

                <div className="text-[10px] text-gray-500 font-mono text-right">
                  ส่งเมื่อ: {log.created_at}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
