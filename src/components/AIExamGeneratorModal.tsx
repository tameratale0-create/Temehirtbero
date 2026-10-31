import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  CheckCircle2,
  Clock,
  Layers,
  HelpCircle,
  AlertCircle,
  FileCheck,
  ChevronRight,
  Play,
  Check,
  X,
  Edit,
  Building2,
  RotateCcw,
  Sliders,
  Plus,
  Minus,
  Copy,
  Hash,
  FileText,
  Filter,
  Timer,
  ListOrdered,
  CheckSquare
} from 'lucide-react';
import { TrainingMaterial, TeacherExam, ExamQuestion, Language } from '../types';
import { StorageService } from '../utils/storage';

interface AIExamGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExamCreated: (createdExam: TeacherExam) => void;
  onTakeExamNow?: (exam: TeacherExam) => void;
  initialMaterialId?: string;
  currentLang?: Language;
}

// Sample training materials ready for instant 1-click loading in Amharic & Afaan Oromoo
interface SampleTrainingTemplate {
  badge: string;
  label: string;
  lang: 'am' | 'om';
  title: string;
  subject: string;
  content: string;
}

const SAMPLE_TRAINING_TEXTS: SampleTrainingTemplate[] = [
  {
    badge: 'አማርኛ · ምዘና',
    label: 'የቀጣይነት ያለው የተማሪዎች ምዘና (Continuous Assessment)',
    lang: 'am',
    title: 'የቀጣይነት ያለው የተማሪዎች ምዘና (Continuous Assessment) እና የፈተና ጥያቄዎች አዘገጃጀት መመሪያ',
    subject: 'Assessment & Pedagogy (ምዘና እና ስነ-ዘዴ)',
    content: `የሻሸመኔ ከተማ አስተዳደር ትምህርት ቢሮ - የቀጣይነት ያለው ምዘና እና የፈተና አዘገጃጀት ይፋዊ የስልጠና ሰነድ፡

ምዕራፍ 1፡ የቀጣይነት ያለው ምዘና (Continuous Assessment) ጽንሰ-ሀሳብና ፋይዳ
1.1 የምዘና አይነቶች ልዩነት፡
- መመርመሪያ ምዘና (Diagnostic Assessment)፡ ትምህርቱ ከመጀመሩ በፊት የተማሪዎችን የቀደመ እውቀት (Prior Knowledge) ለመፈተሽ የሚያገለግል።
- ማሻሻያ ምዘና (Formative Assessment)፡ በመማር ማስተማር ሂደት ውስጥ የተማሪዎችን ግንዛቤ ለመፈተሽ፣ የመማር ክፍተቶችን ለመለየትና የማስተማሪያ ስልትን ለማስተካከል የሚረዳ ቀጣይነት ያለው ምዘና።
- ማጠቃለያ ምዘና (Summative Assessment)፡ በሴሚስተር ወይም በዓመት መጨረሻ የተማሪውን አጠቃላይ እውቀትና ክህሎት በመለካት የውጤት ውሳኔ ለመስጠት የሚያገለግል።
1.2 ቀጣይነት ያለው ምዘና የሚካተቱ ክፍሎች፡
የክፍል ውስጥ ተሳትፎ (10%)፣ የቤት ስራና የተግባር ፕሮጀክት (15%)፣ አጫጭር የፈተና ጥያቄዎች/ኩዊዞች (15%) እና ወርሃዊ ፈተናዎች (20%)።

ምዕራፍ 2፡ የብሉም ታክሶኖሚ (Bloom's Taxonomy) ደረጃዎችን የጠበቀ የፈተና አዘገጃጀት
ፈተናዎችን ሲያዘጋጁ ጥያቄዎች በአንድ ደረጃ ብቻ እንዳይወሰኑ በሚከተሉት የብቃት ደረጃዎች መከፋፈል አለባቸው፡
1. ማስታወስና እውቀት (Remembering/Knowledge)፡ ቀመሮችን፣ ፍቺዎችን፣ ታሪካዊ ቀኖችን ማስታወስ (25-30%)።
2. ግንዛቤ (Understanding/Comprehension)፡ ሀሳቦችን በራስ አገላለጽ ማብራራትና ማነፃፀር (25-30%)።
3. ተግባራዊ ማድረግ (Application)፡ የቀሰሙትን እውቀት በአዲስ ሁኔታ ወይም በተግባራዊ ችግር ላይ መተርጎም (20-25%)።
4. ትንተና እና ግምገማ (Analysis & Evaluation)፡ የመረጃ ክፍሎችን መተንተን፣ መንስኤና ውጤትን መለየት፣ ትክክለኛውን ምርጫ መገምገም (15-20%)።

ምዕራፍ 3፡ ደረጃቸውን የጠበቁ ምርጫ ጥያቄዎች (Multiple Choice Questions) አፃፃፍ ህጎች
- ዋናው የጥያቄ ግንድ (Stem) ግልጽ፣ ቀጥተኛና አሻሚ ቃላት የሌሉት መሆን አለበት።
- አማራጮች (Options) በአወቃቀር እና በርዝመት ተመጣጣኝ መሆን አለባቸው።
- አሳሳች አማራጮች (Distractors) ተማሪዎች በተለምዶ የሚሰሩትን ስህተት መሰረት ያደረጉ ምክንያታዊ ምርጫዎች መሆን አለባቸው።
- "ከላይ የተጠቀሱት ሁሉም" ወይም "መልሱ አልተሰጠም" የሚሉ አማራጮችን ከመጠቀም መቆጠብ ይመረጣል።`
  },
  {
    badge: 'Afaan Oromoo · Madaallii',
    label: 'Tooftaalee Madaallii Walitti Fufaa fi Qophii Qormaataa',
    lang: 'om',
    title: 'Tooftaalee Madaallii Walitti Fufaa (Continuous Assessment) fi Qophii Qormaataa Barsiisotaa',
    subject: 'Afaan Oromoo fi Madaallii (Pedagogy & Assessment)',
    content: `Biiroo Barnootaa Bulchiinsa Magaalaa Shashamannee - Qajeelfama Leenjii Madaallii Walitti Fufaa fi Qophii Qormaata Barsiisotaa:

Boqonnaa 1: Yaada-Rimee Madaallii Walitti Fufaa (Concept of Continuous Assessment)
1.1 Garaagarummaa Madaalliiwwanii:
- Madaallii Adda Baasaa (Diagnostic Assessment): Adeemsi baruu-barsiisuu osoo hin eegalamin dura beekumsa duraanii barattootaa sakatta'uuf kan tajaajiluudha.
- Madaallii Hojiirraa (Formative Assessment): Yeroo baruu-barsiisuu keessatti hanqinaalee hubannoo barattootaa yeroon adda baasuuf, tarsiimoo barsiisaa fooyyessuuf fi barattoota deeggaruuf oola.
- Madaallii Xumuraa (Summative Assessment): Xumura semisteeraa yookiin waggaa irratti qabxii fi sadarkaa barataa murteessuuf kan gaggeeffamuudha.
1.2 Qoodiinsa Qabxii Madaallii Walitti Fufaa:
Hirmaannaa daree (10%), Hojii manaa fi Pirojektii (15%), Qormaata gaggabaaboo/Kwiizii (15%), fi Qormaata Ji'aa (20%).

Boqonnaa 2: Sadarkaalee Bloom (Bloom's Taxonomy) Eeggachuun Gaaffilee Qopheessuu
Barsiisaan gaaffilee qopheessu sadarkaalee yaaduu ol'aanoo fi gadi-aanoo wal-madaalchisuu qaba:
1. Yaadachuu fi Beekumsa (Remembering): Hiika, seera, fi yaad-rimee bu'uuraa yaadachuu (25-30%).
2. Hubannoo (Understanding): Yaada tokko afaan ofiitiin ibsuu, fakkeenya kennuu fi adda baasuu (25-30%).
3. Hojiirra Oolchuu (Application): Beekumsa argatan haala haaraa fi rakkina qabatamaa irratti itti fayyadamuu (20-25%).
4. Xiinxala fi Madaallii (Analysis & Evaluation): Qabiyyee adda qooduun sababaa fi bu'aa wal-simsiisuu, murtii sirrii kennuu (15-20%).

Boqonnaa 3: Qajeelfama Qophii Gaaffilee Filannoo (Multiple Choice Questions)
- Utubaan gaaffichaa (Stem) ifaa, gabaabaa fi iftoomina kan qabu ta'uu qaba.
- Filannoowwan dhiyaatan (Options) dheerinaa fi caasaadhaan wal-fakkaachuu qabu.
- Deebii ijaarsaa (feedback) guyyoota 3 keessatti barataaf kennuu.`
  },
  {
    badge: 'አማርኛ · ቴክኖሎጂ',
    label: 'ዲጂታል ቴክኖሎጂንና አይሲቲን (ICT) በክፍል ውስጥ ማዋሃድ',
    lang: 'am',
    title: 'ዲጂታል ቴክኖሎጂንና አይሲቲን (ICT) በክፍል ማስተማሪያነት የማዋሃድ ስነ-ዘዴ',
    subject: 'Educational Technology & ICT (የትምህርት ቴክኖሎጂ)',
    content: `የሻሸመኔ ከተማ አስተዳደር ትምህርት ቢሮ - አይሲቲን በማስተማር ስነ-ዘዴ ውስጥ የማዋሃድ ስልጠና፡

ምዕራፍ 1፡ አይሲቲን የማዋሃድ አስፈላጊነት በትምህርት ቤቶች
1.1 ተማሪዎችን በእይታ እና በድምፅ (Multimedia) መደገፍ ረቂቅ የሳይንስና የሂሳብ ሀሳቦችን በቀላሉ እንዲረዱ ያደርጋል።
1.2 በ 21ኛው ክፍለ-ዘመን ተማሪዎች የዲጂታል ክህሎት (Digital Literacy) እንዲኖራቸው የመማሪያ ክፍሉ ቁልፍ ሚና ይጫወታል።

ምዕራፍ 2፡ ከመስመር ውጪ (Offline) የሚሰሩ የዲጂታል ትምህርት መሳሪያዎች
- ፊፕላኔት (PhET Interactive Simulations)፡ የፊዚክስ፣ ኬሚስትሪ እና ባዮሎጂ ላብራቶሪ ሙከራዎችን ያለ ኢንተርኔት በኮምፒውተር ወይም በሞባይል በተግባር ማሳየት።
- ካሊብሪ (Kolibri) እና ኪዊክስ (Kiwix)፡ ኢንተርኔት በሌለበት ሁኔታ የዊኪፔዲያ እና የኦንላይን መማሪያ መጽሐፍትን ማጋራት።
- ጂኦጄብራ (GeoGebra)፡ የጂኦሜትሪ ቅርጾችንና ግራፎችን በቀላሉ መንደፍ።

ምዕራፍ 3፡ የተማሪዎችን ንቁ ተሳትፎ ማሳደግ
- የቪዲዮ ክሊፖችን ማሳየት ብቻ ሳይሆን ከቪዲዮው በፊትና በኋላ ጥያቄዎችን በመጠየቅ ውይይት ማስነሳት።
- ተማሪዎች ዲጂታል መሳሪያዎችን ለትምህርት ብቻ እንዲጠቀሙ ህግ ማውጣት እና የዲጂታል ስነ-ምግባርን ማስተማር።`
  },
  {
    badge: 'Afaan Oromoo · Pedagogy',
    label: 'Geggeessummaa Daree Ammayyaa fi Barnoota Hunda-Hammatoo',
    lang: 'om',
    title: 'Geggeessummaa Daree Ammayyaa, Naamusa Gaarii fi Barnoota Hunda-Hammatoo',
    subject: 'Ogummaa Barsiisummaa (General Pedagogy)',
    content: `Biiroo Barnootaa Bulchiinsa Magaalaa Shashamannee - Qajeelfama Geggeessummaa Daree fi Barnoota Hunda-Hammatoo:

Boqonnaa 1: Yaada-Rimee Barnoota Hunda-Hammatoo (Inclusive Education)
1.1 Barattoonni dandeettii, qaamaa, fi haala jireenyaatiin garaagara ta'anis hundi isaanii mirga baruu qabu.
1.2 Barsiisaan barattoota fedhii addaa qaban (kanneen dhageettii, argama, yookiin qaamaa irratti rakkina qaban) adda baasee daree keessatti hirmaachisuu qaba:
- Barattoota argamni isaanii laafaa ta'e fuuldura teessisuu fi barreeffama gabatee bal'isanii barreessuu.
- Barattoota ariitiin baruu hin dandeenyeef yeroo dabalataa fi gargaarsa qeenxee kennuu.

Boqonnaa 2: Naamusa Gaarii fi Qajeelfama Daree (Positive Discipline)
2.1 Adabbii qaamaa fi jecha salphisaa fayyadamuun guutummaatti dhorkaadha.
2.2 Dambiiwwan daree barattoota hirmaachisuun baasuu fi gabatee daree irratti maxxansuu.
2.3 Amala gaarii jajjabeessuu: Barattoota naamusa qabaniif galata afaanii fi beekamtii kennuun warra kaan kakaasuu.

Boqonnaa 3: Hirmaannaa Barattootaa Daree Keessatti Guddisuu
- Tarsiimoo "Think-Pair-Share" (Yaadi - Waliin Qoodi - Dareef Ibsi) hojiirra oolchuu.
- Barattoonni akkaataa gareetiin wal-deeggaranii akka hojjetan gochuu.`
  }
];

export const AIExamGeneratorModal: React.FC<AIExamGeneratorModalProps> = ({
  isOpen,
  onClose,
  onExamCreated,
  onTakeExamNow,
  initialMaterialId,
  currentLang = 'am'
}) => {
  const materials = StorageService.getTrainingMaterials();

  // Find initial material or fallback to first
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>(
    initialMaterialId || materials[0]?.id || ''
  );

  // Filter materials by language
  const [materialLangFilter, setMaterialLangFilter] = useState<'all' | 'am' | 'om' | 'en'>('all');

  const filteredMaterials = materials.filter((m) => {
    if (materialLangFilter === 'all') return true;
    if (materialLangFilter === 'om') {
      return (
        m.subject?.toLowerCase().includes('orom') ||
        m.title.toLowerCase().includes('afaan oromoo') ||
        m.title.toLowerCase().includes('tooftaalee') ||
        m.title.toLowerCase().includes('geggeessummaa')
      );
    }
    if (materialLangFilter === 'en') {
      return (
        m.subject?.toLowerCase().includes('eng') ||
        m.title.toLowerCase().includes('english') ||
        m.title.toLowerCase().includes('clt')
      );
    }
    // 'am' default
    return (
      !m.subject?.toLowerCase().includes('orom') &&
      !m.subject?.toLowerCase().includes('eng')
    );
  });

  const selectedMaterial =
    filteredMaterials.find((m) => m.id === selectedMaterialId) ||
    filteredMaterials[0] ||
    materials[0];

  // Config parameters:
  const [numQuestions, setNumQuestions] = useState<number>(5);
  const [numExams, setNumExams] = useState<number>(1);
  // 1. አንድ ጥያቄ ስንት ደቂቃ ይቆይ (Time per question in minutes, e.g. 1, 2, 3...)
  const [timePerQuestion, setTimePerQuestion] = useState<number>(2);
  // 2. የፈተናው ሙሉ ጥያቄ ይድረሰው ወይስ አንድን ጥያቄ ሰርቶ ሲጨርስ ቀጣይ ጥያቄ ይደረሰው (Delivery Mode)
  const [deliveryMode, setDeliveryMode] = useState<'one_by_one' | 'all_at_once'>('one_by_one');
  const [difficulty, setDifficulty] = useState<'standard' | 'advanced'>('standard');
  const [selectedLang, setSelectedLang] = useState<string>(
    selectedMaterial?.subject?.toLowerCase().includes('orom') ? 'om' : 'am'
  );

  // Custom text option
  const [useCustomContent, setUseCustomContent] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customSubject, setCustomSubject] = useState('Pedagogy & Curriculum');
  const [customContent, setCustomContent] = useState('');
  const [loadedSampleName, setLoadedSampleName] = useState<string | null>(null);

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Result state
  const [generatedExams, setGeneratedExams] = useState<TeacherExam[]>([]);
  const [activeExamIndex, setActiveExamIndex] = useState<number>(0);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenerationError(null);

    const titleToUse = useCustomContent ? customTitle.trim() : selectedMaterial?.title;
    const subjectToUse = useCustomContent ? customSubject.trim() : selectedMaterial?.subject;
    const contentToUse = useCustomContent ? customContent.trim() : selectedMaterial?.fullContent;
    const gradeLevelsToUse = useCustomContent ? 'Grades 7 - 12' : selectedMaterial?.gradeLevels;

    if (!titleToUse || !contentToUse) {
      setGenerationError('እባክዎ የስልጠና ርዕስ እና የስልጠናውን ፅሁፍ ይምረጡ ወይም ያስገቡ።');
      setIsGenerating(false);
      return;
    }

    const safeQuestionsCount = Math.min(Math.max(Number(numQuestions) || 5, 1), 30);
    const safeExamsCount = Math.min(Math.max(Number(numExams) || 1, 1), 5);

    try {
      const response = await fetch('/api/generate-exam', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          trainingTitle: titleToUse,
          subject: subjectToUse,
          gradeLevels: gradeLevelsToUse,
          trainingContent: contentToUse,
          numQuestions: safeQuestionsCount,
          numExams: safeExamsCount,
          language: selectedLang,
          difficulty
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();
      const examSetsFromData =
        Array.isArray(data.exams) && data.exams.length > 0 ? data.exams : [data];

      const modelLetters = ['A', 'B', 'C', 'D', 'E'];
      const timestamp = Date.now();

      const createdExams: TeacherExam[] = examSetsFromData.map((exItem: any, eIdx: number) => {
        const mappedQuestions: ExamQuestion[] = (exItem.questions || []).map(
          (q: any, qIdx: number) => ({
            id: `ai-q-${timestamp}-${eIdx}-${qIdx}`,
            questionText: q.questionText || `ጥያቄ ${qIdx + 1}`,
            options:
              Array.isArray(q.options) && q.options.length >= 2
                ? q.options
                : ['ምርጫ 1', 'ምርጫ 2', 'ምርጫ 3', 'ምርጫ 4'],
            correctIndex: typeof q.correctIndex === 'number' ? q.correctIndex : 0,
            explanation: q.explanation || 'ከስልጠናው ይዘት የተወሰደ ማብራሪያ'
          })
        );

        const modelLabel =
          examSetsFromData.length > 1 ? ` - ሞዴል ${modelLetters[eIdx] || eIdx + 1}` : '';
        const defaultTitle = `${titleToUse} - የብቃት መመዘኛ ፈተና (በ AI የተዘጋጀ)${modelLabel}`;

        const calculatedDuration = timePerQuestion > 0
          ? Math.max(timePerQuestion * safeQuestionsCount, 5)
          : (exItem.durationMinutes || safeQuestionsCount * 3);

        return {
          id: `exam-ai-${timestamp}-${eIdx}`,
          title: exItem.examTitle || defaultTitle,
          subject: subjectToUse || 'Pedagogy',
          targetCategory: 'all',
          targetGradeLevels: gradeLevelsToUse || 'All Grades',
          durationMinutes: calculatedDuration,
          timePerQuestionMinutes: timePerQuestion > 0 ? timePerQuestion : undefined,
          deliveryMode: deliveryMode,
          totalMarks: 100,
          passingScore: exItem.passingScore || 70,
          questions: mappedQuestions,
          instructions:
            exItem.instructions ||
            'ይህ ፈተና ከሻሸመኔ ከተማ አስተዳደር ትምህርት ቢሮ ይፋዊ የስልጠና ሰነድ በቀጥታ በ AI ተዘጋጅቶ የወጣ የመምህራን ብቃት መመዘኛ ነው።',
          status: 'active',
          createdAt: new Date().toISOString().split('T')[0],
          deadline: '2025-12-30',
          sourceTrainingMaterialId: useCustomContent ? undefined : selectedMaterial?.id,
          sourceTrainingTitle: titleToUse,
          generatedByAI: true
        };
      });

      setGeneratedExams(createdExams);
      setActiveExamIndex(0);
    } catch (err: any) {
      console.warn('AI Exam generation request note:', err);
      setGenerationError('ፈተናውን በ AI ለማመንጨት አልተቻለም። እባክዎ እንደገና ይሞክሩ።');
    } finally {
      setIsGenerating(false);
    }
  };

  const currentActiveExam = generatedExams[activeExamIndex] || null;

  const updateQuestionInActiveExam = (
    questionIdx: number,
    updater: (prevQuestion: ExamQuestion) => ExamQuestion
  ) => {
    setGeneratedExams((prevExams) =>
      prevExams.map((exam, eIdx) => {
        if (eIdx !== activeExamIndex) return exam;
        const newQuestions = exam.questions.map((q, qIdx) =>
          qIdx === questionIdx ? updater(q) : q
        );
        return { ...exam, questions: newQuestions };
      })
    );
  };

  const handleSaveAllToRegistry = () => {
    if (generatedExams.length === 0) return;

    generatedExams.forEach((exam) => {
      StorageService.addExam(exam);
    });

    onExamCreated(generatedExams[0]);
    onClose();
  };

  const handleTakeImmediately = () => {
    if (!currentActiveExam) return;

    // Save all to storage first
    generatedExams.forEach((exam) => {
      StorageService.addExam(exam);
    });

    onExamCreated(currentActiveExam);
    if (onTakeExamNow) {
      onTakeExamNow(currentActiveExam);
    }
    onClose();
  };

  const handleApplySample = (sample: SampleTrainingTemplate) => {
    setCustomTitle(sample.title);
    setCustomSubject(sample.subject);
    setCustomContent(sample.content);
    setSelectedLang(sample.lang);
    setLoadedSampleName(sample.label);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
        {/* Header with AI Theme */}
        <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-indigo-950 p-5 sm:p-6 text-white shrink-0 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

          <div className="relative z-10 flex items-start justify-between gap-3">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/40 text-[11px] font-bold text-amber-200">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                <span>የሻሸመኔ ትምህርት ቢሮ ይፋዊ የፈተና ማውጫ · ፈተና የማውጣት ስልጣን የትምህርት ቢሮ ብቻ ነው</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                ከስልጠና ፅሁፍ በ AI ፈተና አውጣ (AI Exam Generator)
              </h2>
              <p className="text-xs text-emerald-100/90 leading-relaxed max-w-xl">
                ከስልጠና ሰነድ በቀጥታ በ AI ቴክኖሎጂ የሚፈለገውን ያህል የጥያቄዎች እና የፈተና ሞዴሎች ብዛት በማስገባት
                ፈታኝና ሚዛናዊ የሆኑ የመምህራን ብቃት መመዘኛዎችን ማመንጨት ይችላሉ።
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 bg-white/10 hover:bg-white/20 rounded-full text-slate-200 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs sm:text-sm">
          {/* Step 1: Configuration Form (When no exams generated yet) */}
          {generatedExams.length === 0 ? (
            <div className="space-y-5">
              {/* Choose Source Mode */}
              <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                <button
                  type="button"
                  onClick={() => setUseCustomContent(false)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    !useCustomContent
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5 text-amber-300" />
                  <span>ከትምህርት ቢሮ ይፋዊ የስልጠና ሰነዶች ምረጥ ({materials.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setUseCustomContent(true)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    useCustomContent
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>የራስዎን የስልጠና ፅሁፍ ያስገቡ / የምሳሌ ፅሁፎች</span>
                </button>
              </div>

              {!useCustomContent ? (
                /* Select Existing Training Material */
                <div className="space-y-3">
                  {/* Language Filter for official documents */}
                  <div className="flex items-center gap-1.5 flex-wrap pb-1">
                    <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1 mr-1">
                      <Filter className="w-3 h-3 text-emerald-600" />
                      <span>ቋንቋ ይምረጡ፡</span>
                    </span>
                    {[
                      { key: 'all', label: `ሁሉም (${materials.length})` },
                      { key: 'am', label: 'አማርኛ (Amharic)' },
                      { key: 'om', label: 'Afaan Oromoo' },
                      { key: 'en', label: 'English' }
                    ].map((tab) => (
                      <button
                        key={tab.key}
                        type="button"
                        onClick={() => {
                          const filterKey = tab.key as any;
                          setMaterialLangFilter(filterKey);
                          // find first matching material
                          const firstMatch = materials.find((m) => {
                            if (filterKey === 'all') return true;
                            if (filterKey === 'om') {
                              return (
                                m.subject?.toLowerCase().includes('orom') ||
                                m.title.toLowerCase().includes('afaan oromoo') ||
                                m.title.toLowerCase().includes('tooftaalee') ||
                                m.title.toLowerCase().includes('geggeessummaa')
                              );
                            }
                            if (filterKey === 'en') {
                              return (
                                m.subject?.toLowerCase().includes('eng') ||
                                m.title.toLowerCase().includes('english')
                              );
                            }
                            return (
                              !m.subject?.toLowerCase().includes('orom') &&
                              !m.subject?.toLowerCase().includes('eng')
                            );
                          });
                          if (firstMatch) {
                            setSelectedMaterialId(firstMatch.id);
                            if (firstMatch.subject?.toLowerCase().includes('orom')) {
                              setSelectedLang('om');
                            } else if (firstMatch.subject?.toLowerCase().includes('eng')) {
                              setSelectedLang('en');
                            } else {
                              setSelectedLang('am');
                            }
                          }
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                          materialLangFilter === tab.key
                            ? 'bg-emerald-700 text-white shadow-2xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      ጥያቄ የሚወጣበት የስልጠና ሞጁል ይምረጡ *
                    </label>
                    <select
                      value={selectedMaterial?.id || selectedMaterialId}
                      onChange={(e) => {
                        const newId = e.target.value;
                        setSelectedMaterialId(newId);
                        const mat = materials.find((m) => m.id === newId);
                        if (mat?.subject?.toLowerCase().includes('orom')) {
                          setSelectedLang('om');
                        } else if (mat?.subject?.toLowerCase().includes('eng')) {
                          setSelectedLang('en');
                        } else {
                          setSelectedLang('am');
                        }
                      }}
                      className="w-full px-3.5 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                    >
                      {filteredMaterials.map((m) => (
                        <option key={m.id} value={m.id}>
                          [{m.subject}] {m.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Selected Material Preview Card */}
                  {selectedMaterial && (
                    <div className="bg-emerald-50/70 border border-emerald-200/90 rounded-2xl p-4 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-950 border border-emerald-300">
                          {selectedMaterial.subject}
                        </span>
                        <span className="text-[10px] text-slate-500 font-semibold">
                          ደረጃ፡ {selectedMaterial.gradeLevels} · ንባብ፡ {selectedMaterial.readTimeMinutes} ደቂቃ
                        </span>
                      </div>
                      <h4 className="font-black text-slate-900 text-xs sm:text-sm">
                        {selectedMaterial.title}
                      </h4>
                      <p className="text-xs text-slate-600 line-clamp-2">
                        {selectedMaterial.summary}
                      </p>
                      <div className="pt-1 text-[11px] text-emerald-800 font-semibold flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>አዘጋጅ፡ {selectedMaterial.authorDepartment}</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Custom Content Form with Quick Sample Training Texts */
                <div className="space-y-4">
                  {/* Quick Sample Training Texts in Amharic & Afaan Oromoo */}
                  <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50 border border-emerald-200 rounded-2xl p-3.5 space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-xs font-black text-emerald-950">
                        <Sparkles className="w-4 h-4 text-emerald-700" />
                        <span>የስልጠና ፅሁፍ ምሳሌዎች (Sample Training Texts በአማርኛ እና በኦሮሚኛ)</span>
                      </div>
                      <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                        አንዲን ጠቅ ያድርጉ
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600">
                      የ AI ፈተና አወጣጥን ለመሞከር ከዚህ በታች ካሉት አርአያነት ያላቸው የስልጠና ሰነዶች አንዱን ይምረጡ፤
                      ፎርሙ በቅጽበት ይሞላል፦
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {SAMPLE_TRAINING_TEXTS.map((sample, sIdx) => {
                        const isSelected = customTitle === sample.title;
                        return (
                          <button
                            key={sIdx}
                            type="button"
                            onClick={() => handleApplySample(sample)}
                            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                              isSelected
                                ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs'
                                : 'bg-white text-slate-800 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50/50'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <span
                                className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                                  isSelected
                                    ? 'bg-white/20 text-white'
                                    : 'bg-emerald-100 text-emerald-950'
                                }`}
                              >
                                {sample.badge}
                              </span>
                              <span
                                className={`text-[10px] font-bold ${
                                  isSelected ? 'text-amber-200' : 'text-slate-500'
                                }`}
                              >
                                {sample.lang === 'om' ? 'Afaan Oromoo' : 'አማርኛ'}
                              </span>
                            </div>
                            <span className="text-xs font-bold line-clamp-1">{sample.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    {loadedSampleName && (
                      <div className="bg-emerald-100 text-emerald-950 border border-emerald-300 p-2 rounded-xl text-[11px] font-bold flex items-center gap-1.5 animate-in fade-in">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span>የተመረጠ ምሳሌ፡ "{loadedSampleName}" ተሞልቷል!</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        የስልጠናው ርዕስ (Training Title) *
                      </label>
                      <input
                        type="text"
                        value={customTitle}
                        onChange={(e) => setCustomTitle(e.target.value)}
                        placeholder="ምሳሌ፡ የትምህርት ቤት አመራር እና የስራ ክንውን መገምገሚያ"
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        የትምህርት መስክ (Subject)
                      </label>
                      <input
                        type="text"
                        value={customSubject}
                        onChange={(e) => setCustomSubject(e.target.value)}
                        placeholder="ምሳሌ፡ Educational Leadership / Pedagogy"
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      የስልጠናው ይዘት / ፅሁፍ (Training Text) *
                    </label>
                    <textarea
                      rows={6}
                      value={customContent}
                      onChange={(e) => setCustomContent(e.target.value)}
                      placeholder="የስልጠናውን ፅሁፍ፣ መመሪያዎች ወይም ቁልፍ ነጥቦች እዚህ ይለጥፉ..."
                      className="w-full p-3 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-hidden leading-relaxed font-sans"
                    />
                  </div>
                </div>
              )}

              {/* DEDICATED FORM INPUT FIELDS FOR QUESTIONS COUNT AND EXAMS COUNT */}
              <div className="bg-slate-50/90 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                  <Sliders className="w-4 h-4 text-emerald-700" />
                  <span className="font-black text-slate-900 text-xs sm:text-sm">
                    የፈተና እና የጥያቄዎች ብዛት ማስተካከያ ፎርም (Exam & Question Configuration)
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 1. INPUT FIELD: AI የሚያወጣቸው ጥያቄዎች ብዛት ማስገቢያ */}
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <label className="block text-xs font-black text-slate-900 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-emerald-600" />
                        <span>AI የሚያወጣቸው ጥያቄዎች ብዛት (ማስገቢያ)*</span>
                      </label>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        {numQuestions} ጥያቄዎች
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setNumQuestions((prev) => Math.max(1, prev - 1))}
                        className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition-colors cursor-pointer shrink-0"
                        title="ቀንስ"
                      >
                        <Minus className="w-4 h-4" />
                      </button>

                      <input
                        type="number"
                        min={1}
                        max={30}
                        value={numQuestions}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          if (!isNaN(val)) {
                            setNumQuestions(Math.min(30, Math.max(1, val)));
                          } else {
                            setNumQuestions(1);
                          }
                        }}
                        className="flex-1 text-center font-black text-base sm:text-lg text-slate-900 py-1.5 px-3 bg-slate-50 border-2 border-emerald-500/40 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                      />

                      <button
                        type="button"
                        onClick={() => setNumQuestions((prev) => Math.min(30, prev + 1))}
                        className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition-colors cursor-pointer shrink-0"
                        title="ጨምር"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Quick Preset Buttons for Questions Count */}
                    <div className="flex items-center flex-wrap gap-1.5 pt-1">
                      <span className="text-[10px] font-bold text-slate-500">ፈጣን ምርጫ፡</span>
                      {[3, 5, 8, 10, 15, 20].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setNumQuestions(preset)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                            numQuestions === preset
                              ? 'bg-emerald-700 text-white shadow-2xs'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>

                    <p className="text-[10px] text-slate-500 leading-tight">
                      በእያንዳንዱ ፈተና ውስጥ የሚካተቱ የጥያቄዎች ብዛት (ከ 1 እስከ 30 ቁጥር ማስገባት ይችላሉ)።
                    </p>
                  </div>

                  {/* 2. INPUT FIELD: AI የሚያወጣቸው ፈተና ብዛት የማስገባቢያ ቦታ */}
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <label className="block text-xs font-black text-slate-900 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-indigo-600" />
                        <span>AI የሚያወጣቸው ፈተና ብዛት (ማስገቢያ)*</span>
                      </label>
                      <span className="text-[10px] font-bold text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                        {numExams === 1 ? '1 ነጠላ ፈተና' : `${numExams} የፈተና ሞዴሎች`}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setNumExams((prev) => Math.max(1, prev - 1))}
                        className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition-colors cursor-pointer shrink-0"
                        title="ቀንስ"
                      >
                        <Minus className="w-4 h-4" />
                      </button>

                      <input
                        type="number"
                        min={1}
                        max={5}
                        value={numExams}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          if (!isNaN(val)) {
                            setNumExams(Math.min(5, Math.max(1, val)));
                          } else {
                            setNumExams(1);
                          }
                        }}
                        className="flex-1 text-center font-black text-base sm:text-lg text-slate-900 py-1.5 px-3 bg-slate-50 border-2 border-indigo-500/40 rounded-xl focus:ring-2 focus:ring-indigo-700 focus:outline-hidden"
                      />

                      <button
                        type="button"
                        onClick={() => setNumExams((prev) => Math.min(5, prev + 1))}
                        className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition-colors cursor-pointer shrink-0"
                        title="ጨምር"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Quick Preset Buttons for Exams Count */}
                    <div className="flex items-center flex-wrap gap-1.5 pt-1">
                      <span className="text-[10px] font-bold text-slate-500">ፈጣን ሞዴል፡</span>
                      {[
                        { count: 1, label: '1 ፈተና' },
                        { count: 2, label: '2 ሞዴል (A/B)' },
                        { count: 3, label: '3 ሞዴል (A/B/C)' },
                        { count: 4, label: '4 ሞዴል' }
                      ].map((item) => (
                        <button
                          key={item.count}
                          type="button"
                          onClick={() => setNumExams(item.count)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                            numExams === item.count
                              ? 'bg-indigo-700 text-white shadow-2xs'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>

                    <p className="text-[10px] text-slate-500 leading-tight">
                      የሚዘጋጁ የተለያዩ የፈተና ሞዴሎች/ስሪቶች ብዛት (ከ 1 እስከ 5 ቁጥር ማስገባት ይችላሉ)።
                    </p>
                  </div>
                </div>

                {/* Additional Settings: Difficulty & Language */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      የጥያቄዎች ጥልቀት (Difficulty)
                    </label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-bold"
                    >
                      <option value="standard">መደበኛ ብቃት (Standard Competency)</option>
                      <option value="advanced">የላቀ / ተንታኝ (Higher Order Pedagogical Thinking)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      የፈተናው ቋንቋ (Exam Language)
                    </label>
                    <select
                      value={selectedLang}
                      onChange={(e) => setSelectedLang(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-bold"
                    >
                      <option value="am">አማርኛ (Amharic)</option>
                      <option value="om">Afaan Oromoo</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                </div>

                {/* 1. አንድ ጥያቄ ስንት ደቂቃ ይቆይ የሚለውን ለመወሰን መሙያ ቦታ */}
                <div className="bg-amber-50/60 p-3.5 rounded-2xl border border-amber-200/90 shadow-2xs space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <label className="block text-xs font-black text-slate-900 flex items-center gap-1.5">
                      <Timer className="w-3.5 h-3.5 text-amber-700" />
                      <span>አንድ ጥያቄ ስንት ደቂቃ ይቆይ? (የእያንዳንዱ ጥያቄ የጊዜ ገደብ)*</span>
                    </label>
                    <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                      {timePerQuestion > 0 ? `${timePerQuestion} ደቂቃ በ 1 ጥያቄ` : 'ያልተገደበ'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setTimePerQuestion((prev) => Math.max(1, prev - 1))}
                      className="w-9 h-9 rounded-xl bg-white hover:bg-amber-100 text-slate-700 border border-amber-300 font-bold flex items-center justify-center transition-colors cursor-pointer shrink-0"
                      title="ቀንስ"
                    >
                      <Minus className="w-4 h-4" />
                    </button>

                    <input
                      type="number"
                      min={1}
                      max={15}
                      value={timePerQuestion}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (!isNaN(val)) {
                          setTimePerQuestion(Math.min(15, Math.max(1, val)));
                        } else {
                          setTimePerQuestion(1);
                        }
                      }}
                      className="flex-1 text-center font-black text-base sm:text-lg text-slate-900 py-1.5 px-3 bg-white border-2 border-amber-500/50 rounded-xl focus:ring-2 focus:ring-amber-700 focus:outline-hidden"
                    />

                    <button
                      type="button"
                      onClick={() => setTimePerQuestion((prev) => Math.min(15, prev + 1))}
                      className="w-9 h-9 rounded-xl bg-white hover:bg-amber-100 text-slate-700 border border-amber-300 font-bold flex items-center justify-center transition-colors cursor-pointer shrink-0"
                      title="ጨምር"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Quick Preset Buttons for Time Per Question */}
                  <div className="flex items-center flex-wrap gap-1.5 pt-1">
                    <span className="text-[10px] font-bold text-slate-600">ፈጣን ምርጫ፡</span>
                    {[
                      { minutes: 1, label: '1 ደቂቃ' },
                      { minutes: 2, label: '2 ደቂቃ (ተመራጭ)' },
                      { minutes: 3, label: '3 ደቂቃ' },
                      { minutes: 5, label: '5 ደቂቃ' }
                    ].map((item) => (
                      <button
                        key={item.minutes}
                        type="button"
                        onClick={() => setTimePerQuestion(item.minutes)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                          timePerQuestion === item.minutes
                            ? 'bg-amber-800 text-white shadow-2xs'
                            : 'bg-white border border-amber-200 text-slate-700 hover:bg-amber-100'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>

                  <p className="text-[10px] text-slate-600 leading-tight">
                    መምህሩ በፈተና ወቅት ለእያንዳንዱ ጥያቄ የሚሰጠው የጊዜ ገደብ (ጠቅላላ የፈተናው ጊዜ <strong>{timePerQuestion * numQuestions} ደቂቃ</strong> ይሆናል)።
                  </p>
                </div>

                {/* 2. የፈተናው ሙሉ ጥያቄ ይድረሰው ወይስ አንድን ጥያቄ ሰርቶ ሲጨርስ ቀጣይ ጥያቄ ይደረሰው የሚለውን ለመወሰን ምርጫ */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <label className="block text-xs font-black text-slate-900 flex items-center gap-1.5">
                      <ListOrdered className="w-3.5 h-3.5 text-teal-700" />
                      <span>የጥያቄዎች አቀራረብ ዘዴ (የፈተናው አሰጣጥ ምርጫ)*</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {/* Option 1: አንድ ጥያቄ ሰርቶ ሲጨርስ ቀጣይ ጥያቄ */}
                    <button
                      type="button"
                      onClick={() => setDeliveryMode('one_by_one')}
                      className={`text-left p-3 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                        deliveryMode === 'one_by_one'
                          ? 'bg-teal-50/80 border-teal-600 shadow-xs'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-black text-slate-900">
                            1. አንድ ጥያቄ ሰርቶ ሲጨርስ ቀጣይ ጥያቄ
                          </span>
                          <span
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                              deliveryMode === 'one_by_one'
                                ? 'border-teal-700 bg-teal-700'
                                : 'border-slate-300'
                            }`}
                          >
                            {deliveryMode === 'one_by_one' && (
                              <span className="w-1.5 h-1.5 bg-white rounded-full" />
                            )}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-snug">
                          መምህሩ አንድን ጥያቄ ሰርቶ 'ቀጣይ ጥያቄ' ሲል ብቻ የሚቀጥለው ይደርሰዋል። የቀደመ ጥያቄ ላይ መመለስ አይፈቀድም።
                        </p>
                      </div>
                      <span className="mt-2 text-[9px] font-bold text-teal-800 bg-teal-100/70 px-2 py-0.5 rounded w-fit">
                        🔒 ጥብቅ ቅደም-ተከተል (Sequential)
                      </span>
                    </button>

                    {/* Option 2: የፈተናው ሙሉ ጥያቄ በአንድ ጊዜ ይድረሰው */}
                    <button
                      type="button"
                      onClick={() => setDeliveryMode('all_at_once')}
                      className={`text-left p-3 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                        deliveryMode === 'all_at_once'
                          ? 'bg-indigo-50/80 border-indigo-600 shadow-xs'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-black text-slate-900">
                            2. የፈተናው ሙሉ ጥያቄ በአንድ ጊዜ
                          </span>
                          <span
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                              deliveryMode === 'all_at_once'
                                ? 'border-indigo-700 bg-indigo-700'
                                : 'border-slate-300'
                            }`}
                          >
                            {deliveryMode === 'all_at_once' && (
                              <span className="w-1.5 h-1.5 bg-white rounded-full" />
                            )}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-snug">
                          መምህሩ ሁሉንም ጥያቄዎች በአንድ ገጽ ላይ ማየት፣ እንደፈለገ መዘዋወርና ከመላኩ በፊት መልሶቹን መከለስ ይችላል።
                        </p>
                      </div>
                      <span className="mt-2 text-[9px] font-bold text-indigo-800 bg-indigo-100/70 px-2 py-0.5 rounded w-fit">
                        🔓 ክፍት አቀራረብ (All at once)
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Error Notice */}
              {generationError && (
                <div className="bg-rose-50 text-rose-900 border border-rose-200 p-3 rounded-xl flex items-center gap-2 text-xs font-semibold">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{generationError}</span>
                </div>
              )}

              {/* Action Button */}
              <div className="pt-2">
                <button
                  type="button"
                  disabled={isGenerating}
                  onClick={handleGenerate}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-800 via-teal-800 to-indigo-900 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm rounded-2xl shadow-lg transition-transform hover:scale-101 active:scale-99 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>
                        AI {numExams > 1 ? `${numExams} የፈተና ሞዴሎችን` : 'ፈተናውን'} ({numQuestions} ጥያቄዎች) በማዘጋጀት ላይ ነው...
                      </span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>
                        ✨ {numExams > 1 ? `${numExams} የፈተና ሞዴሎችን` : 'ፈተናውን'} በ AI አውጣ ({numQuestions} ጥያቄዎች)
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* Step 2: Generated Exams Review & Publishing Screen */
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* If multiple exams were generated, show tabs to switch between Exam sets */}
              {generatedExams.length > 1 && (
                <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center gap-1.5 overflow-x-auto">
                  <span className="text-[11px] font-black text-slate-500 px-2 shrink-0">
                    የተዘጋጁ ሞዴሎች ({generatedExams.length})፡
                  </span>
                  {generatedExams.map((exam, idx) => (
                    <button
                      key={exam.id || idx}
                      type="button"
                      onClick={() => setActiveExamIndex(idx)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                        activeExamIndex === idx
                          ? 'bg-emerald-800 text-white shadow-xs'
                          : 'bg-white text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>ፈተና {idx + 1} (ሞዴል {String.fromCharCode(65 + idx)})</span>
                      <span className="text-[10px] opacity-80">({exam.questions.length} ጥያቄዎች)</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Generated Header Banner for currently selected Exam */}
              {currentActiveExam && (
                <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-indigo-950 p-4 rounded-2xl text-white flex items-center justify-between gap-3 shadow-md">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950">
                        ✨ በ AI የተዘጋጀ
                      </span>
                      {generatedExams.length > 1 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-500/80 text-white">
                          ሞዴል {String.fromCharCode(65 + activeExamIndex)} ({activeExamIndex + 1}/{generatedExams.length})
                        </span>
                      )}
                      <span className="text-[10px] text-emerald-200">
                        የጥያቄ ብዛት፡ {currentActiveExam.questions.length} · ጊዜ፡ {currentActiveExam.durationMinutes} ደቂቃ
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-black">{currentActiveExam.title}</h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setGeneratedExams([]);
                      setActiveExamIndex(0);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>ቅንብሮችን አስተካክል</span>
                  </button>
                </div>
              )}

              {/* Instructions */}
              {currentActiveExam && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600">
                  <strong>መመሪያ፡</strong> {currentActiveExam.instructions}
                </div>
              )}

              {/* Questions List with inline edit capability */}
              {currentActiveExam && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-black text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      <span>
                        በ AI የተዘጋጁ {currentActiveExam.questions.length} ጥያቄዎች (ከታች መገምገም ወይም ማስተካከል ይችላሉ)
                      </span>
                    </h4>
                    {generatedExams.length > 1 && (
                      <span className="text-xs font-bold text-slate-500">
                        የሚታየው፡ ሞዴል {String.fromCharCode(65 + activeExamIndex)}
                      </span>
                    )}
                  </div>

                  {currentActiveExam.questions.map((q, qIdx) => (
                    <div
                      key={q.id || qIdx}
                      className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <span className="font-bold text-slate-500 text-xs block mb-1">
                            ጥያቄ {qIdx + 1}፡
                          </span>
                          <input
                            type="text"
                            value={q.questionText}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateQuestionInActiveExam(qIdx, (prev) => ({
                                ...prev,
                                questionText: val
                              }));
                            }}
                            className="w-full font-bold text-slate-900 text-xs sm:text-sm p-2 bg-slate-50 border border-slate-200 rounded-xl"
                          />
                        </div>
                      </div>

                      {/* Options list */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {q.options.map((opt, optIdx) => {
                          const isCorrect = optIdx === q.correctIndex;
                          return (
                            <div
                              key={optIdx}
                              onClick={() => {
                                updateQuestionInActiveExam(qIdx, (prev) => ({
                                  ...prev,
                                  correctIndex: optIdx
                                }));
                              }}
                              className={`p-2.5 rounded-xl border transition-all flex items-center gap-2 cursor-pointer ${
                                isCorrect
                                  ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold shadow-2xs'
                                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              <span
                                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                                  isCorrect
                                    ? 'bg-emerald-700 text-white'
                                    : 'bg-slate-200 text-slate-700'
                                }`}
                              >
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              <input
                                type="text"
                                value={opt}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  updateQuestionInActiveExam(qIdx, (prev) => {
                                    const nextOpts = [...prev.options];
                                    nextOpts[optIdx] = val;
                                    return { ...prev, options: nextOpts };
                                  });
                                }}
                                className="flex-1 bg-transparent border-0 focus:ring-0 p-0 text-xs font-semibold"
                              />
                              {isCorrect && (
                                <span className="text-[10px] text-emerald-700 font-bold px-1.5 py-0.5 rounded-md bg-emerald-100">
                                  ትክክለኛ
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Explanation */}
                      <div className="bg-amber-50/80 p-2.5 rounded-xl border border-amber-200 text-xs text-amber-950">
                        <span className="font-bold text-[11px] block text-amber-900 mb-0.5">
                          💡 ትክክለኛ ማብራሪያ (Explanation):
                        </span>
                        <textarea
                          rows={2}
                          value={q.explanation}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateQuestionInActiveExam(qIdx, (prev) => ({
                              ...prev,
                              explanation: val
                            }));
                          }}
                          className="w-full bg-transparent border-0 p-0 text-xs text-slate-700 focus:ring-0"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            ዝጋ (Close)
          </button>

          {generatedExams.length > 0 && currentActiveExam && (
            <div className="flex items-center flex-wrap gap-2">
              <button
                type="button"
                onClick={handleSaveAllToRegistry}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>
                  {generatedExams.length > 1
                    ? `ሁሉንም (${generatedExams.length}) የፈተና ሞዴሎች መዝግብ`
                    : 'ወደ ፈተናዎች መዝገብ መዝግብ'}
                </span>
              </button>

              <button
                type="button"
                onClick={handleTakeImmediately}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-black rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer hover:scale-102"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>
                  {generatedExams.length > 1
                    ? `ሞዴል ${String.fromCharCode(65 + activeExamIndex)} ፈተናን ጀምር`
                    : 'ፈተናውን አሁኑኑ ጀምር (Take Exam Now)'}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
