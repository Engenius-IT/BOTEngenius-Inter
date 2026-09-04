import React, { useState } from 'react';
import { tableSummaries } from '../data/mockData';
import { Database, CheckCircle2, XCircle, Code, Cloud, Sparkles } from 'lucide-react';

export const SchemaInspector: React.FC = () => {
  const [activeDbType, setActiveDbType] = useState<'supabase' | 'mysql'>('supabase');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-5 rounded-2xl border border-gray-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-cyan-400" />
            โครงสร้างตารางฐานข้อมูล & Supabase (pgvector)
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            สลับดูคำสั่ง SQL Schema ทั้งสำหรับ Supabase (PostgreSQL + pgvector) และ MySQL
          </p>
        </div>

        {/* Database Selector Buttons */}
        <div className="flex items-center gap-2 bg-gray-900 p-1 rounded-xl border border-gray-800">
          <button
            onClick={() => setActiveDbType('supabase')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeDbType === 'supabase'
                ? 'bg-emerald-500 text-gray-950 shadow-md font-bold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Cloud className="w-3.5 h-3.5" />
            Supabase (แนะนำ 🌟)
          </button>
          <button
            onClick={() => setActiveDbType('mysql')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeDbType === 'mysql'
                ? 'bg-cyan-500 text-gray-950 shadow-md font-bold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            MySQL / MariaDB
          </button>
        </div>
      </div>

      {/* Table Cards List */}
      <div className="grid grid-cols-1 gap-4">
        {tableSummaries.map((tbl) => (
          <div
            key={tbl.tableName}
            className={`glass-panel p-5 rounded-2xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
              tbl.includedInTraining
                ? 'border-emerald-500/40 bg-emerald-950/10'
                : tbl.tableName === 'ai_knowledge_files' || tbl.tableName === 'line_profiles'
                ? 'border-red-900/40 bg-red-950/10 opacity-80'
                : 'border-gray-800'
            }`}
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-3">
                <h3 className="text-base font-bold font-mono text-white">{tbl.tableName}</h3>
                
                {tbl.includedInTraining ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    ใช้เทรน AI (TRAINING ACTIVE)
                  </span>
                ) : tbl.tableName === 'ai_knowledge_files' || tbl.tableName === 'line_profiles' ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-400 bg-red-500/20 border border-red-500/30 px-2.5 py-0.5 rounded-full">
                    <XCircle className="w-3.5 h-3.5" />
                    ยกเว้นจากการเทรน (EXCLUDED)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-400 bg-gray-800 px-2.5 py-0.5 rounded-full">
                    System Table (LOG / ADMIN)
                  </span>
                )}
              </div>

              <p className="text-xs text-gray-300 font-sans">{tbl.purpose}</p>
              <div className="text-[11px] font-mono text-gray-400 flex items-center gap-1 pt-1">
                <span>หมายเหตุ:</span>
                <span className="text-gray-300">{tbl.statusNotes}</span>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-4 text-xs font-mono text-gray-400">
              <div className="bg-gray-900 px-3 py-2 rounded-xl border border-gray-800 text-right">
                <div className="text-[10px] text-gray-500">จำนวนแถวปัจจุบัน</div>
                <div className="text-sm font-bold text-white">{tbl.recordCount} records</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* SQL Script Display */}
      <div className="glass-panel p-5 rounded-2xl border border-emerald-500/30 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Code className="w-4 h-4 text-emerald-400" />
            {activeDbType === 'supabase' ? 'คำสั่ง SQL สำหรับ Supabase (pgvector Enabled)' : 'คำสั่ง SQL สำหรับ MySQL (JSON Constraint)'}
          </h4>
          <span className="text-xs text-emerald-400 font-mono">
            {activeDbType === 'supabase' ? 'PostgreSQL pgvector' : 'MySQL / MariaDB'}
          </span>
        </div>

        <pre className="bg-gray-950 p-4 rounded-xl font-mono text-xs text-emerald-300/90 overflow-x-auto leading-relaxed border border-gray-800">
{activeDbType === 'supabase' ? `-- 1. เปิดใช้งาน Extension pgvector บน Supabase
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. สร้างตาราง knowledge_base สำหรับเก็บ 384D Vector Embeddings
CREATE TABLE public.knowledge_base (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  category TEXT NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  keywords TEXT,
  vector_array vector(384), -- pgvector format
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ฟังก์ชันค้นหา Cosine Similarity บน Supabase
CREATE OR REPLACE FUNCTION match_knowledge(
  query_embedding vector(384),
  match_threshold float,
  match_count int
)
RETURNS TABLE (id bigint, question text, answer text, similarity float)
LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT kb.id, kb.question, kb.answer,
    1 - (kb.vector_array <=> query_embedding) AS similarity
  FROM public.knowledge_base kb
  WHERE 1 - (kb.vector_array <=> query_embedding) > match_threshold
  ORDER BY kb.vector_array <=> query_embedding LIMIT match_count;
END; $$;` : `-- SQL Table: knowledge_base (MySQL)
CREATE TABLE \`knowledge_base\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`category\` varchar(255) NOT NULL,
  \`question\` text NOT NULL,
  \`answer\` text NOT NULL,
  \`keywords\` text DEFAULT NULL,
  \`vector_array\` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(\`vector_array\`)),
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`}
        </pre>
      </div>
    </div>
  );
};
