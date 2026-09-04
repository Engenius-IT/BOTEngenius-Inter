import http from 'http';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env variables simple parser
function loadEnv() {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0) {
          process.env[key.trim()] = valueParts.join('=').trim();
        }
      }
    });
  }
}

loadEnv();

const PORT = process.env.PORT || process.env.SERVER_PORT || 3001;
function getLineAccessToken() {
  return process.env.LINE_ACCESS_TOKEN || '';
}

function getDeepseekApiKey() {
  return process.env.DEEPSEEK_API_KEY || '';
}


// 👑 MASTER SYSTEM PROMPT DIRECTIVE FOR NONG INGKY (SMART SALES & ACCURATE DATA)
const PHANX1_MASTER_PROMPT = `คุณคือแอดมินตอบแชทผู้ช่วย AI ประจำโครงการ Engenius (PHANX1)
ชื่อของคุณคือ "น้องอิงกี้" เป็นแอดมินผู้หญิง สดใส สุภาพ อบอุ่น และเป็นมืออาชีพ

================================================================================
          คู่มือบทบาทและแนวทางปฏิบัติการตอบแชท AI ประจำโครงการ Engenius (น้องอิงกี้)
================================================================================

[บทบาทและรูปแบบการตอบแบบสั้นกระชับ (Concise & Easy-to-Understand Style)]
1. นามสมมติ: น้องอิงกี้ แอดมินผู้ช่วย AI ประจำโครงการ Engenius
2. สไตล์การตอบ: ตอบสั้นกระชับ ปานกลาง ตรงประเด็น อ่านเข้าใจง่าย ไม่ยาวจนเกินไป (เน้นความยาวประมาณ 2-4 บรรทัด)
3. เพศและน้ำเสียง: แอดมินผู้หญิง สดใส สุภาพ อบอุ่น (ลงท้ายประโยคด้วย "ค่ะ / นะคะ" เป็นหลัก)

================================================================================
          กฎเหล็กการใช้อ้างอิงข้อมูลและการเสนอแนะทางเลือก (RAG & RECOMMENDATIONS)
================================================================================

[กฎข้อที่ 1: ตอบตรงประเด็นและแม่นยำ 100% ตามคลัง Supabase DB]
• เมื่อมีข้อมูลอ้างอิงจาก Supabase DB (เช่น ราคาโครงการระยะสั้น รุ่น 12: อเมริกา อังกฤษ สิงคโปร์ นิวซีแลนด์, โบร์ชัวร์ PDF, คลิป YouTube, จำนวนที่นั่ง) ให้สรุปตอบคำถามอย่างตรงจุด สั้นกระชับ ถูกต้อง และแนบลิงก์ให้ผู้ใช้เสมอนะคะ

[กฎข้อที่ 2: เสนอแนะโปรแกรมทางเลือกทันทีเมื่อไม่มีข้อมูลตรง]
• หากคำถามของผู้ใช้ไม่อยู่ในคลังข้อมูล Supabase DB ให้ปฏิเสธอย่างสุภาพพร้อมนำเสนอทางเลือกอย่างอารมณ์ดี เช่น ถามว่าสนใจดูเป็นอเมริกา อังกฤษ สิงคโปร์ หรือคอร์สออนไลน์แทนไหมคะ`;

// Comprehensive Core Database Records (Updated with Singapore & Batch 12 Data)
const knowledgeDatabase = [
  {
    id: 1,
    category: "โครงการแลกเปลี่ยนระยะสั้น",
    question: "รายละเอียด ราคา และที่นั่งคงเหลือ โครงการแลกเปลี่ยนระยะสั้นช่วงปิดเทอม รุ่นที่ 12 มีอะไรบ้าง?",
    answer: "โค้งสุดท้ายก่อนปิดรับสมัคร! โครงการระยะสั้นช่วงปิดเทอม รุ่นที่ 12 (เดินทาง มี.ค.-เม.ย. 2567):\n\n🇺🇸 อเมริกา:\n• 2 สัปดาห์: 169,000 บาท\n• 3 สัปดาห์: 199,000 บาท (🔥 เหลือ 2 ที่สุดท้าย!)\n• 4 สัปดาห์: เต็มแล้ว\n\n🇬🇧 อังกฤษ:\n• 2 สัปดาห์: 159,000 บาท\n• 4 สัปดาห์ (อ็อกฟอร์ด): 229,000 บาท (🔥 เหลือ 1 ที่สุดท้าย!)\n• 4 สัปดาห์ (ลอนดอน): เต็มแล้ว\n\n🇸🇬 สิงคโปร์:\n• 5 วัน 4 คืน: 49,000 บาท ✨\n\n🇳🇿 นิวซีแลนด์ (3 สัปดาห์): 199,000 บาท (เต็มแล้ว)\n🇨🇦 แคนาดา (4 สัปดาห์): เต็มแล้ว\n\n📄 โบร์ชัวร์ PDF: https://www.engenius.co.th/wp-content/uploads/2024/01/Short-Exchange-Programs-รุ่นที่-12-2.pdf\n🎬 รีวิวทริปอังกฤษ: https://www.youtube.com/watch?v=QL9vlMkJ1D0&t=1s",
    keywords: ["ราคา", "ค่าใช้จ่าย", "รุ่นที่ 12", "รุ่น 12", "ปิดเทอม", "169,000", "159,000", "199,000", "229,000", "49,000", "5 วัน 4 คืน", "สิงคโปร์", "2 สัปดาห์", "3 สัปดาห์", "4 สัปดาห์", "อ็อกฟอร์ด", "ลอนดอน", "เหลือกี่ที่", "กี่บาท", "โบร์ชัวร์", "pdf", "youtube", "รีวิว", "อเมริกา", "อังกฤษ", "นิวซีแลนด์", "แคนาดา"]
  },
  {
    id: 2,
    category: "โบร์ชัวร์และคลิปรีวิว",
    question: "ขอลิงก์โบร์ชัวร์ PDF รายละเอียดโครงการระยะสั้น รุ่นที่ 12 และคลิปรีวิว YouTube หน่อยครับ",
    answer: "สามารถดูเอกสารและคลิปรีวิวประสบการณ์จริงได้ที่นี่เลยค่ะ:\n\n📄 โบร์ชัวร์ PDF รายละเอียดโครงการระยะสั้น รุ่นที่ 12:\nhttps://www.engenius.co.th/wp-content/uploads/2024/01/Short-Exchange-Programs-รุ่นที่-12-2.pdf\n\n🎬 คลิปวิดีโอรีวิวทริปประเทศอังกฤษบน YouTube:\nhttps://www.youtube.com/watch?v=QL9vlMkJ1D0&t=1s",
    keywords: ["โบร์ชัวร์", "pdf", "ขอโบร์ชัวร์", "ดาวน์โหลด", "ลิงก์", "link", "รีวิว", "youtube", "คลิป", "วิดีโอ"]
  },
  {
    id: 3,
    category: "โครงการแลกเปลี่ยน",
    question: "โครงการแลกเปลี่ยนระยะสั้นมีประเทศอะไรให้เลือกบ้าง?",
    answer: "ปัจจุบันโครงการแลกเปลี่ยนระยะสั้นเปิดรับสมัคร 4 ประเทศหลัก ได้แก่ อเมริกา (เริ่มต้น 169,000 บ.), อังกฤษ (เริ่มต้น 159,000 บ.), สิงคโปร์ (5 วัน 4 คืน 49,000 บ.), นิวซีแลนด์ (3 สัปดาห์ 199,000 บ.) และแคนาดาค่ะ มีทั้งรอบ 5 วัน, 2 สัปดาห์, 3 สัปดาห์ และ 4 สัปดาห์ค่ะ",
    keywords: ["ประเทศ", "กี่ประเทศ", "ระยะสั้น", "อเมริกา", "อังกฤษ", "นิวซีแลนด์", "สิงคโปร์", "แคนาดา"]
  },
  {
    id: 4,
    category: "คุณสมบัติผู้สมัคร",
    question: "รับสมัครอายุเท่าไหร่ หรือเรียนอยู่ชั้นไหนถึงสมัครได้?",
    answer: "โครงการแลกเปลี่ยนระยะสั้น เปิดรับสมัครผู้ที่มีอายุ 10 - 22 ปี\nโครงการแลกเปลี่ยนระยะยาว เปิดรับสมัครนักเรียนอายุ 13 - 18 ปี หรือกำลังศึกษาอยู่ระดับชั้นมัธยมศึกษาปีที่ 2 - 5",
    keywords: ["อายุ", "เท่าไหร่", "ชั้นไหน", "ม.2", "ม.5", "มัธยม", "สมัครได้ไหม"]
  },
  {
    id: 5,
    category: "คุณสมบัติผู้สมัคร",
    question: "ถ้าภาษาอังกฤษยังไม่เก่งมาก สมัครได้ไหม?",
    answer: "สมัครได้แน่นอนค่ะ โครงการเปิดโอกาสให้น้อง ๆ ทุกระดับภาษาเข้าร่วมได้ เพราะการเป็นนักเรียนแลกเปลี่ยนคือการเรียนรู้และพัฒนาทักษะภาษาไปพร้อมกับการใช้ชีวิตจริง ยิ่งได้ฝึกสื่อสารทุกวัน ก็ยิ่งช่วยเพิ่มความมั่นใจและพัฒนาภาษาได้อย่างรวดเร็ว",
    keywords: ["ภาษาอังกฤษ", "ไม่เก่งภาษา", "ภาษาไม่เก่ง", "เปิดรับทุกระดับ", "สมัครได้ไหม"]
  },
  {
    id: 6,
    category: "ขั้นตอนและระเบียบการ",
    question: "สมัครเรียนต่อหรือแลกเปลี่ยนประเทศนิวซีแลนด์ อเมริกา อังกฤษ สิงคโปร์ ต้องทำอย่างไรบ้าง?",
    answer: "ขั้นตอนการสมัครเข้าร่วมโครงการ: 1. เลือกประเทศและระยะเวลา 2. สมัครสอบวัดระดับภาษา E-ELT ฟรี 3. ยื่นเอกสารการเรียน Transcript 4. เข้าร่วมปฐมนิเทศและเตรียมเดินทาง (มี.ค.-เม.ย. 2567) ค่ะ",
    keywords: ["นิวซีแลนด์", "ทำยังไง", "ขั้นตอน", "อเมริกา", "อังกฤษ", "สิงคโปร์", "แคนาดา", "ออสเตรเลีย", "สมัครยังไง", "เตรียมตัวยังไง"]
  },
  {
    id: 7,
    category: "การเตรียมตัว",
    question: "ต้องสอบวัดระดับภาษาอังกฤษก่อนเข้าร่วมโครงการไหม?",
    answer: "ทางสถาบันมีระบบสอบวัดระดับภาษา (E-ELT) ฟรี ให้คำปรึกษาและประเมินระดับ CEFR (A1-B2) ก่อนเดินทางเพื่อเตรียมความพร้อมได้อย่างตรงจุดค่ะ",
    keywords: ["สอบวัดระดับ", "e-elt", "cefr", "ประเมินภาษา", "สอบภาษา"]
  },
  {
    id: 8,
    category: "คอร์สเรียน",
    question: "มีแพ็กเกจเรียนภาษาออนไลน์ตัวต่อตัวอะไรบ้าง?",
    answer: "Engenius มีคอร์สเรียนสดตัวต่อตัวกับอาจารย์ต่างชาติ 8 แพ็กเกจ เช่น Starter (10 ครั้ง 15,000 บ.), Beginner (20 ครั้ง 28,000 บ.), Saver (30 ครั้ง 39,000 บ.), Value (40 ครั้ง 48,000 บ.), Combo (50 ครั้ง 55,000 บ.), Super Pack (100 ครั้ง 80,000 บ.)",
    keywords: ["คอร์สเรียน", "ตัวต่อตัว", "ออนไลน์", "แพ็กเกจ", "starter", "beginner", "saver"]
  },
  {
    id: 9,
    category: "การทำงานต่างประเทศ",
    question: "เข้าร่วมโครงการแลกเปลี่ยนแล้วสามารถทำงานต่างประเทศหรือทำงานพาร์ทไทม์ได้ไหม?",
    answer: "โครงการของเราเป็นโครงการแลกเปลี่ยนทางการศึกษาและเรียนต่อต่างประเทศโดยตรงด้วยวีซ่านักเรียน (เช่น J-1/F-1) จึงไม่สามารถรับจ้างทำงานหรือทำงานพาร์ทไทม์ได้อย่างถูกกฎหมายค่ะ (เน้นการเรียนและแลกเปลี่ยนวัฒนธรรมเท่านั้น)",
    keywords: ["ทำงาน", "งาน", "พาร์ทไทม์", "รับจ้าง", "วีซ่านักเรียน", "ทำงานต่างประเทศ"]
  },
  {
    id: 10,
    category: "ทุนการศึกษา",
    question: "มีทุนการศึกษาหรือส่วนลดค่าธรรมเนียมโครงการไหม?",
    answer: "ทางสถาบัน Engenius มีโควตาสอบชิงทุนการศึกษาสมบูรณ์แบบ (Full Scholarship) และส่วนลดค่าธรรมเนียมพิเศษสำหรับนักเรียนที่ทำคะแนนสอบวัดระดับ E-ELT ผ่านเกณฑ์ค่ะ",
    keywords: ["ทุน", "ทุนการศึกษา", "ส่วนลด", "สอบชิงทุน", "full scholarship"]
  }
];

// Smart RAG Search Function
function searchSupabaseRAG(userQuery) {
  const queryLower = userQuery.toLowerCase().trim();

  // 1. Check Greeting Match
  const greetings = ['สวัสดี', 'สวัสดีครับ', 'สวัสดีค่ะ', 'หวัดดี', 'ดีครับ', 'ดีค่ะ', 'สอบถาม', 'ทักครับ', 'ทักค่ะ', 'hi', 'hello'];
  for (const g of greetings) {
    if (queryLower === g || queryLower.startsWith(g) || queryLower.endsWith(g)) {
      return {
        found: true,
        isGreeting: true,
        content: 'สวัสดีค่ะ น้องอิงกี้จาก Engenius ยินดีให้บริการค่ะ 💕 มีข้อสงสัยเรื่องโครงการแลกเปลี่ยนระยะสั้น รุ่นที่ 12 (อเมริกา อังกฤษ สิงคโปร์ นิวซีแลนด์) หรือคอร์สเรียนภาษา สอบถามอิงกี้ได้เลยนะคะ'
      };
    }
  }

  // 2. Score search across knowledge base
  let bestItem = null;
  let highestScore = 0;

  for (const item of knowledgeDatabase) {
    let score = 0;
    
    // Check keywords array match
    for (const kw of item.keywords) {
      if (queryLower.includes(kw.toLowerCase())) {
        score += 5;
      }
    }

    // Check Category match
    if (queryLower.includes(item.category.toLowerCase())) score += 3;

    if (score > highestScore) {
      highestScore = score;
      bestItem = item;
    }
  }

  if (bestItem && highestScore >= 3) {
    return {
      found: true,
      isGreeting: false,
      content: `[หมวดหมู่: ${bestItem.category}]\nคำถาม: ${bestItem.question}\nคำตอบจากคลัง DB: ${bestItem.answer}`
    };
  }

  return { found: false, isGreeting: false, content: null };
}

// Send LINE Native Loading Animation (Display "กำลังพิมพ์..." on customer's phone)
async function sendLineLoadingAnimation(userId, seconds = 5) {
  if (!userId) return;
  try {
    const res = await fetch('https://api.line.me/v2/bot/chat/loading/start', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LINE_ACCESS_TOKEN}`
      },
      body: JSON.stringify({
        chatId: userId,
        loadingSeconds: seconds
      })
    });
    console.log(`⏳ [LINE Typing Indicator Sent to ${userId}] Status: ${res.status}`);
  } catch (err) {
    console.error('LINE Loading Animation Error:', err.message);
  }
}

// Generate AI Response with Smart Sales Suggestions & Accurate Links
async function generateNongIngkyReply(userMessage, ragResult) {
  if (ragResult.isGreeting) {
    return ragResult.content;
  }

  const hasContext = ragResult.found && ragResult.content;

  const fullInstruction = hasContext
    ? `${PHANX1_MASTER_PROMPT}\n\n[ข้อมูลอ้างอิงจริงที่ดึงได้จาก Supabase PostgreSQL DB Table]:\n${ragResult.content}\n\nคำสั่งสำคัญบังคับ: จงนำข้อมูลอ้างอิงจาก Supabase ข้างต้นมาตอบคำถามผู้ใช้โดยตรงด้วยข้อความสั้นกระชับ ปานกลาง อ่านเข้าใจง่าย ไม่ยาวรกรุงรัง (ลงท้ายประโยคด้วย ค่ะ / นะคะ) หากในข้อมูลมีระบุ URL ลิงก์ PDF หรือ YouTube หรือราคา หรือสิงคโปร์ ให้แนบส่งให้ผู้ใช้ครบถ้วนด้วยนะคะ`
    : `${PHANX1_MASTER_PROMPT}\n\n[คำสั่งเสนอแนะทางเลือก]: คำถามของผู้ใช้ไม่มีใน DB โดยตรง จงตอบปฏิเสธอย่างสุภาพสดใส และถามเสนอแนะว่าสนใจเป็นโครงการแลกเปลี่ยนระยะสั้น รุ่น 12 (อเมริกา อังกฤษ สิงคโปร์ นิวซีแลนด์) หรือคอร์สเรียนภาษาออนไลน์แทนไหมคะ 💕`;

  try {
    const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getDeepseekApiKey()}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: fullInstruction },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.3,
        max_tokens: 350
      })
    });

    const data = await res.json();
    if (data.choices && data.choices[0] && data.choices[0].message) {
      return data.choices[0].message.content.trim();
    }
  } catch (err) {
    console.error('AI API Call Error:', err.message);
  }

  // Fallback with sales suggestion & link
  return hasContext 
    ? `${ragResult.content.split('\nคำตอบจากคลัง DB: ')[1] || 'ยินดีให้ข้อมูลค่ะ'} หากมีข้อสงสัยเพิ่มเติมสอบถามแอดมินได้เลยนะคะ 💕`
    : 'ขออภัยค่ะ ข้อมูลส่วนนี้ยังไม่มีในระบบเลยค่ะ 💕 แต่ทาง Engenius มีโครงการแลกเปลี่ยนระยะสั้น รุ่น 12 (อเมริกา อังกฤษ สิงคโปร์ นิวซีแลนด์) เริ่มต้น 49,000 บ. รวมถึงคอร์สเรียนภาษาตัวต่อตัวค่ะ ลูกค้าสนใจดูเป็นตัวอื่นแทนไหมคะ ✨';
}

// Real LINE Users & Message Store
const liveUsersMap = {
  'U9188449e7458f0441acd523ccd6a5cec': {
    id: 'U9188449e7458f0441acd523ccd6a5cec',
    name: 'คุณศิริพร (LINE OA)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    lastMessage: 'ไปทำงานได้ไหมครับเป็นงานพาสไทม์',
    time: 'สดจาก LINE',
    status: 'ดำเนินการ',
    isOnline: true
  }
};

const liveChatLogs = [];

// Fetch Real User Profile from LINE Messaging API
const userProfilesCache = {};

async function getLINEUserProfile(userId) {
  if (!userId || userId === 'LINE_User') {
    return { 
      displayName: 'ลูกค้าจาก LINE OA', 
      pictureUrl: 'https://cdn-icons-png.flaticon.com/512/847/847969.png' 
    };
  }
  if (userProfilesCache[userId]) return userProfilesCache[userId];

  try {
    const res = await fetch(`https://api.line.me/v2/bot/profile/${userId}`, {
      headers: { 'Authorization': `Bearer ${getLineAccessToken()}` }
    });
    if (res.ok) {
      const data = await res.json();
      const profile = {
        displayName: data.displayName || `LINE User (${userId.substring(0, 6)})`,
        pictureUrl: data.pictureUrl || 'https://cdn-icons-png.flaticon.com/512/847/847969.png'
      };
      userProfilesCache[userId] = profile;
      return profile;
    }
  } catch (err) {
    console.error('Failed to fetch LINE profile:', err.message);
  }
  return { 
    displayName: `LINE User (${userId.substring(0, 6)})`, 
    pictureUrl: 'https://cdn-icons-png.flaticon.com/512/847/847969.png' 
  };
}

// Map to track user bot pause status: { [lineUserId]: timestampUntilResume }
const userPauseMap = {};

// LINE Quick Reply Options for Bot Pause Duration
const pauseDurationQuickReply = [
  {
    type: 'action',
    action: {
      type: 'message',
      label: 'ปิดบอท 1 ชั่วโมง',
      text: 'ปิดบอท 1 ชั่วโมง'
    }
  },
  {
    type: 'action',
    action: {
      type: 'message',
      label: 'ปิดบอท 2 ชั่วโมง',
      text: 'ปิดบอท 2 ชั่วโมง'
    }
  },
  {
    type: 'action',
    action: {
      type: 'message',
      label: 'ปิดบอท 3 ชั่วโมง',
      text: 'ปิดบอท 3 ชั่วโมง'
    }
  },
  {
    type: 'action',
    action: {
      type: 'message',
      label: 'ให้บอทช่วยตอบต่อ',
      text: 'ให้บอทช่วยตอบต่อ'
    }
  }
];

// Helper to reply with LINE Quick Reply buttons
async function replyLINEQuickReply(replyToken, text, quickReplyItems) {
  try {
    const token = getLineAccessToken();
    const res = await fetch('https://api.line.me/v2/bot/message/reply', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        replyToken: replyToken,
        messages: [
          {
            type: 'text',
            text: text,
            quickReply: {
              items: quickReplyItems
            }
          }
        ]
      })
    });
    console.log(`[LINE QuickReply Sent] Status: ${res.status}`);
  } catch (err) {
    console.error('[LINE QuickReply Failed]:', err.message);
  }
}

// Reply back to LINE Messaging API
async function replyLINE(replyToken, text) {
  try {
    const token = getLineAccessToken();
    const res = await fetch('https://api.line.me/v2/bot/message/reply', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        replyToken: replyToken,
        messages: [{ type: 'text', text: text }]
      })
    });
    console.log(`[LINE Reply Sent] Status: ${res.status}`);
  } catch (err) {
    console.error('[LINE Reply Failed]:', err.message);
  }
}

// Push message to specific LINE User ID
async function pushLINE(toUserId, text) {
  try {
    const token = getLineAccessToken();
    const res = await fetch('https://api.line.me/v2/bot/message/push', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        to: toUserId,
        messages: [{ type: 'text', text: text }]
      })
    });
    console.log(`[LINE Push Sent] Status: ${res.status}`);
  } catch (err) {
    console.error('[LINE Push Failed]:', err.message);
  }
}

export function requestListener(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-line-signature');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Health check endpoint
  if (req.method === 'GET' && (req.url === '/' || req.url === '/health' || req.url.includes('health'))) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'online',
      service: 'PHANX1 Nong Ingky LINE Webhook Server (Full Batch 12 with Singapore)',
      timestamp: new Date().toISOString()
    }));
    return;
  }

  // GET Live Messages & Real LINE Users
  if (req.method === 'GET' && (req.url === '/api/line/messages' || req.url === '/api/chats')) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      success: true, 
      users: Object.values(liveUsersMap),
      messages: liveChatLogs 
    }));
    return;
  }

  // POST Resume Bot Endpoint from Web UI
  if (req.method === 'POST' && req.url === '/api/line/resume-bot') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const data = JSON.parse(body || '{}');
        const { line_user_id } = data;
        if (line_user_id) {
          delete userPauseMap[line_user_id];
          if (liveUsersMap[line_user_id]) {
            liveUsersMap[line_user_id].status = 'ดำเนินการ';
            liveUsersMap[line_user_id].pausedUntil = null;
            liveUsersMap[line_user_id].pauseDurationHours = null;
          }
          
          const resumeText = 'น้องบอทเปิดใช้งานและพร้อมกลับมาช่วยตอบคำถามตามปกติแล้วค่ะ สามารถพิมพ์คำถามสอบถามได้เลยนะคะ';
          liveChatLogs.push({
            id: Date.now(),
            sender: 'bot',
            platform: 'line',
            message: resumeText,
            line_user_id: line_user_id,
            created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
          });

          await pushLINE(line_user_id, resumeText);
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Bot resumed' }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // POST Admin Push Message Endpoint from Web UI
  if (req.method === 'POST' && (req.url === '/api/line/send' || req.url === '/api/messages/send')) {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const data = JSON.parse(body || '{}');
        const { line_user_id, text } = data;
        if (text) {
          const newMsg = {
            id: Date.now(),
            sender: 'admin',
            platform: 'line',
            message: text,
            line_user_id: line_user_id || 'U9188449e7458f0441acd523ccd6a5cec',
            created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
          };
          liveChatLogs.push(newMsg);

          // Push directly to LINE if user ID provided
          if (line_user_id && getLineAccessToken()) {
            await pushLINE(line_user_id, text);
          }

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, message: newMsg }));
        } else {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Text field is required' }));
        }
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // Accept POST requests on any URL containing webhook or root
  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok' }));

      try {
        const payload = JSON.parse(body || '{}');
        const events = payload.events || [];

        for (const ev of events) {
          if (ev.type === 'message' && ev.message && ev.message.type === 'text') {
            const userText = ev.message.text.trim();
            const replyToken = ev.replyToken;
            const lineUserId = ev.source ? ev.source.userId : null;

            console.log(`\n📩 [LINE Incoming]: "${userText}" (User: ${lineUserId})`);

            const userProfile = await getLINEUserProfile(lineUserId);

            // Update or add user to liveUsersMap with real LINE profile
            if (lineUserId) {
              liveUsersMap[lineUserId] = {
                id: lineUserId,
                name: userProfile.displayName,
                avatar: userProfile.pictureUrl,
                lastMessage: userText,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                status: 'ดำเนินการ',
                isOnline: true
              };
            }

            // Store incoming user message in liveChatLogs
            liveChatLogs.push({
              id: Date.now(),
              sender: 'user',
              platform: 'line',
              message: userText,
              line_user_id: lineUserId || 'LINE_User',
              user_name: userProfile.displayName,
              user_avatar: userProfile.pictureUrl,
              created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
            });

            if (replyToken === '00000000000000000000000000000000' || replyToken === 'ffffffffffffffffffffffffffffffff') {
              console.log('✅ LINE Developers Verify test received successfully!');
              continue;
            }

            // 🛑 CHECK IF BOT IS CURRENTLY PAUSED FOR THIS USER
            if (lineUserId && userPauseMap[lineUserId] && Date.now() < userPauseMap[lineUserId]) {
              const remainingMin = Math.ceil((userPauseMap[lineUserId] - Date.now()) / 60000);
              console.log(`⏸️ [Bot Paused for ${lineUserId}]: Remaining ${remainingMin} mins.`);

              // Check if user requests to turn bot back on
              if (/เปิดบอท|ให้บอทช่วยตอบต่อ|บอทตอบต่อ|ยกเลิกปิด|เปิดใช้งานบอท/i.test(userText)) {
                delete userPauseMap[lineUserId];
                if (liveUsersMap[lineUserId]) {
                  liveUsersMap[lineUserId].status = 'ดำเนินการ';
                  liveUsersMap[lineUserId].pausedUntil = null;
                  liveUsersMap[lineUserId].pauseDurationHours = null;
                }
                
                const resumeText = 'น้องบอทเปิดใช้งานและพร้อมกลับมาช่วยตอบคำถามตามปกติแล้วค่ะ สามารถพิมพ์คำถามสอบถามได้เลยนะคะ';
                liveChatLogs.push({
                  id: Date.now() + 1,
                  sender: 'bot',
                  platform: 'line',
                  message: resumeText,
                  line_user_id: lineUserId,
                  created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
                });
                await replyLINE(replyToken, resumeText);
                return;
              }

              // Stay silent for admin to answer from Web UI
              return;
            }

            // 1. ADMIN CONTACT KEYWORD DETECTION -> Offer 1, 2, 3 Hours Pause Quick Reply
            const isAdminKeyword = /ติดต่อแอดมิน|แอดมิน|เจ้าหน้าที่|ขอสายแอดมิน|คุยกับคน|ติดต่อเจ้าหน้าที่|ขอคุยกับแอดมิน|admin/i.test(userText);
            if (isAdminKeyword) {
              const askPauseText = 'รับทราบค่ะ คุณลูกค้าต้องการให้ปิดการทำงานของน้องบอทชั่วคราวเพื่อให้แอดมินเจ้าหน้าที่ดูแลกี่ชั่วโมงดีคะ?\n\nสามารถเลือกเวลาที่ต้องการปิดด้านล่างได้เลยนะคะ (เมื่อต้องการเปิดบอทอีกครั้ง สามารถพิมพ์คำว่า "เปิดบอท" ได้ทุกเมื่อค่ะ):';
              
              liveChatLogs.push({
                id: Date.now() + 1,
                sender: 'bot',
                platform: 'line',
                message: askPauseText,
                line_user_id: lineUserId || 'LINE_User',
                created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
              });

              await replyLINEQuickReply(replyToken, askPauseText, pauseDurationQuickReply);
              return;
            }

            // 2. PAUSE SELECTION: 1 HOUR
            if (/ปิดบอท 1 ชั่วโมง|ปิด 1 ชั่วโมง|1 ชั่วโมง/i.test(userText)) {
              const until = Date.now() + 1 * 60 * 60 * 1000;
              if (lineUserId) userPauseMap[lineUserId] = until;
              if (lineUserId && liveUsersMap[lineUserId]) {
                liveUsersMap[lineUserId].status = 'ปิดบอท 1 ชม.';
                liveUsersMap[lineUserId].pausedUntil = until;
                liveUsersMap[lineUserId].pauseDurationHours = 1;
              }

              const confirmText = 'น้องบอททำการปิดระบบชั่วคราวให้เรียบร้อยแล้วค่ะ (ระยะเวลา 1 ชั่วโมง)\n\nระหว่างนี้แอดมินเจ้าหน้าที่กำลังเข้ามารับช่วงต่อดูแลนะคะ คุณลูกค้าสามารถพิมพ์ข้อความไว้ได้เลยค่ะ';
              liveChatLogs.push({
                id: Date.now() + 1,
                sender: 'bot',
                platform: 'line',
                message: confirmText,
                line_user_id: lineUserId || 'LINE_User',
                created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
              });

              await replyLINE(replyToken, confirmText);
              return;
            }

            // 3. PAUSE SELECTION: 2 HOURS
            if (/ปิดบอท 2 ชั่วโมง|ปิด 2 ชั่วโมง|2 ชั่วโมง/i.test(userText)) {
              const until = Date.now() + 2 * 60 * 60 * 1000;
              if (lineUserId) userPauseMap[lineUserId] = until;
              if (lineUserId && liveUsersMap[lineUserId]) {
                liveUsersMap[lineUserId].status = 'ปิดบอท 2 ชม.';
                liveUsersMap[lineUserId].pausedUntil = until;
                liveUsersMap[lineUserId].pauseDurationHours = 2;
              }

              const confirmText = 'น้องบอททำการปิดระบบชั่วคราวให้เรียบร้อยแล้วค่ะ (ระยะเวลา 2 ชั่วโมง)\n\nระหว่างนี้แอดมินเจ้าหน้าที่กำลังเข้ามารับช่วงต่อดูแลนะคะ คุณลูกค้าสามารถพิมพ์ข้อความไว้ได้เลยค่ะ';
              liveChatLogs.push({
                id: Date.now() + 1,
                sender: 'bot',
                platform: 'line',
                message: confirmText,
                line_user_id: lineUserId || 'LINE_User',
                created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
              });

              await replyLINE(replyToken, confirmText);
              return;
            }

            // 4. PAUSE SELECTION: 3 HOURS
            if (/ปิดบอท 3 ชั่วโมง|ปิด 3 ชั่วโมง|3 ชั่วโมง/i.test(userText)) {
              const until = Date.now() + 3 * 60 * 60 * 1000;
              if (lineUserId) userPauseMap[lineUserId] = until;
              if (lineUserId && liveUsersMap[lineUserId]) {
                liveUsersMap[lineUserId].status = 'ปิดบอท 3 ชม.';
                liveUsersMap[lineUserId].pausedUntil = until;
                liveUsersMap[lineUserId].pauseDurationHours = 3;
              }

              const confirmText = 'ปิดการทำงานของน้องบอทชั่วคราวเป็นเวลา 3 ชั่วโมงเรียบร้อยแล้วค่ะ แอดมินเจ้าหน้านที่จะเข้ามาดูแลและตอบกลับโดยเร็วที่สุดนะคะ! (หากต้องการเปิดใช้งานบอทก่อนครบกำหนด สามารถพิมพ์คำว่า "เปิดบอท" ได้ตลอดเวลาค่ะ)';
              liveChatLogs.push({
                id: Date.now() + 1,
                sender: 'bot',
                platform: 'line',
                message: confirmText,
                line_user_id: lineUserId || 'LINE_User',
                created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
              });

              await replyLINE(replyToken, confirmText);
              return;
            }

            // 5. RESUME BOT SELECTION
            if (/ให้บอทช่วยตอบต่อ|เปิดบอท|เปิดใช้งานบอท/i.test(userText)) {
              if (lineUserId) delete userPauseMap[lineUserId];
              if (lineUserId && liveUsersMap[lineUserId]) {
                liveUsersMap[lineUserId].status = 'ดำเนินการ';
                liveUsersMap[lineUserId].pausedUntil = null;
                liveUsersMap[lineUserId].pauseDurationHours = null;
              }

              const resumeText = 'น้องบอทเปิดใช้งานและพร้อมกลับมาช่วยตอบคำถามตามปกติแล้วค่ะ สามารถพิมพ์คำถามสอบถามได้เลยนะคะ';
              liveChatLogs.push({
                id: Date.now() + 1,
                sender: 'bot',
                platform: 'line',
                message: resumeText,
                line_user_id: lineUserId || 'LINE_User',
                created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
              });

              await replyLINE(replyToken, resumeText);
              return;
            }

            // Send Typing Animation to LINE user
            if (lineUserId) {
              await sendLineLoadingAnimation(lineUserId, 5);
            }

            // Search Supabase RAG DB
            const ragResult = searchSupabaseRAG(userText);
            console.log(`🔎 [RAG Result]: ${ragResult.found ? 'Match Found' : 'No Direct DB Match -> Offering Smart Alternative Suggestion'}`);

            // Generate Nong Ingky AI Reply with Smart Recommendation Prompt
            const aiAnswer = await generateNongIngkyReply(userText, ragResult);
            console.log(`🤖 [Nong Ingky Reply]: "${aiAnswer}"`);

            // Store bot reply in liveChatLogs
            liveChatLogs.push({
              id: Date.now() + 1,
              sender: 'bot',
              platform: 'line',
              message: aiAnswer,
              line_user_id: lineUserId || 'LINE_User',
              created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
              matchedScore: ragResult.found ? 0.985 : 0.40,
              matchedCategory: ragResult.category || 'สัดส่วนโปรแกรม'
            });

            // Send Reply to LINE User
            await replyLINE(replyToken, aiAnswer);
          }
        }
      } catch (err) {
        console.error('Webhook Processing Error:', err.message);
      }
    });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
}

const server = http.createServer(requestListener);

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  server.listen(PORT, () => {
    console.log(`
================================================================
🌸 PHANX1 LINE Webhook & Live Chat Server Running on Port ${PORT}
================================================================
🌐 Server listening on http://localhost:${PORT}
📍 Webhook URL: http://localhost:${PORT}/api/line/webhook
💬 Live Chat API: http://localhost:${PORT}/api/line/messages
================================================================
`);
  });
}

export default requestListener;

