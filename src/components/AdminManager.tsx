import React, { useState } from 'react';
import { AdminUser } from '../types/schema';
import { Users, Shield, Key, Plus, CheckCircle, Mail, UserCheck } from 'lucide-react';

interface AdminManagerProps {
  admins: AdminUser[];
  setAdmins: React.Dispatch<React.SetStateAction<AdminUser[]>>;
}

export const AdminManager: React.FC<AdminManagerProps> = ({ admins, setAdmins }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'superadmin' | 'admin' | 'editor'>('admin');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const newAdmin: AdminUser = {
      id: Date.now(),
      name,
      email,
      password_hash: "$2y$10$encrypted_hash_" + Math.random().toString(36).substring(7),
      role,
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
      updated_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    setAdmins(prev => [newAdmin, ...prev]);
    setName('');
    setEmail('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-5 rounded-2xl border border-gray-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-400" />
            ระบบจัดการผู้ดูแลระบบ (admins)
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            จัดการรายชื่อ สิทธิ์การเข้าถึง และ บัญชีแอดมินในตาราง <code className="text-amber-400 font-mono">admins</code>
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          เพิ่มผู้ดูแลระบบใหม่
        </button>
      </div>

      {/* Admin Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {admins.map((admin) => (
          <div key={admin.id} className="glass-panel p-5 rounded-2xl border border-gray-800 hover:border-amber-500/30 transition-all space-y-4 shadow-lg">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{admin.name}</h4>
                  <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                    <Mail className="w-3 h-3 text-gray-500" />
                    <span className="font-mono text-[11px]">{admin.email}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-800/80 flex items-center justify-between text-xs">
              <span className={`px-2.5 py-0.5 rounded-full font-mono text-[11px] font-semibold border ${
                admin.role === 'superadmin' ? 'bg-red-500/10 text-red-400 border-red-500/30' :
                admin.role === 'admin' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                'bg-blue-500/10 text-blue-400 border-blue-500/30'
              }`}>
                {admin.role.toUpperCase()}
              </span>

              <span className="text-[10px] text-gray-500 font-mono">
                สร้างเมื่อ: {admin.created_at.substring(0, 10)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Create Admin Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateAdmin} className="glass-panel w-full max-w-md p-6 rounded-2xl border border-gray-700 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-400" />
                เพิ่มผู้ดูแลระบบใหม่
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white text-sm bg-gray-800 w-7 h-7 rounded-lg flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-300 block mb-1">ชื่อ-นามสกุล แอดมิน</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="เช่น แอดมินฝ่ายบริการลูกค้า"
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl p-2.5 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-300 block mb-1">อีเมล (Email)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@phanx1.shop"
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl p-2.5 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-300 block mb-1">บทบาทสิทธิ์ (Role)</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl p-2.5 text-xs text-white"
                >
                  <option value="superadmin">Superadmin (สิทธิ์สูงสุด)</option>
                  <option value="admin">Admin (จัดการบทสนทนา & บรอดแคสต์)</option>
                  <option value="editor">Editor (สิทธิ์จัดการคลังความรู้ AI)</option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-xs rounded-xl"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold text-xs rounded-xl"
              >
                สร้างบัญชี Admin
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
