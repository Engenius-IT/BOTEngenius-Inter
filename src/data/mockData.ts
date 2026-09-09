import { 
  KnowledgeBaseItem, 
  KnowledgeArticleItem, 
  ChatMessage, 
  BroadcastLog, 
  AdminUser, 
  SQLTableSummary,
  AIProviderConfig 
} from '../types/schema';

// Helper to generate normalized vector arrays for simulation
export function generateMockVector(seedText: string, dimensions = 384): number[] {
  let hash = 0;
  for (let i = 0; i < seedText.length; i++) {
    hash = (hash << 5) - hash + seedText.charCodeAt(i);
    hash |= 0;
  }
  const vec: number[] = [];
  let norm = 0;
  for (let i = 0; i < dimensions; i++) {
    const val = Math.sin(hash + i * 0.1) * 0.05;
    vec.push(val);
    norm += val * val;
  }
  norm = Math.sqrt(norm) || 1;
  return vec.map(v => v / norm);
}

// Compute Cosine Similarity between two vectors
export function computeCosineSimilarity(vecA: number[], vecB: number[]): number {
  if (!vecA || !vecB || vecA.length === 0 || vecB.length === 0) return 0;
  const minLen = Math.min(vecA.length, vecB.length);
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < minLen; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (normA * normB);
}

// Active AI Model Provider & Keys Configuration
export const initialAIConfig: AIProviderConfig = {
  activeProvider: 'deepseek',
  deepseek: {
    model: 'deepseek-chat',
    apiKey: import.meta.env.VITE_DEEPSEEK_API_KEY || ''
  },
  gemini: {
    chatModel: 'gemini-2.5-flash',
    embeddingModel: 'models/gemini-embedding-2',
    apiKey: import.meta.env.VITE_GEMINI_API_KEY || ''
  },
  groq: {
    model: 'llama-3.3-70b-versatile',
    apiKey: import.meta.env.VITE_GROQ_API_KEY || ''
  },
  openai: {
    model: 'gpt-4o-mini',
    apiKey: import.meta.env.VITE_OPENAI_API_KEY || ''
  },
  line: {
    channelSecret: import.meta.env.VITE_LINE_CHANNEL_SECRET || '',
    accessToken: import.meta.env.VITE_LINE_ACCESS_TOKEN || '',
    adminLineUserId: 'U9188449e7458f0441acd523ccd6a5cec'
  }
};

// Base Knowledge Items
const baseKnowledgeList: KnowledgeBaseItem[] = [
  {
    id: 1,
    category: "โครงการแลกเปลี่ยน",
    question: "โครงการแลกเปลี่ยนระยะสั้น รุ่นที่ 20 มีประเทศอะไรให้เลือกบ้าง?",
    answer: "โครงการทุนแลกเปลี่ยนภาษาและวัฒนธรรมระยะสั้น รุ่นที่ 20 (เดินทางช่วง เม.ย. - พ.ค. 2570) เปิดรับสมัคร 5 ประเทศ ได้แก่:\n1. 🇺🇸 อเมริกา (แคลิฟอร์เนีย 4 สัปดาห์: 229,000 บ.)\n2. 🇬🇧 อังกฤษ (ลอนดอน 4 สัปดาห์: 229,000 บ.)\n3. 🇳🇿 นิวซีแลนด์ (โอ๊คแลนด์ 3 สัปดาห์: 199,000 บ.)\n4. 🇨🇦 แคนาดา (แวนคูเวอร์ 4 สัปดาห์: 229,000 บ.)\n5. 🇸🇬 สิงคโปร์ (5 วัน 4 คืน: 49,000 บ.)\n✨ สมัครได้เลยไม่ต้องสอบ (รับจำนวนจำกัด) หรือสอบชิงทุนเต็มจำนวนและทุนสมทบได้ค่ะ",
    keywords: "โครงการแลกเปลี่ยนระยะสั้น, รุ่นที่ 20, รุ่น 20, อเมริกา, อังกฤษ, นิวซีแลนด์, แคนาดา, สิงคโปร์, ประเทศ, กี่ประเทศ, มีประเทศอะไรบ้าง",
    vector_array: generateMockVector("โครงการแลกเปลี่ยนระยะสั้น รุ่นที่ 20 อเมริกา อังกฤษ นิวซีแลนด์ แคนาดา สิงคโปร์ กี่ประเทศ 2570"),
    sourceTable: 'knowledge_base'
  },
  {
    id: 2,
    category: "โครงการแลกเปลี่ยน",
    question: "โครงการแลกเปลี่ยนระยะยาวไปช่วงไหนของปี แล้วไปนานกี่เดือน?",
    answer: "สำหรับโครงการแลกเปลี่ยนระยะยาว มีกำหนดเดินทางประมาณเดือนสิงหาคม - กันยายน และเดินทางกลับประมาณเดือนพฤษภาคม - มิถุนายน รวมระยะเวลาประมาณ 10 เดือน หรือ 1 ปีการศึกษาเต็ม เพื่อให้น้อง ๆ ได้ใช้ชีวิตและเรียนรู้ในต่างประเทศอย่างเต็มรูปแบบ",
    keywords: "โครงการแลกเปลี่ยนระยะยาว, 1 ปีการศึกษาเต็ม, ใช้ชีวิตในต่างประเทศ, ระยะเวลาเรียน, กี่เดือน",
    vector_array: generateMockVector("โครงการแลกเปลี่ยนระยะยาวไปช่วงไหนของปี แล้วไปนานกี่เดือน? 10 เดือน 1 ปีการศึกษา"),
    sourceTable: 'knowledge_base'
  },
  {
    id: 3,
    category: "คุณสมบัติผู้สมัคร",
    question: "รับสมัครอายุเท่าไหร่ หรือเรียนอยู่ชั้นไหนถึงสมัครได้?",
    answer: "โครงการแลกเปลี่ยนระยะสั้น รุ่นที่ 20 เปิดรับสมัครผู้ที่มีอายุ 10 - 22 ปี (กำลังศึกษา ป.5 - ป.6, ม.1 - ม.6 หรือระดับอาชีวะ/อุดมศึกษา ขึ้นอยู่กับประเทศที่เลือก เช่น อังกฤษ 12-22 ปี, นิวซีแลนด์ 13-18 ปี, แคนาดา ม.1-ม.6, อเมริกา/สิงคโปร์ 10-22 ปี)\nโครงการแลกเปลี่ยนระยะยาว เปิดรับนักเรียนอายุ 13 - 18 ปี (ม.2 - ม.5)",
    keywords: "คุณสมบัติ, อายุ, ชั้นไหน, ป.5, ม.1, ม.6, 10-22 ปี, 12-22 ปี, 13-18 ปี, อาชีวะ, มหาวิทยาลัย, สมัครได้ไหม",
    vector_array: generateMockVector("รับสมัครอายุเท่าไหร่ หรือเรียนอยู่ชั้นไหนถึงสมัครได้? 10-22 ปี ป.5-ม.6 อาชีวะ อุดมศึกษา รุ่นที่ 20"),
    sourceTable: 'knowledge_base'
  },
  {
    id: 4,
    category: "คุณสมบัติผู้สมัคร",
    question: "ถ้าภาษาอังกฤษยังไม่เก่งมาก สมัครได้ไหม?",
    answer: "สมัครได้แน่นอนค่ะ! โครงการเปิดรับทุกระดับภาษา ไม่จำเป็นต้องสื่อสารคล่องแคล่ว เนื่องจากมีเจ้าหน้าที่และอาจารย์ชาวไทยเดินทางไปดูแลตลอดระยะเวลาโครงการ และน้อง ๆ จะได้พัฒนาทักษะภาษาและปรับตัวกับเจ้าของภาษาจริงค่ะ",
    keywords: "ภาษาอังกฤษ, ไม่เก่งภาษา, ภาษาไม่คล่อง, อาจารย์ชาวไทยดูแล, เปิดรับทุกระดับ, สมัครได้ไหม",
    vector_array: generateMockVector("ถ้าภาษาอังกฤษยังไม่เก่งมาก สมัครได้ไหม? เปิดรับทุกระดับภาษา มีอาจารย์ชาวไทยดูแล"),
    sourceTable: 'knowledge_base'
  },
  {
    id: 5,
    category: "การเตรียมตัว",
    question: "ต้องสอบวัดระดับภาษาอังกฤษก่อนเข้าร่วมโครงการไหม?",
    answer: "สำหรับรอบปกติ: สามารถสมัครได้ทันที ไม่ต้องสอบ (รับจำนวนจำกัด จนกว่าโควตาจะเต็ม)\nสำหรับรอบชิงทุน: มีสอบข้อเขียนภาษาอังกฤษ (70 ข้อ) + วัฒนธรรมไทย (30 ข้อ) รวม 100 ข้อ 100 คะแนน เพื่อชิงทุนเต็มจำนวนและทุนสมทบสูงสุด 50,000 บาทค่ะ",
    keywords: "สอบไหม, ไม่ต้องสอบ, สอบชิงทุน, ข้อสอบ, 100 ข้อ, วัดระดับภาษา, สมัครได้เลย",
    vector_array: generateMockVector("ต้องสอบวัดระดับภาษาอังกฤษก่อนเข้าร่วมโครงการไหม? สมัครได้เลยไม่ต้องสอบ หรือสอบชิงทุน 100 ข้อ"),
    sourceTable: 'knowledge_base'
  },
  {
    id: 6,
    category: "คอร์สเรียน",
    question: "มีแพ็กเกจเรียนภาษาออนไลน์ตัวต่อตัวอะไรบ้าง?",
    answer: "Engenius มีคอร์สเรียนสดตัวต่อตัวกับอาจารย์ต่างชาติ 8 แพ็กเกจ เช่น Starter (10 ครั้ง 15,000 บ.), Beginner (20 ครั้ง 28,000 บ.), Saver (30 ครั้ง 39,000 บ.), Value (40 ครั้ง 48,000 บ.), Combo (50 ครั้ง 55,000 บ.), Super Pack (100 ครั้ง 80,000 บ.)",
    keywords: "คอร์สเรียนตัวต่อตัว, แพ็กเกจเรียนภาษา, Starter, Beginner, Saver, Value, Combo, Super Pack",
    vector_array: generateMockVector("มีแพ็กเกจเรียนภาษาออนไลน์ตัวต่อตัวอะไรบ้าง? Starter Beginner Saver Value Combo Super"),
    sourceTable: 'knowledge_base'
  },
  {
    id: 7,
    category: "การทำงานต่างประเทศ",
    question: "เข้าร่วมโครงการแลกเปลี่ยนแล้วสามารถทำงานต่างประเทศหรือทำงานพาร์ทไทม์ได้ไหม?",
    answer: "โครงการของเราเป็นโครงการแลกเปลี่ยนทางการศึกษาและวัฒนธรรมระยะสั้นด้วยวีซ่าท่องเที่ยว/นักเรียน จึงไม่สามารถรับจ้างทำงานหรือทำงานพาร์ทไทม์ได้อย่างถูกกฎหมายค่ะ (เน้นการเรียน ฝึกภาษา และทัศนศึกษาเปิดประสบการณ์)",
    keywords: "ไปทำงาน, ทำงานต่างประเทศ, ทำงานพาร์ทไทม์, อยากไปทำงาน, รับจ้างทำงาน, วีซ่า",
    vector_array: generateMockVector("เข้าร่วมโครงการแล้วสามารถทำงานต่างประเทศหรือทำงานพาร์ทไทม์ได้ไหม? ไม่ได้ เน้นเรียนและทัศนศึกษา"),
    sourceTable: 'knowledge_base'
  },
  {
    id: 8,
    category: "โครงการแลกเปลี่ยนระยะสั้น",
    question: "รายละเอียด ราคา กำหนดการเดินทาง และเงื่อนไขโครงการแลกเปลี่ยนระยะสั้น รุ่นที่ 20 มีอะไรบ้าง?",
    answer: "โครงการแลกเปลี่ยนภาษาและวัฒนธรรมระยะสั้น รุ่นที่ 20 (เดินทาง เม.ย. - พ.ค. 2570):\n\n🇺🇸 1. อเมริกา (แคลิฟอร์เนีย 4 สัปดาห์ | 3 เม.ย. - 2 พ.ค. 70): 229,000 บาท (โฮสต์แฟมิลี่, ดิสนีย์แลนด์, ยูนิเวอร์แซล, LA)\n🇬🇧 2. อังกฤษ (ลอนดอน 4 สัปดาห์ | 3 เม.ย. - 2 พ.ค. 70): 229,000 บาท (โฮสต์แฟมิลี่, แฮร์รี่พอตเตอร์, อ็อกฟอร์ด, เคมบริดจ์)\n🇳🇿 3. นิวซีแลนด์ (โอ๊คแลนด์ 3 สัปด์ | 17 เม.ย. - 9 พ.ค. 70): 199,000 บาท (เรียนใน รร. มัธยม, โฮสต์แฟมิลี่, Sky Tower)\n🇨🇦 4. แคนาดา (แวนคูเวอร์ 4 สัปดาห์ | 3 เม.ย. - 2 พ.ค. 70): 229,000 บาท (โฮสต์แฟมิลี่, สกีรีสอร์ต Whistler, FlyOver)\n🇸🇬 5. สิงคโปร์ (5 วัน 4 คืน | 19 - 23 เม.ย. 70): 49,000 บาท (โรงแรมห้องละ 2 คน, Universal Studios, Gardens by the Bay)\n\n📄 ดาวน์โหลดโบร์ชัวร์ PDF รายละเอียดโครงการรุ่นที่ 20: https://engenius.co.th/wp-content/uploads/2026/06/Short-Exchange-Programs-%E0%B8%A3%E0%B8%B8%E0%B9%88%E0%B8%99%E0%B8%97%E0%B8%B5%E0%B9%88-20-April-2027-.pdf\n✨ สมัครรอบปกติได้ทันทีไม่ต้องสอบ ชำระงวดแรก 49,000 บ. (สิงคโปร์ 19,000 บ.) เพื่อยืนยันสิทธิ์\n📞 สอบถามเพิ่มเติม: 02-117-4742 | LINE: @engenius | เว็บไซต์: www.engenius.co.th",
    keywords: "รุ่นที่ 20, รุ่น 20, ราคา, ค่าใช้จ่าย, 229,000, 199,000, 49,000, อเมริกา, อังกฤษ, นิวซีแลนด์, แคนาดา, สิงคโปร์, เมษายน 2570, พฤษภาคม 2570, ผ่อนชำระ, กี่งวด, โบร์ชัวร์, pdf, ดาวน์โหลด",
    vector_array: generateMockVector("รายละเอียด ราคา กำหนดการเดินทาง โครงการแลกเปลี่ยนระยะสั้น รุ่นที่ 20 อเมริกา 229000 อังกฤษ 229000 นิวซีแลนด์ 199000 แคนาดา 229000 สิงคโปร์ 49000 เมษายน 2570 โบร์ชัวร์ PDF"),
    sourceTable: 'knowledge_base'
  },
  {
    id: 9,
    category: "ทุนการศึกษาและกำหนดการ",
    question: "รายละเอียดทุนการศึกษา และกำหนดการรับสมัครสอบชิงทุน รุ่นที่ 20 มีอย่างไรบ้าง?",
    answer: "ทุนการศึกษาโครงการระยะสั้น รุ่นที่ 20 (สำหรับ อเมริกา, อังกฤษ, แคนาดา, นิวซีแลนด์):\n• ลำดับที่ 1 (95-100 คะแนน): ทุนเต็มจำนวน 1 ทุน\n• ลำดับที่ 2 (90-94 คะแนน): ทุน 50,000 บาท (5 ทุน)\n• ลำดับที่ 3 (85-89 คะแนน): ทุน 30,000 บาท (10 ทุน)\n• ลำดับที่ 4 (80-84 คะแนน): ทุน 20,000 บาท (20 ทุน)\n• ลำดับที่ 5 (75-79 คะแนน): ทุน 10,000 บาท (20 ทุน)\n• ลำดับที่ 6-8: ทุน 8,000 / 5,000 / 3,000 บาท\n\n📅 กำหนดการสำคัญ:\n• รับสมัครสอบชิงทุน: บัดนี้ - 27 พ.ย. 2569 (ค่าสมัคร 200 บ.)\n• สอบข้อเขียน: 28 พ.ย. 2569 (10.00-12.00 น.)\n• ประกาศผลสอบ: 5 ธ.ค. 2569\n• ยืนยันสิทธิ์รับทุน: 5 - 12 ธ.ค. 2569\n• สมัครรอบปกติ (ไม่ต้องสอบ): บัดนี้ - 15 มี.ค. 2570\n📄 ดาวน์โหลดระเบียบการและใบสมัคร PDF: https://engenius.co.th/wp-content/uploads/2026/06/Short-Exchange-Programs-%E0%B8%A3%E0%B8%B8%E0%B9%88%E0%B8%99%E0%B8%97%E0%B8%B5%E0%B9%88-20-April-2027-.pdf",
    keywords: "ทุน, ชิงทุน, ทุนเต็มจำนวน, ทุนสมทบ, 50,000, 30,000, กำหนดการ, วันสอบ, ประกาศผล, 28 พฤศจิกายน, 5 ธันวาคม, 15 มีนาคม, ค่าสมัครสอบ 200, โบร์ชัวร์, pdf",
    vector_array: generateMockVector("รายละเอียดทุนการศึกษา กำหนดการสอบชิงทุน รุ่นที่ 20 ทุนเต็มจำนวน ทุนสมทบ 28 พฤศจิกายน 2569 15 มีนาคม 2570 โบร์ชัวร์ PDF"),
    sourceTable: 'knowledge_base'
  },
  {
    id: 10,
    category: "โบร์ชัวร์และข้อมูลติดต่อ",
    question: "มีโบร์ชัวร์ PDF รายละเอียดโครงการระยะสั้น รุ่นที่ 20 และช่องทางติดต่อไหม?",
    answer: "สามารถดาวน์โหลดโบร์ชัวร์และติดต่อโครงการ Engenius International (รุ่นที่ 20) ได้ที่นี่ค่ะ:\n📄 ดาวน์โหลดโบร์ชัวร์ PDF รุ่นที่ 20:\nhttps://engenius.co.th/wp-content/uploads/2026/06/Short-Exchange-Programs-%E0%B8%A3%E0%B8%B8%E0%B9%88%E0%B8%99%E0%B8%97%E0%B8%B5%E0%B9%88-20-April-2027-.pdf\n\n🌐 เว็บไซต์: https://www.engenius.co.th\n💚 LINE Official: @engenius\n📞 โทรศัพท์: 02-117-4742 (ทุกวัน 09.00 - 20.00 น.)\n📧 อีเมล: engeniusinter@gmail.com / finance@engenius.co.th\n🏢 ที่อยู่: ชั้น G อาคารบีบีดี เลขที่ 626 ถนนพระรามที่ 4 แขวงมหาพฤฒาราม เขตบางรัก กทม. 10500\n🏦 บัญชีชำระเงิน: ธ.กรุงไทย บจก. เอ็นจีเนียส กรุ๊ป เลขที่ 017-0-46582-9",
    keywords: "โบร์ชัวร์, pdf, ขอโบร์ชัวร์, เอกสาร, ดาวน์โหลด, ลิงก์, ติดต่อ, เบอร์โทร, ไลน์, line, อีเมล, ที่อยู่, เว็บไซต์, 02-117-4742, @engenius",
    vector_array: generateMockVector("โบร์ชัวร์ PDF รายละเอียดโครงการระยะสั้น รุ่นที่ 20 ดาวน์โหลด ติดต่อ โทร 02-117-4742 LINE @engenius"),
    sourceTable: 'knowledge_base'
  }
];

// Generator function to scale knowledge base to 5,000 comprehensive Supabase records
function generate5000KnowledgeItems(): KnowledgeBaseItem[] {
  const result: KnowledgeBaseItem[] = [...baseKnowledgeList];
  
  const categories = [
    'โครงการแลกเปลี่ยน', 'วีซ่าและเอกสาร', 'หอพักโฮสต์แฟมิลี่', 
    'ทุนการศึกษาและส่วนลด', 'การเตรียมตัวเดินทาง', 'คอร์สเรียนออนไลน์', 
    'ประกันสุขภาพการเดินทาง', 'ระเบียบการโรงเรียน', 'ประสบการณ์รุ่นพี่', 'การชำระเงิน'
  ];

  const countries = ['อเมริกา (USA)', 'อังกฤษ (UK)', 'นิวซีแลนด์ (New Zealand)', 'สิงคโปร์ (Singapore)', 'แคนาดา (Canada)', 'ออสเตรเลีย (Australia)'];

  const topics = [
    { title: 'การยื่นวีซ่านักเรียน J-1 / F-1', kw: 'วีซ่า, J-1, F-1, กงสุล, สัมภาษณ์วีซ่า' },
    { title: 'การเลือกและจับคู่ Host Family ครอบครัวโฮสต์', kw: 'โฮสต์แฟมิลี่, Host Family, พักบ้านโฮสต์, วัฒนธรรม' },
    { title: 'สอบชิงทุนการศึกษาสมบูรณ์แบบ Full Scholarship', kw: 'ทุนสมบูรณ์, สอบชิงทุน, ทุน 100%, ส่วนลดค่าธรรมเนียม' },
    { title: 'เอกสารแสดงผลการเรียน Transcript & Grade Transfer', kw: 'เกรดเฉลี่ย, เทียบโอนวิชา, ใบรับรองการเป็นนักเรียน, Transcript' },
    { title: 'ประกันภัยอุบัติเหตุและสุขภาพการเดินทางต่างประเทศ', kw: 'ประกันสุขภาพ, ครอบคลุมการรักษา, เคลมค่ารักษา, ประกันอุบัติเหตุ' },
    { title: 'การจองตั๋วเครื่องบินกลุ่มแลกเปลี่ยนและสัมภาระ', kw: 'ตั๋วเครื่องบิน, สัมภาระ 23kg, กระเป๋าเดินทาง, น้ำหนักกระเป๋า' },
    { title: 'ตารางกิจกรรมช่วง Summer Camp แลกเปลี่ยนระยะสั้น', kw: 'Summer Camp, กิจกรรมทัศนศึกษา, เรียนภาษาเช้า, เที่ยวบ่าย' },
    { title: 'การทดสอบระดับภาษา E-ELT และ CEFR Framework', kw: 'E-ELT, CEFR, วัดระดับภาษา, A1, A2, B1, B2, C1' },
    { title: 'ขั้นตอนการโอนเงินค่าธรรมเนียมและใบเสร็จรับเงิน', kw: 'โอนเงิน, ใบเสร็จ, ผ่อนชำระ, ใบกำกับภาษี, บัญชีธนาคาร' },
    { title: 'การเข้าร่วมคอร์สปรับพื้นฐานภาษา Intensive English', kw: 'Intensive English, ปรับพื้นฐาน, เรียนสด, อาจารย์ฝรั่ง' },
    { title: 'ระเบียบการปฏิบัติตนและการรักษาความปลอดภัยขณะอยู่ต่างประเทศ', kw: 'ความปลอดภัย, Emergency, สายด่วน 24 ชม., กฎระเบียบ' },
    { title: 'การเทียบโอนชั้นเรียนกลับมาโรงเรียนไทยโดยไม่ต้องซ้ำชั้น', kw: 'ไม่ซ้ำชั้น, เทียบโอนกระทรวงศึกษาธิการ, ใบ ปพ.1, ปพ.7' },
    { title: 'การเข้าชมรมกีฬาและกิจกรรมชมรมดนตรีในไฮสคูล', kw: 'กิจกรรมชมรม, High School Club, อเมริกันฟุตบอล, เชียร์ลีดเดอร์' },
    { title: 'แพ็กเกจเรียนภาษาออนไลน์ตัวต่อตัว คอร์ส Starter ถึง Super Pack', kw: 'คอร์สตัวต่อตัว, Starter, Beginner, Saver, Value, Combo' },
    { title: 'การดูแลนักเรียนใกล้ชิดโดย Coordinator ประจำเมือง', kw: 'Coordinator, ผู้ดูแลประจำเมือง, ช่วยเหลือ 24 ชม., เยี่ยมบ้านโฮสต์' }
  ];

  let currentId = 8;
  
  while (result.length < 5000) {
    const catIndex = (currentId - 8) % categories.length;
    const topicIndex = (currentId - 8) % topics.length;
    const countryIndex = (currentId - 8) % countries.length;

    const cat = categories[catIndex];
    const top = topics[topicIndex];
    const country = countries[countryIndex];

    const q = `${top.title} สำหรับประเทศ ${country} (รายการ #${currentId})`;
    const a = `รายละเอียดข้อมูลระดับพรีเมียมจาก Supabase DB: สำหรับการดำเนินการในเรื่อง "${top.title}" ประเทศ ${country} ทางโครงการ PHANX1 มีทีมงานเจ้าหน้าที่คอยอำนวยความสะดวกอย่างครบวงจร ทั้งการจัดเตรียมเอกสาร การประสานงานกับสถาบันการศึกษาต่างประเทศ และการดูแลความปลอดภัยตลอด 24 ชั่วโมง โดยมีแนวทางปฏิบัติอย่างเป็นระบบตามมาตรฐานสากล`;
    const kw = `${top.kw}, ${country}, รหัส ${currentId}, PHANX1 DB`;

    result.push({
      id: currentId,
      category: cat,
      question: q,
      answer: a,
      keywords: kw,
      vector_array: generateMockVector(`${q} ${a} ${kw}`),
      sourceTable: 'knowledge_base'
    });

    currentId++;
  }

  return result;
}

// Export the generated 5,000 items list
export const initialKnowledgeBase: KnowledgeBaseItem[] = generate5000KnowledgeItems();

// Initial `knowledgearticle` entries
export const initialKnowledgeArticles: KnowledgeArticleItem[] = [
  {
    id: "cmq0n58hn0001s2egt5hpczl7",
    sourceId: "faq:26",
    title: "โครงการแลกเปลี่ยนระยะยาวไปช่วงไหนของปี แล้วไปนานกี่เดือน?",
    content: "สำหรับโครงการแลกเปลี่ยนระยะยาว มีกำหนดเดินทางประมาณเดือนสิงหาคม - กันยายน และเดินทางกลับประมาณเดือนพฤษภาคม - มิถุนายน รวมระยะเวลาประมาณ 10 เดือน หรือ 1 ปีการศึกษาเต็ม เพื่อให้น้อง ๆ ได้ใช้ชีวิตและเรียนรู้ในต่างประเทศอย่างเต็มรูปแบบ",
    keywords: "โครงการแลกเปลี่ยนระยะยาว, 10 เดือน, 1 ปีการศึกษาเต็ม, สิงหาคม, พฤษภาคม",
    category: "โครงการแลกเปลี่ยน",
    vector: generateMockVector("โครงการแลกเปลี่ยนระยะยาวไปช่วงไหนของปี แล้วไปนานกี่เดือน? 10 เดือน 1 ปีการศึกษา"),
    sourceTable: 'knowledgearticle',
    isActive: true,
    createdAt: '2026-09-01T00:00:00Z',
    updatedAt: '2026-09-01T00:00:00Z'
  }
];

export const initialChatMessages: ChatMessage[] = [];
export const initialBroadcastLogs: BroadcastLog[] = [];

export const initialAdminUsers: AdminUser[] = [
  { 
    id: 1, 
    name: 'แอดมินหลัก (Super Admin)', 
    email: 'admin@phanx1.com', 
    password_hash: '$2a$10$xyz', 
    role: 'superadmin', 
    created_at: '2026-09-01T00:00:00Z', 
    updated_at: '2026-09-01T00:00:00Z' 
  }
];

export const initialAdmins = initialAdminUsers;

export const tableSummaries: SQLTableSummary[] = [
  { tableName: 'knowledge_base', includedInTraining: true, recordCount: 5000, purpose: 'ตารางเก็บข้อถาม-ตอบหลัก และ Vector Embeddings (1536-dim)', statusNotes: 'Active (PostgreSQL + pgvector)' },
  { tableName: 'knowledgearticle', includedInTraining: true, recordCount: 120, purpose: 'ตารางเก็บบทความยาวและ FAQ จากไฟล์อัปโหลด PDF/Docx', statusNotes: 'Active' },
  { tableName: 'chat_history_logs', includedInTraining: false, recordCount: 8420, purpose: 'ประวัติการแชทของลูกค้า พร้อมบันทึก RAG Latency และ Provider', statusNotes: 'Logging' },
  { tableName: 'line_user_profiles', includedInTraining: false, recordCount: 1250, purpose: 'ตารางข้อมูลผู้ใช้งานผ่าน LINE Official Account', statusNotes: 'CRM Sync' }
];

export const sqlTablesSummary = tableSummaries;
