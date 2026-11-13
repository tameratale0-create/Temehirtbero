import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  Camera,
  Plus,
  Trash2,
  CheckCircle2,
  GraduationCap,
  Building2,
  CreditCard,
  Shield,
  FileText,
  User,
  Sparkles,
  Award,
  AlertCircle,
  Eye
} from 'lucide-react';
import {
  SchoolStakeholder,
  StakeholderRole,
  GraduationCredentialDoc,
  Language,
  School
} from '../types';

interface StakeholderFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (stakeholder: SchoolStakeholder) => void;
  currentLang: Language;
  school: School;
  editingStakeholder?: SchoolStakeholder | null;
}

export const StakeholderFormModal: React.FC<StakeholderFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentLang,
  school,
  editingStakeholder
}) => {
  const isOm = currentLang === 'om';
  const isEn = currentLang === 'en';
  const t3 = (om: string, en: string, am: string) => (isOm ? om : isEn ? en : am);

  const photoInputRef = useRef<HTMLInputElement>(null);
  const faydaInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [fullName, setFullName] = useState(editingStakeholder?.fullName || '');
  const [gender, setGender] = useState<'M' | 'F'>(editingStakeholder?.gender || 'M');
  const [role, setRole] = useState<StakeholderRole>(editingStakeholder?.role || 'head_librarian');
  const [roleCustomTitle, setRoleCustomTitle] = useState(editingStakeholder?.roleCustomTitle || '');
  const [formError, setFormError] = useState<string | null>(null);
  
  // Profile Office / Department
  const [officeOrDepartment, setOfficeOrDepartment] = useState(
    editingStakeholder?.officeOrDepartment ||
      t3(
        'Waajjira Mana Kitaabaa fi Giddugala Odeeffannoo Mana Barumsaa',
        'School Library & Information Center Office',
        'የትምህርት ቤተ-መጻሕፍት እና የመረጃ ማዕከል ጽ/ቤት'
      )
  );

  const [phone, setPhone] = useState(editingStakeholder?.phone || '+251 9');
  const [email, setEmail] = useState(editingStakeholder?.email || '');
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(editingStakeholder?.photoUrl);

  // Fayda Digital ID & Fayda Number
  const [faydaNumber, setFaydaNumber] = useState(
    editingStakeholder?.faydaNumber ||
      `FAYDA-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`
  );
  const [faydaDocUrl, setFaydaDocUrl] = useState<string | undefined>(editingStakeholder?.faydaDocUrl);
  const [faydaVerified, setFaydaVerified] = useState<boolean>(
    editingStakeholder?.faydaVerified !== undefined ? editingStakeholder.faydaVerified : true
  );

  // Multiple Graduation Credentials List
  const [credentials, setCredentials] = useState<GraduationCredentialDoc[]>(
    editingStakeholder?.credentials && editingStakeholder.credentials.length > 0
      ? editingStakeholder.credentials
      : [
          {
            id: `crd-${Date.now()}-1`,
            level: 'Degree',
            fieldOfStudy: t3(
              'Saayinsii Mana Kitaabaa fi Odeeffannoo (Library & Information Science)',
              'Library & Information Science',
              'Library & Information Science (የቤተ-መጻሕፍት ሳይንስ)'
            ),
            institution: t3(
              'Yuunivarsiitii Jimmaa (Jimma University)',
              'Jimma University',
              'Jimma University (ጅማ ዩኒቨርሲቲ)'
            ),
            graduationYear: 2017,
            credentialDocNumber: 'JU-BSC-ILS-2017-7429'
          }
        ]
  );

  const [professionalLicenseNumber, setProfessionalLicenseNumber] = useState(
    editingStakeholder?.professionalLicenseNumber || `ETH-OR-LIB-${Math.floor(1000 + Math.random() * 9000)}`
  );
  const [experienceYears, setExperienceYears] = useState<number>(
    editingStakeholder?.experienceYears || 5
  );
  const [accessCode, setAccessCode] = useState(
    editingStakeholder?.accessCode || `STK-${Math.floor(1000 + Math.random() * 9000)}`
  );

  if (!isOpen) return null;

  // Preset quick office selections
  const presetOffices = [
    t3('Waajjira Mana Kitaabaa fi Giddugala Odeeffannoo Mana Barumsaa', 'School Library & Information Center Office', 'የትምህርት ቤተ-መጻሕፍት እና የመረጃ ማዕከል ጽ/ቤት'),
    t3('Waajjira Dura-Taa\'aa / Daarektara Mana Barumsaa (Principal Office)', 'School Principal / Director Office', 'የትምህርት ቤት ዋና አስተዳደር ጽ/ቤት (Principal Office)'),
    t3('Waajjira Dhimma Barnootaa fi Sirna Barnootaa', 'Academic Affairs & Curriculum Office', 'አካዳሚክ ጉዳዮች እና ስርአተ-ትምህርት ጽ/ቤት'),
    t3('Waajjira Saayinsii, ICT fi Laaboraatoorii', 'Science, ICT & Laboratory Office', 'የሳይንስ፣ አይሲቲ እና ላብራቶሪ ጽ/ቤት'),
    t3('Waajjira Muummee Afaanotaa', 'Languages Department Office', 'የቋንቋዎች ዲፓርትመንት ጽ/ቤት'),
    t3('Waajjira Tajaajila Barattootaa, Gorsaa fi Naamusaa', 'Student Services, Guidance & Conduct Office', 'የተማሪዎች አገልግሎት፣ ምክር እና ስነ-ምግባር ጽ/ቤት'),
    t3('Rejistraaraa, Faayinaansii fi Bulchiinsa Qabeenyaa', 'Registrar, Finance & Property Administration', 'ሬጅስትራር፣ ፋይናንስ እና ንብረት አስተዳደር'),
    t3('Waajjira Waldaa Maatii fi Barsiisotaa (PTA)', 'Parent-Teacher Association (PTA) Office', 'የወላጅ መምህራን ህብረት (PTA) ጽ/ቤት')
  ];

  // Handle Profile Photo Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Fayda ID Card Upload
  const handleFaydaDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFaydaDocUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Add another Graduation Credential
  const handleAddCredential = () => {
    const newCred: GraduationCredentialDoc = {
      id: `crd-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      level: 'Degree',
      fieldOfStudy: '',
      institution: '',
      graduationYear: 2016,
      credentialDocNumber: `DOC-${Math.floor(1000 + Math.random() * 9000)}`
    };
    setCredentials([...credentials, newCred]);
  };

  // Update a specific Credential
  const handleUpdateCredential = (index: number, field: keyof GraduationCredentialDoc, value: any) => {
    const updated = [...credentials];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    setCredentials(updated);
  };

  // Handle Credential Document File Upload
  const handleCredentialDocUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        handleUpdateCredential(index, 'documentFileUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove Credential
  const handleRemoveCredential = (index: number) => {
    if (credentials.length === 1) {
      setFormError(
        t3(
          'Yoo xiqqaate ragaan eebbaa tokko jiraachuu qaba.',
          'At least one graduation credential is required.',
          'ቢያንስ አንድ የተመረቀበት ማስረጃ መኖር አለበት'
        )
      );
      return;
    }
    setFormError(null);
    setCredentials(credentials.filter((_, idx) => idx !== index));
  };

  // Form Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!fullName.trim()) {
      setFormError(
        t3(
          'Maaloo maqaa guutuu qooda fudhatichaa galchaa.',
          'Please enter the full name of the stakeholder.',
          'እባክዎ የባለድርሻ አካሉን ሙሉ ስም ያስገቡ'
        )
      );
      return;
    }

    if (!officeOrDepartment.trim()) {
      setFormError(
        t3(
          'Maaloo waajjira ykn kutaa hojii piroofaayilii galchaa.',
          'Please enter the profile office or department.',
          'እባክዎ የፕሮፋይል ጽሕፈት ቤቱን ያስገቡ'
        )
      );
      return;
    }

    if (!faydaNumber.trim()) {
      setFormError(
        t3(
          'Maaloo lakkoofsa eenyummaa dijitaalaa Fayda galchaa.',
          'Please enter the Fayda Digital ID number.',
          'እባክዎ የፋይዳ ዲጂታል መታወቂያ ቁጥር ያስገቡ'
        )
      );
      return;
    }

    const payload: SchoolStakeholder = {
      id: editingStakeholder?.id || `stk-${Date.now()}`,
      schoolId: school.id,
      schoolName: school.name,
      fullName: fullName.trim(),
      gender,
      role,
      roleCustomTitle: roleCustomTitle.trim() || undefined,
      officeOrDepartment: officeOrDepartment.trim(),
      phone: phone.trim(),
      email: email.trim(),
      photoUrl,
      faydaNumber: faydaNumber.trim().toUpperCase(),
      faydaDocUrl,
      faydaVerified,
      credentials,
      professionalLicenseNumber: professionalLicenseNumber.trim(),
      experienceYears: Number(experienceYears) || 1,
      accessCode: accessCode.trim(),
      certificateNumber:
        editingStakeholder?.certificateNumber ||
        `SHAS-STK-CERT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      status: editingStakeholder?.status || 'active',
      registeredDate: editingStakeholder?.registeredDate || new Date().toISOString().split('T')[0]
    };

    onSave(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[94vh] flex flex-col border border-slate-200 overflow-hidden my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white leading-tight">
                {editingStakeholder
                  ? t3(
                      'Odeeffannoo Qooda Fudhattuu Sirreessuu',
                      'Edit Stakeholder Profile',
                      'የባለድርሻ አካል መረጃ ማስተካከያ'
                    )
                  : t3(
                      'Unka Galmee Qooda Fudhattoota Mana Barumsaa',
                      'School Stakeholder Registration Form',
                      'የትምህርት ቤት ባለድርሻ አካል ምዝገባ ፎርም'
                    )}
              </h3>
              <p className="text-xs text-slate-300">
                {school.name} ·{' '}
                {t3(
                  'Waajjira Piroofaayilii, Eenyummaa Fayda fi Ragaa Eebbaa',
                  'Profile Office, Fayda ID & Graduation Credentials',
                  'የፕሮፋይል ጽሕፈት ቤት፣ የፋይዳ መታወቂያ እና የተመረቁ ማስረጃዎች'
                )}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6 bg-slate-50">
          {formError && (
            <div className="p-3.5 bg-rose-50 border border-rose-300 rounded-2xl flex items-center justify-between gap-2 text-xs font-bold text-rose-900">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{formError}</span>
              </div>
              <button
                type="button"
                onClick={() => setFormError(null)}
                className="text-rose-600 hover:text-rose-800 px-2 py-0.5 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* SECTION 1: PERSONAL & CONTACT INFORMATION */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h4 className="text-xs font-black uppercase text-emerald-900 tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
              <User className="w-4 h-4 text-emerald-700" />
              <span>
                {t3(
                  '1. Odeeffannoo Dhuunfaa fi Gahee Hojii',
                  '1. Personal & Role Details',
                  '1. የግል እና የስራ መረጃ (Personal & Role Details)'
                )}
              </span>
            </h4>

            {/* Profile Photo Upload */}
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
              <div className="relative group shrink-0">
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt="Preview"
                    className="w-20 h-24 object-cover rounded-xl border-2 border-emerald-700 shadow-md"
                  />
                ) : (
                  <div className="w-20 h-24 rounded-xl bg-slate-200 border-2 border-dashed border-slate-400 flex flex-col items-center justify-center text-slate-400">
                    <User className="w-8 h-8 mb-1" />
                    <span className="text-[10px] font-bold">
                      {t3('Suuraa Hin Qabu', 'No Photo', 'ፎቶ የለም')}
                    </span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  className="absolute inset-0 bg-black/60 rounded-xl flex flex-col items-center justify-center text-white text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Camera className="w-4 h-4 mb-0.5" />
                  <span>{t3('Jijjiiri', 'Change', 'ቀይር')}</span>
                </button>
              </div>

              <div className="flex-1 text-center sm:text-left space-y-1">
                <p className="text-xs font-bold text-slate-800">
                  {t3(
                    'Suuraa Piroofaayilii Dhuunfaa Qooda Fudhattuu',
                    'Stakeholder Personal Profile Photo',
                    'የባለድርሻ አካሉ የግል ፕሮፋይል ፎቶ'
                  )}
                </p>
                <p className="text-[11px] text-slate-500">
                  {t3(
                    'Suuraa qulqullina qabu waraqaa ragaa fi eenyummaa dijitaalaaf ol-kaa\'aa',
                    'Upload a clear photo for official certificates and digital ID cards',
                    'ለይፋዊ የምስክር ወረቀት እና ለዲጂታል መታወቂያ የሚሆን ጥራት ያለው ፎቶ ይጫኑ'
                  )}
                </p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{t3('Suuraa Filadhu', 'Upload Photo', 'ፎቶ ምረጥ (Upload Photo)')}</span>
                  </button>
                  {photoUrl && (
                    <button
                      type="button"
                      onClick={() => setPhotoUrl(undefined)}
                      className="px-2.5 py-1 text-xs text-rose-600 hover:bg-rose-50 rounded-xl font-bold transition-colors"
                    >
                      {t3('Haqi', 'Remove', 'አጥፋ')}
                    </button>
                  )}
                </div>
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t3('Maqaa Guutuu', 'Full Name', 'ሙሉ ስም (Full Name)')} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder={t3(
                    'Fkn: Aadde Muluemebet Deresse / Obbo Guttamaa Waaqoo',
                    'e.g., Ms. Muluemebet Deresse / Mr. Gutema Wako',
                    'ለምሳሌ: ወ/ሮ ሙሉእመቤት ደረሰ / አቶ ጉተማ ዋቆ'
                  )}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t3('Saala', 'Gender', 'ጾታ (Gender)')}
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as 'M' | 'F')}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-medium bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                >
                  <option value="M">{t3('Dhiira', 'Male', 'ወንድ (Male)')}</option>
                  <option value="F">{t3('Dhalaa', 'Female', 'ሴት (Female)')}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t3('Lakkoofsa Bilbilaa', 'Phone Number', 'ስልክ ቁጥር (Phone Number)')}
                </label>
                <input
                  type="text"
                  placeholder="+251 91 184 9201"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t3('Teessoo Iimeeyilii', 'Email Address', 'ኢሜይል (Email Address)')}
                </label>
                <input
                  type="email"
                  placeholder="librarian@shasheducation.gov.et"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Role Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t3(
                    'Gahee Qooda Fudhattuu Mana Barumsaa',
                    'School Stakeholder Role',
                    'የትምህርት ቤት ባለድርሻ አካል ሚና (Stakeholder Role)'
                  )}
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as StakeholderRole)}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-bold text-emerald-950 bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                >
                  <option value="head_librarian">
                    {t3('Itti Gaafatamaa Mana Kitaabaa fi Odeeffannoo', 'Chief School Librarian & Info Officer', 'የትምህርት ቤት ቤተ-መጻሕፍት ኃላፊ እና የመረጃ ባለሙያ')}
                  </option>
                  <option value="principal">
                    {t3('Dura-Taa\'aa / Daarektara Ol\'aanaa', 'Head Principal / Director', 'ዋና ርዕሰ መምህር / ዳይሬክተር')}
                  </option>
                  <option value="vice_principal_academic">
                    {t3('Itti Aanaa Dura-Taa\'aa (Akaadaamii)', 'Vice Principal (Academic)', 'ምክትል ርዕሰ መምህር (አካዳሚክ)')}
                  </option>
                  <option value="vice_principal_admin">
                    {t3('Itti Aanaa Dura-Taa\'aa (Bulchiinsa)', 'Vice Principal (Administration)', 'ምክትል ርዕሰ መምህር (አስተዳደር)')}
                  </option>
                  <option value="lab_technician">
                    {t3('Ogeessa Laaboraatoorii Saayinsii fi Teeknooloojii', 'Science & Technology Lab Specialist', 'የሳይንስ እና ቴክኖሎጂ ላብራቶሪ ባለሙያ')}
                  </option>
                  <option value="department_head">
                    {t3('Itti Gaafatamaa Muummee Barnootaa', 'Department Head', 'የትምህርት ክፍል ኃላፊ')}
                  </option>
                  <option value="teacher">
                    {t3('Barsiisaa Ol\'aanaa', 'Senior Teacher', 'ከፍተኛ መምህር')}
                  </option>
                  <option value="guidance_counselor">
                    {t3('Ogeessa Gorsaa fi Xiin-Sammuu', 'Guidance & Psychology Counselor', 'የስነ-ልቦና እና የምክር ባለሙያ')}
                  </option>
                  <option value="school_owner_board">
                    {t3('Abbaa Mana Barumsaa / Dura-Taa\'aa Boordii', 'School Owner / Board Chair', 'የትምህርት ቤት ባለቤት / የቦርድ ሰብሳቢ')}
                  </option>
                  <option value="pta_chair">
                    {t3('Dura-Taa\'aa Waldaa Maatii fi Barsiisotaa (PTA)', 'PTA Chairperson', 'የወላጅ መምህራን ህብረት (PTA) ሰብሳቢ')}
                  </option>
                  <option value="registrar_finance">
                    {t3('Qondaala Rejistraaraa fi Faayinaansii', 'Registrar & Finance Officer', 'ሬጅስትራር እና ፋይናንስ ሹም')}
                  </option>
                  <option value="student_council_leader">
                    {t3('Bakka Bu\'aa Mana Maree Barattootaa', 'Student Council Leader', 'የተማሪዎች መማክርት መሪ')}
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t3(
                    'Maqaa Hojii Dhuunfaa / Ramaddii Addaa',
                    'Custom Role Title / Specific Assignment',
                    'ብጁ የስራ ማዕረግ (Custom Role Title / Specific Assignment)'
                  )}
                </label>
                <input
                  type="text"
                  placeholder={t3(
                    'Fkn: Ogeessa Mana Kitaabaa fi Odeeffannoo',
                    'e.g., Library & Information Specialist',
                    'ለምሳሌ: የቤተ-መጻሕፍት እና የመረጃ ባለሙያ'
                  )}
                  value={roleCustomTitle}
                  onChange={(e) => setRoleCustomTitle(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: PROFILE OFFICE / DEPARTMENT */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="text-xs font-black uppercase text-emerald-900 tracking-wider flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-700" />
                <span>
                  {t3(
                    '2. Waajjira Piroofaayilii / Kutaa Hojii',
                    '2. Profile Office / Department',
                    '2. የፕሮፋይል ጽሕፈት ቤት (Profile Office / Department)'
                  )}
                </span>
              </h4>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {t3('Dirqama Guutamuu Qaba', 'Required', 'ግዴታ ማስገቢያ')}
              </span>
            </div>

            <p className="text-xs text-slate-600">
              {t3(
                'Waajjira mana barumsaa qooda fudhatichi seeraan keessatti hojjetu ykn hoogganu filadhaa ykn barreessaa:',
                'Select or enter the school office or department the stakeholder officially works in or leads:',
                'ባለድርሻ አካሉ በይፋ የሚሰሩበትን ወይም የሚመሩትን የትምህርት ቤት ጽሕፈት ቤት ይምረጡ ወይም ያስገቡ:'
              )}
            </p>

            {/* Quick chips for preset offices */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {presetOffices.map((office) => (
                <button
                  key={office}
                  type="button"
                  onClick={() => setOfficeOrDepartment(office)}
                  className={`text-[11px] font-medium px-2.5 py-1 rounded-xl transition-all border ${
                    officeOrDepartment === office
                      ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs font-bold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
                  }`}
                >
                  {office}
                </button>
              ))}
            </div>

            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t3(
                  'Maqaa Waajjira Filatame / Barreeffame',
                  'Selected / Entered Office Name',
                  'የተመረጠ / የተጻፈ ጽሕፈት ቤት ስም'
                )}{' '}
                <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  placeholder={t3(
                    'Fkn: Waajjira Mana Kitaabaa fi Giddugala Odeeffannoo Mana Barumsaa',
                    'e.g., School Library & Information Center Office',
                    'ለምሳሌ: የትምህርት ቤተ-መጻሕፍት እና የመረጃ ማዕከል ጽ/ቤት'
                  )}
                  value={officeOrDepartment}
                  onChange={(e) => setOfficeOrDepartment(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 border border-slate-300 rounded-xl text-xs font-bold text-emerald-950 focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: FAYDA NATIONAL DIGITAL ID & NUMBER */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="text-xs font-black uppercase text-amber-900 tracking-wider flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-amber-700" />
                <span>
                  {t3(
                    '3. Eenyummaa Dijitaalaa Fayda fi Lakkoofsa Fayda',
                    '3. Fayda Digital National ID & Number',
                    '3. የፋይዳ መታወቂያ እና የፋይዳ ቁጥር (Fayda Digital National ID)'
                  )}
                </span>
              </h4>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                {t3('Adda Baasa Dijitaalaa Biyyaalessaa', 'National Digital ID', 'ብሔራዊ ዲጂታል መለያ')}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t3(
                    'Lakkoofsa Eenyummaa Dijitaalaa Fayda (Fayda ID / FIN)',
                    'Fayda Digital ID Number (Fayda ID / FIN)',
                    'የፋይዳ ዲጂታል መታወቂያ ቁጥር (Fayda ID / FIN)'
                  )}{' '}
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="FAYDA-8201-4491-1182"
                  value={faydaNumber}
                  onChange={(e) => setFaydaNumber(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-amber-600 focus:outline-hidden uppercase"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  {t3(
                    'Lakkoofsa adda baasaa Fayda dijiitii 16 ykn addaa',
                    '16-digit or unique Fayda identification number',
                    '16-አሃዝ ወይም የፋይዳ ልዩ መለያ ቁጥር'
                  )}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t3(
                    'Haala Mirkaneessaa Fayda (Verification Status)',
                    'Fayda Verification Status',
                    'የፋይዳ ማረጋገጫ ሁኔታ (Verification Status)'
                  )}
                </label>
                <div className="flex items-center gap-3 pt-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={faydaVerified}
                      onChange={(e) => setFaydaVerified(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                    <CheckCircle2
                      className={`w-4 h-4 ${faydaVerified ? 'text-emerald-600' : 'text-slate-400'}`}
                    />
                    <span>
                      {faydaVerified
                        ? t3('Sirna Faydaatiin Mirkanaa\'e (Verified)', 'Verified via Fayda System', 'በፋይዳ ስርዓት የተረጋገጠ (Verified)')
                        : t3('Mirkaneessa Eegaa Jira', 'Pending Verification', 'ማረጋገጫ በመጠባበቅ ላይ')}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* Fayda ID Card Upload */}
            <div className="bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200 space-y-2">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <h5 className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-amber-700" />
                    <span>
                      {t3(
                        'Sanada / Suuraa Kaardii Eenyummaa Dijitaalaa Fayda',
                        'Fayda Digital ID Card Document / Scan',
                        'የፋይዳ ዲጂታል መታወቂያ ካርድ ሰነድ / ስካን (Fayda ID Card Photo)'
                      )}
                    </span>
                  </h5>
                  <p className="text-[11px] text-amber-900/80">
                    {t3(
                      'Suuraa fuulduraa ykn duubaa kaardii eenyummaa Fayda ol-kaa\'aa',
                      'Upload the front or back photo of the Fayda ID card',
                      'የፋይዳ መታወቂያውን የፊት ወይም የጀርባ ፎቶ ይጫኑ'
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => faydaInputRef.current?.click()}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{t3('Kaardii Ol-kaa\'i', 'Upload Fayda', 'ካርድ ጫን (Upload Fayda)')}</span>
                  </button>
                  {faydaDocUrl && (
                    <button
                      type="button"
                      onClick={() => setFaydaDocUrl(undefined)}
                      className="px-2 py-1 text-xs text-rose-600 hover:bg-rose-100 rounded-xl font-bold transition-colors"
                    >
                      {t3('Haqi', 'Remove', 'አጥፋ')}
                    </button>
                  )}
                </div>
                <input
                  ref={faydaInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFaydaDocUpload}
                  className="hidden"
                />
              </div>

              {/* Fayda Doc Preview Thumbnail */}
              {faydaDocUrl && (
                <div className="mt-2 rounded-xl overflow-hidden border border-amber-300 max-h-40 bg-white">
                  <img
                    src={faydaDocUrl}
                    alt="Fayda Document"
                    className="w-full h-40 object-contain"
                  />
                </div>
              )}
            </div>
          </div>

          {/* SECTION 4: MULTIPLE GRADUATION CREDENTIALS */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
              <div>
                <h4 className="text-xs font-black uppercase text-emerald-900 tracking-wider flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-emerald-700" />
                  <span>
                    {t3(
                      '4. Ragaawwan Eebbaa fi Digirii',
                      '4. Graduation Credentials & Degrees',
                      '4. የተመረቀበት ማስረጃዎች (Graduation Credentials & Degrees)'
                    )}
                  </span>
                </h4>
                <p className="text-[11px] text-slate-500">
                  {t3(
                    'Ragaa eebbaa tokkoo ol (Digirii, Maastarsii, Dippiloomaa, Waraqaa Ragaa, Hayyama Ogummaa) maxxansuun ni danda\'ama',
                    'You can attach multiple credentials (Degree, Masters, Diploma, Certificate, Professional License)',
                    'ከአንድ በላይ የተመረቀበት ማስረጃ (ዲግሪ፣ ማስተርስ፣ ዲፕሎማ፣ ሰርተፊኬት፣ የሙያ ፈቃድ) ማያያዝ ይቻላል'
                  )}
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddCredential}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl transition-colors shadow-xs self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t3('+ Ragaa Eebbaa Biraa Dabali', '+ Add Credential', '+ ሌላ የተመረቀ ማስረጃ አክል')}</span>
              </button>
            </div>

            {/* List of graduation credentials */}
            <div className="space-y-4">
              {credentials.map((cred, idx) => (
                <div
                  key={cred.id || idx}
                  className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-emerald-950 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-800 text-white flex items-center justify-center text-[10px]">
                        {idx + 1}
                      </span>
                      <span>
                        {t3('Ragaa', 'Credential', 'ማስረጃ')} #{idx + 1} ({cred.level})
                      </span>
                    </span>

                    {credentials.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveCredential(idx)}
                        className="text-xs text-rose-600 hover:text-rose-800 hover:bg-rose-100 p-1 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{t3('Ragaa Kana Haqi', 'Remove Credential', 'ይህን ማስረጃ ሰርዝ')}</span>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        {t3('Sadarkaa Barnootaa (Level)', 'Education Level', 'የትምህርት ደረጃ (Level)')}
                      </label>
                      <select
                        value={cred.level}
                        onChange={(e) =>
                          handleUpdateCredential(idx, 'level', e.target.value as any)
                        }
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                      >
                        <option value="Degree">{t3('Digirii Jalqabaa (First Degree / B.Sc / B.A)', 'First Degree (B.Sc / B.A)', 'የመጀመሪያ ዲግሪ (First Degree / B.Sc / B.A)')}</option>
                        <option value="Masters">{t3('Digirii Maastarsii (Master\'s / M.Sc / M.A)', 'Master\'s Degree (M.Sc / M.A)', 'የማስተርስ ዲግሪ (Master\'s / M.Sc / M.A)')}</option>
                        <option value="PhD">{t3('Doktoreetii (PhD / Doctorate)', 'Doctorate (PhD)', 'ዶክትሬት (PhD / Doctorate)')}</option>
                        <option value="Diploma">{t3('Dippiloomaa (Diploma / TVET)', 'Diploma / TVET', 'ዲፕሎማ (Diploma / TVET)')}</option>
                        <option value="Certificate">{t3('Waraqaa Ragaa Ogummaa (Certificate)', 'Professional Certificate', 'የሙያ ሰርተፊኬት (Certificate)')}</option>
                        <option value="License">{t3('Sanada Hayyama Ogummaa (Statutory License)', 'Statutory License', 'የሙያ ፈቃድ ሰነድ (Statutory License)')}</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        {t3('Damee Barnootaa / Ogummaa (Field of Study)', 'Field of Study', 'የትምህርት መስክ / ሙያ (Field of Study)')} <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={t3(
                          'Fkn: Information & Library Science / Educational Leadership',
                          'e.g., Information & Library Science / Educational Leadership',
                          'ለምሳሌ: Information & Library Science / Educational Leadership'
                        )}
                        value={cred.fieldOfStudy}
                        onChange={(e) => handleUpdateCredential(idx, 'fieldOfStudy', e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        {t3('Yuunivarsiitii / Dhaabbata Itti Eebbifame (Institution)', 'Institution / University', 'የተመረቀበት ዩኒቨርሲቲ / ተቋም (Institution)')} <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={t3(
                          'Fkn: Yuunivarsiitii Jimmaa / Yuunivarsiitii Finfinnee',
                          'e.g., Jimma University / Addis Ababa University',
                          'ለምሳሌ: Jimma University / Addis Ababa University'
                        )}
                        value={cred.institution}
                        onChange={(e) => handleUpdateCredential(idx, 'institution', e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        {t3('Bara Eebbaa (Year)', 'Graduation Year', 'የምረቃ ዓ.ም (Year)')}
                      </label>
                      <input
                        type="number"
                        min="1980"
                        max="2030"
                        value={cred.graduationYear}
                        onChange={(e) =>
                          handleUpdateCredential(idx, 'graduationYear', Number(e.target.value))
                        }
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-xl text-xs font-mono font-bold focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        {t3('Lakkoofsa Sanadaa / Digirii (Doc No.)', 'Document / Degree No.', 'የሰነድ / ዲግሪ ቁጥር (Doc No.)')}
                      </label>
                      <input
                        type="text"
                        placeholder="JU-BSC-ILS-2017-7429"
                        value={cred.credentialDocNumber}
                        onChange={(e) =>
                          handleUpdateCredential(idx, 'credentialDocNumber', e.target.value)
                        }
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-xl text-xs font-mono font-medium focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                      />
                    </div>

                    {/* Individual Document Image Upload */}
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        {t3(
                          'Faayila Sanada / Iskaanaa Ragaa Eebbaa Idilee',
                          'Official Graduation Document / Scan Attachment',
                          'ይፋዊ የተመረቀበት ማስረጃ ሰነድ / ስካን ፋይል (Document Proof Attachment)'
                        )}
                      </label>
                      <div className="flex items-center gap-2">
                        <label className="cursor-pointer inline-flex items-center gap-1 px-3 py-1 bg-white border border-slate-300 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-700 transition-colors">
                          <Upload className="w-3.5 h-3.5 text-emerald-700" />
                          <span>{t3('Sanada Ol-kaa\'i', 'Upload Scan', 'ሰነድ ጫን (Upload Scan)')}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleCredentialDocUpload(idx, e)}
                            className="hidden"
                          />
                        </label>
                        {cred.documentFileUrl && (
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> {t3('Sanadni maxxanfameera', 'Attached', 'ሰነድ ተያይዟል')}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleUpdateCredential(idx, 'documentFileUrl', undefined)}
                              className="text-[10px] text-rose-600 hover:underline"
                            >
                              {t3('Haqi', 'Remove', 'ሰርዝ')}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Add button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleAddCredential}
                className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 border border-dashed border-emerald-400 text-emerald-900 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>
                  {t3(
                    '+ Ragaa Eebbaa Dabalataa Biraa Dabali',
                    '+ Add Another Credential Document',
                    '+ ሌላ ተጨማሪ የተመረቀበት ማስረጃ አክል (Add Another Credential Document)'
                  )}
                </span>
              </button>
            </div>
          </div>

          {/* SECTION 5: LICENSE, EXPERIENCE & ACCESS CODE */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h4 className="text-xs font-black uppercase text-slate-900 tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
              <Shield className="w-4 h-4 text-slate-700" />
              <span>
                {t3(
                  '5. Hayyama Ogummaa fi Koodii Seensaa (License & Access)',
                  '5. Professional License & Access Code',
                  '5. የሙያ ፈቃድ እና የመግቢያ ኮድ (License & Access)'
                )}
              </span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t3('Lakkoofsa Hayyama Ogummaa', 'Professional License No', 'የሙያ ፈቃድ ቁጥር (Professional License No)')}
                </label>
                <input
                  type="text"
                  placeholder="ETH-OR-LIB-2017-1093"
                  value={professionalLicenseNumber}
                  onChange={(e) => setProfessionalLicenseNumber(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-mono font-medium focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t3('Waggaa Muuxannoo Hojii', 'Years of Experience', 'የስራ ልምድ ዓመታት (Years of Experience)')}
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(Number(e.target.value))}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-mono font-bold focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t3('Koodii Seensaa (Access Code)', 'Access Code', 'የመግቢያ ኮድ (Access Code)')}
                </label>
                <input
                  type="text"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-mono font-black text-emerald-900 bg-emerald-50/50 focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition-colors"
            >
              {t3('Haqi', 'Cancel', 'ይቅር (Cancel)')}
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl transition-colors shadow-md flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {editingStakeholder
                  ? t3('Jijjiirama Ol-kaa\'i', 'Save Changes', 'ለውጦቹን አስቀምጥ (Save Changes)')
                  : t3(
                      'Qooda Fudhattuu Galmeessi & Waraqaa Ragaa Uumi',
                      'Register Stakeholder & Generate Certificate',
                      'ባለድርሻ አካሉን መዝግብ እና የምስክር ወረቀት ፍጠር'
                    )}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
