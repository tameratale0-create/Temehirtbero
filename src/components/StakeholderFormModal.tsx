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
  const photoInputRef = useRef<HTMLInputElement>(null);
  const faydaInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [fullName, setFullName] = useState(editingStakeholder?.fullName || '');
  const [gender, setGender] = useState<'M' | 'F'>(editingStakeholder?.gender || 'M');
  const [role, setRole] = useState<StakeholderRole>(editingStakeholder?.role || 'head_librarian');
  const [roleCustomTitle, setRoleCustomTitle] = useState(editingStakeholder?.roleCustomTitle || '');
  
  // Profile Office / Department (ጽሕፈት ቤት)
  const [officeOrDepartment, setOfficeOrDepartment] = useState(
    editingStakeholder?.officeOrDepartment || 'የትምህርት ቤተ-መጻሕፍት እና የመረጃ ማዕከል ጽ/ቤት'
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
            fieldOfStudy: 'Library & Information Science (የቤተ-መጻሕፍት ሳይንስ)',
            institution: 'Jimma University (ጅማ ዩኒቨርሲቲ)',
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
    'የትምህርት ቤተ-መጻሕፍት እና የመረጃ ማዕከል ጽ/ቤት',
    'የትምህርት ቤት ዋና አስተዳደር ጽ/ቤት (Principal Office)',
    'አካዳሚክ ጉዳዮች እና ስርአተ-ትምህርት ጽ/ቤት',
    'የሳይንስ፣ አይሲቲ እና ላብራቶሪ ጽ/ቤት',
    'የቋንቋዎች ዲፓርትመንት ጽ/ቤት',
    'የተማሪዎች አገልግሎት፣ ምክር እና ስነ-ምግባር ጽ/ቤት',
    'ሬጅስትራር፣ ፋይናንስ እና ንብረት አስተዳደር',
    'የወላጅ መምህራን ህብረት (PTA) ጽ/ቤት'
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
      alert('ቢያንስ አንድ የተመረቀበት ማስረጃ መኖር አለበት (At least one credential required)');
      return;
    }
    setCredentials(credentials.filter((_, idx) => idx !== index));
  };

  // Form Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      alert('እባክዎ የባለድርሻ አካሉን ሙሉ ስም ያስገቡ');
      return;
    }

    if (!officeOrDepartment.trim()) {
      alert('እባክዎ የፕሮፋይል ጽሕፈት ቤቱን ያስገቡ');
      return;
    }

    if (!faydaNumber.trim()) {
      alert('እባክዎ የፋይዳ ዲጂታል መታወቂያ ቁጥር ያስገቡ');
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
                  ? 'የባለድርሻ አካል መረጃ ማስተካከያ'
                  : 'የትምህርት ቤት ባለድርሻ አካል ምዝገባ ፎርም'}
              </h3>
              <p className="text-xs text-slate-300">
                {school.name} · የፕሮፋይል ጽሕፈት ቤት፣ የፋይዳ መታወቂያ እና የተመረቁ ማስረጃዎች
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
          {/* SECTION 1: PERSONAL & CONTACT INFORMATION */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h4 className="text-xs font-black uppercase text-emerald-900 tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
              <User className="w-4 h-4 text-emerald-700" />
              <span>1. የግል እና የስራ መረጃ (Personal & Role Details)</span>
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
                    <span className="text-[10px] font-bold">ፎቶ የለም</span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  className="absolute inset-0 bg-black/60 rounded-xl flex flex-col items-center justify-center text-white text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Camera className="w-4 h-4 mb-0.5" />
                  <span>ቀይር</span>
                </button>
              </div>

              <div className="flex-1 text-center sm:text-left space-y-1">
                <p className="text-xs font-bold text-slate-800">የባለድርሻ አካሉ የግል ፕሮፋይል ፎቶ</p>
                <p className="text-[11px] text-slate-500">
                  ለይፋዊ የምስክር ወረቀት እና ለዲጂታል መታወቂያ የሚሆን ጥራት ያለው ፎቶ ይጫኑ
                </p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>ፎቶ ምረጥ (Upload Photo)</span>
                  </button>
                  {photoUrl && (
                    <button
                      type="button"
                      onClick={() => setPhotoUrl(undefined)}
                      className="px-2.5 py-1 text-xs text-rose-600 hover:bg-rose-50 rounded-xl font-bold transition-colors"
                    >
                      አጥፋ
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
                  ሙሉ ስም (Full Name) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="ለምሳሌ: ወ/ሮ ሙሉእመቤት ደረሰ / አቶ ጉተማ ዋቆ"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ጾታ (Gender)</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as 'M' | 'F')}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-medium bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                >
                  <option value="M">ወንድ (Male)</option>
                  <option value="F">ሴት (Female)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ስልክ ቁጥር (Phone Number)
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
                  ኢሜይል (Email Address)
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
                  የትምህርት ቤት ባለድርሻ አካል ሚና (Stakeholder Role)
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as StakeholderRole)}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-bold text-emerald-950 bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                >
                  <option value="head_librarian">የትምህርት ቤት ቤተ-መጻሕፍት ኃላፊ እና የመረጃ ባለሙያ</option>
                  <option value="principal">ዋና ርዕሰ መምህር / ዳይሬክተር</option>
                  <option value="vice_principal_academic">ምክትል ርዕሰ መምህር (አካዳሚክ)</option>
                  <option value="vice_principal_admin">ምክትል ርዕሰ መምህር (አስተዳደር)</option>
                  <option value="lab_technician">የሳይንስ እና ቴክኖሎጂ ላብራቶሪ ባለሙያ</option>
                  <option value="department_head">የትምህርት ክፍል ኃላፊ</option>
                  <option value="teacher">ከፍተኛ መምህር</option>
                  <option value="guidance_counselor">የስነ-ልቦና እና የምክር ባለሙያ</option>
                  <option value="school_owner_board">የትምህርት ቤት ባለቤት / የቦርድ ሰብሳቢ</option>
                  <option value="pta_chair">የወላጅ መምህራን ህብረት (PTA) ሰብሳቢ</option>
                  <option value="registrar_finance">ሬጅስትራር እና ፋይናንስ ሹም</option>
                  <option value="student_council_leader">የተማሪዎች መማክርት መሪ</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ብጁ የስራ ማዕረግ (Custom Role Title / Specific Assignment)
                </label>
                <input
                  type="text"
                  placeholder="ለምሳሌ: የቤተ-መጻሕፍት እና የመረጃ ባለሙያ"
                  value={roleCustomTitle}
                  onChange={(e) => setRoleCustomTitle(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: PROFILE OFFICE / DEPARTMENT (ጽሕፈት ቤት) - EXPLICITLY REQUESTED */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="text-xs font-black uppercase text-emerald-900 tracking-wider flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-700" />
                <span>2. የፕሮፋይል ጽሕፈት ቤት (Profile Office / Department)</span>
              </h4>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                ግዴታ ማስገቢያ
              </span>
            </div>

            <p className="text-xs text-slate-600">
              ባለድርሻ አካሉ በይፋ የሚሰሩበትን ወይም የሚመሩትን የትምህርት ቤት ጽሕፈት ቤት ይምረጡ ወይም ያስገቡ:
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
                የተመረጠ / የተጻፈ ጽሕፈት ቤት ስም <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  placeholder="ለምሳሌ: የትምህርት ቤተ-መጻሕፍት እና የመረጃ ማዕከል ጽ/ቤት"
                  value={officeOrDepartment}
                  onChange={(e) => setOfficeOrDepartment(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 border border-slate-300 rounded-xl text-xs font-bold text-emerald-950 focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: FAYDA NATIONAL DIGITAL ID & NUMBER - EXPLICITLY REQUESTED */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="text-xs font-black uppercase text-amber-900 tracking-wider flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-amber-700" />
                <span>3. የፋይዳ መታወቂያ እና የፋይዳ ቁጥር (Fayda Digital National ID)</span>
              </h4>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                ብሔራዊ ዲጂታል መለያ
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  የፋይዳ ዲጂታል መታወቂያ ቁጥር (Fayda ID / FIN) <span className="text-rose-500">*</span>
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
                  16-አሃዝ ወይም የፋይዳ ልዩ መለያ ቁጥር
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  የፋይዳ ማረጋገጫ ሁኔታ (Verification Status)
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
                      {faydaVerified ? 'በፋይዳ ስርዓት የተረጋገጠ (Verified)' : 'ማረጋገጫ በመጠባበቅ ላይ'}
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
                    <span>የፋይዳ ዲጂታል መታወቂያ ካርድ ሰነድ / ስካን (Fayda ID Card Photo)</span>
                  </h5>
                  <p className="text-[11px] text-amber-900/80">
                    የፋይዳ መታወቂያውን የፊት ወይም የጀርባ ፎቶ ይጫኑ
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => faydaInputRef.current?.click()}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>ካርድ ጫን (Upload Fayda)</span>
                  </button>
                  {faydaDocUrl && (
                    <button
                      type="button"
                      onClick={() => setFaydaDocUrl(undefined)}
                      className="px-2 py-1 text-xs text-rose-600 hover:bg-rose-100 rounded-xl font-bold transition-colors"
                    >
                      አጥፋ
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

          {/* SECTION 4: MULTIPLE GRADUATION CREDENTIALS - EXPLICITLY REQUESTED (ከአንድ በላይ የተመረቀ ማስረጃ) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
              <div>
                <h4 className="text-xs font-black uppercase text-emerald-900 tracking-wider flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-emerald-700" />
                  <span>4. የተመረቀበት ማስረጃዎች (Graduation Credentials & Degrees)</span>
                </h4>
                <p className="text-[11px] text-slate-500">
                  ከአንድ በላይ የተመረቀበት ማስረጃ (ዲግሪ፣ ማስተርስ፣ ዲፕሎማ፣ ሰርተፊኬት፣ የሙያ ፈቃድ) ማያያዝ ይቻላል
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddCredential}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl transition-colors shadow-xs self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ ሌላ የተመረቀ ማስረጃ አክል</span>
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
                      <span>ማስረጃ #{idx + 1} ({cred.level})</span>
                    </span>

                    {credentials.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveCredential(idx)}
                        className="text-xs text-rose-600 hover:text-rose-800 hover:bg-rose-100 p-1 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>ይህን ማስረጃ ሰርዝ</span>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        የትምህርት ደረጃ (Level)
                      </label>
                      <select
                        value={cred.level}
                        onChange={(e) =>
                          handleUpdateCredential(idx, 'level', e.target.value as any)
                        }
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                      >
                        <option value="Degree">የመጀመሪያ ዲግሪ (First Degree / B.Sc / B.A)</option>
                        <option value="Masters">የማስተርስ ዲግሪ (Master's / M.Sc / M.A)</option>
                        <option value="PhD">ዶክትሬት (PhD / Doctorate)</option>
                        <option value="Diploma">ዲፕሎማ (Diploma / TVET)</option>
                        <option value="Certificate">የሙያ ሰርተፊኬት (Certificate)</option>
                        <option value="License">የሙያ ፈቃድ ሰነድ (Statutory License)</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        የትምህርት መስክ / ሙያ (Field of Study) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="ለምሳሌ: Information & Library Science / Educational Leadership"
                        value={cred.fieldOfStudy}
                        onChange={(e) => handleUpdateCredential(idx, 'fieldOfStudy', e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        የተመረቀበት ዩኒቨርሲቲ / ተቋም (Institution) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="ለምሳሌ: Jimma University / Addis Ababa University"
                        value={cred.institution}
                        onChange={(e) => handleUpdateCredential(idx, 'institution', e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        የምረቃ ዓ.ም (Year)
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
                        የሰነድ / ዲግሪ ቁጥር (Doc No.)
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
                        ይፋዊ የተመረቀበት ማስረጃ ሰነድ / ስካን ፋይል (Document Proof Attachment)
                      </label>
                      <div className="flex items-center gap-2">
                        <label className="cursor-pointer inline-flex items-center gap-1 px-3 py-1 bg-white border border-slate-300 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-700 transition-colors">
                          <Upload className="w-3.5 h-3.5 text-emerald-700" />
                          <span>ሰነድ ጫን (Upload Scan)</span>
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
                              <CheckCircle2 className="w-3 h-3" /> ሰነድ ተያይዟል
                            </span>
                            <button
                              type="button"
                              onClick={() => handleUpdateCredential(idx, 'documentFileUrl', undefined)}
                              className="text-[10px] text-rose-600 hover:underline"
                            >
                              ሰርዝ
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
                <span>+ ሌላ ተጨማሪ የተመረቀበት ማስረጃ አክል (Add Another Credential Document)</span>
              </button>
            </div>
          </div>

          {/* SECTION 5: LICENSE, EXPERIENCE & ACCESS CODE */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h4 className="text-xs font-black uppercase text-slate-900 tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
              <Shield className="w-4 h-4 text-slate-700" />
              <span>5. የሙያ ፈቃድ እና የመግቢያ ኮድ (License & Access)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  የሙያ ፈቃድ ቁጥር (Professional License No)
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
                  የስራ ልምድ ዓመታት (Years of Experience)
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
                  የመግቢያ ኮድ (Access Code)
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
              ይቅር (Cancel)
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl transition-colors shadow-md flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {editingStakeholder
                  ? 'ለውጦቹን አስቀምጥ (Save Changes)'
                  : 'ባለድርሻ አካሉን መዝግብ እና የምስክር ወረቀት ፍጠር'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
