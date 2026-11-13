import React, { useState } from 'react';
import {
  Building2,
  CheckCircle2,
  X,
  FileCheck,
  MapPin,
  Users,
  Award,
  BookOpen,
  Camera,
  Upload
} from 'lucide-react';
import { Language, School, SchoolType, SchoolLevel, InspectionLevel } from '../types';
import { translations } from '../data/translations';
import { StorageService } from '../utils/storage';
import { SchoolLogo, SCHOOL_LOGO_PRESETS } from './SchoolLogo';

interface SchoolRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
  onSchoolRegistered: (newSchool: School) => void;
}

export const SchoolRegisterModal: React.FC<SchoolRegisterModalProps> = ({
  isOpen,
  onClose,
  currentLang,
  onSchoolRegistered
}) => {
  const t = translations[currentLang];
  const isOm = currentLang === 'om';
  const isEn = currentLang === 'en';
  const t3 = (om: string, en: string, am: string) => (isOm ? om : isEn ? en : am);

  const [name, setName] = useState('');
  const [nameOm, setNameOm] = useState('');
  const [type, setType] = useState<SchoolType>('government');
  const [level, setLevel] = useState<SchoolLevel>('secondary');
  const [subcity, setSubcity] = useState('አቦስቶ (Abosto)');
  const [principalName, setPrincipalName] = useState('');
  const [phone, setPhone] = useState('+251 ');
  const [email, setEmail] = useState('');
  const [establishedYear, setEstablishedYear] = useState(2000);
  const [maleStudents, setMaleStudents] = useState<number>(350);
  const [femaleStudents, setFemaleStudents] = useState<number>(350);
  const [maleTeachers, setMaleTeachers] = useState<number>(18);
  const [femaleTeachers, setFemaleTeachers] = useState<number>(14);
  const [classroomsCount, setClassroomsCount] = useState<number>(20);
  const [labsCount, setLabsCount] = useState<number>(2);
  const [libraryCapacity, setLibraryCapacity] = useState<number>(100);
  const [inspectionLevel, setInspectionLevel] = useState<InspectionLevel>('level_2');
  const [logoUrl, setLogoUrl] = useState<string | undefined>(undefined);

  const [submittedCode, setSubmittedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        try {
          const maxDim = 260;
          let width = img.width;
          let height = img.height;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            setLogoUrl(canvas.toDataURL('image/jpeg', 0.85));
          } else {
            setLogoUrl(dataUrl);
          }
        } catch {
          setLogoUrl(dataUrl);
        }
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Generate unique school code compliant with Shashemene Bureau standards
    const codePrefix = name.slice(0, 3).toUpperCase().replace(/[^A-Z]/g, 'SCH');
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const generatedCode = `${codePrefix}-${level === 'secondary' ? 'SEC' : 'PRI'}-${randomSuffix}`;

    const totalStudents = Number(maleStudents) + Number(femaleStudents);
    const totalTeachers = Number(maleTeachers) + Number(femaleTeachers);

    const newSchool: School = {
      id: `sch-${Date.now()}`,
      name,
      nameOm: nameOm || undefined,
      code: generatedCode,
      type,
      level,
      subcity,
      principalName,
      phone,
      email: email || `${generatedCode.toLowerCase()}@education.gov.et`,
      establishedYear: Number(establishedYear),
      totalStudents,
      maleStudents: Number(maleStudents),
      femaleStudents: Number(femaleStudents),
      totalTeachers,
      maleTeachers: Number(maleTeachers),
      femaleTeachers: Number(femaleTeachers),
      classroomsCount: Number(classroomsCount),
      labsCount: Number(labsCount),
      libraryCapacity: Number(libraryCapacity),
      inspectionLevel,
      status: 'active',
      accessCode: generatedCode,
      createdAt: new Date().toISOString().split('T')[0],
      logoUrl: logoUrl || undefined
    };

    StorageService.addSchool(newSchool);
    setSubmittedCode(generatedCode);
    onSchoolRegistered(newSchool);
  };

  const handleFinish = () => {
    setSubmittedCode(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full my-8 shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 px-6 py-5 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-300" />
              <h2 className="text-base sm:text-lg font-bold">{t.reg_title}</h2>
            </div>
            <p className="text-xs text-emerald-100 mt-0.5">{t.reg_desc}</p>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-200 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedCode ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">{t.reg_success}</h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              {t3(
                'Galmeen seeraa mana barumsaa keessanii Biiroo Barnootaa Bulchiinsa Magaalaa Shaashamanneetiin mirkanaa\'eera. Gara sirnaa seenuuf koodii seensaa armaan gadii fayyadamaa:',
                'Your school registration has been verified by the Shashemene City Education Bureau. Use the access code below to sign in:',
                'የትምህርት ቤትዎ ይፋዊ ምዝገባ በሻሸመኔ ከተማ አስተዳደር ትምህርት ቢሮ ተረጋግጧል። ወደ ሲስተሙ ለመግባት የሚከተለውን የመግቢያ ኮድ ይጠቀሙ፡'
              )}
            </p>

            <div className="bg-emerald-50 border-2 border-dashed border-emerald-300 p-4 rounded-xl inline-block max-w-sm w-full mx-auto">
              <p className="text-xs text-slate-500 font-medium">
                {t3('Koodii Seensaa Mana Barumsaa (Access Code)', 'School Access Code', 'የትምህርት ቤቱ መግቢያ ኮድ (Access Code)')}
              </p>
              <p className="text-2xl font-mono font-bold text-emerald-900 tracking-wider my-1">
                {submittedCode}
              </p>
              <p className="text-[11px] text-emerald-700">
                {t3(
                  'Koodii kana qabachuun yeroo barbaaddan akka Abbaa Qabeenyaa/Daarektara Mana Barumsaatti seenuu dandeessu.',
                  'Use this code anytime to sign in as the School Owner / Director.',
                  'ይህንን ኮድ በመያዝ በማንኛውም ጊዜ እንደ ትምህርት ቤት ባለቤት/ዳይሬክተር መግባት ይችላሉ።'
                )}
              </p>
            </div>

            <div className="pt-4">
              <button
                onClick={handleFinish}
                className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
              >
                {t3('Gara Sirnaatti Itti Fufi', 'Continue to System', 'ወደ ሲስተሙ ቀጥል')}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            {/* Section 1: Basic Info */}
            <div className="border-b border-slate-100 pb-4 space-y-3.5">
              <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-2">
                {t3(
                  '1. Odeeffannoo Waliigalaa Dhaabbataa (General Info)',
                  '1. General Institutional Info',
                  '1. አጠቃላይ መረጃ (General Institutional Info)'
                )}
              </h4>

              {/* School Profile Logo Upload & Presets */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-emerald-700" />
                    <span>
                      {t3('Asxaa Piroofaayilii Mana Barumsaa (Logo)', 'School Profile Logo', 'የትምህርት ቤት ፕሮፋይል አርማ (School Profile Logo)')}
                    </span>
                  </span>
                  {logoUrl && (
                    <button
                      type="button"
                      onClick={() => setLogoUrl(undefined)}
                      className="text-[10px] text-rose-600 hover:underline"
                    >
                      {t3('Asxaa Haqi', 'Remove Logo', 'አርማ አስወግድ')}
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <SchoolLogo
                    logoUrl={logoUrl}
                    schoolName={name || t3('Mana Barumsaa', 'School', 'ትምህርት ቤት')}
                    size={52}
                    shape="rounded"
                    className="shadow-xs shrink-0"
                  />

                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white text-[11px] font-bold rounded-lg cursor-pointer transition-colors shadow-xs">
                        <Upload className="w-3 h-3" />
                        <span>
                          {t3('Bilbila / Kompiitara Irraa Fe\'i', 'Upload Image', 'ከስልክ/ኮምፒተር ፎቶ ጫን')}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoFileChange}
                          className="hidden"
                        />
                      </label>
                      <span className="text-[10px] text-slate-400">
                        {t3('ykn asxaa qophaa\'aa filadhu:', 'or choose official preset:', 'ወይም ይፋዊ አርማ ምረጥ፡')}
                      </span>
                    </div>

                    {/* Presets Row */}
                    <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
                      {SCHOOL_LOGO_PRESETS.map((pr) => (
                        <button
                          key={pr.id}
                          type="button"
                          onClick={() => setLogoUrl(pr.id)}
                          className={`p-1 rounded-lg border transition-all ${
                            logoUrl === pr.id
                              ? 'border-emerald-600 ring-2 ring-emerald-500/30'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                          title={isOm ? pr.labelOm : isEn ? pr.labelEn : pr.labelAm}
                        >
                          <SchoolLogo
                            logoUrl={pr.id}
                            schoolName=""
                            size={26}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.school_name_label} *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t3(
                      'Fkn: Mana Barumsaa Sad. 2ffaa Moodeela Shaashamannee',
                      'e.g., Shashemene Model Secondary School',
                      'ምሳሌ፡ ሻሸመኔ ሞዴል 2ኛ ደረጃ ትምህርት ቤት'
                    )}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t3('Maqaa Afaan Oromootiin', 'Oromo Name', 'Maqaa Afaan Oromootiin (Oromo Name)')}
                  </label>
                  <input
                    type="text"
                    value={nameOm}
                    onChange={(e) => setNameOm(e.target.value)}
                    placeholder="M/B Sadarkaa 2ffaa Moodeela..."
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.school_type_label} *
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as SchoolType)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-hidden bg-white"
                  >
                    <option value="government">{t3('Kan Mootummaa (Government)', 'Government School', 'የመንግስት (Government)')}</option>
                    <option value="private">{t3('Kan Dhuunfaa (Private Academy)', 'Private Academy', 'የግል (Private Academy)')}</option>
                    <option value="mission">{t3('Kan Hawaasaa / Miishin (Mission / Public)', 'Mission / Public School', 'የሚሽን / የህዝብ (Mission / Public)')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.school_level_label} *
                  </label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value as SchoolLevel)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-hidden bg-white"
                  >
                    <option value="primary">{t3('Sadarkaa 1ffaa (Kutaa 1-8)', 'Primary (Grades 1-8)', '1ኛ ደረጃ (Primary 1-8)')}</option>
                    <option value="middle">{t3('Sadarkaa Giddu-galeessaa (Kutaa 7-8)', 'Middle School (Grades 7-8)', 'መካከለኛ ደረጃ (Middle 7-8)')}</option>
                    <option value="secondary">{t3('Sadarkaa 2ffaa (Kutaa 9-12)', 'Secondary (Grades 9-12)', '2ኛ ደረጃ (Secondary 9-12)')}</option>
                    <option value="complete">{t3('Guutuu Kutaa 1-12 (Complete 1-12)', 'Complete (Grades 1-12)', 'የተሟላ 1-12 (Complete 1-12)')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.subcity_label} *
                  </label>
                  <select
                    value={subcity}
                    onChange={(e) => setSubcity(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-hidden bg-white"
                  >
                    <option value="አቦስቶ (Abosto)">{t3('Kifle Ketemaa Abostoo (Abosto)', 'Abosto Sub-City', 'አቦስቶ (Abosto)')}</option>
                    <option value="ቡልቻና (Bulchana)">{t3('Kifle Ketemaa Bulchaanaa (Bulchana)', 'Bulchana Sub-City', 'ቡልቻና (Bulchana)')}</option>
                    <option value="አዋሾ (Awasho)">{t3('Kifle Ketemaa Awaashoo (Awasho)', 'Awasho Sub-City', 'አዋሾ (Awasho)')}</option>
                    <option value="ቁዬራ (Kuyera)">{t3('Kifle Ketemaa Kuyyaraa (Kuyera)', 'Kuyera Sub-City', 'ቁዬራ (Kuyera)')}</option>
                    <option value="አለሉ (Alelu)">{t3('Kifle Ketemaa Aleeluu (Alelu)', 'Alelu Sub-City', 'አለሉ (Alelu)')}</option>
                    <option value="ዲዳ ቦቄ (Dida Boke)">{t3('Kifle Ketemaa Diidaa Booqee (Dida Boke)', 'Dida Boke Sub-City', 'ዲዳ ቦቄ (Dida Boke)')}</option>
                    <option value="አራዳ (Arada)">{t3('Kifle Ketemaa Araadaa (Arada)', 'Arada Sub-City', 'አራዳ (Arada)')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.established_label}
                  </label>
                  <input
                    type="number"
                    value={establishedYear}
                    onChange={(e) => setEstablishedYear(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Leadership & Contact */}
            <div className="border-b border-slate-100 pb-4">
              <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-3">
                {t3(
                  '2. Hoggansa fi Teessoo (Principal & Contact)',
                  '2. Principal & Contact',
                  '2. አመራር እና አድራሻ (Principal & Contact)'
                )}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.principal_name_label} *
                  </label>
                  <input
                    type="text"
                    required
                    value={principalName}
                    onChange={(e) => setPrincipalName(e.target.value)}
                    placeholder={t3('Obbo / Aaddee ...', 'Mr. / Ms. ...', 'አቶ/ወ/ሮ ...')}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.phone_label} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+251 9..."
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.email_label}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="school@example.com"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Student & Teacher Statistics */}
            <div className="border-b border-slate-100 pb-4">
              <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-3">
                {t3(
                  '3. Istaatistiksii Barattootaa fi Barsiisotaa (Enrollment & Staff)',
                  '3. Enrollment & Staff Statistics',
                  '3. የተማሪዎች እና የመምህራን ስታቲስቲክስ (Enrollment & Staff)'
                )}
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.male_students_label}
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={maleStudents}
                    onChange={(e) => setMaleStudents(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.female_students_label}
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={femaleStudents}
                    onChange={(e) => setFemaleStudents(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t3('Barsiisota Dhiiraa', 'Male Teachers', 'ወንድ መምህራን')}
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={maleTeachers}
                    onChange={(e) => setMaleTeachers(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t3('Barsiisota Dhalaa', 'Female Teachers', 'ሴት መምህራን')}
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={femaleTeachers}
                    onChange={(e) => setFemaleTeachers(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  />
                </div>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                {t3('Barattoota Waliigalaa:', 'Total Students:', 'አጠቃላይ ተማሪዎች:')}{' '}
                <strong className="text-slate-800">{Number(maleStudents) + Number(femaleStudents)}</strong> ·{' '}
                {t3('Barsiisota Waliigalaa:', 'Total Teachers:', 'አጠቃላይ መምህራን:')}{' '}
                <strong className="text-slate-800">{Number(maleTeachers) + Number(femaleTeachers)}</strong>
              </p>
            </div>

            {/* Section 4: Facilities & Inspection Standard */}
            <div>
              <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-3">
                {t3(
                  '4. Daree Barnootaa, Laabiraatoorii fi Sadarkaa Istaandardii Biiroo',
                  '4. Classrooms, Labs & Inspection Standard Level',
                  '4. የመማሪያ ክፍሎች፣ ላብራቶሪ እና የቢሮ መስፈርት ደረጃ'
                )}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.classrooms_label}
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={classroomsCount}
                    onChange={(e) => setClassroomsCount(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.labs_label}
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={labsCount}
                    onChange={(e) => setLabsCount(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.library_label}
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={libraryCapacity}
                    onChange={(e) => setLibraryCapacity(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.inspection_level_label}
                  </label>
                  <select
                    value={inspectionLevel}
                    onChange={(e) => setInspectionLevel(e.target.value as InspectionLevel)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-hidden bg-white"
                  >
                    <option value="level_1">{t3('Sadarkaa 1 (Level 1)', 'Level 1', 'ደረጃ 1 (Level 1)')}</option>
                    <option value="level_2">{t3('Sadarkaa 2 (Level 2)', 'Level 2', 'ደረጃ 2 (Level 2)')}</option>
                    <option value="level_3">{t3('Sadarkaa 3 (Level 3 - Accredited)', 'Level 3 - Accredited', 'ደረጃ 3 (Level 3 - Accredited)')}</option>
                    <option value="level_4">{t3('Sadarkaa 4 (Level 4 - Model)', 'Level 4 - Model', 'ደረጃ 4 (Level 4 - Model)')}</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                {t3('Dhiisi (Cancel)', 'Cancel', 'ሰርዝ (Cancel)')}
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
              >
                {t.btn_register_school}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
