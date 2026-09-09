import { initialKnowledgeBase, initialKnowledgeArticles, computeCosineSimilarity, generateMockVector } from '../data/mockData';

export interface RAGSearchResult {
  searchedTable: string;
  matchedRowId: string | number;
  similarityScore: number;
  retrievedContent: string;
  category: string;
  found: boolean;
}

export function searchSupabaseRAG(userQuery: string): RAGSearchResult {
  const queryLower = userQuery.toLowerCase().trim();
  const queryVector = generateMockVector(userQuery);

  let bestMatch: {
    item: any;
    score: number;
    table: string;
    id: string | number;
    category: string;
    content: string;
    hasKeywordMatch: boolean;
  } | null = null;

  // 1. Search in `knowledge_base`
  for (const kb of initialKnowledgeBase) {
    const textToMatch = `${kb.category} ${kb.question} ${kb.answer} ${kb.keywords}`.toLowerCase();
    
    let matchScore = 0;
    let hasKeyword = false;

    // Check specific Thai query intent matches
    if ((queryLower.includes('ทำงาน') || queryLower.includes('งาน') || queryLower.includes('อาชีพ')) && 
        (textToMatch.includes('ทำงาน') || textToMatch.includes('งาน'))) {
      matchScore += 10;
      hasKeyword = true;
    }

    if ((queryLower.includes('ประเทศ') || queryLower.includes('กี่ประเทศ') || queryLower.includes('นิวซีแลนด์') || queryLower.includes('อเมริกา') || queryLower.includes('อังกฤษ') || queryLower.includes('สิงคโปร์') || queryLower.includes('แคนาดา')) && 
        (textToMatch.includes('ประเทศ') || textToMatch.includes('อเมริกา') || textToMatch.includes('นิวซีแลนด์') || textToMatch.includes('ขั้นตอน'))) {
      matchScore += 10;
      hasKeyword = true;
    }

    if ((queryLower.includes('ทำยังไง') || queryLower.includes('ขั้นตอน') || queryLower.includes('สมัครยังไง') || queryLower.includes('เตรียมตัว')) && 
        (textToMatch.includes('ขั้นตอน') || textToMatch.includes('เตรียมตัว') || textToMatch.includes('สมัคร'))) {
      matchScore += 10;
      hasKeyword = true;
    }

    if ((queryLower.includes('ระยะยาว') || queryLower.includes('กี่เดือน') || queryLower.includes('นานกี่')) && 
        (textToMatch.includes('ระยะยาว') || textToMatch.includes('เดือน'))) {
      matchScore += 10;
      hasKeyword = true;
    }

    if ((queryLower.includes('อายุ') || queryLower.includes('ชั้น') || queryLower.includes('ม.')) && 
        (textToMatch.includes('อายุ') || textToMatch.includes('มัธยม') || textToMatch.includes('ชั้น'))) {
      matchScore += 10;
      hasKeyword = true;
    }

    if ((queryLower.includes('ภาษา') || queryLower.includes('เก่ง')) && textToMatch.includes('ภาษา')) {
      matchScore += 8;
      hasKeyword = true;
    }

    if ((queryLower.includes('คอร์ส') || queryLower.includes('ตัวต่อตัว') || queryLower.includes('แพ็กเกจ')) && 
        (textToMatch.includes('คอร์ส') || textToMatch.includes('ตัวต่อตัว') || textToMatch.includes(' starter'))) {
      matchScore += 10;
      hasKeyword = true;
    }

    if ((queryLower.includes('ราคา') || queryLower.includes('ค่าใช้จ่าย') || queryLower.includes('กี่บาท') || queryLower.includes('แพงไหม') || queryLower.includes('รุ่นที่ 20') || queryLower.includes('รุ่น 20') || queryLower.includes('เหลือ') || queryLower.includes('เต็ม')) && 
        (textToMatch.includes('บาท') || textToMatch.includes('ราคา') || textToMatch.includes('รุ่นที่ 20') || textToMatch.includes('รุ่น 20') || textToMatch.includes('เหลือ'))) {
      matchScore += 10;
      hasKeyword = true;
    }

    if ((queryLower.includes('โบร์ชัวร์') || queryLower.includes('pdf') || queryLower.includes('ดาวน์โหลด') || queryLower.includes('รีวิว') || queryLower.includes('youtube') || queryLower.includes('คลิป')) && 
        (textToMatch.includes('pdf') || textToMatch.includes('youtube') || textToMatch.includes('โบร์ชัวร์') || textToMatch.includes('รีวิว'))) {
      matchScore += 10;
      hasKeyword = true;
    }

    if ((queryLower.includes('ทุน') || queryLower.includes('ส่วนลด')) && textToMatch.includes('ทุน')) {
      matchScore += 10;
      hasKeyword = true;
    }

    if ((queryLower.includes('สอบ') || queryLower.includes('e-elt') || queryLower.includes('cefr')) && 
        (textToMatch.includes('สอบ') || textToMatch.includes('cefr'))) {
      matchScore += 10;
      hasKeyword = true;
    }

    // General token containment check
    const queryWords = queryLower.split(/[\s,?.!]+/);
    for (const w of queryWords) {
      if (w.length >= 3 && textToMatch.includes(w)) {
        matchScore += 2;
        hasKeyword = true;
      }
    }

    const vecSim = computeCosineSimilarity(queryVector, kb.vector_array || []);
    const totalScore = matchScore + (vecSim * 3);

    if (hasKeyword && (!bestMatch || totalScore > bestMatch.score)) {
      bestMatch = {
        item: kb,
        score: totalScore,
        table: 'public.knowledge_base',
        id: kb.id,
        category: kb.category,
        content: `[หมวดหมู่: ${kb.category}]\nคำถาม: ${kb.question}\nคำตอบจากคลัง DB: ${kb.answer}`,
        hasKeywordMatch: hasKeyword
      };
    }
  }

  // 2. Search in `knowledgearticle`
  for (const art of initialKnowledgeArticles) {
    const textToMatch = `${art.category} ${art.title} ${art.content} ${art.keywords}`.toLowerCase();
    
    let matchScore = 0;
    let hasKeyword = false;

    const queryWords = queryLower.split(/[\s,?.!]+/);
    for (const w of queryWords) {
      if (w.length >= 2 && textToMatch.includes(w)) {
        matchScore += 2;
        hasKeyword = true;
      }
    }

    const vecSim = computeCosineSimilarity(queryVector, art.vector || []);
    const totalScore = matchScore + (vecSim * 3);

    if (hasKeyword && (!bestMatch || totalScore > bestMatch.score)) {
      bestMatch = {
        item: art,
        score: totalScore,
        table: 'public.knowledgearticle',
        id: art.id,
        category: art.category,
        content: `[หมวดหมู่: ${art.category}]\nหัวข้อ: ${art.title}\nรายละเอียดเนื้อหาจากคลัง DB: ${art.content}`,
        hasKeywordMatch: hasKeyword
      };
    }
  }

  // Only return found = true if there was an explicit keyword/intent match!
  if (bestMatch && bestMatch.hasKeywordMatch && bestMatch.score >= 2.0) {
    const normalizedSim = Math.min(0.998, Math.max(0.915, 0.90 + (bestMatch.score * 0.008)));

    return {
      searchedTable: bestMatch.table,
      matchedRowId: bestMatch.id,
      similarityScore: parseFloat(normalizedSim.toFixed(3)),
      retrievedContent: bestMatch.content,
      category: bestMatch.category,
      found: true
    };
  }

  // Irrelevant question fallback (no false positive high score!)
  return {
    searchedTable: 'public.knowledge_base',
    matchedRowId: 0,
    similarityScore: 0.285,
    retrievedContent: '❌ ไม่พบข้อมูลที่เกี่ยวข้องในคลังความรู้ Supabase DB (Cosine Similarity < 0.70)',
    category: 'None',
    found: false
  };
}
