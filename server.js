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
          const rawValue = valueParts.join('=').trim();
          process.env[key.trim()] = rawValue.replace(/^(['"])(.*)\1$/, '$2');
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

function getDeepseekModel() {
  return process.env.DEEPSEEK_MODEL || 'deepseek-chat';
}

const missingRuntimeEnv = ['LINE_ACCESS_TOKEN', 'DEEPSEEK_API_KEY']
  .filter((key) => !process.env[key]);
if (missingRuntimeEnv.length > 0) {
  console.error(`[Config] Missing required environment variables: ${missingRuntimeEnv.join(', ')}`);
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
4. แนวทางชวนคุย: ตอบสิ่งที่ลูกค้าถามให้ชัดก่อน แล้วชวนคุยต่อด้วยคำถามเดียวที่เกี่ยวข้องเมื่อช่วยแนะนำได้ ไม่ถามซ้ำหรือกดดันให้สมัคร

================================================================================
          กฎเหล็กการใช้อ้างอิงข้อมูลและการเสนอแนะทางเลือก (RAG & RECOMMENDATIONS)
================================================================================

[กฎข้อที่ 1: ตอบตรงประเด็นและแม่นยำ 100% ตามคลัง Supabase DB]
• เมื่อมีข้อมูลอ้างอิงจาก Supabase DB (เช่น ราคาโครงการระยะสั้น รุ่น 20: อเมริกา 249k, อังกฤษ 249k, นิวซีแลนด์ 229k, แคนาดา 249k, สิงคโปร์ 49k, Work and Travel USA 2027, ทุนการศึกษา และกำหนดการ) ให้สรุปตอบคำถามอย่างตรงจุด สั้นกระชับ ถูกต้อง และแจ้งรายละเอียดที่ถูกต้องเสมอนะคะ

[กฎข้อที่ 2: เสนอแนะโปรแกรมทางเลือกทันทีเมื่อไม่มีข้อมูลตรง]
• หากคำถามของผู้ใช้ไม่อยู่ในคลังข้อมูล Supabase DB ให้ปฏิเสธอย่างสุภาพพร้อมนำเสนอทางเลือกอย่างอารมณ์ดี เช่น โครงการแลกเปลี่ยนระยะสั้น รุ่น 20, Work and Travel USA 2027 หรือคอร์สเรียนภาษาออนไลน์ค่ะ`;

// Comprehensive Core Database Records (Updated with Batch 20 Data)
const knowledgeDatabase = [
  {
    id: 1,
    category: "โครงการแลกเปลี่ยนระยะสั้น",
    question: "รายละเอียด ราคา กำหนดการเดินทาง และเงื่อนไขโครงการแลกเปลี่ยนระยะสั้น รุ่นที่ 20 มีอะไรบ้าง?",
    answer: "โครงการแลกเปลี่ยนภาษาและวัฒนธรรมระยะสั้น รุ่นที่ 20 (เดินทางช่วง เม.ย. - พ.ค. 2570):\n\n🇺🇸 1. อเมริกา (แคลิฟอร์เนีย 4 สัปดาห์ | 3 เม.ย. - 2 พ.ค. 70): 249,000 บาท\n🇬🇧 2. อังกฤษ (ลอนดอน 4 สัปดาห์ | 3 เม.ย. - 2 พ.ค. 70): 249,000 บาท\n🇳🇿 3. นิวซีแลนด์ (โอ๊คแลนด์ 3 สัปดาห์ | 17 เม.ย. - 9 พ.ค. 70): 229,000 บาท\n🇨🇦 4. แคนาดา (แวนคูเวอร์ 4 สัปดาห์ | 3 เม.ย. - 2 พ.ค. 70): 249,000 บาท\n🇸🇬 5. สิงคโปร์ (5 วัน 4 คืน | 19 - 23 เม.ย. 70): 49,000 บาท\n\n📄 โบร์ชัวร์ PDF รายละเอียดโครงการรุ่นที่ 20: https://engenius.co.th/wp-content/uploads/2026/06/Short-Exchange-Programs-%E0%B8%A3%E0%B8%B8%E0%B9%88%E0%B8%99%E0%B8%97%E0%B8%B5%E0%B9%88-20-April-2027-.pdf\n✨ สมัครรอบปกติได้ทันทีไม่ต้องสอบ ชำระงวดที่ 1 เพื่อยืนยันสิทธิ์ (49,000 บ. / สิงคโปร์ 19,000 บ.) จนกว่าโควตาจะเต็มค่ะ\n📞 สอบถามเพิ่มเติม โทร. 02-117-4742 | LINE: @engenius",
    keywords: ["ราคา", "ค่าใช้จ่าย", "รุ่นที่ 20", "รุ่น 20", "ปิดเทอม", "249,000", "229,000", "49,000", "5 วัน 4 คืน", "สิงคโปร์", "3 สัปดาห์", "4 สัปดาห์", "ลอนดอน", "แคลิฟอร์เนีย", "โอ๊คแลนด์", "แวนคูเวอร์", "กี่บาท", "รีวิว", "อเมริกา", "อังกฤษ", "นิวซีแลนด์", "แคนาดา", "2570", "โบร์ชัวร์", "pdf"]
  },
  {
    id: 2,
    category: "โบร์ชัวร์และทุนการศึกษา",
    question: "ขอลิงก์ดาวน์โหลดโบร์ชัวร์ PDF รายละเอียดโครงการระยะสั้น รุ่นที่ 20 และข้อมูลทุนการศึกษา",
    answer: "สามารถดูเอกสารและดาวน์โหลดโบร์ชัวร์โครงการระยะสั้น รุ่นที่ 20 ได้ที่นี่เลยค่ะ:\n\n📄 โบร์ชัวร์ PDF รายละเอียดโครงการระยะสั้น รุ่นที่ 20:\nhttps://engenius.co.th/wp-content/uploads/2026/06/Short-Exchange-Programs-%E0%B8%A3%E0%B8%B8%E0%B9%88%E0%B8%99%E0%B8%97%E0%B8%B5%E0%B9%88-20-April-2027-.pdf\n\n🏆 รายละเอียดทุนการศึกษา (อเมริกา, อังกฤษ, แคนาดา, นิวซีแลนด์):\n• ทุนเต็มจำนวน 1 ทุน (95-100 คะแนน)\n• ทุนสมทบ 50,000 บาท 5 ทุน (90-94 คะแนน)\n• ทุนสมทบ 30,000 บาท 10 ทุน (85-89 คะแนน)\n• ทุนสมทบ 20,000 บาท 20 ทุน (80-84 คะแนน)\n• ทุนสมทบ 10,000 บาท 20 ทุน (75-79 คะแนน)\n📅 สอบข้อเขียน: 28 พ.ย. 2569 | สมัครสอบบัดนี้ - 27 พ.ย. 2569 (ค่าสมัคร 200 บ.)",
    keywords: ["โบร์ชัวร์", "pdf", "ขอโบร์ชัวร์", "ดาวน์โหลด", "ลิงก์", "link", "เอกสาร", "ทุน", "ชิงทุน", "ทุนเต็มจำนวน", "ทุนสมทบ", "50,000", "30,000"]
  },
  {
    id: 3,
    category: "โครงการแลกเปลี่ยน",
    question: "โครงการแลกเปลี่ยนระยะสั้นมีประเทศอะไรให้เลือกบ้าง?",
    answer: "โครงการแลกเปลี่ยนระยะสั้น รุ่นที่ 20 เปิดรับสมัคร 5 ประเทศ ได้แก่ อเมริกา (แคลิฟอร์เนีย 4 สัปดาห์ 249,000 บ.), อังกฤษ (ลอนดอน 4 สัปดาห์ 249,000 บ.), แคนาดา (แวนคูเวอร์ 4 สัปดาห์ 249,000 บ.), นิวซีแลนด์ (โอ๊คแลนด์ 3 สัปดาห์ 229,000 บ.) และสิงคโปร์ (5 วัน 4 คืน 49,000 บ.) ค่ะ",
    keywords: ["ประเทศ", "กี่ประเทศ", "ระยะสั้น", "อเมริกา", "อังกฤษ", "นิวซีแลนด์", "สิงคโปร์", "แคนาดา", "รุ่น 20", "รุ่นที่ 20"]
  },
  {
    id: 4,
    category: "คุณสมบัติผู้สมัคร",
    question: "รับสมัครอายุเท่าไหร่ หรือเรียนอยู่ชั้นไหนถึงสมัครได้?",
    answer: "โครงการแลกเปลี่ยนระยะสั้น รุ่นที่ 20 เปิดรับสมัครผู้ที่มีอายุ 10 - 22 ปี (กำลังศึกษา ป.5 - ป.6, ม.1 - ม.6 หรือระดับอาชีวะ/อุดมศึกษา ขึ้นอยู่กับประเทศที่เลือก เช่น อังกฤษ 12-22 ปี, นิวซีแลนด์ 13-18 ปี, แคนาดา ม.1-ม.6, อเมริกา/สิงคโปร์ 10-22 ปี)\nโครงการแลกเปลี่ยนระยะยาว เปิดรับนักเรียนอายุ 13 - 18 ปี (ม.2 - ม.5)",
    keywords: ["อายุ", "เท่าไหร่", "ชั้นไหน", "ป.5", "ป.6", "ม.1", "ม.6", "อาชีวะ", "อุดมศึกษา", "มัธยม", "สมัครได้ไหม", "คุณสมบัติ"]
  },
  {
    id: 5,
    category: "คุณสมบัติผู้สมัคร",
    question: "ถ้าภาษาอังกฤษยังไม่เก่งมาก สมัครได้ไหม?",
    answer: "สมัครได้แน่นอนค่ะ! โครงการเปิดรับทุกระดับภาษา ไม่จำเป็นต้องสื่อสารคล่องแคล่ว เนื่องจากมีเจ้าหน้าที่และอาจารย์ชาวไทยเดินทางไปดูแลตลอดระยะเวลาโครงการ และน้อง ๆ จะได้ฝึกภาษาและปรับตัวกับเจ้าของภาษาจริงค่ะ",
    keywords: ["ภาษาอังกฤษ", "ไม่เก่งภาษา", "ภาษาไม่เก่ง", "เปิดรับทุกระดับ", "สมัครได้ไหม", "ไม่คล่อง"]
  },
  {
    id: 6,
    category: "ขั้นตอนและระเบียบการ",
    question: "ขั้นตอนการสมัครและชำระเงินโครงการระยะสั้น รุ่นที่ 20 ทำอย่างไร?",
    answer: "ขั้นตอนการสมัคร:\n1. สมัครออนไลน์ที่ www.engenius.co.th หรือผ่านศูนย์สอบทั่วประเทศ\n2. รอบปกติ: ชำระค่างวดที่ 1 เพื่อยืนยันสิทธิ์ทันทีโดยไม่ต้องสอบ (อเมริกา/อังกฤษ/แคนาดา/นิวซีแลนด์ 49,000 บ. | สิงคโปร์ 19,000 บ.)\n3. โอนเข้าบัญชี ธ.กรุงไทย บจก. เอ็นจีเนียส กรุ๊ป เลขที่ 017-0-46582-9 แล้วส่งสลิปทาง Email: finance@engenius.co.th หรือ Line@: @engenius\n4. ส่งเอกสารทำวีซ่าและเข้าร่วมปฐมนิเทศก่อนเดินทางค่ะ",
    keywords: ["สมัครยังไง", "ขั้นตอน", "ชำระเงิน", "เลขบัญชี", "กรุงไทย", "017-0-46582-9", "งวดที่ 1", "ยืนยันสิทธิ์", "ผ่อนชำระ"]
  },
  {
    id: 7,
    category: "ข้อมูลติดต่อ",
    question: "ขอช่องทางการติดต่อ เบอร์โทรศัพท์ และสถานที่ตั้งของ Engenius หน่อยครับ",
    answer: "ติดต่อ Engenius International:\n📞 โทร: 02-117-4742 (ทุกวัน 09.00 – 20.00 น.)\n💚 LINE Official: @engenius\n🌐 เว็บไซต์: www.engenius.co.th\n📧 อีเมล: engeniusinter@gmail.com\n🏢 ที่อยู่: ชั้น G อาคารบีบีดี เลขที่ 626 ถนนพระรามที่ 4 แขวงมหาพฤฒาราม เขตบางรัก กรุงเทพฯ 10500",
    keywords: ["ติดต่อ", "เบอร์โทร", "โทร", "ไลน์", "line", "ที่อยู่", "บริษัท", "สำนักงาน", "02-117-4742", "@engenius"]
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
    answer: "โครงการแลกเปลี่ยนเพื่อการศึกษาทั่วไปไม่อนุญาตให้ทำงานพาร์ทไทม์ค่ะ แต่โครงการ Work and Travel USA เป็นโครงการ J-1 สำหรับนักศึกษาที่ได้รับอนุมัติให้ทำงานชั่วคราวตามตำแหน่งและเงื่อนไขของผู้สนับสนุนโครงการ โดยช่วงทำงานของ Engenius โดยทั่วไปประมาณ 2–3 เดือน หลังจบโครงการมีช่วงเดินทางได้ไม่เกิน 30 วันตามเงื่อนไข และห้ามทำงานในช่วงดังกล่าวค่ะ",
    keywords: ["ทำงาน", "งาน", "พาร์ทไทม์", "รับจ้าง", "วีซ่านักเรียน", "ทำงานต่างประเทศ"]
  },
  {
    id: 10,
    category: "ทุนการศึกษา",
    question: "มีทุนการศึกษาหรือส่วนลดค่าธรรมเนียมโครงการไหม?",
    answer: "ทางสถาบัน Engenius มีโควตาสอบชิงทุนการศึกษาสมบูรณ์แบบ (Full Scholarship) และส่วนลดค่าธรรมเนียมพิเศษสำหรับนักเรียนที่ทำคะแนนสอบวัดระดับ E-ELT ผ่านเกณฑ์ค่ะ",
    keywords: ["ทุน", "ทุนการศึกษา", "ส่วนลด", "สอบชิงทุน", "full scholarship"]
  },
  {
    id: 11,
    category: "Work and Travel USA 2027",
    question: "รายละเอียดโครงการ Work and Travel USA 2027 โปรโมชั่น ส่วนลด คุณสมบัติ และวัตถุประสงค์มีอะไรบ้าง?",
    answer: `โครงการ Work and Travel USA 2027 ของ Engenius International เป็นโครงการแลกเปลี่ยนภาษาและวัฒนธรรมระดับอุดมศึกษา เปิดโอกาสให้นักศึกษาเรียนรู้ชีวิตและวัฒนธรรมอเมริกันผ่านการทำงานช่วงปิดภาคเรียนฤดูร้อน\n\nระยะเวลาและการทำงาน: ตามข้อมูลโครงการ Engenius ช่วงทำงานโดยทั่วไปประมาณ 2–3 เดือน งานต้องเป็นงานชั่วคราวที่ได้รับอนุมัติตามเงื่อนไข J-1 และผู้สนับสนุนในสหรัฐฯ ให้ยึดวันในเอกสาร DS-2019 และคำแนะนำของผู้สนับสนุนเป็นหลัก กระทรวงการต่างประเทศสหรัฐฯ ระบุว่า Summer Work Travel มีระยะเวลาได้สูงสุด 4 เดือน หลังจบโครงการมีช่วงเดินทางได้ไม่เกิน 30 วัน แต่ไม่สามารถทำงานในช่วง grace period ได้\n\nโปรโมชั่น Work and Travel 2027:\n• สมัครคู่ 2 คน ลดคนละ 3,000 บาท\n• สมัครพร้อมกัน 3–4 คน ลดคนละ 5,000 บาท\n• สมัครกลุ่มตั้งแต่ 5 คนขึ้นไป ลดสูงสุดคนละ 10,000 บาท\n• จอง Premium Job ได้โดยไม่มีค่าใช้จ่ายเพิ่มเติม ตามเงื่อนไขและจำนวนสิทธิ์ของแต่ละรอบ\n• Engenius ระบุว่าค่าโครงการถูกที่สุด และมีทีมงานให้คำปรึกษาและดูแลตลอดขั้นตอนสมัคร จำนวนรับมีจำกัด\n\nประวัติโครงการ: โครงการ Work and Travel ในประเทศไทยมีมานานกว่า 15 ปี ผู้อำนวยการ Engenius International เคยเข้าร่วม Aspire by ASSE International ในปี 2005 และ Engenius เซ็นสัญญากับผู้สนับสนุนในปี 2017 ปัจจุบันจัดปีละ 2 ช่วง คือ Spring และ Summer\n\nวัตถุประสงค์: พัฒนาทักษะการทำงานช่วงปิดภาคเรียน ฝึกภาษาอังกฤษกับเจ้าของภาษา เรียนรู้วัฒนธรรมและการใช้ชีวิตในต่างประเทศ ฝึกอยู่ร่วมกับผู้อื่นและแก้ปัญหาเฉพาะหน้า สร้างมิตรภาพกับเพื่อนหลายประเทศ ฝึกปรับตัวกับสภาพแวดล้อมและเพื่อนร่วมงาน และเปิดโอกาสให้ท่องเที่ยวในสหรัฐฯ\n\nคุณสมบัติผู้สมัครตามข้อมูลโครงการ: อายุ 18–27 ปี สัญชาติไทย สถานภาพโสด เป็นนักศึกษาเต็มเวลาระดับปริญญาตรีชั้นปีที่ 1–4 หรือปริญญาโท รักษาสถานภาพนักศึกษาและยังไม่ยื่นแจ้งจบ มี GPA ตั้งแต่ 2.00 สื่อสารภาษาอังกฤษได้ มีความรับผิดชอบ อดทน ทัศนคติดี พร้อมปรับตัวและเข้าใจกฎระเบียบโครงการค่ะ`,
    answer: `โครงการ Work and Travel USA 2027 ของ Engenius International เป็นโครงการแลกเปลี่ยนภาษาและวัฒนธรรมระดับอุดมศึกษา เปิดโอกาสให้นักศึกษาเรียนรู้ชีวิตและวัฒนธรรมอเมริกันผ่านการทำงานช่วงปิดภาคเรียนฤดูร้อน\n\nเปิดรับสมัคร Spring และ Summer 2027 ค่าสมัครเริ่มต้น 3,900 บาท มีโปรโมชั่น Early Bird สมัครก่อนคุ้มกว่า สิทธิประโยชน์ประกอบด้วย Premium Location, Premium Job และตำแหน่งงานคุณภาพ จัดสรรแบบ First Come, First Served ตำแหน่งงานที่เปิดรับตามเว็บไซต์ Engenius ได้แก่ Alaska, California, Florida, Hawaii, Illinois, Maryland, Massachusetts, Montana, New Jersey, New York, South Carolina, Tennessee, Utah, Virginia, Wisconsin, Wyoming และ Washington D.C.\n\nระยะเวลาและการทำงาน: ตามข้อมูลโครงการ Engenius ช่วงทำงานโดยทั่วไปประมาณ 2–3 เดือน งานต้องเป็นงานชั่วคราวที่ได้รับอนุมัติตามเงื่อนไข J-1 และผู้สนับสนุนในสหรัฐฯ ให้ยึดวันในเอกสาร DS-2019 และคำแนะนำของผู้สนับสนุนเป็นหลัก กระทรวงการต่างประเทศสหรัฐฯ ระบุว่า Summer Work Travel มีระยะเวลาได้สูงสุด 4 เดือน หลังจบโครงการมีช่วงเดินทางได้ไม่เกิน 30 วัน แต่ไม่สามารถทำงานในช่วง grace period ได้\n\nโปรโมชั่น Work and Travel 2027:\n• สมัครคู่ 2 คน ลดคนละ 3,000 บาท\n• สมัครพร้อมกัน 3–4 คน ลดคนละ 5,000 บาท\n• สมัครกลุ่มตั้งแต่ 5 คนขึ้นไป ลดสูงสุดคนละ 10,000 บาท\n• จอง Premium Job ได้โดยไม่มีค่าใช้จ่ายเพิ่มเติม ตามเงื่อนไขและจำนวนสิทธิ์ของแต่ละรอบ\n• Engenius ระบุว่าค่าโครงการถูกที่สุด และมีทีมงานให้คำปรึกษาและดูแลตลอดขั้นตอนสมัคร จำนวนรับมีจำกัด\n\nประวัติโครงการ: โครงการ Work and Travel ในประเทศไทยมีมานานกว่า 15 ปี ผู้อำนวยการ Engenius International เคยเข้าร่วม Aspire by ASSE International ในปี 2005 และ Engenius เซ็นสัญญากับผู้สนับสนุนในปี 2017 ปัจจุบันจัดปีละ 2 ช่วง คือ Spring และ Summer\n\nวัตถุประสงค์: พัฒนาทักษะการทำงานช่วงปิดภาคเรียน ฝึกภาษาอังกฤษในสภาพแวดล้อมจริงระหว่างทำงานและใช้ชีวิตประจำวัน เรียนรู้วัฒนธรรม ฝึกอยู่ร่วมกับผู้อื่นและปรับตัวกับความแตกต่าง สร้างมิตรภาพกับเพื่อนหลายประเทศ แก้ปัญหาเฉพาะหน้า และเปิดโอกาสให้ท่องเที่ยวในสหรัฐฯ\n\nคุณสมบัติผู้สมัครตามข้อมูลโครงการ: อายุ 18–27 ปี สัญชาติไทย สถานภาพโสด เป็นนักศึกษาเต็มเวลาระดับปริญญาตรีชั้นปีที่ 1–4 หรือปริญญาโท รักษาสถานภาพนักศึกษาและยังไม่ยื่นแจ้งจบ มี GPA ตั้งแต่ 2.00 สื่อสารภาษาอังกฤษได้ มีความตั้งใจและเข้าใจวัตถุประสงค์โครงการ มีความอดทน ขยัน ประพฤติดี สุขภาพแข็งแรง พร้อมปรับตัวและทำงานกับชาวต่างชาติค่ะ\n\nติดต่อ Engenius: LINE ตามโปสเตอร์ @eng11 หรือ LINE หน้าเว็บไซต์หลัก @engenius_inter, โทร. 02-117-4742, เว็บไซต์ www.engenius.co.th, Facebook Engenius International, Instagram @Engenius_inter ค่ะ`,
    keywords: ["Work and Travel", "Work & Travel", "WAT", "Work and Travel USA", "USA 2027", "2027", "J-1", "J1", "ทำงานในอเมริกา", "ทำงานอเมริกา", "ท่องเที่ยวอเมริกา", "อเมริกา", "เปิดรับสมัคร", "Spring", "Summer", "ค่าสมัคร", "3,900", "3900", "Early Bird", "สมัครก่อน", "Premium Location", "Premium Job", "First Come", "ตำแหน่งงาน", "รัฐ", "Alaska", "California", "Florida", "Hawaii", "Illinois", "Maryland", "Massachusetts", "Montana", "New Jersey", "New York", "South Carolina", "Tennessee", "Utah", "Virginia", "Wisconsin", "Wyoming", "Washington D.C.", "โปรโมชั่น", "โปรโมชัน", "ส่วนลด", "สมัครคู่", "สมัครเป็นคู่", "3,000", "5,000", "10,000", "กลุ่ม 5 คน", "คุณสมบัติ", "อายุ 18-27", "18–27", "เกรดเฉลี่ย", "GPA", "2.00", "สุขภาพแข็งแรง", "ประพฤติดี", "นักศึกษา", "ปริญญาตรี", "ปริญญาโท", "ระยะเวลา", "2-3 เดือน", "30 วัน", "grace period", "Aspire", "ASSE", "2005", "2017", "วัตถุประสงค์", "ภาษาอังกฤษ", "วัฒนธรรม", "ประสบการณ์", "ทักษะการทำงาน", "ปรับตัว", "ทีมงาน", "@eng11", "@engenius_inter", "02-117-4742", "engenius.co.th"]
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
        content: 'สวัสดีค่ะ 💕 อิงกี้จาก Engenius พร้อมช่วยแนะนำค่ะ วันนี้สนใจโครงการไหนคะ? 1️⃣ โครงการแลกเปลี่ยนระยะสั้น รุ่นที่ 20 2️⃣ Work and Travel USA 2027 สำหรับนักศึกษา พิมพ์ชื่อโครงการ หรือถามเรื่องค่าใช้จ่าย คุณสมบัติ และขั้นตอนสมัครได้เลยนะคะ ✨'
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
        'Authorization': `Bearer ${getLineAccessToken()}`
      },
      body: JSON.stringify({
        chatId: userId,
        loadingSeconds: seconds
      })
    });
    if (!res.ok) {
      console.error(`LINE Loading Animation Failed: ${res.status} ${await res.text()}`);
    } else {
      console.log(`⏳ [LINE Typing Indicator Sent to ${userId}] Status: ${res.status}`);
    }
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
    ? `${PHANX1_MASTER_PROMPT}\n\n[ข้อมูลอ้างอิงจริงที่ดึงได้จาก Supabase PostgreSQL DB Table]:\n${ragResult.content}\n\nคำสั่งสำคัญบังคับ: จงนำข้อมูลอ้างอิงจาก Supabase ข้างต้นมาตอบคำถามผู้ใช้โดยตรงด้วยข้อความสั้นกระชับ ปานกลาง อ่านเข้าใจง่าย ไม่ยาวรกรุงรัง (ลงท้ายประโยคด้วย ค่ะ / นะคะ) หากในข้อมูลมีระบุราคา เงื่อนไข หรือรายละเอียดโครงการ ให้แจ้งข้อมูลถูกต้องครบถ้วนนะคะ`
    : `${PHANX1_MASTER_PROMPT}\n\n[คำสั่งเสนอแนะทางเลือก]: คำถามของผู้ใช้ไม่มีใน DB โดยตรง จงตอบปฏิเสธอย่างสุภาพสดใส และเสนอทางเลือกเป็นโครงการแลกเปลี่ยนระยะสั้น รุ่น 20, Work and Travel USA 2027 หรือคอร์สเรียนภาษาออนไลน์ค่ะ 💕`;

  try {
    const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getDeepseekApiKey()}`
      },
      body: JSON.stringify({
        model: getDeepseekModel(),
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
    console.error(`DeepSeek API Error: ${res.status} ${JSON.stringify(data).slice(0, 500)}`);
  } catch (err) {
    console.error('AI API Call Error:', err.message);
  }

  // Fallback with sales suggestion & link
  return hasContext
    ? `${ragResult.content.split('\nคำตอบจากคลัง DB: ')[1] || 'ยินดีให้ข้อมูลค่ะ'} หากมีข้อสงสัยเพิ่มเติมสอบถามแอดมินได้เลยนะคะ 💕`
    : 'ขออภัยค่ะ ข้อมูลส่วนนี้ยังไม่มีในระบบเลยค่ะ 💕 แต่ทาง Engenius มีโครงการแลกเปลี่ยนระยะสั้น รุ่น 20, Work and Travel USA 2027 และคอร์สเรียนภาษาตัวต่อตัวค่ะ สนใจให้อิงกี้แนะนำโครงการไหนก่อนดีคะ ✨';
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
    if (!res.ok) {
      console.error(`[LINE QuickReply Failed] Status: ${res.status} ${await res.text()}`);
    } else {
      console.log(`[LINE QuickReply Sent] Status: ${res.status}`);
    }
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
    if (!res.ok) {
      console.error(`[LINE Reply Failed] Status: ${res.status} ${await res.text()}`);
    } else {
      console.log(`[LINE Reply Sent] Status: ${res.status}`);
    }
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
    if (!res.ok) {
      console.error(`[LINE Push Failed] Status: ${res.status} ${await res.text()}`);
    } else {
      console.log(`[LINE Push Sent] Status: ${res.status}`);
    }
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
  if (req.method === 'GET') {
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
  if (req.method === 'POST' && req.url.includes('resume-bot')) {
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

  // POST Manual Chat Session Endpoint from Web UI
  if (req.method === 'POST' && req.url === '/api/line/manual-chat') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const data = JSON.parse(body || '{}');
        const { line_user_id, action = 'start' } = data;

        if (!line_user_id) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'line_user_id is required' }));
          return;
        }

        if (!['start', 'extend', 'end'].includes(action)) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Unsupported manual chat action' }));
          return;
        }

        const currentUntil = userPauseMap[line_user_id] || Date.now();
        let pausedUntil = null;
        let status = 'ดำเนินการ';
        let message = 'น้องอิงกี้กลับมาเปิดใช้งานและพร้อมตอบคำถามตามปกติแล้วค่ะ';

        if (action === 'start') {
          pausedUntil = Date.now() + 60 * 60 * 1000;
          status = 'แชทแมนนวล 1 ชม.';
          message = 'ขณะนี้แอดมินกำลังเข้ามาดูแลแชทให้ค่ะ\nน้องอิงกี้จะหยุดตอบชั่วคราวเป็นเวลา 1 ชั่วโมงนะคะ';
        } else if (action === 'extend') {
          pausedUntil = Math.max(currentUntil, Date.now()) + 60 * 60 * 1000;
          status = 'แชทแมนนวล';
          message = 'แอดมินขยายเวลาแชทแมนนวลให้อีก 1 ชั่วโมงแล้วค่ะ\nระหว่างนี้แอดมินจะดูแลและตอบกลับให้เองนะคะ';
        }

        if (pausedUntil) {
          userPauseMap[line_user_id] = pausedUntil;
        } else {
          delete userPauseMap[line_user_id];
        }

        if (liveUsersMap[line_user_id]) {
          liveUsersMap[line_user_id].status = status;
          liveUsersMap[line_user_id].pausedUntil = pausedUntil;
          liveUsersMap[line_user_id].pauseDurationHours = pausedUntil ? 1 : null;
        }

        liveChatLogs.push({
          id: Date.now(),
          sender: action === 'end' ? 'bot' : 'admin',
          platform: 'line',
          message,
          line_user_id,
          created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
        });

        await pushLINE(line_user_id, message);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, action, pausedUntil }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // POST Admin Push Message Endpoint from Web UI
  if (req.method === 'POST' && (req.url.includes('send') || req.url.includes('messages'))) {
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

if (!process.env.VERCEL) {
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
