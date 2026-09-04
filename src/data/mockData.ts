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
    question: "โครงการแลกเปลี่ยนระยะสั้นมีประเทศอะไรให้เลือกบ้าง?",
    answer: "ปัจจุบันโครงการแลกเปลี่ยนระยะสั้นเปิดรับสมัครทั้งหมด 4 ประเทศ ได้แก่ อเมริกา อังกฤษ นิวซีแลนด์ และสิงคโปร์ โดยแต่ละประเทศจะมีรูปแบบการเรียนรู้ วัฒนธรรม และประสบการณ์ที่แตกต่างกันออกไป เพื่อให้น้อง ๆ ได้เลือกปลายทางที่เหมาะกับความสนใจและเป้าหมายของตนเอง",
    keywords: "แลกเปลี่ยนระยะสั้น, แลกเปลี่ยนอเมริกา, แลกเปลี่ยนอังกฤษ, แลกเปลี่ยนนิวซีแลนด์, แลกเปลี่ยนสิงคโปร์, ซัมเมอร์แคมป์ต่างประเทศ, ประเทศ, กี่ประเทศ",
    vector_array: generateMockVector("โครงการแลกเปลี่ยนระยะสั้นมีประเทศอะไรให้เลือกบ้าง? อเมริกา อังกฤษ นิวซีแลนด์ สิงคโปร์ กี่ประเทศ"),
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
    answer: "โครงการแลกเปลี่ยนระยะสั้น เปิดรับสมัครผู้ที่มีอายุ 10 - 22 ปี\nโครงการแลกเปลี่ยนระยะยาว เปิดรับสมัครนักเรียนอายุ 13 - 18 ปี หรือกำลังศึกษาอยู่ระดับชั้นมัธยมศึกษาปีที่ 2 - 5",
    keywords: "โครงการแลกเปลี่ยนระยะสั้น, โครงการแลกเปลี่ยนระยะยาว, อายุ 10 - 22 ปี, ม.2 - ม.5, เรียนอยู่ชั้นไหน, อายุเท่าไหร่",
    vector_array: generateMockVector("รับสมัครอายุเท่าไหร่ หรือเรียนอยู่ชั้นไหนถึงสมัครได้? 10-22 ปี ม.2-ม.5"),
    sourceTable: 'knowledge_base'
  },
  {
    id: 4,
    category: "คุณสมบัติผู้สมัคร",
    question: "ถ้าภาษาอังกฤษยังไม่เก่งมาก สมัครได้ไหม?",
    answer: "สมัครได้แน่นอนค่ะ โครงการเปิดโอกาสให้น้อง ๆ ทุกระดับภาษาเข้าร่วมได้ เพราะการเป็นนักเรียนแลกเปลี่ยนคือการเรียนรู้และพัฒนาทักษะภาษาไปพร้อมกับการใช้ชีวิตจริง ยิ่งได้ฝึกสื่อสารทุกวัน ก็ยิ่งช่วยเพิ่มความมั่นใจและพัฒนาภาษาได้อย่างรวดเร็ว",
    keywords: "คุณสมบัติเปิดกว้าง, ทุกระดับภาษา, เรียนรู้และพัฒนาทักษะ, ไม่เก่งภาษา",
    vector_array: generateMockVector("ถ้าภาษาอังกฤษยังไม่เก่งมาก สมัครได้ไหม? เปิดรับทุกระดับภาษา"),
    sourceTable: 'knowledge_base'
  },
  {
    id: 5,
    category: "การเตรียมตัว",
    question: "ต้องสอบวัดระดับภาษาอังกฤษก่อนเข้าร่วมโครงการไหม?",
    answer: "ทางสถาบันมีระบบสอบวัดระดับภาษา (E-ELT) ฟรี ให้คำปรึกษาและประเมินระดับ CEFR (A1-B2) ก่อนเดินทางเพื่อเตรียมความพร้อมได้อย่างตรงจุดค่ะ",
    keywords: "สอบวัดระดับ, E-ELT, CEFR, ประเมินภาษา",
    vector_array: generateMockVector("ต้องสอบวัดระดับภาษาอังกฤษก่อนเข้าร่วมโครงการไหม? E-ELT CEFR"),
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
    answer: "โครงการของเราเป็นโครงการแลกเปลี่ยนทางการศึกษาและเรียนต่อต่างประเทศโดยตรงด้วยวีซ่านักเรียน (เช่น J-1/F-1) จึงไม่สามารถรับจ้างทำงานหรือทำงานพาร์ทไทม์ได้อย่างถูกกฎหมายค่ะ (เน้นการเรียนและแลกเปลี่ยนวัฒนธรรมเท่านั้น)",
    keywords: "ไปทำงาน, ทำงานต่างประเทศ, ทำงานพาร์ทไทม์, อยากไปทำงาน, รับจ้างทำงาน, วีซ่านักเรียน",
    vector_array: generateMockVector("เข้าร่วมโครงการแล้วสามารถทำงานต่างประเทศหรือทำงานพาร์ทไทม์ได้ไหม? ไม่ได้เป็นโครงการจัดหางาน วีซ่านักเรียน"),
    sourceTable: 'knowledge_base'
  },
  {
    id: 8,
    category: "โครงการแลกเปลี่ยนระยะสั้น",
    question: "รายละเอียดและราคาโครงการแลกเปลี่ยนระยะสั้น รุ่นที่ 12 มีประเทศอะไรบ้าง ราคาเท่าไหร่?",
    answer: "โค้งสุดท้าย! โครงการแลกเปลี่ยนระยะสั้นช่วงปิดเทอม รุ่นที่ 12 (เดินทาง มี.ค.-เม.ย. 2567):\n\n🇺🇸 อเมริกา:\n• 2 สัปดาห์: 169,000 บาท\n• 3 สัปดาห์: 199,000 บาท (🔥 เหลือ 2 ที่สุดท้าย!)\n• 4 สัปดาห์: เต็มแล้ว\n\n🇬🇧 อังกฤษ:\n• 2 สัปดาห์: 159,000 บาท\n• 4 สัปดาห์ (เมืองอ็อกฟอร์ด): 229,000 บาท (🔥 เหลือ 1 ที่สุดท้าย!)\n• 4 สัปดาห์ (เมืองลอนดอน): เต็มแล้ว\n\n🇸🇬 สิงคโปร์:\n• 5 วัน 4 คืน: 49,000 บาท ✨\n\n🇳🇿 นิวซีแลนด์:\n• 3 สัปดาห์: 199,000 บาท (เต็มแล้ว)\n\n🇨🇦 แคนาดา:\n• 4 สัปดาห์: เต็มแล้ว\n\n📄 ดาวน์โหลดโบร์ชัวร์รายละเอียด PDF: https://www.engenius.co.th/wp-content/uploads/2024/01/Short-Exchange-Programs-รุ่นที่-12-2.pdf\n🎬 ชมรีวิวทริปประเทศอังกฤษ: https://www.youtube.com/watch?v=QL9vlMkJ1D0&t=1s",
    keywords: "รุ่นที่ 12, ราคา, ค่าใช้จ่าย, 169,000, 159,000, 199,000, 229,000, 49,000, 5 วัน 4 คืน, สิงคโปร์, 2 สัปดาห์, 3 สัปดาห์, 4 สัปดาห์, โบร์ชัวร์, pdf, รีวิว, youtube, อ็อกฟอร์ด, อเมริกา, อังกฤษ, นิวซีแลนด์, แคนาดา, เหลือกี่ที่, เต็มหรือยัง",
    vector_array: generateMockVector("รายละเอียดและราคาโครงการแลกเปลี่ยนระยะสั้น รุ่นที่ 12 อเมริกา 169000 199000 อังกฤษ 159000 229000 สิงคโปร์ 49000 5วัน4คืน นิวซีแลนด์ 199000 PDF YouTube"),
    sourceTable: 'knowledge_base'
  },
  {
    id: 9,
    category: "โบร์ชัวร์และรีวิว",
    question: "มีโบร์ชัวร์รายละเอียดโครงการและคลิปรีวิวไหม?",
    answer: "สามารถดูเอกสารโบร์ชัวร์และคลิปรีวิวประสบการณ์จริงได้ที่นี่ค่ะ:\n📄 โบร์ชัวร์ PDF รายละเอียดโครงการระยะสั้น รุ่นที่ 12: https://www.engenius.co.th/wp-content/uploads/2024/01/Short-Exchange-Programs-รุ่นที่-12-2.pdf\n🎬 คลิปวิดีโอรีวิวทริปประเทศอังกฤษบน YouTube: https://www.youtube.com/watch?v=QL9vlMkJ1D0&t=1s",
    keywords: "โบร์ชัวร์, pdf, เอกสาร, รายละเอียด, คลิป, รีวิว, youtube, วิดีโอ, ดูรีวิว, ขอโบร์ชัวร์, ลิงก์",
    vector_array: generateMockVector("โบร์ชัวร์ PDF รายละเอียดโครงการระยะสั้น รุ่นที่ 12 คลิปวิดีโอรีวิวทริปประเทศอังกฤษ YouTube"),
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
