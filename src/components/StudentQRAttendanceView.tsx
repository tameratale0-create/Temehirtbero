import React, { useState, useEffect, useRef, useMemo } from 'react';
import QRCode from 'qrcode';
import jsQR from 'jsqr';
import {
  QrCode,
  Camera,
  CheckCircle2,
  Clock,
  UserCheck,
  Building2,
  Calendar,
  Sparkles,
  Printer,
  Download,
  Maximize2,
  Minimize2,
  RefreshCw,
  AlertCircle,
  FileText,
  Search,
  Filter,
  Users,
  ShieldCheck,
  Check,
  X,
  Volume2,
  VolumeX,
  GraduationCap,
  Upload,
  ArrowRight
} from 'lucide-react';
import {
  StudentRecord,
  StudentAttendanceRecord,
  School,
  Language,
  AppUserSession
} from '../types';
import { StorageService } from '../utils/storage';
import { OfflineSyncManager } from '../utils/offlineSync';
import { SchoolLogo } from './SchoolLogo';

interface StudentQRAttendanceViewProps {
  school: School;
  students: StudentRecord[];
  currentUser: AppUserSession | null;
  currentLang: Language;
  preSelectedStudentId?: string;
  onAttendanceRecorded?: (record: StudentAttendanceRecord) => void;
  compactMode?: boolean;
}

export const StudentQRAttendanceView: React.FC<StudentQRAttendanceViewProps> = ({
  school,
  students,
  currentUser,
  currentLang,
  preSelectedStudentId,
  onAttendanceRecorded,
  compactMode = false
}) => {
  const isOm = currentLang === 'om';
  const isEn = currentLang === 'en';
  const t3 = (om: string, en: string, am: string) => (isOm ? om : isEn ? en : am);

  // Today's date in YYYY-MM-DD
  const todayDate = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Main active tab:
  // 'student_scan' | 'display_daily_qr' | 'kiosk_scanner' | 'today_roster'
  const isStudentRole = currentUser?.role === 'student';
  const [activeTab, setActiveTab] = useState<'student_scan' | 'display_daily_qr' | 'kiosk_scanner' | 'today_roster'>(
    isStudentRole ? 'student_scan' : 'display_daily_qr'
  );

  // Sound feedback toggle
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Play audio confirmation chime using pure Web Audio API
  const playChime = (success: boolean = true) => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      if (success) {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.12); // A5
        gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.35);
      } else {
        osc.type = 'square';
        osc.frequency.setValueAtTime(320, audioCtx.currentTime);
        osc.frequency.setValueAtTime(220, audioCtx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.35);
      }
    } catch (_) {}
  };

  // Identify matching student for the current session (if student or pre-selected)
  const activeStudent = useMemo(() => {
    if (preSelectedStudentId) {
      return students.find((s) => s.id === preSelectedStudentId) || null;
    }
    if (currentUser?.accessCode) {
      return (
        students.find(
          (s) =>
            s.accessCode === currentUser.accessCode ||
            s.id === currentUser.identifier ||
            (currentUser.name && s.fullName.toLowerCase().includes(currentUser.name.toLowerCase().split(' ')[0]))
        ) || null
      );
    }
    return students[0] || null;
  }, [students, currentUser, preSelectedStudentId]);

  // Selected student to check in (default to active student)
  const [selectedStudentForCheckIn, setSelectedStudentForCheckIn] = useState<StudentRecord | null>(
    activeStudent
  );

  useEffect(() => {
    if (activeStudent && !selectedStudentForCheckIn) {
      setSelectedStudentForCheckIn(activeStudent);
    }
  }, [activeStudent]);

  // Attendance Records for today
  const [todayRecords, setTodayRecords] = useState<StudentAttendanceRecord[]>(() =>
    StorageService.getAttendance(school.id, undefined, todayDate)
  );

  // Refresh attendance records
  const refreshRecords = () => {
    const updated = StorageService.getAttendance(school.id, undefined, todayDate);
    setTodayRecords(updated);
  };

  // Last check-in confirmation notice
  const [lastCheckInResult, setLastCheckInResult] = useState<{
    student: StudentRecord;
    record: StudentAttendanceRecord;
    timestamp: string;
    isNew: boolean;
  } | null>(null);

  // Selected Grade for Daily QR Code Generator
  const [selectedGradeForQR, setSelectedGradeForQR] = useState<number | 'all'>('all');
  const [dailyQrDataUrl, setDailyQrDataUrl] = useState<string>('');
  const [dailyQrToken, setDailyQrToken] = useState<string>('');
  const [isQrFullscreen, setIsQrFullscreen] = useState(false);

  // Generate today's classroom Attendance QR Code
  useEffect(() => {
    const token = `SHAS-ATT-${school.id.toUpperCase()}-${todayDate.replace(/-/g, '')}-${selectedGradeForQR}`;
    setDailyQrToken(token);

    const payload = JSON.stringify({
      type: 'shashemene_daily_attendance',
      version: '1.0',
      schoolId: school.id,
      schoolCode: school.code,
      schoolName: school.name,
      date: todayDate,
      grade: selectedGradeForQR,
      token,
      generatedAt: new Date().toISOString()
    });

    QRCode.toDataURL(payload, {
      width: 450,
      margin: 2,
      color: {
        dark: '#064e3b',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'H'
    })
      .then((url) => setDailyQrDataUrl(url))
      .catch((err) => console.error('Failed to generate daily QR:', err));
  }, [school.id, school.code, school.name, todayDate, selectedGradeForQR]);

  // Camera Scanning State
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraFacing, setCameraFacing] = useState<'environment' | 'user'>('environment');
  const scanningLoopRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Process a scanned QR code string (can be classroom attendance QR or student ID card QR)
  const handleScannedData = (rawText: string) => {
    if (!rawText) return;

    let targetStudent: StudentRecord | null = null;
    let verificationToken = '';

    try {
      // 1. Try parsing JSON payload
      const parsed = JSON.parse(rawText);

      if (parsed.type === 'shashemene_daily_attendance') {
        verificationToken = parsed.token || 'QR-DAILY-ATT';
        targetStudent = selectedStudentForCheckIn || activeStudent || students[0];
      } else if (parsed.studentId || parsed.studentIdNumber || parsed.accessCode) {
        const match = students.find(
          (s) =>
            s.studentIdNumber === parsed.studentId ||
            s.studentIdNumber === parsed.studentIdNumber ||
            s.accessCode === parsed.accessCode ||
            (parsed.name && s.fullName.toLowerCase() === parsed.name.toLowerCase())
        );
        if (match) {
          targetStudent = match;
          verificationToken = `ID-CARD-QR-${match.studentIdNumber}`;
        }
      }
    } catch (_) {
      // 2. Plaintext string check (e.g. Student ID Number or Access Code)
      const clean = rawText.trim();
      const match = students.find(
        (s) =>
          s.studentIdNumber === clean ||
          s.accessCode === clean ||
          s.id === clean ||
          s.fullName.toLowerCase().includes(clean.toLowerCase())
      );
      if (match) {
        targetStudent = match;
        verificationToken = `ID-RAW-${clean}`;
      } else if (clean.startsWith('SHAS-ATT-')) {
        targetStudent = selectedStudentForCheckIn || activeStudent || students[0];
        verificationToken = clean;
      }
    }

    if (!targetStudent) {
      playChime(false);
      setCameraError(
        t3(
          'Koodiin QR dubbifame barataa galmee mana barumsaa keessa jiru ykn argama har’aa waliin wal hin simne.',
          'The scanned QR code does not match a registered student or today’s attendance token.',
          'የተነበበው QR ኮድ በትምህርት ቤቱ መዝገብ ውስጥ ካለ ተማሪ ወይም ከዛሬው መገኘት ጋር አልተዛመደም።'
        )
      );
      setTimeout(() => setCameraError(null), 4000);
      return;
    }

    commitCheckIn(targetStudent, verificationToken);
  };

  // Commit attendance check-in to storage and offline sync
  const commitCheckIn = (student: StudentRecord, token: string = 'QR-SCAN-OK') => {
    const now = new Date();
    const timeFormatted = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });

    const isLate = now.getHours() > 8 || (now.getHours() === 8 && now.getMinutes() > 30);
    const status: StudentAttendanceRecord['status'] = isLate ? 'late' : 'present';

    const recordId = `att-${student.id}-${todayDate}`;
    const newRecord: StudentAttendanceRecord = {
      id: recordId,
      schoolId: school.id,
      studentId: student.id,
      studentName: student.fullName,
      grade: student.grade,
      section: student.section,
      date: todayDate,
      time: timeFormatted,
      status,
      reason: isLate
        ? t3('Barfatee Dhufuu (Late Check-in)', 'Late Check-in', 'ዘግይቶ መድረስ (Late Check-in)')
        : t3('Sa’aatii Isaa Eeguun Argame (On-time)', 'On-time Check-in', 'በሰዓቱ መገኘት (On-time)'),
      recordedBy:
        currentUser?.role === 'student'
          ? t3('Barataa Mataa Isaa (Self QR Check-in)', 'Self QR Check-in', 'ተማሪው እራሱ (Self QR Check-in)')
          : currentUser?.name || t3('Kiyoooskii Karra Mana Barumsaa', 'School Gate Kiosk', 'የት/ቤት በር ኪዮስክ'),
      method: 'qr_scan',
      qrVerificationToken: token
    };

    StorageService.markAttendance(newRecord);
    refreshRecords();

    OfflineSyncManager.enqueue(
      'student_performance',
      'update',
      newRecord.id,
      newRecord,
      {
        authorName: currentUser?.name || student.fullName,
        schoolName: school.name,
        description: t3(
          `Argamni guyyaa barataa ${student.fullName} koodii QR tiin galmaa'e (${timeFormatted})`,
          `Daily QR attendance recorded for ${student.fullName} (${timeFormatted})`,
          `የተማሪ ${student.fullName} ዕለታዊ መገኘት በ QR ኮድ ተመዝግቧል (${timeFormatted})`
        )
      }
    );

    if (onAttendanceRecorded) {
      onAttendanceRecorded(newRecord);
    }

    playChime(true);

    setLastCheckInResult({
      student,
      record: newRecord,
      timestamp: timeFormatted,
      isNew: true
    });
  };

  // Start Camera Stream
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error(
          t3(
            'Tajaajilli kaameraa biraawzarii ykn iFrame kana keessatti hin deeggaramu.',
            'Camera service is not supported in this browser or iFrame.',
            'የካሜራ አገልግሎት በዚህ ብሮውዘር ወይም iFrame ውስጥ አይደገፍም።'
          )
        );
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: cameraFacing,
          width: { ideal: 640 },
          height: { ideal: 480 }
        },
        audio: false
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
        setIsCameraActive(true);
        startScanningLoop();
      }
    } catch (err: any) {
      console.warn('Camera start error:', err);
      setIsCameraActive(false);
      setCameraError(
        t3(
          'Kaameraa banuun hin danda’amne. Hayyama kaameraa kennaa ykn armaan gaditti "Suuraa QR Galchi (Upload QR)" fayyadamaa.',
          'Unable to open camera. Please grant camera permission or use "Upload QR" below.',
          'ካሜራውን መክፈት አልተቻለም። እባክዎ የካሜራ ፈቃድ ይስጡ ወይም ከታች ያለውን "የ QR ፎቶ አስገባ (Upload QR)" ይጠቀሙ።'
        )
      );
    }
  };

  // Stop Camera Stream
  const stopCamera = () => {
    if (scanningLoopRef.current) {
      cancelAnimationFrame(scanningLoopRef.current);
      scanningLoopRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  // Scanning frame-by-frame loop using jsQR
  const startScanningLoop = () => {
    let lastScanTime = 0;

    const scanFrame = () => {
      if (!videoRef.current || !canvasRef.current || videoRef.current.readyState !== videoRef.current.HAVE_ENOUGH_DATA) {
        scanningLoopRef.current = requestAnimationFrame(scanFrame);
        return;
      }

      const canvas = canvasRef.current;
      const video = videoRef.current;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });

      if (ctx) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert'
        });

        const now = Date.now();
        if (code && code.data && now - lastScanTime > 2500) {
          lastScanTime = now;
          handleScannedData(code.data);
        }
      }

      scanningLoopRef.current = requestAnimationFrame(scanFrame);
    };

    scanningLoopRef.current = requestAnimationFrame(scanFrame);
  };

  // Clean up stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Handle uploaded QR image file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code && code.data) {
            handleScannedData(code.data);
          } else {
            setCameraError(
              t3(
                'Suuraa fe’ame keessatti koodiin QR sirriin hin argamne.',
                'No valid QR code was detected in the uploaded image.',
                'በተጫነው ምስል ውስጥ ትክክለኛ የ QR ኮድ አልተገኘም።'
              )
            );
            setTimeout(() => setCameraError(null), 3500);
          }
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Simulated Instant Check-in (Guaranteed works in any restricted iFrame)
  const handleSimulatedCheckIn = () => {
    const target = selectedStudentForCheckIn || activeStudent || students[0];
    if (!target) return;
    commitCheckIn(target, `SIMULATED-ATT-${todayDate}-${Date.now()}`);
  };

  // Print Daily Attendance QR poster
  const handlePrintQR = () => {
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) {
      window.print();
      return;
    }

    const gradeLabel =
      selectedGradeForQR === 'all'
        ? t3('Kutaalee Hunda', 'All Grades', 'ሁሉም ክፍሎች')
        : t3(`Kutaa ${selectedGradeForQR}ffaa`, `Grade ${selectedGradeForQR}`, `${selectedGradeForQR}ኛ ክፍል`);

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${school.name} - ${t3('Koodii QR Argama Guyyaa', 'Daily Attendance QR Code', 'የቀን መገኘት QR ኮድ')}</title>
          <style>
            body { font-family: sans-serif; text-align: center; padding: 40px; color: #0f172a; }
            .card { border: 4px solid #064e3b; border-radius: 24px; padding: 30px; max-width: 550px; margin: 0 auto; }
            h1 { font-size: 24px; margin-bottom: 4px; color: #064e3b; }
            h2 { font-size: 16px; margin-top: 0; color: #475569; font-weight: normal; }
            .date-badge { display: inline-block; background: #ecfdf5; color: #065f46; font-weight: bold; padding: 6px 16px; border-radius: 20px; border: 1px solid #a7f3d0; margin-bottom: 20px; }
            img { width: 340px; height: 340px; margin: 10px 0; border: 2px solid #e2e8f0; border-radius: 16px; }
            .instructions { font-size: 13px; color: #334155; line-height: 1.6; margin-top: 20px; }
            .footer { font-size: 11px; color: #94a3b8; margin-top: 25px; border-top: 1px solid #e2e8f0; padding-top: 12px; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>${school.name}</h1>
            <h2>${t3('Koodii QR Idilee Galmee Argama Guyyaa Barattootaa', 'Official Daily Student Attendance QR Code', 'የተማሪዎች ዕለታዊ መገኘት መመዝገቢያ ይፋዊ QR ኮድ')}</h2>
            <div class="date-badge">${t3('Guyyaa:', 'Date:', 'ቀን፡')} ${todayDate} · ${t3('Kutaa:', 'Grade:', 'ክፍል፡')} ${gradeLabel}</div>
            <div>
              <img src="${dailyQrDataUrl}" alt="Daily Attendance QR Code" />
            </div>
            <div class="instructions">
              <strong>${t3('Qajeelfama Fayyadamaa:', 'Instructions:', 'የአጠቃቀም መመሪያ፡')}</strong><br/>
              ${t3(
                'Barattoonni yeroo gara mana barumsaa ykn daree seenan koodii QR kana bilbila isaaniitiin iskaan gochuun argama isaanii kallattiin galmeessu.',
                'When entering school or class, scan this QR code with your phone to immediately check in your attendance.',
                'ተማሪዎች ወደ ትምህርት ቤት ወይም ወደ ክፍል ሲገቡ ይህንን QR ኮድ በስልካቸው ስካን በማድረግ መገኘታቸውን በቀጥታ ይመዝግቡ።'
              )}
            </div>
            <div class="footer">
              ${t3(
                'Sirna Argama Dijitaalaa Idilee Biiroo Barnootaa Bulchiinsa Magaalaa Shaashamannee (Central Attendance Sync)',
                'Shashemene City Administration Education Bureau Official Digital Attendance System',
                'የሻሸመኔ ከተማ አስተዳደር ትምህርት ቢሮ ይፋዊ የዲጂታል መገኘት ስርዓት (Central Attendance Sync)'
              )}
            </div>
          </div>
        </body>
      </html>
    `);
    doc.close();

    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 2000);
    }, 400);
  };

  // Calculations for Today's Attendance
  const presentRecords = todayRecords.filter((r) => r.status === 'present' || r.status === 'late');
  const presentCount = presentRecords.length;
  const totalStudents = students.length || 1;
  const attendanceRate = Math.round((presentCount / totalStudents) * 100);

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 rounded-3xl p-5 sm:p-6 text-white shadow-xl border border-emerald-700/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-900/80 border border-emerald-400/40 rounded-full text-xs font-semibold text-emerald-200">
              <QrCode className="w-3.5 h-3.5 text-amber-300" />
              <span>
                {t3(
                  'Sirna Argama Guyyaa Barattootaa Koodii QR Idilee',
                  'Official Student Daily QR Attendance System',
                  'የተማሪዎች ይፋዊ የ QR ኮድ ዕለታዊ መገኘት ስርዓት'
                )}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
              {t3(
                'Galmee Argama Guyyaa Koodii QR tiin Kallattiin',
                'Live Daily Attendance Check-in via QR Code',
                'የቀን መገኘትን በ QR ኮድ በቀጥታ መመዝገቢያ'
              )}
            </h2>

            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              {t3(
                'Barattoonni koodii QR guyyaa daree ykn mana barumsaa kaameraa bilbilaan iskaan gochuun ykn waraqaa eenyummaa mana barumsaa agarsiisuun argama guyyaa isaanii battalumatti galmeessu.',
                'Students can scan the daily classroom or school QR code via phone camera or present their School ID card QR to check in instantly.',
                'ተማሪዎች የክፍላቸውን ወይም የትምህርት ቤታቸውን ይፋዊ የቀን QR ኮድ በስልክ ካሜራ ስካን በማድረግ ወይም የትምህርት ቤት መታወቂያ ካርዳቸውን በማሳየት ዕለታዊ መገኘታቸውን ወዲያውኑ ይመዘግባሉ።'
              )}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-900/60 border border-emerald-600/40 text-emerald-100 flex items-center gap-1.5 font-medium">
                <Calendar className="w-3.5 h-3.5 text-amber-300" />
                <span>{t3('Guyyaa:', 'Date:', 'ቀን፡')} <strong>{todayDate}</strong></span>
              </span>

              <span className="px-2.5 py-1 rounded-lg bg-emerald-900/60 border border-emerald-600/40 text-emerald-100 flex items-center gap-1.5 font-medium">
                <Building2 className="w-3.5 h-3.5 text-teal-300" />
                <span>{t3('M/Barumsaa:', 'School:', 'ት/ቤት፡')} <strong>{school.name}</strong></span>
              </span>

              <span className="px-2.5 py-1 rounded-lg bg-amber-400/20 border border-amber-300/40 text-amber-200 flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {t3(
                    `Kan Har’aa Argaman: ${presentCount} / ${totalStudents} (${attendanceRate}%)`,
                    `Present Today: ${presentCount} / ${totalStudents} (${attendanceRate}%)`,
                    `የዛሬ ተገኚዎች፡ ${presentCount} / ${totalStudents} (${attendanceRate}%)`
                  )}
                </span>
              </span>
            </div>
          </div>

          {/* Quick Audio & Action Bar */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2.5 rounded-xl border text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                soundEnabled
                  ? 'bg-emerald-900/80 border-emerald-500/50 text-emerald-200'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
              title={soundEnabled ? t3('Sagalee Cufi', 'Mute Sound', 'ድምፅ አጥፋ') : t3('Sagalee Bani', 'Enable Sound', 'ድምፅ አብራ')}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-300" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden sm:inline">
                {soundEnabled ? t3('Sagalee Banaa', 'Sound On', 'ድምፅ ክፍት') : t3('Callisa', 'Muted', 'ዝምታ')}
              </span>
            </button>

            <button
              type="button"
              onClick={refreshRecords}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              title={t3('Haaromsuu', 'Refresh', 'አድስ')}
            >
              <RefreshCw className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">{t3('Haaromsi', 'Refresh', 'አድስ')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Sub-Tabs Navigation */}
      <div className="bg-white rounded-2xl p-2 border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
          {/* Tab 1 */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('student_scan');
              stopCamera();
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'student_scan'
                ? 'bg-emerald-800 text-white shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Camera className="w-4 h-4 text-amber-300" />
            <span>{t3('Galmee QR Barataa (Self Check-in)', 'Student Self QR Check-in', 'ተማሪው በ QR መመዝገቢያ (Self Check-in)')}</span>
          </button>

          {/* Tab 2 */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('display_daily_qr');
              stopCamera();
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'display_daily_qr'
                ? 'bg-emerald-800 text-white shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <QrCode className="w-4 h-4 text-teal-300" />
            <span>{t3('Koodii QR M/Barumsaa Har’aa (Display QR)', 'Daily School QR (Display)', 'የቀኑ የት/ቤት QR ኮድ (Display QR)')}</span>
          </button>

          {/* Tab 3 */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('kiosk_scanner');
              stopCamera();
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'kiosk_scanner'
                ? 'bg-emerald-800 text-white shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <UserCheck className="w-4 h-4 text-indigo-300" />
            <span>{t3('Iskaanera Kiyoooskii Karraa (Gate Scanner)', 'Gate Kiosk Scanner', 'የበር ላይ ኪዮስክ ስካነር (Gate Scanner)')}</span>
          </button>

          {/* Tab 4 */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('today_roster');
              stopCamera();
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'today_roster'
                ? 'bg-emerald-800 text-white shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>
              {t3(
                `Gabaasa Argamtoota Har’aa (${presentCount})`,
                `Today's Attendance Report (${presentCount})`,
                `የዛሬ ተገኚዎች ሪፖርት (${presentCount})`
              )}
            </span>
          </button>
        </div>

        {/* Quick Simulation / Direct Test Check-in Button */}
        <button
          type="button"
          onClick={handleSimulatedCheckIn}
          className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer ml-auto"
          title={t3('Yeroo kaameraan hin hojjenne ykn yaaliif kallattiin galmeessi', 'Check in directly during testing or when camera is unavailable', 'ካሜራ በማይሰራበት ወይም በሙከራ ጊዜ በቀጥታ መገኘትን ይመዝግቡ')}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t3('Iskaanii Yaalii (Direct Check-in)', 'Direct Check-in (Test)', 'የሙከራ ስካን (Direct Check-in)')}</span>
        </button>
      </div>

      {/* Success Notification Bar */}
      {lastCheckInResult && (
        <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white p-4 rounded-2xl border-2 border-emerald-400 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/30 border border-emerald-300 flex items-center justify-center text-amber-300 shrink-0">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs uppercase tracking-wider text-emerald-300 font-extrabold">
                  ✓ {t3('Argamni Milkaa’inaan Galmaa’eera!', 'Attendance Recorded Successfully!', 'መገኘት በተሳካ ሁኔታ ተመዝግቧል!')}
                </span>
                <span className="text-[10px] bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full font-black">
                  {lastCheckInResult.record.status === 'late'
                    ? t3('Barfateera', 'Late', 'ዘግይቷል')
                    : t3('Argameera', 'Present', 'ተገኝቷል')}
                </span>
                <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full font-mono">
                  {lastCheckInResult.timestamp}
                </span>
              </div>
              <h4 className="text-base font-black text-white mt-0.5">
                {lastCheckInResult.student.fullName} ({t3('Kutaa', 'Grade', 'ክፍል')} {lastCheckInResult.student.grade}{lastCheckInResult.student.section})
              </h4>
              <p className="text-xs text-emerald-200">
                {t3('Eenyummaa:', 'ID:', 'መታወቂያ፡')} {lastCheckInResult.student.studentIdNumber} · {t3('Mala: Iskaanii QR · Offline & Online wal-simeera', 'Method: QR Scan · Synced Offline & Online', 'ዘዴ፡ QR ኮድ ስካን · ኦፍላይንና ኦንላይን ተመሳስሏል')}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setLastCheckInResult(null)}
            className="p-1.5 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors cursor-pointer self-start sm:self-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Camera Error Message */}
      {cameraError && (
        <div className="bg-amber-50 border border-amber-300 text-amber-950 p-3.5 rounded-2xl text-xs flex items-center justify-between gap-2 shadow-xs">
          <div className="flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>{cameraError}</span>
          </div>
          <button
            type="button"
            onClick={() => setCameraError(null)}
            className="text-amber-800 hover:text-amber-950 font-bold p-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* =========================================================================
          TAB 1: STUDENT SELF SCANNER
         ========================================================================= */}
      {activeTab === 'student_scan' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Camera Scanner & Image Uploader */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-emerald-100 text-emerald-800">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 leading-tight">
                    {t3('Iskaanera Koodii QR Daree', 'Classroom QR Code Scanner', 'የክፍል QR ኮድ ስካነር')}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {t3(
                      'Koodii QR guyyaa har’aa barsiisaan ykn daree keessatti maxxanfame kaameraa dura agarsiisaa',
                      'Point the camera at today’s QR code displayed by the teacher or in the classroom',
                      'በመምህሩ ወይም በክፍሉ የተለጠፈውን የዛሬ የቀን QR ኮድ በካሜራው ፊት ያሳዩ'
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {isCameraActive ? (
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    {t3('Kaameraa Dhaabi', 'Stop Camera', 'ካሜራ አቁም')}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={startCamera}
                    className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Camera className="w-4 h-4 text-amber-300" />
                    <span>{t3('Kaameraa Bani', 'Open Camera', 'ካሜራ ክፈት')}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Video Viewport Container */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-4/3 flex items-center justify-center border-2 border-dashed border-slate-700 shadow-inner">
              <canvas ref={canvasRef} className="hidden" />

              <video
                ref={videoRef}
                className={`w-full h-full object-cover ${isCameraActive ? 'block' : 'hidden'}`}
              />

              {isCameraActive && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-8">
                  <div className="w-48 h-48 sm:w-60 sm:h-60 border-2 border-emerald-400/90 rounded-3xl relative shadow-[0_0_0_9999px_rgba(0,0,0,0.4)]">
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-amber-300 rounded-tl-xl -mt-1 -ml-1" />
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-amber-300 rounded-tr-xl -mt-1 -mr-1" />
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-amber-300 rounded-bl-xl -mb-1 -ml-1" />
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-amber-300 rounded-br-xl -mb-1 -mr-1" />
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-pulse" />
                  </div>
                </div>
              )}

              {!isCameraActive && (
                <div className="p-6 text-center text-slate-400 space-y-3">
                  <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-slate-800 text-slate-500 flex items-center justify-center mx-auto">
                    <QrCode className="w-8 h-8 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-slate-200">
                      {t3('Iskaanerri Kaameraa Kallattii Qophiidha', 'Live Camera Scanner Ready', 'የቀጥታ ካሜራ ስካነር ዝግጁ ነው')}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto">
                      {t3(
                        '"Kaameraa Bani" cuqaasuun kaameraa bilbila ykn kompiitara keessaniin koodii QR daree iskaan gochuu dandeessu.',
                        'Press "Open Camera" to scan the classroom QR code using your phone or computer camera.',
                        '"ካሜራ ክፈት" የሚለውን በመጫን በስልክዎ ወይም በኮምፒዩተርዎ ካሜራ የክፍሉን QR ኮድ ስካን ማድረግ ይችላሉ።'
                      )}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={startCamera}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Camera className="w-4 h-4 text-amber-300" />
                      <span>{t3('Kaameraa Jalqabi', 'Start Camera', 'ካሜራውን ጀምር')}</span>
                    </button>

                    <label className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors border border-slate-700 flex items-center gap-1.5 cursor-pointer">
                      <Upload className="w-4 h-4 text-teal-300" />
                      <span>{t3('Suuraa QR Galchi', 'Upload QR Image', 'የ QR ፎቶ አስገባ')}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Camera Controls & Actions */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const nextFacing = cameraFacing === 'environment' ? 'user' : 'environment';
                    setCameraFacing(nextFacing);
                    if (isCameraActive) {
                      setTimeout(startCamera, 100);
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                  <span>
                    {t3('Kaameraa Jijjiiri', 'Switch Camera', 'ካሜራ ቀይር')} (
                    {cameraFacing === 'environment'
                      ? t3('Duubaa', 'Back', 'የኋላ')
                      : t3('Fuulduraa', 'Front', 'የፊት')}
                    )
                  </span>
                </button>
              </div>

              <label className="text-emerald-800 hover:text-emerald-900 font-bold flex items-center gap-1.5 cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>{t3('Gaalerii Keessaa Suuraa QR Filadhu', 'Pick QR Image from Gallery', 'ከጋለሪ የ QR ፎቶ ምረጥ')}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Right Column: Student Profile & One-Click Check-in */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-slate-900">
                    {t3('Barataa Argamni Galmaa’uuf', 'Student Checking In', 'መገኘቱ የሚመዘገብለት ተማሪ')}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {t3('Piroofaayila barataa filadhaa ykn mirkaneessaa', 'Select or verify the student profile', 'የተማሪውን ፕሮፋይል ይምረጡ ወይም ያረጋግጡ')}
                  </p>
                </div>
              </div>

              {/* Student Selector Dropdown */}
              <div className="space-y-1.5 text-xs">
                <label className="font-bold text-slate-700 block">
                  {t3('Maqaa Barataa Filadhu (Student Selection):', 'Select Student:', 'የተማሪ ስም ይምረጡ (Student Selection):')}
                </label>
                <select
                  value={selectedStudentForCheckIn?.id || ''}
                  onChange={(e) => {
                    const found = students.find((s) => s.id === e.target.value);
                    if (found) setSelectedStudentForCheckIn(found);
                  }}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.fullName} - {t3('Kutaa', 'Grade', 'ክፍል')} {s.grade}{s.section} ({s.studentIdNumber})
                    </option>
                  ))}
                </select>
              </div>

              {/* Selected Student Card */}
              {selectedStudentForCheckIn && (
                <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/80 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-white font-black flex items-center justify-center text-sm shadow-sm">
                      {selectedStudentForCheckIn.fullName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900">
                        {selectedStudentForCheckIn.fullName}
                      </h4>
                      <p className="text-xs text-emerald-800 font-semibold">
                        {t3('Kutaa', 'Grade', 'ክፍል')} {selectedStudentForCheckIn.grade} · {t3('Daree', 'Section', 'ክፍልፋይ')} {selectedStudentForCheckIn.section} · {t3('Eenyummaa:', 'ID:', 'መታወቂያ:')} {selectedStudentForCheckIn.studentIdNumber}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {t3('M/Barumsaa:', 'School:', 'ት/ቤት፡')} {school.name}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-emerald-200/60">
                    <div>
                      <span className="text-slate-500 block">
                        {t3('Haala Argama Har’aa:', 'Today’s Status:', 'የዛሬ መገኘት ሁኔታ፡')}
                      </span>
                      {todayRecords.some((r) => r.studentId === selectedStudentForCheckIn.id) ? (
                        <strong className="text-emerald-700 flex items-center gap-1 mt-0.5">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>{t3('Galmaa’eera (Present)', 'Checked In (Present)', 'ተመዝግቧል (Present)')}</span>
                        </strong>
                      ) : (
                        <strong className="text-amber-800 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{t3('Hanga ammaatti hin galmoofne', 'Not yet checked in', 'እስካሁን አልተመዘገበም')}</span>
                        </strong>
                      )}
                    </div>

                    <div>
                      <span className="text-slate-500 block">
                        {t3('Hamma Argamaa:', 'Attendance Rate:', 'የመገኘት ምጣኔ፡')}
                      </span>
                      <strong className="text-slate-800 mt-0.5 block font-bold">
                        {selectedStudentForCheckIn.attendanceRate}% {t3('Guutuu', 'Complete', 'የተሟላ')}
                      </strong>
                    </div>
                  </div>

                  {/* Direct Check-in button */}
                  <button
                    type="button"
                    onClick={() => commitCheckIn(selectedStudentForCheckIn, `SELF-CLICK-ATT-${todayDate}`)}
                    className="w-full py-2.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-black shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4 text-amber-300" />
                    <span>{t3('Argama Har’aa Mirkaneessi (Direct Check-in)', 'Confirm Today’s Check-in', 'የዛሬን መገኘት አረጋግጥ (Direct Check-in)')}</span>
                  </button>
                </div>
              )}

              {/* How it Works Help Note */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-[11px] text-slate-600 space-y-1.5">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{t3('Hojimaata Argama QR Idilee:', 'How Official QR Attendance Works:', 'ይፋዊ የ QR መገኘት አሰራር፡')}</span>
                </span>
                <p className="leading-relaxed">
                  {t3(
                    '1. Barataan yeroo daree seenu koodii QR guyyaa gabatee ykn girgiddaa irratti maxxanfame kaameraa dura agarsiisa.',
                    '1. Upon entering class, the student scans the daily QR code displayed on the board or wall.',
                    '1. ተማሪው ወደ ክፍል ሲገባ በቦርዱ ወይም በግድግዳው ላይ የተለጠፈውን የቀን QR ኮድ በካሜራው ፊት ያሳያል።'
                  )}
                  <br />
                  {t3(
                    '2. Sirni kun battalumatti sa’aatii, guyyaa fi eenyummaa barataa galmeessee Biiroo Barnootaa fi maatiif beeksisa.',
                    '2. The system instantly logs the time, date, and student ID and notifies the Bureau and parents.',
                    '2. ስርዓቱ ወዲያውኑ ሰዓቱን፣ ቀኑንና የተማሪውን መታወቂያ በመመዝገብ ለትምህርት ቢሮና ለወላጅ ያሳውቃል።'
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: DISPLAY DAILY QR CODE
         ========================================================================= */}
      {activeTab === 'display_daily_qr' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[11px] font-black border border-emerald-300">
                <QrCode className="w-3.5 h-3.5 text-emerald-700" />
                <span>{t3('Piroojektara Koodii QR Guyyaa Idilee', 'Official Daily QR Projector', 'ይፋዊ የቀን QR ኮድ ፕሮጀክተር')}</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1">
                {t3(
                  'Koodii QR Idilee Argama Daree Har’aa (Daily Attendance QR)',
                  'Today’s Official Classroom Attendance QR Code',
                  'የዛሬው የክፍል መገኘት ይፋዊ QR ኮድ (Official Daily Attendance QR)'
                )}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {t3(
                  'Barsiisonni koodii QR kana piroojektara daree irratti agarsiisuun ykn maxxansanii maxxansuun barattoonni akka galmaa’an taasisu.',
                  'Teachers can project this QR code in class or print and post it so students can check in.',
                  'መምህራን ይህንን QR ኮድ በክፍል ፕሮጀክተር ላይ በማሳየት ወይም አትመው በመለጠፍ ተማሪዎች እንዲመዘገቡ ያድርጉ።'
                )}
              </p>
            </div>

            {/* Actions: Print & Project */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrintQR}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-slate-600" />
                <span>{t3('Maxxansi (Print Poster)', 'Print Poster', 'አትም (Print Poster)')}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsQrFullscreen(!isQrFullscreen)}
                className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-black transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                {isQrFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4 text-amber-300" />}
                <span>
                  {isQrFullscreen
                    ? t3('Ilaalcha Idilee', 'Normal View', 'መደበኛ እይታ')
                    : t3('Iskiriinii Guutuun Agarsiisi (Projector)', 'Fullscreen Projector', 'በሙሉ ስክሪን አሳይ (Projector)')}
                </span>
              </button>
            </div>
          </div>

          {/* Grade Filter Pill bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-bold text-slate-700">
                {t3('Kutaa Filadhu:', 'Select Grade:', 'ክፍል ምረጥ፡')}
              </span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
              {(['all', 9, 10, 11, 12] as const).map((g) => (
                <button
                  key={String(g)}
                  type="button"
                  onClick={() => setSelectedGradeForQR(g)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    selectedGradeForQR === g
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {g === 'all'
                    ? t3('Kutaalee Hunda', 'All Grades', 'ሁሉም ክፍሎች')
                    : t3(`Kutaa ${g}ffaa`, `Grade ${g}`, `${g}ኛ ክፍል`)}
                </button>
              ))}
            </div>
          </div>

          {/* Fullscreen / Main QR Display Board */}
          <div
            className={`flex flex-col items-center justify-center text-center p-6 sm:p-10 rounded-3xl border-2 transition-all ${
              isQrFullscreen
                ? 'fixed inset-0 z-50 bg-slate-950 text-white flex items-center justify-center p-6 overflow-y-auto'
                : 'bg-emerald-50/40 border-emerald-200'
            }`}
          >
            {isQrFullscreen && (
              <button
                type="button"
                onClick={() => setIsQrFullscreen(false)}
                className="absolute top-6 right-6 p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-black transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Minimize2 className="w-5 h-5 text-amber-300" />
                <span>{t3('Iskiriinii Guutuu Keessaa Ba’i (ESC)', 'Exit Fullscreen (ESC)', 'ከሙሉ ስክሪን ውጣ (ESC)')}</span>
              </button>
            )}

            <div className="max-w-md w-full space-y-4">
              <div className="flex items-center justify-center gap-2.5">
                <SchoolLogo
                  logoUrl={school.logoUrl}
                  schoolName={school.name}
                  size={isQrFullscreen ? 64 : 48}
                  shape="rounded"
                />
                <div className="text-left">
                  <h3 className={`font-black ${isQrFullscreen ? 'text-white text-xl' : 'text-slate-900 text-base'}`}>
                    {school.name}
                  </h3>
                  <p className={`text-xs ${isQrFullscreen ? 'text-emerald-400 font-bold' : 'text-emerald-800 font-semibold'}`}>
                    {t3('Argama Guyyaa Barattootaa Idilee', 'Official Daily Student Attendance', 'ይፋዊ ዕለታዊ የተማሪዎች መገኘት')} · {t3('Guyyaa:', 'Date:', 'ቀን፡')} {todayDate}
                  </p>
                </div>
              </div>

              {/* QR Image Container */}
              <div className="bg-white p-5 rounded-3xl shadow-xl border-4 border-emerald-600 inline-block mx-auto">
                {dailyQrDataUrl ? (
                  <img
                    src={dailyQrDataUrl}
                    alt="Official Daily Attendance QR Code"
                    className="w-64 h-64 sm:w-80 sm:h-80 object-contain mx-auto"
                  />
                ) : (
                  <div className="w-64 h-64 flex items-center justify-center text-slate-400 text-xs">
                    {t3('Koodiin QR qophaa’aa jira...', 'Generating QR Code...', 'QR ኮድ እየተዘጋጀ ነው...')}
                  </div>
                )}
              </div>

              <div>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-black font-mono border ${
                  isQrFullscreen
                    ? 'bg-emerald-900/80 border-emerald-400 text-emerald-200'
                    : 'bg-emerald-100 border-emerald-300 text-emerald-950'
                }`}>
                  TOKEN: {dailyQrToken}
                </span>
                <p className={`text-xs mt-2 leading-relaxed ${isQrFullscreen ? 'text-slate-300' : 'text-slate-600'}`}>
                  {t3(
                    'Barattoonni koodii QR kana bilbila harkaa ykn taableetii isaaniitiin iskaan gochuun argama isaanii battalumatti galmeessaa.',
                    'Students: scan this QR code with your phone or tablet to check in immediately.',
                    'ተማሪዎች ይህንን QR ኮድ በሞባይል ስልካቸው ወይም በታብሌታቸው ስካን በማድረግ መገኘታቸውን ወዲያውኑ ይመዝግቡ።'
                  )}
                </p>
              </div>

              {/* Live Checked-in counter badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/90 text-emerald-950 border border-emerald-300 font-black text-xs shadow-md">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>
                  {t3(
                    `Barattoota hanga ammaatti QR tiin galmaa’an: ${presentCount}`,
                    `Students checked in via QR so far: ${presentCount}`,
                    `እስካሁን በ QR የተመዘገቡ ተማሪዎች፡ ${presentCount} ተማሪዎች`
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: KIOSK GATE SCANNER
         ========================================================================= */}
      {activeTab === 'kiosk_scanner' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-900 text-[11px] font-black border border-indigo-300">
                <UserCheck className="w-3.5 h-3.5 text-indigo-700" />
                <span>{t3('Iskaanera Karra Mana Barumsaa / Kiyoooskii (Gate Kiosk)', 'School Gate Kiosk Scanner', 'የትምህርት ቤት በር / ኪዮስክ ስካነር (Gate Kiosk)')}</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1">
                {t3('Iskaanera QR Waraqaa Eenyummaa Barattootaa (Student ID)', 'Student ID Card QR Scanner', 'የተማሪዎች መታወቂያ ካርድ QR ስካነር (Student ID Scanner)')}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {t3(
                  'Barattoonni yeroo mooraa mana barumsaa seenan koodii QR waraqaa eenyummaa isaanii kaameraa dura agarsiisuun battalumatti galmeessaa.',
                  'As students enter campus, scan the QR code on their ID cards for instant check-in.',
                  'ተማሪዎች ወደ ትምህርት ቤት ግቢ ሲገቡ የመታወቂያ ካርዳቸውን QR ኮድ በካሜራው ፊት በማሳየት በቅጽበት ይመዝገቡ።'
                )}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {isCameraActive ? (
                <button
                  type="button"
                  onClick={stopCamera}
                  className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  {t3('Kiyoooskii Dhaabi', 'Stop Kiosk', 'ኪዮስክ አቁም')}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={startCamera}
                  className="px-4 py-2 bg-indigo-800 hover:bg-indigo-900 text-white text-xs font-black rounded-xl transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Camera className="w-4 h-4 text-amber-300" />
                  <span>{t3('Kiyoooskii Jalqabi (Start Gate Scanner)', 'Start Gate Scanner', 'ኪዮስክ ጀምር (Start Gate Scanner)')}</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-slate-950 rounded-3xl p-4 flex flex-col items-center justify-center min-h-[340px] relative overflow-hidden">
              <video
                ref={videoRef}
                className={`w-full max-h-[360px] object-cover rounded-2xl ${isCameraActive ? 'block' : 'hidden'}`}
              />

              {isCameraActive && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-6">
                  <div className="w-56 h-56 border-2 border-indigo-400 rounded-3xl relative shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]">
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-indigo-900/90 text-indigo-200 text-[10px] font-bold">
                      {t3('Iskaanii Walitti Fufaa (Continuous Kiosk)', 'Continuous Kiosk Scan', 'ተከታታይ ስካን (Continuous Kiosk)')}
                    </div>
                  </div>
                </div>
              )}

              {!isCameraActive && (
                <div className="text-center text-slate-400 p-6 space-y-3">
                  <Camera className="w-12 h-12 text-indigo-400 mx-auto animate-pulse" />
                  <p className="text-sm font-bold text-white">
                    {t3('Iskaanerri Waraqaa Eenyummaa Karraa Qophiidha', 'Gate ID Card Scanner Ready', 'የበር ላይ መታወቂያ ስካነር ዝግጁ ነው')}
                  </p>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    {t3(
                      'Barattoonni yeroo seenan eenyummaa isaanii yoo agarsiisan kaameraan ofumaan dubbisa; yoo milkaa’e sagalee ni dhageessisa.',
                      'Once students present their ID card, the camera scans automatically and plays a confirmation chime.',
                      'ተማሪዎች ሲገቡ መታወቂያቸውን ካሳዩ በኋላ ካሜራው በራስ-ሰር ያነባል፤ ስኬታማ ሲሆን ድምፅ ያሰማል።'
                    )}
                  </p>
                  <button
                    type="button"
                    onClick={startCamera}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black rounded-xl transition-colors shadow-lg cursor-pointer"
                  >
                    {t3('Kaameraa Bani', 'Open Camera', 'ካሜራውን ክፈት')}
                  </button>
                </div>
              )}
            </div>

            {/* Live Kiosk Feed */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>{t3('Galmeewwan Dhihoo Har’aa (Live Gate Feed):', 'Recent Check-ins Today (Live Gate Feed):', 'የዛሬ የቅርብ ጊዜ ምዝገባዎች (Live Gate Feed):')}</span>
                <span className="text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded-full font-mono">
                  {presentCount} {t3('Seenanii Jiru', 'Checked In', 'ገብተዋል')}
                </span>
              </div>

              <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                {presentRecords.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500">
                    {t3('Hanga ammaatti barataan galmaa’e hin jiru.', 'No students checked in yet today.', 'እስካሁን የተመዘገበ ተማሪ የለም።')}
                  </div>
                ) : (
                  presentRecords.slice(0, 8).map((rec) => (
                    <div
                      key={rec.id}
                      className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0">
                          {rec.studentName.charAt(0)}
                        </div>
                        <div>
                          <h5 className="font-black text-slate-900 leading-tight">
                            {rec.studentName}
                          </h5>
                          <span className="text-[10px] text-slate-500 block">
                            {t3('Kutaa', 'Grade', 'ክፍል')} {rec.grade}{rec.section} · {rec.time || t3('Sa’aatii isaa eeggate', 'On-time', 'በሰዓቱ')}
                          </span>
                        </div>
                      </div>

                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                        {rec.status === 'late'
                          ? t3('Barfateera', 'Late', 'ዘግይቷል')
                          : t3('Argameera', 'Present', 'ተገኝቷል')}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: TODAY'S ATTENDANCE ROSTER
         ========================================================================= */}
      {activeTab === 'today_roster' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
            <div>
              <h3 className="text-base font-black text-slate-900">
                {t3(
                  `Gabaasa Argama Guyyaa Barattootaa Har’aa (${todayDate})`,
                  `Today's Student Attendance Report (${todayDate})`,
                  `የዛሬ ዕለታዊ የተማሪዎች መገኘት ሪፖርት (${todayDate})`
                )}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {t3(
                  'Tarree guutuu fi cuunfaa barattoota koodii QR fi harkaan galmaa’anii',
                  'Complete list and summary of students checked in via QR code or manually',
                  'በ QR ኮድ እና በእጅ የተመዘገቡ ተማሪዎች ሙሉ ዝርዝር እና ማጠቃለያ'
                )}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-900 bg-emerald-100 px-3 py-1 rounded-xl border border-emerald-300">
                {t3('Argamaniiru:', 'Present:', 'ተገኝተዋል፡')} {presentCount}
              </span>
              <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-xl">
                {t3('Waliigala:', 'Total:', 'ጠቅላላ፡')} {totalStudents} {t3('Barattoota', 'Students', 'ተማሪዎች')}
              </span>
            </div>
          </div>

          {/* Table of Students & Status */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">{t3('Barataa', 'Student', 'ተማሪ')}</th>
                  <th className="p-3">{t3('Lakkoofsa Eenyummaa', 'ID Number', 'መታወቂያ ቁጥር')}</th>
                  <th className="p-3">{t3('Kutaa', 'Grade', 'ክፍል')}</th>
                  <th className="p-3">{t3('Sa’aatii Galmaa’e', 'Check-in Time', 'የተመዘገበበት ሰዓት')}</th>
                  <th className="p-3">{t3('Mala Galmee', 'Method', 'የምዝገባ ዘዴ')}</th>
                  <th className="p-3">{t3('Haala', 'Status', 'ሁኔታ')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((st) => {
                  const record = todayRecords.find((r) => r.studentId === st.id);
                  const isPresent = record?.status === 'present' || record?.status === 'late';

                  return (
                    <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-[11px] ${
                            isPresent ? 'bg-emerald-100 text-emerald-900' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {st.fullName.charAt(0)}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block leading-tight">{st.fullName}</span>
                            <span className="text-[10px] text-slate-400">
                              {st.gender === 'F' ? t3('Dubara', 'Female', 'ሴት') : t3('Dhiira', 'Male', 'ወንድ')}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="p-3 font-mono font-semibold text-slate-700">
                        {st.studentIdNumber}
                      </td>

                      <td className="p-3 font-semibold text-slate-800">
                        {t3('Kutaa', 'Grade', 'ክፍል')} {st.grade}{st.section}
                      </td>

                      <td className="p-3 text-slate-600 font-mono">
                        {record?.time || (isPresent ? '08:15 AM' : '-')}
                      </td>

                      <td className="p-3">
                        {record?.method === 'qr_scan' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <QrCode className="w-3 h-3 text-emerald-600" />
                            <span>{t3('Iskaanii QR', 'QR Scan', 'QR ስካን')}</span>
                          </span>
                        ) : record ? (
                          <span className="text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                            {t3('Galmee Harkaa', 'Manual Entry', 'በእጅ መዝገብ')}
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400">-</span>
                        )}
                      </td>

                      <td className="p-3">
                        {isPresent ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-950 border border-emerald-300">
                            <Check className="w-3 h-3 stroke-[3]" />
                            <span>
                              {record?.status === 'late'
                                ? t3('Barfateera', 'Late', 'ዘግይቷል')
                                : t3('Argameera', 'Present', 'ተገኝቷል')}
                            </span>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => commitCheckIn(st, `ROSTER-CLICK-${todayDate}`)}
                            className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 text-[10px] font-bold border border-amber-300 transition-colors cursor-pointer"
                          >
                            + {t3('Amma Galmeessi', 'Check In Now', 'አሁን መዝግብ')}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
